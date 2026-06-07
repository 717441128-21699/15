import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown, Building2, Store, ChefHat, UtensilsCrossed } from 'lucide-react';
import { useAppStore } from '@/store';
import { authApi } from '@/services/api';
import type { UserRole } from '@/types';
import { cn } from '@/lib/utils';

interface RoleOption {
  role: UserRole;
  title: string;
  description: string;
  icon: typeof Crown;
  username: string;
  password: string;
}

const roleOptions: RoleOption[] = [
  {
    role: 'headquarters',
    title: '总部运营总监',
    description: '全局视角，洞察全国门店经营数据，制定战略决策',
    icon: Crown,
    username: 'admin',
    password: '123456',
  },
  {
    role: 'region',
    title: '区域运营经理',
    description: '管理区域内门店运营，对比分析区域绩效表现',
    icon: Building2,
    username: 'east_region',
    password: '123456',
  },
  {
    role: 'store',
    title: '门店店长',
    description: '聚焦单店运营，实时掌握门店营收与损耗情况',
    icon: Store,
    username: 'store1',
    password: '123456',
  },
];

export default function Login() {
  const navigate = useNavigate();
  const login = useAppStore((state) => state.login);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!selectedRole) {
      setError('请先选择登录角色');
      return;
    }

    const roleConfig = roleOptions.find((r) => r.role === selectedRole);
    if (!roleConfig) return;

    setLoading(true);
    setError(null);

    try {
      const { user, token } = await authApi.login({
        username: roleConfig.username,
        password: roleConfig.password,
      });
      login(user, token);
      navigate('/dashboard', { replace: true });
    } catch (e) {
      setError(e instanceof Error ? e.message : '登录失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden gradient-primary">
        <div className="absolute inset-0">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-accent-500/20 blur-3xl" />
          <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full bg-primary-400/20 blur-3xl" />
          <div className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full bg-accent-400/10 blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col justify-center px-16 py-20 w-full">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-14 h-14 rounded-2xl bg-accent-500 flex items-center justify-center">
              <UtensilsCrossed className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="font-serif-cn text-3xl font-bold text-white">智膳云</h1>
              <p className="text-primary-200 text-sm">餐饮智能运营平台</p>
            </div>
          </div>

          <h2 className="font-serif-cn text-5xl font-bold text-white leading-tight mb-6">
            数据驱动
            <br />
            <span className="text-accent-400">精细化运营</span>
          </h2>

          <p className="text-primary-200 text-lg leading-relaxed max-w-md mb-12">
            整合门店营收、翻台率、损耗率等核心指标，通过智能分析帮助运营团队降本增效，提升盈利能力。
          </p>

          <div className="space-y-5">
            {[
              { icon: ChefHat, text: '实时监控全国门店运营健康状态' },
              { icon: Building2, text: '多维度数据分析辅助经营决策' },
              { icon: Store, text: '智能预警提前规避运营风险' },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                    <Icon className="w-5 h-5 text-accent-400" />
                  </div>
                  <span className="text-white/90 text-base">{item.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-16 bg-primary-50">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-10 justify-center">
            <div className="w-12 h-12 rounded-xl bg-accent-500 flex items-center justify-center">
              <UtensilsCrossed className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="font-serif-cn text-2xl font-bold text-primary-900">智膳云</h1>
              <p className="text-primary-500 text-xs">餐饮智能运营平台</p>
            </div>
          </div>

          <h2 className="font-serif-cn text-3xl font-bold text-primary-900 mb-2">欢迎登录</h2>
          <p className="text-primary-500 mb-10">请选择您的角色以进入运营平台</p>

          <div className="space-y-4 mb-8">
            {roleOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = selectedRole === option.role;
              return (
                <button
                  key={option.role}
                  onClick={() => {
                    setSelectedRole(option.role);
                    setError(null);
                  }}
                  className={cn(
                    'w-full p-5 rounded-2xl border-2 text-left transition-all duration-200',
                    isSelected
                      ? 'border-accent-500 bg-accent-50 shadow-lg shadow-accent-500/10'
                      : 'border-primary-100 bg-white hover:border-primary-200 hover:shadow-md'
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        'w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors',
                        isSelected ? 'bg-accent-500 text-white' : 'bg-primary-100 text-primary-600'
                      )}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3
                          className={cn(
                            'font-serif-cn text-lg font-semibold',
                            isSelected ? 'text-accent-700' : 'text-primary-800'
                          )}
                        >
                          {option.title}
                        </h3>
                        <div
                          className={cn(
                            'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all',
                            isSelected ? 'border-accent-500 bg-accent-500' : 'border-primary-300'
                          )}
                        >
                          {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                      </div>
                      <p className="text-sm text-primary-500 leading-relaxed">{option.description}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-danger/10 border border-danger/20 text-danger text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            className={cn(
              'w-full py-4 rounded-2xl font-semibold text-white transition-all duration-200 text-lg',
              loading
                ? 'bg-primary-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 shadow-lg shadow-accent-500/25 hover:shadow-xl hover:shadow-accent-500/30'
            )}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                登录中...
              </span>
            ) : (
              '登录'
            )}
          </button>

          <p className="text-center text-xs text-primary-400 mt-8">
            © 2025 智膳云 餐饮智能运营平台 · All rights reserved
          </p>
        </div>
      </div>
    </div>
  );
}
