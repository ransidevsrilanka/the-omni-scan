import AdminLayout from '@/components/layout/AdminLayout';
import { UserPlus, Shield, Eye } from 'lucide-react';

const AdminTeam = () => {
  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl tracking-[0.15em]">TEAM</h1>
        <button className="bg-primary text-primary-foreground px-6 py-2.5 text-sm font-display tracking-[0.15em] hover:bg-primary/90 transition-colors flex items-center gap-2">
          <UserPlus className="h-4 w-4" /> INVITE MEMBER
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { role: 'Admin', desc: 'Full access to all features', icon: Shield },
          { role: 'Manager', desc: 'Manage products and orders', icon: UserPlus },
          { role: 'Viewer', desc: 'View-only access', icon: Eye },
        ].map(r => (
          <div key={r.role} className="bg-card border border-border p-6">
            <r.icon className="h-5 w-5 text-primary mb-3" />
            <h3 className="font-display text-sm tracking-[0.15em] mb-1">{r.role.toUpperCase()}</h3>
            <p className="text-xs text-muted-foreground">{r.desc}</p>
            <p className="text-2xl font-display mt-3">0</p>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border p-6">
        <h2 className="font-display text-sm tracking-[0.15em] mb-4">TEAM MEMBERS</h2>
        <p className="text-sm text-muted-foreground tracking-wider text-center py-8">
          No team members yet. Invite your first team member.
        </p>
      </div>
    </AdminLayout>
  );
};

export default AdminTeam;
