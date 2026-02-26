import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { useCurrency } from '@/contexts/CurrencyContext';
import type { Database } from '@/integrations/supabase/types';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const statusFilters = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const AdminOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [filter, setFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const { formatPrice } = useCurrency();

  const fetchOrders = async () => {
    let query = supabase.from('orders').select('*, order_items(*)').order('created_at', { ascending: false });
    if (filter !== 'All') query = query.eq('status', filter.toLowerCase() as Database['public']['Enums']['order_status']);
    const { data } = await query;
    setOrders(data || []);
  };

  useEffect(() => { fetchOrders(); }, [filter]);

  const updateStatus = async (orderId: string, newStatus: Database['public']['Enums']['order_status']) => {
    await supabase.from('orders').update({ status: newStatus, updated_at: new Date().toISOString() }).eq('id', orderId);
    await supabase.from('order_status_history').insert({ order_id: orderId, status: newStatus, note: `Status changed to ${newStatus}` });
    toast.success(`Order updated to ${newStatus}`);
    fetchOrders();
    if (selectedOrder?.id === orderId) setSelectedOrder({ ...selectedOrder, status: newStatus });
  };

  return (
    <AdminLayout>
      <h1 className="font-display text-2xl tracking-[0.15em] mb-8">ORDERS</h1>

      <div className="flex items-center gap-3 mb-6 flex-wrap">
        {statusFilters.map(s => (
          <motion.button key={s} whileTap={{ scale: 0.95 }} onClick={() => setFilter(s)}
            className={`px-4 py-2 text-xs tracking-[0.15em] border transition-colors ${filter === s ? 'border-primary text-primary' : 'border-border text-muted-foreground hover:border-foreground'}`}>
            {s.toUpperCase()}
          </motion.button>
        ))}
      </div>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedOrder(null)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} onClick={e => e.stopPropagation()} className="glass-card p-8 w-full max-w-lg max-h-[80vh] overflow-y-auto rounded-sm">
              <h2 className="font-display text-lg tracking-[0.15em] mb-2">{selectedOrder.order_number}</h2>
              <p className="text-xs text-muted-foreground mb-6">{new Date(selectedOrder.created_at).toLocaleString()}</p>
              
              <div className="mb-4">
                <p className="text-xs tracking-wider text-muted-foreground mb-2">STATUS</p>
                <div className="flex gap-2 flex-wrap">
                  {(['pending', 'processing', 'shipped', 'delivered', 'cancelled'] as const).map(s => (
                    <button key={s} onClick={() => updateStatus(selectedOrder.id, s)}
                      className={`px-3 py-1.5 text-xs tracking-wider border ${selectedOrder.status === s ? 'border-primary text-primary bg-primary/10' : 'border-border text-muted-foreground hover:border-foreground'}`}>
                      {s.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <p className="text-xs tracking-wider text-muted-foreground mb-2">CUSTOMER</p>
                <p className="text-sm">{(selectedOrder.shipping_address as any)?.firstName} {(selectedOrder.shipping_address as any)?.lastName}</p>
                <p className="text-xs text-muted-foreground">{(selectedOrder.shipping_address as any)?.phone}</p>
              </div>

              <div className="mb-4">
                <p className="text-xs tracking-wider text-muted-foreground mb-2">ITEMS</p>
                {selectedOrder.order_items?.map((item: any) => (
                  <div key={item.id} className="flex justify-between py-2 border-b border-border/30 text-sm">
                    <span>{item.quantity}x {item.name} ({item.size}/{item.color})</span>
                    <span>{formatPrice(item.price_lkr * item.quantity, item.price_usd * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-3 space-y-1 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatPrice(selectedOrder.subtotal_lkr, selectedOrder.subtotal_usd)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{formatPrice(selectedOrder.shipping_lkr, selectedOrder.shipping_usd)}</span></div>
                <div className="flex justify-between font-display text-lg pt-2"><span>Total</span><span>{formatPrice(selectedOrder.total_lkr, selectedOrder.total_usd)}</span></div>
              </div>

              <button onClick={() => setSelectedOrder(null)} className="w-full mt-6 py-3 border border-border text-sm tracking-wider hover:border-foreground">CLOSE</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="glass-card overflow-hidden rounded-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-surface/50">
              <th className="text-left px-4 py-3 text-xs tracking-[0.15em] text-muted-foreground font-medium">ORDER</th>
              <th className="text-left px-4 py-3 text-xs tracking-[0.15em] text-muted-foreground font-medium">CUSTOMER</th>
              <th className="text-left px-4 py-3 text-xs tracking-[0.15em] text-muted-foreground font-medium">TOTAL</th>
              <th className="text-left px-4 py-3 text-xs tracking-[0.15em] text-muted-foreground font-medium">STATUS</th>
              <th className="text-left px-4 py-3 text-xs tracking-[0.15em] text-muted-foreground font-medium">DATE</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-12 text-center text-muted-foreground tracking-wider">No orders yet</td></tr>
            ) : orders.map((order, i) => (
              <motion.tr key={order.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                onClick={() => setSelectedOrder(order)} className="border-b border-border/50 hover:bg-surface/30 transition-colors cursor-pointer">
                <td className="px-4 py-3 tracking-wider">{order.order_number}</td>
                <td className="px-4 py-3 text-muted-foreground">{(order.shipping_address as any)?.firstName} {(order.shipping_address as any)?.lastName}</td>
                <td className="px-4 py-3">{formatPrice(order.total_lkr, order.total_usd)}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs tracking-wider px-2 py-1 ${order.status === 'delivered' ? 'bg-green-500/20 text-green-400' : order.status === 'cancelled' ? 'bg-destructive/20 text-destructive' : 'bg-primary/20 text-primary'}`}>
                    {order.status?.toUpperCase()}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;
