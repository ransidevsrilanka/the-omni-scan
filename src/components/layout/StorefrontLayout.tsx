import { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import CartDrawer from './CartDrawer';

const StorefrontLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="grain min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-[105px]">
        {children}
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
};

export default StorefrontLayout;
