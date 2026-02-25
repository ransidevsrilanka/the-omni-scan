import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { UserPlus, Shield, Eye, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const AdminTeam = () => {
  const [roles, setRoles] = useState<any[]>([]);
  const [invites, setInvites] = useState<any[]>([]);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('moderator');

  const fetch = async () => {
    const { data: r } = await supabase.from('user_roles').select('*, profiles!user_roles_user_id_fkey(first_name, last_name)');
    setRoles(r || []);
    const { data: i } = await supabase.from('team_invites').select('*').order('created_at', { ascending: false });
    setInvites(i || []);
  };
  useEffect(() => { fetch(); }, []);

  const handleInvite = async () => {
    const { error } = await supabase.from('team_invites').insert({ email: inviteEmail, role: inviteRole as any });
    if (error) { toast.error(error.message); return; }
    toast.success(`Invite sent to ${inviteEmail}`);
    setShowInvite(false); setInviteEmail(''); fetch();
  };

  const admins = roles.filter(r => r.role === 'admin').length;
  const mods = roles.filter(r => r.role === 'moderator').length;
  const users = roles.filter(r => r.role === 'user').length;

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl tracking-[0.15em]">TEAM</h1>
        <motion.button whileTap={{ scale: 0.95 }} onClick={() => setShowInvite(true)} className="bg-primary text-primary-foreground px-6 py-2.5 text-sm font-display tracking-[0.15em] hover:bg-primary/90 transition-colors flex items-center gap-2">
          <UserPlus className="h-4 w-4" /> INVITE MEMBER
        </motion.button>
      </div>

      <AnimatePresence>
        {showInvite && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowInvite(false)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} onClick={e => e.stopPropagation()} className="glass-card p-8 w-full max-w-md rounded-sm">
              <h2 className="font-display text-lg tracking-[0.15em] mb-6">INVITE TEAM MEMBER</h2>
              <div className="space-y-4">
                <input placeholder="Email address" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} className="w-full bg-surface border border-border px-4 py-2.5 text-sm outline-none focus:border-primary placeholder:text-muted-foreground" />
                <select value={inviteRole} onChange={e => setInviteRole(e.target.value)} className="w-full bg-surface border border-border px-4 py-2.5 text-sm outline-none">
                  <option value="admin">Admin</option>
                  <option value="moderator">Moderator</option>
                  <option value="user">User</option>
                </select>
                <motion.button whileTap={{ scale: 0.97 }} onClick={handleInvite} className="w-full bg-primary text-primary-foreground py-3 font-display text-sm tracking-[0.2em]">SEND INVITE</motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[{ role: 'Admin', count: admins, icon: Shield }, { role: 'Moderator', count: mods, icon: UserPlus }, { role: 'User', count: users, icon: Eye }].map((r, i) => (
          <motion.div key={r.role} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-stat p-6 rounded-sm">
            <r.icon className="h-5 w-5 text-primary mb-3" />
            <h3 className="font-display text-sm tracking-[0.15em] mb-1">{r.role.toUpperCase()}</h3>
            <p className="text-2xl font-display">{r.count}</p>
          </motion.div>
        ))}
      </div>

      <div className="glass-card p-6 rounded-sm">
        <h2 className="font-display text-sm tracking-[0.15em] mb-4">TEAM MEMBERS</h2>
        {roles.length === 0 ? (
          <p className="text-sm text-muted-foreground tracking-wider text-center py-8">No team members yet</p>
        ) : (
          <div className="space-y-2">
            {roles.map(r => (
              <div key={r.id} className="flex items-center justify-between py-2 border-b border-border/30">
                <div>
                  <p className="text-sm tracking-wider">{(r as any).profiles?.first_name} {(r as any).profiles?.last_name}</p>
                  <p className="text-xs text-muted-foreground">{r.role}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {invites.length > 0 && (
        <div className="glass-card p-6 rounded-sm mt-4">
          <h2 className="font-display text-sm tracking-[0.15em] mb-4">PENDING INVITES</h2>
          {invites.map(inv => (
            <div key={inv.id} className="flex items-center justify-between py-2 border-b border-border/30">
              <div>
                <p className="text-sm">{inv.email}</p>
                <p className="text-xs text-muted-foreground">{inv.role} · {inv.accepted_at ? 'Accepted' : 'Pending'}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminTeam;
