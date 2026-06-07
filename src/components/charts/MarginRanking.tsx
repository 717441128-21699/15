import { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import type { DishMargin } from '../../types';
import { cn } from '../../lib/utils';
import { formatCurrency, formatPercent } from '../../utils/format';

interface MarginRankingProps {
  data: DishMargin[];
}

const categories = [
  { value: 'all', label: '全部品类' },
  { value: '热菜', label: '热菜' },
  { value: '素菜', label: '素菜' },
  { value: '海鲜', label: '海鲜' },
  { value: '主食', label: '主食' },
  { value: '凉菜', label: '凉菜' },
];

export default function MarginRanking({ data }: MarginRankingProps) {
  const [rankType, setRankType] = useState<'top' | 'bottom'>('top');
  const [category, setCategory] = useState('all');

  const filteredData = data.filter((d) => category === 'all' || d.category === category);

  const maxMargin = Math.max(...filteredData.map((d) => d.grossMargin), 1);

  return (
    <div className="bg-white rounded-xl p-5 card-shadow h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-primary-800 font-serif-cn">菜品毛利排名</h3>
          <p className="text-xs text-primary-400 mt-0.5">Top10 高/低毛利菜品分析</p>
        </div>
        <div className="flex gap-1 bg-primary-50 p-0.5 rounded-lg">
          <button
            onClick={() => setRankType('top')}
            className={cn(
              'flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-all',
              rankType === 'top' ? 'bg-white text-success shadow-sm' : 'text-primary-500 hover:text-primary-700',
            )}
          >
            <ChevronUp size={12} />
            高毛利
          </button>
          <button
            onClick={() => setRankType('bottom')}
            className={cn(
              'flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-all',
              rankType === 'bottom' ? 'bg-white text-danger shadow-sm' : 'text-primary-500 hover:text-primary-700',
            )}
          >
            <ChevronDown size={12} />
            低毛利
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {categories.map((c) => (
          <button
            key={c.value}
            onClick={() => setCategory(c.value)}
            className={cn(
              'px-2.5 py-1 rounded-full text-xs font-medium transition-all',
              category === c.value
                ? 'bg-primary-500 text-white'
                : 'bg-primary-50 text-primary-500 hover:bg-primary-100',
            )}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="space-y-2.5 flex-1 overflow-y-auto scrollbar-thin pr-1">
        {filteredData.slice(0, 10).map((dish, idx) => {
          const percent = (dish.grossMargin / maxMargin) * 100;
          const isHighMargin = dish.grossMargin >= 65;
          const isLowMargin = dish.grossMargin <= 55;
          return (
            <div key={dish.id} className="group">
              <div className="flex items-center gap-3 mb-1">
                <div
                  className={cn(
                    'w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold flex-shrink-0',
                    idx < 3 && rankType === 'top'
                      ? 'bg-accent-500 text-white'
                      : idx < 3 && rankType === 'bottom'
                      ? 'bg-danger text-white'
                      : 'bg-primary-100 text-primary-600',
                  )}
                >
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-primary-800 truncate">{dish.name}</span>
                    <div className="flex items-center gap-3 ml-2 flex-shrink-0">
                      <span className="text-xs text-primary-400">{formatCurrency(dish.revenue)}</span>
                      <span
                        className={cn(
                          'text-sm font-bold',
                          isHighMargin ? 'text-success' : isLowMargin ? 'text-danger' : 'text-primary-700',
                        )}
                      >
                        {formatPercent(dish.grossMargin, 0)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-1.5 bg-primary-50 rounded-full overflow-hidden ml-8">
                <div
                  className={cn(
                    'h-full rounded-full transition-all duration-500',
                    isHighMargin
                      ? 'bg-gradient-to-r from-success to-green-400'
                      : isLowMargin
                      ? 'bg-gradient-to-r from-danger to-red-400'
                      : 'bg-gradient-to-r from-primary-500 to-primary-400',
                  )}
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
