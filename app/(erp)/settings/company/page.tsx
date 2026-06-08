'use client';
import { useState } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Building2, Upload, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function CompanySettingsPage() {
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    toast.success('Company settings saved');
  };

  const sections = [
    {
      title: 'Company Profile',
      fields: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Company Name" defaultValue="Acme Corporation" required />
          <Input label="Legal Name" defaultValue="Acme Corporation LLC" />
          <Input label="Registration Number" placeholder="REG-123456" />
          <Input label="Website" type="url" placeholder="https://acme.com" />
          <Input label="Email" type="email" placeholder="info@acme.com" />
          <Input label="Phone" type="tel" placeholder="+1 555 000 0000" />
        </div>
      ),
    },
    {
      title: 'Address',
      fields: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Street" placeholder="123 Main St" className="sm:col-span-2" />
          <Input label="City" placeholder="New York" />
          <Input label="State / Province" placeholder="NY" />
          <Input label="Country" placeholder="United States" />
          <Input label="ZIP / Postal Code" placeholder="10001" />
        </div>
      ),
    },
    {
      title: 'Tax Information',
      fields: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Tax ID / EIN" placeholder="12-3456789" />
          <Input label="VAT Number" placeholder="VAT-123456" />
        </div>
      ),
    },
    {
      title: 'Invoice Settings',
      fields: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Invoice Prefix" defaultValue="INV-" />
          <Input label="Next Invoice Number" type="number" defaultValue="43" />
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Default Terms</label>
            <textarea className="w-full h-20 px-3 py-2 rounded-lg border border-slate-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500" defaultValue="Payment due within 30 days of invoice date." />
          </div>
        </div>
      ),
    },
    {
      title: 'Localization',
      fields: (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Select label="Default Currency" options={[{ label: 'USD — US Dollar', value: 'USD' }, { label: 'EUR — Euro', value: 'EUR' }, { label: 'GBP — British Pound', value: 'GBP' }, { label: 'DZD — Algerian Dinar', value: 'DZD' }]} />
          <Select label="Timezone" options={[{ label: 'UTC', value: 'UTC' }, { label: 'America/New_York', value: 'America/New_York' }, { label: 'Europe/Paris', value: 'Europe/Paris' }, { label: 'Africa/Algiers', value: 'Africa/Algiers' }]} />
          <Select label="Language" options={[{ label: 'English', value: 'en' }, { label: 'French', value: 'fr' }, { label: 'Arabic', value: 'ar' }]} />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Company Settings</h1>
          <p className="text-sm text-slate-500">Manage your company profile and preferences</p>
        </div>
        <Button leftIcon={<Save className="w-4 h-4" />} loading={saving} onClick={save}>Save Changes</Button>
      </div>

      {/* Logo */}
      <Card>
        <CardHeader><CardTitle>Company Logo</CardTitle></CardHeader>
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Building2 className="w-8 h-8 text-indigo-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700 mb-1">Upload your company logo</p>
            <p className="text-xs text-slate-400 mb-3">PNG, JPG or SVG. Max 2MB. Recommended: 200×200px</p>
            <Button variant="outline" size="sm" leftIcon={<Upload className="w-4 h-4" />}>Upload Logo</Button>
          </div>
        </div>
      </Card>

      {sections.map((s) => (
        <Card key={s.title}>
          <CardHeader><CardTitle>{s.title}</CardTitle></CardHeader>
          {s.fields}
        </Card>
      ))}
    </div>
  );
}
