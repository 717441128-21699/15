import { useState, useRef, useEffect } from 'react';
import { Search, Bell, ChevronDown } from 'lucide-react';
import { useAppStore } from '@/store';
import { cn } from '@/lib/utils';

const CITIES = [
  { value: undefined, label: '全部城市' },
  { value: '上海', label: '上海' },
  { value: '北京', label: '北京' },
  { value: '广州', label: '广州' },
  { value: '深圳', label: '深圳' },
  { value: '杭州', label: '杭州' },
  { value: '成都', label: '成都' },
  { value: '南京', label: '南京' },
  { value: '武汉', label: '武汉' },
];

const BRANDS = [
  { value: undefined, label: '全部品牌' },
  { value: '味道轩', label: '味道轩' },
];

interface DropdownProps {
  value: string | undefined;
  options: Array<{ value: string | undefined; label: string }>;
  onChange: (value: string | undefined) => void;
  placeholder?: string;
}

function Dropdown({ value, options, onChange }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selectedLabel = options.find((o) => o.value === value)?.label || options[0]?.label;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-primary-200 bg-white text-sm text-primary-800 hover:bg-primary-50 transition-colors"
      >
        <span className="whitespace-nowrap">{selectedLabel}</span>
        <ChevronDown
          className={cn(
            'w-4 h-4 text-primary-500 transition-transform duration-200',
            open && 'rotate-180'
          )}
        />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1.5 bg-white rounded-xl shadow-xl border border-primary-100 py-1 z-50 min-w-[140px] animate-fade-in">
          {options.map((option) => (
            <button
              key={String(option.value ?? 'all')}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              className={cn(
                'w-full text-left px-3 py-2 text-sm transition-colors',
                value === option.value
                  ? 'bg-primary-50 text-primary-800 font-medium'
                  : 'text-primary-700 hover:bg-primary-50'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function Header() {
  const { storeFilters, setStoreFilters } = useAppStore();
  const [searchValue, setSearchValue] = useState('');

  const handleCityChange = (city: string | undefined) => {
    setStoreFilters({ city });
  };

  const handleBrandChange = (brand: string | undefined) => {
    setStoreFilters({ brand });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-primary-100">
      <div className="flex items-center gap-4 px-6 py-3">
        <div className="flex items-center gap-3">
          <Dropdown
            value={storeFilters.city}
            options={CITIES}
            onChange={handleCityChange}
          />
          <Dropdown
            value={storeFilters.brand}
            options={BRANDS}
            onChange={handleBrandChange}
          />
        </div>

        <div className="flex-1 max-w-md mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-400" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="搜索门店、菜品..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-primary-200 bg-primary-50/50 text-sm text-primary-800 placeholder:text-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent focus:bg-white transition-all"
            />
        </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="relative p-2 rounded-lg text-primary-600 hover:bg-primary-100 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-danger ring-2 ring-white"></span>
          </button>
        </div>
      </div>
    </header>
  );
}
