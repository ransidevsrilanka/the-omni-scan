import StorefrontLayout from '@/components/layout/StorefrontLayout';

const PrivacyPolicy = () => (
  <StorefrontLayout>
    <div className="container py-12 max-w-3xl">
      <h1 className="font-display text-3xl md:text-4xl tracking-[0.15em] mb-8">PRIVACY POLICY</h1>
      <div className="space-y-8 text-sm text-muted-foreground leading-relaxed">
        <section>
          <h2 className="font-display text-lg tracking-[0.15em] text-foreground mb-3">INFORMATION WE COLLECT</h2>
          <p>We collect information you provide directly, including name, email address, shipping address, phone number, and payment details when you make a purchase. We also collect browsing data, device information, and cookies to improve your shopping experience.</p>
        </section>
        <section>
          <h2 className="font-display text-lg tracking-[0.15em] text-foreground mb-3">HOW WE USE YOUR DATA</h2>
          <p>Your data is used to process orders, communicate order updates, improve our services, send marketing communications (with your consent), and comply with legal obligations. We never sell your personal data to third parties.</p>
        </section>
        <section>
          <h2 className="font-display text-lg tracking-[0.15em] text-foreground mb-3">COOKIES</h2>
          <p>We use essential cookies for site functionality, analytics cookies to understand usage patterns, and marketing cookies for personalized advertising. You can manage your cookie preferences through your browser settings.</p>
        </section>
        <section>
          <h2 className="font-display text-lg tracking-[0.15em] text-foreground mb-3">THIRD-PARTY SHARING</h2>
          <p>We share data only with payment processors (PayHere), shipping providers, and analytics services necessary to operate our business. All third parties are bound by data protection agreements.</p>
        </section>
        <section>
          <h2 className="font-display text-lg tracking-[0.15em] text-foreground mb-3">YOUR RIGHTS</h2>
          <p>You have the right to access, correct, delete, or export your personal data. Contact us at privacy@islandcouture.com to exercise these rights.</p>
        </section>
        <p className="text-xs text-muted-foreground pt-4 border-t border-border">Last updated: {new Date().toLocaleDateString()}</p>
      </div>
    </div>
  </StorefrontLayout>
);

export default PrivacyPolicy;
