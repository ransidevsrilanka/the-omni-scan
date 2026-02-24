import { useState } from 'react';
import { Link } from 'react-router-dom';
import StorefrontLayout from '@/components/layout/StorefrontLayout';
import { motion } from 'framer-motion';

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);

  return (
    <StorefrontLayout>
      <div className="container py-20 max-w-md mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="font-display text-3xl tracking-[0.15em] mb-2 text-center">
            {isRegister ? 'CREATE ACCOUNT' : 'SIGN IN'}
          </h1>
          <p className="text-sm text-muted-foreground text-center mb-10 tracking-wider">
            {isRegister ? 'Join the Island Couture movement' : 'Welcome back'}
          </p>

          <div className="space-y-4">
            {isRegister && (
              <div className="grid grid-cols-2 gap-4">
                <input placeholder="First Name" className="bg-surface border border-border px-4 py-3 text-sm outline-none focus:border-primary placeholder:text-muted-foreground" />
                <input placeholder="Last Name" className="bg-surface border border-border px-4 py-3 text-sm outline-none focus:border-primary placeholder:text-muted-foreground" />
              </div>
            )}
            <input placeholder="Email" type="email" className="w-full bg-surface border border-border px-4 py-3 text-sm outline-none focus:border-primary placeholder:text-muted-foreground" />
            <input placeholder="Password" type="password" className="w-full bg-surface border border-border px-4 py-3 text-sm outline-none focus:border-primary placeholder:text-muted-foreground" />
            {isRegister && (
              <input placeholder="Confirm Password" type="password" className="w-full bg-surface border border-border px-4 py-3 text-sm outline-none focus:border-primary placeholder:text-muted-foreground" />
            )}
            <button className="w-full bg-primary text-primary-foreground py-3.5 font-display text-sm tracking-[0.3em] hover:bg-primary/90 transition-colors">
              {isRegister ? 'CREATE ACCOUNT' : 'SIGN IN'}
            </button>
          </div>

          {!isRegister && (
            <Link to="/forgot-password" className="block text-center text-sm text-muted-foreground hover:text-foreground mt-4 tracking-wider">
              Forgot your password?
            </Link>
          )}

          <div className="border-t border-border mt-8 pt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button onClick={() => setIsRegister(!isRegister)} className="text-primary hover:underline tracking-wider">
                {isRegister ? 'SIGN IN' : 'CREATE ONE'}
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </StorefrontLayout>
  );
};

export default Login;
