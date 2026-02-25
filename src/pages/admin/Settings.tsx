import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Save, Shield, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const AdminSettings = () => {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [paymentConfig, setPaymentConfig] = useState<any>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      const { data: s } = await supabase.from('store_settings').select('*');
      const map: Record<string, string> = {};
      (s || []).forEach(row => { map[row.key] = row.value || ''; });
      setSettings(map);

      const { data: pc } = await supabase.from('payment_config').select('*').limit(1).maybeSingle();
      setPaymentConfig(pc || {});
    };
    fetch();
  }, []);

  const saveSetting = async (key: string, value: string) => {
    const { data: existing } = await supabase.from('store_settings').select('id').eq('key', key).maybeSingle();
    if (existing) {
      await supabase.from('store_settings').update({ value }).eq('key', key);
    } else {
      await supabase.from('store_settings').insert({ key, value });
    }
  };

  const handleSave = async () => {
    setLoading(true);
    for (const [key, value] of Object.entries(settings)) {
      await saveSetting(key, value);
    }
    if (paymentConfig.id) {
      await supabase.from('payment_config').update({
        mode: paymentConfig.mode,
        sandbox_merchant_id: paymentConfig.sandbox_merchant_id,
        sandbox_merchant_secret: paymentConfig.sandbox_merchant_secret,
        sandbox_app_id: paymentConfig.sandbox_app_id,
        sandbox_app_secret: paymentConfig.sandbox_app_secret,
        live_merchant_id: paymentConfig.live_merchant_id,
        live_merchant_secret: paymentConfig.live_merchant_secret,
        live_app_id: paymentConfig.live_app_id,
        live_app_secret: paymentConfig.live_app_secret,
        updated_at: new Date().toISOString(),
      }).eq('id', paymentConfig.id);
    }
    toast.success('Settings saved');
    setLoading(false);
  };

  const updateSetting = (key: string, value: string) => setSettings(prev => ({ ...prev, [key]: value }));
  const updatePC = (key: string, value: string) => setPaymentConfig((prev: any) => ({ ...prev, [key]: value }));

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl tracking-[0.15em]">SETTINGS</h1>
        <motion.button whileTap={{ scale: 0.95 }} onClick={handleSave} disabled={loading} className="bg-primary text-primary-foreground px-6 py-2.5 text-sm font-display tracking-[0.15em] hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50">
          <Save className="h-4 w-4" /> {loading ? 'SAVING...' : 'SAVE CHANGES'}
        </motion.button>
      </div>

      <div className="space-y-6 max-w-2xl">
        {/* Store Info */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 rounded-sm">
          <h2 className="font-display text-sm tracking-[0.15em] mb-6">STORE INFORMATION</h2>
          <div className="space-y-4">
            <div>
              <label className="text-xs tracking-[0.15em] text-muted-foreground block mb-2">STORE NAME</label>
              <input value={settings.store_name || ''} onChange={e => updateSetting('store_name', e.target.value)} className="w-full bg-surface border border-border px-4 py-2.5 text-sm outline-none focus:border-primary" />
            </div>
            <div>
              <label className="text-xs tracking-[0.15em] text-muted-foreground block mb-2">CONTACT EMAIL</label>
              <input value={settings.contact_email || ''} onChange={e => updateSetting('contact_email', e.target.value)} className="w-full bg-surface border border-border px-4 py-2.5 text-sm outline-none focus:border-primary" />
            </div>
            <div>
              <label className="text-xs tracking-[0.15em] text-muted-foreground block mb-2">PHONE</label>
              <input value={settings.phone || ''} onChange={e => updateSetting('phone', e.target.value)} className="w-full bg-surface border border-border px-4 py-2.5 text-sm outline-none focus:border-primary" />
            </div>
          </div>
        </motion.div>

        {/* Shipping */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 rounded-sm">
          <h2 className="font-display text-sm tracking-[0.15em] mb-6">SHIPPING RATES</h2>
          <div className="space-y-4">
            <div>
              <label className="text-xs tracking-[0.15em] text-muted-foreground block mb-2">STANDARD SHIPPING (LKR)</label>
              <input value={settings.standard_shipping_lkr || ''} onChange={e => updateSetting('standard_shipping_lkr', e.target.value)} className="w-full bg-surface border border-border px-4 py-2.5 text-sm outline-none focus:border-primary" />
            </div>
            <div>
              <label className="text-xs tracking-[0.15em] text-muted-foreground block mb-2">FREE SHIPPING THRESHOLD (LKR)</label>
              <input value={settings.free_shipping_threshold_lkr || ''} onChange={e => updateSetting('free_shipping_threshold_lkr', e.target.value)} className="w-full bg-surface border border-border px-4 py-2.5 text-sm outline-none focus:border-primary" />
            </div>
          </div>
        </motion.div>

        {/* PayHere */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6 rounded-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-sm tracking-[0.15em]">PAYMENT GATEWAY — PAYHERE</h2>
            <div className="flex items-center gap-2">
              {paymentConfig.mode === 'live' && <AlertTriangle className="h-4 w-4 text-destructive" />}
              <span className={`text-xs tracking-wider px-3 py-1 font-display ${paymentConfig.mode === 'live' ? 'bg-destructive/20 text-destructive pulse-glow' : 'bg-primary/20 text-primary'}`}>
                {paymentConfig.mode?.toUpperCase() || 'SANDBOX'}
              </span>
            </div>
          </div>
          
          <div className="mb-6">
            <label className="text-xs tracking-[0.15em] text-muted-foreground block mb-2">MODE</label>
            <div className="flex gap-3">
              <button onClick={() => updatePC('mode', 'sandbox')} className={`px-6 py-2.5 text-xs tracking-wider border transition-all ${paymentConfig.mode === 'sandbox' ? 'border-primary text-primary bg-primary/10' : 'border-border text-muted-foreground hover:border-foreground'}`}>
                <Shield className="h-3.5 w-3.5 inline mr-2" />SANDBOX
              </button>
              <button onClick={() => updatePC('mode', 'live')} className={`px-6 py-2.5 text-xs tracking-wider border transition-all ${paymentConfig.mode === 'live' ? 'border-destructive text-destructive bg-destructive/10' : 'border-border text-muted-foreground hover:border-foreground'}`}>
                LIVE
              </button>
            </div>
          </div>

          {/* Sandbox Credentials */}
          <div className="mb-6">
            <h3 className="text-xs tracking-[0.15em] text-muted-foreground mb-4 flex items-center gap-2">
              <Shield className="h-3 w-3" /> SANDBOX CREDENTIALS
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Merchant ID</label>
                <input value={paymentConfig.sandbox_merchant_id || ''} onChange={e => updatePC('sandbox_merchant_id', e.target.value)} className="w-full bg-surface border border-border px-3 py-2 text-sm outline-none focus:border-primary" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Merchant Secret</label>
                <input type="password" value={paymentConfig.sandbox_merchant_secret || ''} onChange={e => updatePC('sandbox_merchant_secret', e.target.value)} className="w-full bg-surface border border-border px-3 py-2 text-sm outline-none focus:border-primary" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">App ID</label>
                <input value={paymentConfig.sandbox_app_id || ''} onChange={e => updatePC('sandbox_app_id', e.target.value)} className="w-full bg-surface border border-border px-3 py-2 text-sm outline-none focus:border-primary" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">App Secret</label>
                <input type="password" value={paymentConfig.sandbox_app_secret || ''} onChange={e => updatePC('sandbox_app_secret', e.target.value)} className="w-full bg-surface border border-border px-3 py-2 text-sm outline-none focus:border-primary" />
              </div>
            </div>
          </div>

          {/* Live Credentials */}
          <div>
            <h3 className="text-xs tracking-[0.15em] text-muted-foreground mb-4 flex items-center gap-2">
              <AlertTriangle className="h-3 w-3" /> LIVE CREDENTIALS
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Merchant ID</label>
                <input value={paymentConfig.live_merchant_id || ''} onChange={e => updatePC('live_merchant_id', e.target.value)} className="w-full bg-surface border border-border px-3 py-2 text-sm outline-none focus:border-primary" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Merchant Secret</label>
                <input type="password" value={paymentConfig.live_merchant_secret || ''} onChange={e => updatePC('live_merchant_secret', e.target.value)} className="w-full bg-surface border border-border px-3 py-2 text-sm outline-none focus:border-primary" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">App ID</label>
                <input value={paymentConfig.live_app_id || ''} onChange={e => updatePC('live_app_id', e.target.value)} className="w-full bg-surface border border-border px-3 py-2 text-sm outline-none focus:border-primary" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">App Secret</label>
                <input type="password" value={paymentConfig.live_app_secret || ''} onChange={e => updatePC('live_app_secret', e.target.value)} className="w-full bg-surface border border-border px-3 py-2 text-sm outline-none focus:border-primary" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tax */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6 rounded-sm">
          <h2 className="font-display text-sm tracking-[0.15em] mb-6">TAX SETTINGS</h2>
          <div>
            <label className="text-xs tracking-[0.15em] text-muted-foreground block mb-2">TAX RATE (%)</label>
            <input value={settings.tax_rate || ''} onChange={e => updateSetting('tax_rate', e.target.value)} className="w-full bg-surface border border-border px-4 py-2.5 text-sm outline-none focus:border-primary" />
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
