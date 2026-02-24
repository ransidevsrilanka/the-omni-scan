import StorefrontLayout from '@/components/layout/StorefrontLayout';

const ShippingPolicy = () => (
  <StorefrontLayout>
    <div className="container py-12 max-w-3xl">
      <h1 className="font-display text-3xl md:text-4xl tracking-[0.15em] mb-8">SHIPPING POLICY</h1>
      <div className="space-y-8 text-sm text-muted-foreground leading-relaxed">
        <section>
          <h2 className="font-display text-lg tracking-[0.15em] text-foreground mb-3">DOMESTIC SHIPPING (SRI LANKA)</h2>
          <p>Standard delivery: 3-5 business days — LKR 350. Free shipping on orders over LKR 15,000. Express delivery available for select areas at additional cost.</p>
        </section>
        <section>
          <h2 className="font-display text-lg tracking-[0.15em] text-foreground mb-3">INTERNATIONAL SHIPPING</h2>
          <p>We ship internationally via trusted courier partners. Delivery times vary by destination (7-14 business days). Shipping costs are calculated at checkout based on weight and destination.</p>
        </section>
        <section>
          <h2 className="font-display text-lg tracking-[0.15em] text-foreground mb-3">ORDER PROCESSING</h2>
          <p>Orders are processed within 1-2 business days. You will receive a confirmation email with tracking information once your order has been dispatched.</p>
        </section>
        <section>
          <h2 className="font-display text-lg tracking-[0.15em] text-foreground mb-3">TRACKING</h2>
          <p>All orders include tracking. Track your order through your account dashboard or using the tracking link sent via email.</p>
        </section>
        <section>
          <h2 className="font-display text-lg tracking-[0.15em] text-foreground mb-3">CUSTOMS & DUTIES</h2>
          <p>International orders may be subject to import duties and taxes, which are the responsibility of the buyer. Island Couture is not responsible for delays caused by customs processing.</p>
        </section>
        <p className="text-xs text-muted-foreground pt-4 border-t border-border">Last updated: {new Date().toLocaleDateString()}</p>
      </div>
    </div>
  </StorefrontLayout>
);

export default ShippingPolicy;
