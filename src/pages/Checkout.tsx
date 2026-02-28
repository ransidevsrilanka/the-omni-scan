import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import StorefrontLayout from '@/components/layout/StorefrontLayout';
import { useCart } from '@/contexts/CartContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const Checkout = () => {
  const { items, totalLKR, totalUSD, clearCart } = useCart();
  const { formatPrice } = useCurrency();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [shipping, setShipping] = useState({ firstName: '', lastName: '', email: '', phone: '', address: '', city: '', postalCode: '' });
  const formRef = useRef<HTMLFormElement>(null);

  const shippingCost = totalLKR >= 15000 ? 0 : 350;

  const handlePlaceOrder = async () => {
    if (!user) return;
    setLoading(true);

    try {
      // 1. Create order
      const { data: order, error } = await supabase.from('orders').insert({
        user_id: user.id,
        order_number: '',
        subtotal_lkr: totalLKR,
        subtotal_usd: totalUSD,
        shipping_lkr: shippingCost,
        shipping_usd: shippingCost > 0 ? 1.15 : 0,
        total_lkr: totalLKR + shippingCost,
        total_usd: totalUSD + (shippingCost > 0 ? 1.15 : 0),
        shipping_address: shipping,
        payment_method: 'payhere',
        payment_status: 'pending',
      }).select().single();

      if (error || !order) { toast.error(error?.message || 'Failed to create order'); setLoading(false); return; }

      // 2. Insert order items
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.productId,
        name: item.name,
        image: item.image,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        price_lkr: item.priceLKR,
        price_usd: item.priceUSD,
      }));
      await supabase.from('order_items').insert(orderItems);

      // 3. Initial status history
      await supabase.from('order_status_history').insert({ order_id: order.id, status: 'pending', note: 'Order placed' });

      // 4. Call PayHere checkout edge function
      const totalAmount = totalLKR + shippingCost;
      const { data: payhereData, error: payhereError } = await supabase.functions.invoke('payhere-checkout', {
        body: {
          order_id: order.id,
          amount: totalAmount,
          currency: 'LKR',
          first_name: shipping.firstName,
          last_name: shipping.lastName,
          email: shipping.email || user.email,
          phone: shipping.phone,
          address: shipping.address,
          city: shipping.city,
          items_description: items.map(i => i.name).join(', '),
        }
      });

      if (payhereError || !payhereData?.merchant_id) {
        // Fallback: mark order as placed without payment redirect
        clearCart();
        toast.success('Order placed! Payment will be processed.');
        navigate('/account');
        setLoading(false);
        return;
      }

      // 5. Build hidden form and submit to PayHere
      const form = formRef.current;
      if (!form) return;

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const notifyUrl = `${supabaseUrl}/functions/v1/payhere-notify`;
      const returnUrl = `${window.location.origin}/account`;
      const cancelUrl = `${window.location.origin}/checkout`;

      // Set form action
      form.action = payhereData.payment_url;

      // Clear and set hidden fields
      form.innerHTML = '';
      const fields: Record<string, string> = {
        merchant_id: payhereData.merchant_id,
        return_url: returnUrl,
        cancel_url: cancelUrl,
        notify_url: notifyUrl,
        order_id: order.id,
        items: items.map(i => i.name).join(', '),
        currency: 'LKR',
        amount: payhereData.amount,
        first_name: shipping.firstName,
        last_name: shipping.lastName,
        email: shipping.email || user.email || '',
        phone: shipping.phone,
        address: shipping.address,
        city: shipping.city,
        country: 'Sri Lanka',
        hash: payhereData.hash,
      };

      Object.entries(fields).forEach(([name, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.value = value;
        form.appendChild(input);
      });

      clearCart();
      form.submit();
    } catch (err) {
      toast.error('Something went wrong');
      setLoading(false);
    }
  };

  return (
    <StorefrontLayout>
      {/* Hidden form for PayHere redirect */}
      <form ref={formRef} method="POST" style={{ display: 'none' }} />

      <div className="container py-12 max-w-4xl">
        <h1 className="font-display text-3xl tracking-[0.15em] mb-10">CHECKOUT</h1>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lg:col-span-3 space-y-8 order-2 lg:order-1">
            <div>
              <h2 className="font-display text-lg tracking-[0.15em] mb-4">SHIPPING INFORMATION</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input placeholder="First Name" value={shipping.firstName} onChange={e => setShipping({ ...shipping, firstName: e.target.value })} className="bg-surface border border-border px-4 py-3 text-sm outline-none focus:border-primary placeholder:text-muted-foreground" />
                  <input placeholder="Last Name" value={shipping.lastName} onChange={e => setShipping({ ...shipping, lastName: e.target.value })} className="bg-surface border border-border px-4 py-3 text-sm outline-none focus:border-primary placeholder:text-muted-foreground" />
                </div>
                <input placeholder="Email" value={shipping.email} onChange={e => setShipping({ ...shipping, email: e.target.value })} className="w-full bg-surface border border-border px-4 py-3 text-sm outline-none focus:border-primary placeholder:text-muted-foreground" />
                <input placeholder="Phone" value={shipping.phone} onChange={e => setShipping({ ...shipping, phone: e.target.value })} className="w-full bg-surface border border-border px-4 py-3 text-sm outline-none focus:border-primary placeholder:text-muted-foreground" />
                <input placeholder="Address" value={shipping.address} onChange={e => setShipping({ ...shipping, address: e.target.value })} className="w-full bg-surface border border-border px-4 py-3 text-sm outline-none focus:border-primary placeholder:text-muted-foreground" />
                <div className="grid grid-cols-2 gap-4">
                  <input placeholder="City" value={shipping.city} onChange={e => setShipping({ ...shipping, city: e.target.value })} className="bg-surface border border-border px-4 py-3 text-sm outline-none focus:border-primary placeholder:text-muted-foreground" />
                  <input placeholder="Postal Code" value={shipping.postalCode} onChange={e => setShipping({ ...shipping, postalCode: e.target.value })} className="bg-surface border border-border px-4 py-3 text-sm outline-none focus:border-primary placeholder:text-muted-foreground" />
                </div>
              </div>
            </div>

            <div>
              <h2 className="font-display text-lg tracking-[0.15em] mb-4">PAYMENT</h2>
              <div className="glass-card p-6 text-center rounded-sm">
                <p className="text-sm text-muted-foreground tracking-wider">PayHere payment will process your payment securely after placing the order.</p>
              </div>
            </div>

            <motion.button whileTap={{ scale: 0.97 }} onClick={handlePlaceOrder} disabled={loading || items.length === 0}
              className="w-full bg-primary text-primary-foreground py-4 font-display text-sm tracking-[0.3em] hover:bg-primary/90 transition-colors disabled:opacity-50">
              {loading ? 'PROCESSING...' : 'PLACE ORDER'}
            </motion.button>
          </motion.div>

          <div className="lg:col-span-2 order-1 lg:order-2">
            <div className="glass-card p-6 sticky top-32 rounded-sm">
              <h3 className="font-display text-sm tracking-[0.2em] mb-6">ORDER SUMMARY</h3>
              <div className="space-y-3 mb-4">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{item.quantity}x {item.name}</span>
                    <span>{formatPrice(item.priceLKR * item.quantity, item.priceUSD * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-3 text-sm border-t border-border pt-3">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span><span>{formatPrice(totalLKR, totalUSD)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span><span>{shippingCost === 0 ? 'FREE' : `LKR ${shippingCost}`}</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between font-display text-lg">
                  <span>Total</span><span>{formatPrice(totalLKR + shippingCost, totalUSD + (shippingCost > 0 ? 1.15 : 0))}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StorefrontLayout>
  );
};

export default Checkout;
