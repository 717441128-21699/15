import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  AlertTriangle,
  ShoppingCart,
  FileText,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ChefHat,
} from 'lucide-react';
import { useAppStore } from '../../store';
import { getRoleLabel } from '../../utils/format';
import { cn } from '../../lib/utils';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: '运营看板' },
  { to: '/alerts', icon: AlertTriangle, label: '预警中心' },
  { to: '/procurement', icon: ShoppingCart, label: '采购预测', roles: ['headquarters', 'region'] },
  { to: '/report', icon: FileText, label: '健康报告' },
];

export default function Sidebar() {
  const { user, sidebarCollapsed, toggleSidebar, logout } = useAppStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside
      className={cn(
        'h-screen gradient-primary text-white flex flex-col transition-all duration-300 sticky top-0',
        sidebarCollapsed ? 'w-16' : 'w-64',
      )}
    >
      <div className="p-4 flex items-center justify-between border-b border-white/10">
        <div className={cn('flex items-center gap-3', sidebarCollapsed && 'justify-center w-full')}>
          <div className="w-9 h-9 rounded-xl bg-accent-500 flex items-center justify-center flex-shrink-0">
            <ChefHat size={20} />
          </div>
          {!sidebarCollapsed && (
            <div>
              <div className="font-serif-cn font-bold text-base leading-tight">味道轩</div>
              <div className="text-[10px] text-primary-200">智能运营平台</div>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto scrollbar-thin">
        {navItems
          .filter((item) => !item.roles || (user && item.roles.includes(user.role)))
          .map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                  'hover:bg-white/10 active:bg-white/15',
                  isActive ? 'bg-white/15 text-white shadow-inner' : 'text-primary-200',
                  sidebarCollapsed && 'justify-center px-0',
                )
              }
              title={sidebarCollapsed ? item.label : undefined}
            >
              <item.icon size={20} className="flex-shrink-0" />
              {!sidebarCollapsed && <span className="text-sm font-medium">{item.label}</span>}
            </NavLink>
          ))}
      </nav>

      <div className="border-t border-white/10 p-3 space-y-2">
        {!sidebarCollapsed && user && (
          <div className="px-2 py-2">
            <div className="text-sm font-medium truncate">{user.name}</div>
            <div className="text-[11px] text-primary-300">{getRoleLabel(user.role)}</div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-primary-200',
            'hover:bg-white/10 hover:text-white transition-all duration-200',
            sidebarCollapsed && 'justify-center px-0',
          )}
          title={sidebarCollapsed ? '退出登录' : undefined}
        >
          <LogOut size={18} />
          {!sidebarCollapsed && <span className="text-sm">退出登录</span>}
        </button>
        <button
          onClick={toggleSidebar}
          className={cn(
            'w-full flex items-center justify-center py-2 rounded-lg text-primary-300',
            'hover:bg-white/10 hover:text-white transition-all duration-200',
          )}
        >
          {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
    </aside>
  );
}
