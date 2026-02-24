import StorefrontLayout from '@/components/layout/StorefrontLayout';

const TermsConditions = () => (
  <StorefrontLayout>
    <div className="container py-12 max-w-3xl">
      <h1 className="font-display text-3xl md:text-4xl tracking-[0.15em] mb-8">TERMS & CONDITIONS</h1>
      <div className="space-y-8 text-sm text-muted-foreground leading-relaxed">
        <section>
          <h2 className="font-display text-lg tracking-[0.15em] text-foreground mb-3">GENERAL</h2>
          <p>By accessing and using the Island Couture website, you agree to comply with these terms. We reserve the right to update these terms at any time without prior notice.</p>
        </section>
        <section>
          <h2 className="font-display text-lg tracking-[0.15em] text-foreground mb-3">USER RESPONSIBILITIES</h2>
          <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account. You must provide accurate and current information when creating an account or placing an order.</p>
        </section>
        <section>
          <h2 className="font-display text-lg tracking-[0.15em] text-foreground mb-3">INTELLECTUAL PROPERTY</h2>
          <p>All content on this website — including images, text, logos, and designs — is the intellectual property of Island Couture and may not be reproduced, distributed, or used without written permission.</p>
        </section>
        <section>
          <h2 className="font-display text-lg tracking-[0.15em] text-foreground mb-3">LIMITATION OF LIABILITY</h2>
          <p>Island Couture shall not be liable for any indirect, incidental, or consequential damages arising from the use of our website or products. Our liability is limited to the purchase price of the products ordered.</p>
        </section>
        <section>
          <h2 className="font-display text-lg tracking-[0.15em] text-foreground mb-3">GOVERNING LAW</h2>
          <p>These terms are governed by the laws of Sri Lanka. Any disputes shall be resolved in the courts of Sri Lanka.</p>
        </section>
        <p className="text-xs text-muted-foreground pt-4 border-t border-border">Last updated: {new Date().toLocaleDateString()}</p>
      </div>
    </div>
  </StorefrontLayout>
);

export default TermsConditions;
