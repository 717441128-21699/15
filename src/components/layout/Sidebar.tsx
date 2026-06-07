import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  AlertTriangle,
  ShoppingCart,
  FileText,
  LogOut,
  ChefHat,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAppStore } from '@/store';
import { cn } from '@/lib/utils';
import { formatRoleLabel } from '@/utils/format';

interface MenuItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: Array<'headquarters' | 'region' | 'store'>;
}

const menuItems: MenuItem[] = [
  {
    path: '/dashboard',
    label: '运营看板',
    icon: LayoutDashboard,
  },
  {
    path: '/alerts',
    label: '预警中心',
    icon: AlertTriangle,
  },
  {
    path: '/procurement',
    label: '采购预测',
    icon: ShoppingCart,
    roles: ['headquarters', 'region'],
  },
  {
    path: '/report',
    label: '健康报告',
    icon: FileText,
  },
];

export function Sidebar() {
  const navigate = useNavigate();
  const { sidebarCollapsed, toggleSidebar, user, logout } = useAppStore();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const roleLabel = user ? formatRoleLabel(user.role) : null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const visibleMenuItems = menuItems.filter(
    (item) => !item.roles || !user || item.roles.includes(user.role)
  );

  return (
    <aside
      className={cn(
        'gradient-primary h-screen flex flex-col text-white transition-all duration-300 ease-in-out sticky top-0',
        sidebarCollapsed ? 'w-20' : 'w-64'
      )}
    >
      <div className="flex items-center justify-between px-4 py-5 border-b border-white/10">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-accent-500 flex items-center justify-center shrink-0">
            <ChefHat className="w-6 h-6 text-white" />
          </div>
          {!sidebarCollapsed && (
            <div className="whitespace-nowrap overflow-hidden">
              <h1 className="font-serif-cn text-lg font-bold leading-tight">味道轩</h1>
              <p className="text-xs text-primary-200">智能运营平台</p>
            </div>
          )}
        </div>
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg hover:bg-white/10 transition-colors shrink-0"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto scrollbar-thin">
        {visibleMenuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group',
                  isActive
                    ? 'bg-white/15 text-white shadow-lg shadow-black/10'
                    : 'text-primary-100 hover:bg-white/10 hover:text-white'
                )
              }
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!sidebarCollapsed && (
                <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-3">
        {user && (
          <div className="mb-3">
            {!sidebarCollapsed ? (
              <div className="flex items-center gap-3 px-2 py-2 rounded-lg bg-white/5">
                <div className="w-9 h-9 rounded-full bg-accent-500 flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold">{user.name.charAt(0)}</span>
                </div>
                <div className="min-w-0 overflow-hidden">
                  <p className="text-sm font-medium truncate">{user.name}</p>
                  {roleLabel && (
                    <span
                      className={cn(
                        'inline-block text-xs mt-0.5 px-1.5 py-0.5 rounded',
                        roleLabel.className
                      )}
                    >
                      {roleLabel.label}
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div className="w-9 h-9 mx-auto rounded-full bg-accent-500 flex items-center justify-center">
                <span className="text-sm font-bold">{user.name.charAt(0)}</span>
              </div>
            )}
          </div>
        )}

        <div className="relative">
          <button
            onClick={() => setShowLogoutConfirm(!showLogoutConfirm)}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-primary-100 hover:bg-white/10 hover:text-white transition-all duration-200',
              sidebarCollapsed && 'justify-center'
            )}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!sidebarCollapsed && (
              <span className="text-sm font-medium">退出登录</span>
            )}
          </button>

          {showLogoutConfirm && (
            <div
              className={cn(
                'absolute bottom-full mb-2 bg-white rounded-xl shadow-xl p-3 z-50 animate-fade-in',
                sidebarCollapsed
                  ? 'left-1/2 -translate-x-1/2 w-44'
                  : 'left-0 right-0'
              )}
            >
              <p className="text-sm text-primary-800 mb-3 text-center">确定要退出登录吗？</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-primary-200 text-primary-700 hover:bg-primary-50 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 px-3 py-1.5 text-xs rounded-lg bg-danger text-white hover:bg-red-600 transition-colors"
                >
                  确定
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
