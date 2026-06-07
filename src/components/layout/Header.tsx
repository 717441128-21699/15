import { useState } from 'react';
import { Bell, Search, ChevronDown, MapPin, Store } from 'lucide-react';
import { useAppStore } from '../../store';
import { getRoleLabel } from '../../utils/format';
import { cn } from '../../lib/utils';

const cities = [
  { value: 'all', label: '全国' },
  { value: '北京', label: '北京' },
  { value: '上海', label: '上海' },
  { value: '广东', label: '广东' },
  { value: '浙江', label: '浙江' },
  { value: '四川', label: '四川' },
];

const brands = [
  { value: 'all', label: '全部品牌' },
  { value: '味道轩', label: '味道轩' },
];

export default function Header() {
  const { user, selectedCity, selectedBrand, setSelectedCity, setSelectedBrand } = useAppStore();
  const [cityOpen, setCityOpen] = useState(false);
  const [brandOpen, setBrandOpen] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-primary-100 px-6 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <div className="relative">
          <button
            onClick={() => {
              setCityOpen(!cityOpen);
              setBrandOpen(false);
            }}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary-50 hover:bg-primary-100 transition-colors"
          >
            <MapPin size={16} className="text-primary-500" />
            <span className="text-sm text-primary-700 font-medium">
              {cities.find((c) => c.value === selectedCity)?.label || '全国'}
            </span>
            <ChevronDown size={14} className="text-primary-400" />
          </button>
          {cityOpen && (
            <div className="absolute top-full left-0 mt-1 w-32 bg-white rounded-lg shadow-lg border border-primary-100 py-1 z-50 animate-fade-in">
              {cities.map((c) => (
                <button
                  key={c.value}
                  onClick={() => {
                    setSelectedCity(c.value);
                    setCityOpen(false);
                  }}
                  className={cn(
                    'w-full px-3 py-2 text-left text-sm hover:bg-primary-50 transition-colors',
                    selectedCity === c.value ? 'text-primary-600 font-medium bg-primary-50' : 'text-primary-700',
                  )}
                >
                  {c.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => {
              setBrandOpen(!brandOpen);
              setCityOpen(false);
            }}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary-50 hover:bg-primary-100 transition-colors"
          >
            <Store size={16} className="text-primary-500" />
            <span className="text-sm text-primary-700 font-medium">
              {brands.find((b) => b.value === selectedBrand)?.label || '全部品牌'}
            </span>
            <ChevronDown size={14} className="text-primary-400" />
          </button>
          {brandOpen && (
            <div className="absolute top-full left-0 mt-1 w-36 bg-white rounded-lg shadow-lg border border-primary-100 py-1 z-50 animate-fade-in">
              {brands.map((b) => (
                <button
                  key={b.value}
                  onClick={() => {
                    setSelectedBrand(b.value);
                    setBrandOpen(false);
                  }}
                  className={cn(
                    'w-full px-3 py-2 text-left text-sm hover:bg-primary-50 transition-colors',
                    selectedBrand === b.value ? 'text-primary-600 font-medium bg-primary-50' : 'text-primary-700',
                  )}
                >
                  {b.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400" />
          <input
            type="text"
            placeholder="搜索门店、菜品..."
            className="pl-9 pr-4 py-2 w-64 rounded-lg bg-primary-50 border-0 text-sm text-primary-700 placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-lg hover:bg-primary-50 transition-colors">
          <Bell size={20} className="text-primary-500" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-danger" />
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-primary-100">
          <div className="w-9 h-9 rounded-full gradient-accent flex items-center justify-center text-white font-semibold text-sm">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="hidden sm:block">
            <div className="text-sm font-medium text-primary-800">{user?.name}</div>
            <div className="text-xs text-primary-400">{getRoleLabel(user?.role || '')}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
