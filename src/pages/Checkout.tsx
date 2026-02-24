import StorefrontLayout from '@/components/layout/StorefrontLayout';
import { motion } from 'framer-motion';

const Checkout = () => {
  return (
    <StorefrontLayout>
      <div className="container py-12 max-w-4xl">
        <h1 className="font-display text-3xl tracking-[0.15em] mb-10">CHECKOUT</h1>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lg:col-span-3 space-y-8">
            {/* Shipping */}
            <div>
              <h2 className="font-display text-lg tracking-[0.15em] mb-4">SHIPPING INFORMATION</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input placeholder="First Name" className="bg-surface border border-border px-4 py-3 text-sm outline-none focus:border-primary placeholder:text-muted-foreground" />
                  <input placeholder="Last Name" className="bg-surface border border-border px-4 py-3 text-sm outline-none focus:border-primary placeholder:text-muted-foreground" />
                </div>
                <input placeholder="Email" className="w-full bg-surface border border-border px-4 py-3 text-sm outline-none focus:border-primary placeholder:text-muted-foreground" />
                <input placeholder="Phone" className="w-full bg-surface border border-border px-4 py-3 text-sm outline-none focus:border-primary placeholder:text-muted-foreground" />
                <input placeholder="Address" className="w-full bg-surface border border-border px-4 py-3 text-sm outline-none focus:border-primary placeholder:text-muted-foreground" />
                <div className="grid grid-cols-2 gap-4">
                  <input placeholder="City" className="bg-surface border border-border px-4 py-3 text-sm outline-none focus:border-primary placeholder:text-muted-foreground" />
                  <input placeholder="Postal Code" className="bg-surface border border-border px-4 py-3 text-sm outline-none focus:border-primary placeholder:text-muted-foreground" />
                </div>
              </div>
            </div>

            {/* Payment */}
            <div>
              <h2 className="font-display text-lg tracking-[0.15em] mb-4">PAYMENT</h2>
              <div className="border border-border p-6 text-center">
                <p className="text-sm text-muted-foreground tracking-wider">PayHere payment integration will process your payment securely.</p>
              </div>
            </div>

            <button className="w-full bg-primary text-primary-foreground py-4 font-display text-sm tracking-[0.3em] hover:bg-primary/90 transition-colors">
              PLACE ORDER
            </button>
          </motion.div>

          {/* Summary */}
          <div className="lg:col-span-2">
            <div className="bg-surface border border-border p-6 sticky top-32">
              <h3 className="font-display text-sm tracking-[0.2em] mb-6">ORDER SUMMARY</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span><span>LKR 0</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span><span>Calculated at next step</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between font-medium">
                  <span>Total</span><span>LKR 0</span>
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
