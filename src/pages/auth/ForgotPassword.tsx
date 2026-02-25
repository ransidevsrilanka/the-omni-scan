import { useState } from 'react';
import { Link } from 'react-router-dom';
import StorefrontLayout from '@/components/layout/StorefrontLayout';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await resetPassword(email);
    if (error) toast.error(error.message);
    else { setSent(true); toast.success('Check your email for a reset link.'); }
    setLoading(false);
  };

  return (
    <StorefrontLayout>
      <div className="container py-20 max-w-md mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl tracking-[0.15em] mb-2 text-center">RESET PASSWORD</h1>
          <p className="text-sm text-muted-foreground text-center mb-10 tracking-wider">
            {sent ? 'Check your email for a reset link' : 'Enter your email to receive a reset link'}
          </p>
          {!sent && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-surface border border-border px-4 py-3 text-sm outline-none focus:border-primary placeholder:text-muted-foreground" />
              <motion.button type="submit" disabled={loading} whileTap={{ scale: 0.97 }} className="w-full bg-primary text-primary-foreground py-3.5 font-display text-sm tracking-[0.3em] hover:bg-primary/90 transition-colors disabled:opacity-50">
                {loading ? 'SENDING...' : 'SEND RESET LINK'}
              </motion.button>
            </form>
          )}
          <Link to="/login" className="block text-center text-sm text-muted-foreground hover:text-foreground mt-6 tracking-wider">
            Back to Sign In
          </Link>
        </motion.div>
      </div>
    </StorefrontLayout>
  );
};

export default ForgotPassword;
