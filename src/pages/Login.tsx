import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChefHat, Building2, MapPin, Store, Loader2, CheckCircle2 } from 'lucide-react';
import { useAppStore } from '../store';
import type { UserRole } from '../types';
import { cn } from '../lib/utils';
import { getRoleLabel } from '../utils/format';

const roles: { value: UserRole; label: string; description: string; icon: React.ReactNode }[] = [
  {
    value: 'headquarters',
    label: '总部运营总监',
    description: '查看全国门店数据，审批二级预警',
    icon: <Building2 size={24} />,
  },
  {
    value: 'region',
    label: '区域运营经理',
    description: '管理所辖区域门店，处理一级预警',
    icon: <MapPin size={24} />,
  },
  {
    value: 'store',
    label: '门店店长',
    description: '查看门店数据，确认预警信息',
    icon: <Store size={24} />,
  },
];

export default function Login() {
  const navigate = useNavigate();
  const { login, hydrate, user, isLoading, setLoading } = useAppStore();
  const [selectedRole, setSelectedRole] = useState<UserRole>('headquarters');
  const [error, setError] = useState('');

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await login(selectedRole);
      navigate('/dashboard', { replace: true });
    } catch {
      setError('登录失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 gradient-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-accent-500 blur-3xl" />
          <div className="absolute top-1/2 right-0 w-80 h-80 rounded-full bg-info blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-72 h-72 rounded-full bg-success blur-3xl" />
        </div>

        <div className="relative z-10 p-12 flex flex-col justify-between h-full">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-accent-500 flex items-center justify-center">
              <ChefHat size={28} />
            </div>
            <div>
              <div className="font-serif-cn font-bold text-2xl">味道轩</div>
              <div className="text-sm text-primary-200">智能运营分析平台</div>
            </div>
          </div>

          <div className="space-y-6">
            <h1 className="font-serif-cn text-4xl font-bold leading-tight">
              数据驱动
              <br />
              精细化餐饮运营
            </h1>
            <p className="text-primary-200 text-lg max-w-md leading-relaxed">
              实时监控全国门店运营数据，智能预警食材损耗与翻台效率，AI 驱动的采购预测与排班优化，助您降本增效。
            </p>

            <div className="space-y-3 pt-4">
              {[
                '全国 8 大城市 · 12 家门店实时数据接入',
                '自动计算翻台率、毛利率、损耗率等 10+ 核心指标',
                '三级预警体系 · 店长-区域-总部审批流程',
                '72 小时食材需求预测 · 最优采购批量推荐',
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <CheckCircle2 size={18} className="text-accent-400 flex-shrink-0" />
                  <span className="text-sm text-primary-100">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-xs text-primary-300">
            © 2026 味道轩餐饮集团 · 智能运营中心
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 bg-primary-50">
        <div className="w-full max-w-md animate-fade-in">
          <div className="lg:hidden flex items-center gap-3 mb-10 justify-center">
            <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center text-white">
              <ChefHat size={22} />
            </div>
            <div>
              <div className="font-serif-cn font-bold text-xl text-primary-800">味道轩</div>
              <div className="text-xs text-primary-400">智能运营分析平台</div>
            </div>
          </div>

          <h2 className="text-2xl font-bold font-serif-cn text-primary-800 mb-2">欢迎登录</h2>
          <p className="text-sm text-primary-400 mb-8">选择您的角色身份进入系统</p>

          <div className="space-y-3 mb-8">
            {roles.map((role) => (
              <button
                key={role.value}
                onClick={() => setSelectedRole(role.value)}
                className={cn(
                  'w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 text-left',
                  selectedRole === role.value
                    ? 'border-primary-500 bg-primary-50 shadow-md'
                    : 'border-primary-100 bg-white hover:border-primary-200 hover:shadow-sm',
                )}
              >
                <div
                  className={cn(
                    'w-12 h-12 rounded-xl flex items-center justify-center transition-colors',
                    selectedRole === role.value
                      ? 'bg-primary-500 text-white'
                      : 'bg-primary-50 text-primary-500',
                  )}
                >
                  {role.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={cn('font-semibold', selectedRole === role.value ? 'text-primary-700' : 'text-primary-800')}>
                    {role.label}
                  </div>
                  <div className="text-xs text-primary-400 mt-0.5">{role.description}</div>
                </div>
                <div
                  className={cn(
                    'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all',
                    selectedRole === role.value ? 'border-primary-500 bg-primary-500' : 'border-primary-200',
                  )}
                >
                  {selectedRole === role.value && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
              </button>
            ))}
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-danger/10 text-danger text-sm">{error}</div>
          )}

          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl gradient-primary text-white font-semibold text-sm
              hover:opacity-95 active:opacity-90 transition-all duration-200 shadow-lg shadow-primary-500/25
              disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                登录中...
              </>
            ) : (
              <>以{getRoleLabel(selectedRole)}身份登录</>
            )}
          </button>

          <p className="text-center text-xs text-primary-400 mt-6">
            演示环境 · 选择任意角色即可体验对应权限
          </p>
        </div>
      </div>
    </div>
  );
}
