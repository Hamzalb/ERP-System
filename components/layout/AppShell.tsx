'use client';
import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-full min-h-screen mesh-bg">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Navbar onMenuClick={() => setSidebarOpen(true)} />

      <main className="lg:pl-64 pt-[60px] min-h-screen">
        <div className="p-6 max-w-[1600px] mx-auto">{children}</div>
      </main>
    </div>
  );
}
