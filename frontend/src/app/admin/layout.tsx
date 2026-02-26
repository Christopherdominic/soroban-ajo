'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  ArrowLeftRight,
  Shield,
  Settings,
  FileBarChart,
  ClipboardList,
  Bell,
  LogOut,
  ChevronLeft,
  Menu,
  AlertTriangle,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, permission: 'users:read' },
  { href: '/admin/users', label: 'Users', icon: Users, permission: 'users:read' },
  { href: '/admin/groups', label: 'Groups', icon: FolderKanban, permission: 'groups:read' },
  { href: '/admin/transactions', label: 'Transactions', icon: ArrowLeftRight, permission: 'transactions:read' },
  { href: '/admin/moderation', label: 'Moderation', icon: Shield, permission: 'moderation:read' },
  { href: '/admin/reports', label: 'Reports', icon: FileBarChart, permission: 'reports:read' },
  { href: '/admin/audit', label: 'Audit Log', icon: ClipboardList, permission: 'audit:read' },
  { href: '/admin/settings', label: 'Settings', icon: Settings, permission: 'config:read' },
];

interface AdminLayoutProps {
  children: ReactNode;
  permissions?: string[];
}

export default function AdminLayout({ children, permissions = [] }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const visibleItems = NAV_ITEMS.filter(item =>
    permissions.length === 0 || permissions.includes(item.permission)
  );

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin/login');
  };

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100 font-mono overflow-hidden">
      <aside className={`flex flex-col bg-gray-900 border-r border-gray-800 transition-all duration-200 ${collapsed ? 'w-16' : 'w-60'}`}>
        <div className="flex items-center gap-3 px-4 py-5 border-b border-gray-800">
          <div className="w-7 h-7 bg-amber-500 rounded flex items-center justify-center flex-shrink-0">
            <Shield className="w-4 h-4 text-gray-900" />
          </div>
          {!collapsed && (
            <span className="font-bold text-amber-400 tracking-widest text-xs uppercase">Admin</span>
          )}
          <button onClick={() => setCollapsed(!collapsed)} className="ml-auto text-gray-500 hover:text-gray-300 transition-colors">
            {collapsed ? <Menu className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
          {visibleItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== '/admin' && pathname?.startsWith(href));
            return (
              <Link key={href} href={href} className={`flex items-center gap-3 px-3 py-2 rounded text-sm transition-all group ${active ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'}`} title={collapsed ? label : undefined}>
                <Icon className="w-4 h-4 flex-shrink-0" />
                {!collapsed && <span>{label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-gray-800 p-3">
          <button onClick={handleLogout} className="flex items-center gap-3 w-full px-3 py-2 rounded text-sm text-gray-400 hover:text-red-400 hover:bg-gray-800 transition-all">
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="flex items-center justify-between px-6 py-3 border-b border-gray-800 bg-gray-900/50">
          <div className="text-xs text-gray-500 uppercase tracking-wider">
            {visibleItems.find(i => pathname?.startsWith(i.href))?.label || 'Admin Panel'}
          </div>
          <Bell className="w-5 h-5 text-gray-400" />
        </header>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
