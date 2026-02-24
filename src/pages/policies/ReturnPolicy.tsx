import StorefrontLayout from '@/components/layout/StorefrontLayout';

const ReturnPolicy = () => (
  <StorefrontLayout>
    <div className="container py-12 max-w-3xl">
      <h1 className="font-display text-3xl md:text-4xl tracking-[0.15em] mb-8">RETURN POLICY</h1>
      <div className="space-y-8 text-sm text-muted-foreground leading-relaxed">
        <section>
          <h2 className="font-display text-lg tracking-[0.15em] text-foreground mb-3">RETURN WINDOW</h2>
          <p>We accept returns within 14 days of delivery. Items must be unworn, unwashed, and in their original packaging with all tags attached.</p>
        </section>
        <section>
          <h2 className="font-display text-lg tracking-[0.15em] text-foreground mb-3">CONDITIONS</h2>
          <p>Items marked as final sale or clearance are not eligible for return. Intimate apparel, swimwear, and accessories (once opened) cannot be returned for hygiene reasons.</p>
        </section>
        <section>
          <h2 className="font-display text-lg tracking-[0.15em] text-foreground mb-3">REFUND PROCESS</h2>
          <p>Once we receive and inspect your return, we will process your refund within 5-7 business days. Refunds are issued to the original payment method. Shipping costs are non-refundable.</p>
        </section>
        <section>
          <h2 className="font-display text-lg tracking-[0.15em] text-foreground mb-3">EXCHANGES</h2>
          <p>We offer exchanges for different sizes or colors, subject to availability. Contact our support team to initiate an exchange.</p>
        </section>
        <section>
          <h2 className="font-display text-lg tracking-[0.15em] text-foreground mb-3">HOW TO RETURN</h2>
          <p>Email returns@islandcouture.com with your order number and reason for return. We will provide a return shipping label and instructions.</p>
        </section>
        <p className="text-xs text-muted-foreground pt-4 border-t border-border">Last updated: {new Date().toLocaleDateString()}</p>
      </div>
    </div>
  </StorefrontLayout>
);

export default ReturnPolicy;
