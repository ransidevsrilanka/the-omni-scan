import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StorefrontLayout from '@/components/layout/StorefrontLayout';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const { updatePassword } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash.includes('type=recovery')) {
      // Not a valid recovery link
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { toast.error('Passwords do not match'); return; }
    setLoading(true);
    const { error } = await updatePassword(password);
    if (error) toast.error(error.message);
    else { toast.success('Password updated!'); navigate('/login'); }
    setLoading(false);
  };

  return (
    <StorefrontLayout>
      <div className="container py-20 max-w-md mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl tracking-[0.15em] mb-2 text-center">NEW PASSWORD</h1>
          <p className="text-sm text-muted-foreground text-center mb-10 tracking-wider">Enter your new password</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input placeholder="New Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} className="w-full bg-surface border border-border px-4 py-3 text-sm outline-none focus:border-primary placeholder:text-muted-foreground" />
            <input placeholder="Confirm Password" type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required className="w-full bg-surface border border-border px-4 py-3 text-sm outline-none focus:border-primary placeholder:text-muted-foreground" />
            <motion.button type="submit" disabled={loading} whileTap={{ scale: 0.97 }} className="w-full bg-primary text-primary-foreground py-3.5 font-display text-sm tracking-[0.3em] hover:bg-primary/90 transition-colors disabled:opacity-50">
              {loading ? 'UPDATING...' : 'SET NEW PASSWORD'}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </StorefrontLayout>
  );
};

export default ResetPassword;
