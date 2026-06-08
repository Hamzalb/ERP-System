'use client';
import { useState } from 'react';
import { Plus, Building2, Package, MapPin, TrendingUp } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

const WAREHOUSES = [
  { _id: '1', name: 'Main Warehouse', location: 'New York, NY', totalItems: 2840, capacity: 5000, status: 'active', manager: 'John Smith' },
  { _id: '2', name: 'West Coast Hub', location: 'Los Angeles, CA', totalItems: 1620, capacity: 3000, status: 'active', manager: 'Emma Davis' },
  { _id: '3', name: 'Midwest Center', location: 'Chicago, IL', totalItems: 980, capacity: 2000, status: 'active', manager: 'Mike Ross' },
  { _id: '4', name: 'South Distribution', location: 'Houston, TX', totalItems: 340, capacity: 1500, status: 'maintenance', manager: 'Sarah Chen' },
];

export default function WarehousesPage() {
  const [showModal, setShowModal] = useState(false);

  const totalCapacity = WAREHOUSES.reduce((s, w) => s + w.capacity, 0);
  const totalUsed = WAREHOUSES.reduce((s, w) => s + w.totalItems, 0);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Warehouses</h1>
          <p className="text-sm text-slate-500">{WAREHOUSES.length} locations · {totalUsed.toLocaleString()} items stored</p>
        </div>
        <Button size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setShowModal(true)}>
          Add Warehouse
        </Button>
      </div>

      {/* Overview stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Warehouses', value: WAREHOUSES.length, icon: Building2, color: 'text-indigo-600 bg-indigo-50' },
          { label: 'Total Capacity', value: totalCapacity.toLocaleString(), icon: Package, color: 'text-sky-600 bg-sky-50' },
          { label: 'Items Stored', value: totalUsed.toLocaleString(), icon: TrendingUp, color: 'text-emerald-600 bg-emerald-50' },
          { label: 'Utilization', value: `${Math.round((totalUsed / totalCapacity) * 100)}%`, icon: MapPin, color: 'text-amber-600 bg-amber-50' },
        ].map((s) => (
          <Card key={s.label} padding="sm" tilt>
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${s.color}`}>
                <s.icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-slate-500">{s.label}</p>
                <p className="text-lg font-bold text-slate-900">{s.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Warehouse cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {WAREHOUSES.map((wh) => {
          const pct = Math.round((wh.totalItems / wh.capacity) * 100);
          const barColor = pct > 90 ? 'bg-red-500' : pct > 70 ? 'bg-amber-500' : 'bg-emerald-500';

          return (
            <Card key={wh._id} hoverable tilt className="group">
              <CardHeader>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-200">
                  <Building2 className="w-4.5 h-4.5 text-white" />
                </div>
                <Badge variant={wh.status === 'active' ? 'success' : 'warning'} dot className="capitalize">
                  {wh.status}
                </Badge>
              </CardHeader>

              <h3 className="font-bold text-slate-900 mb-1">{wh.name}</h3>
              <p className="text-xs text-slate-500 flex items-center gap-1 mb-4">
                <MapPin className="w-3 h-3" /> {wh.location}
              </p>

              {/* Capacity bar */}
              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-500">Capacity</span>
                  <span className="font-semibold text-slate-700">{pct}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${barColor}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>{wh.totalItems.toLocaleString()} items</span>
                  <span>{wh.capacity.toLocaleString()} max</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">Manager: <span className="font-medium text-slate-700">{wh.manager}</span></span>
                <button className="text-xs text-indigo-600 hover:underline font-medium">View →</button>
              </div>
            </Card>
          );
        })}
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Add Warehouse"
        footer={<><Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button><Button>Create Warehouse</Button></>}>
        <div className="space-y-4">
          <Input label="Warehouse Name" placeholder="e.g. North Distribution Center" required />
          <Input label="Location" placeholder="City, State" required />
          <Input label="Capacity (units)" type="number" placeholder="1000" required />
          <Input label="Manager Name" placeholder="Manager full name" />
          <Select label="Status" options={[{ label: 'Active', value: 'active' }, { label: 'Maintenance', value: 'maintenance' }]} />
          <Input label="Address" placeholder="Full street address" />
        </div>
      </Modal>
    </div>
  );
}
