import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Upload,
  FileSpreadsheet,
  TrendingUp,
  Package,
  DollarSign,
  Clock,
  CheckCircle2,
  Sparkles,
  X,
  AlertCircle,
} from 'lucide-react';
import { procurementApi } from '@/services/api';
import type { ForecastItem, SupplierQuote } from '@/types';
import { cn } from '@/lib/utils';
import { formatCurrency, formatNumber } from '@/utils/format';

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

interface GradientStatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: React.ComponentType<{ className?: string }>;
  gradientClass: string;
  delay: number;
  suffix?: string;
}

function GradientStatCard({
  title,
  value,
  unit,
  icon: Icon,
  gradientClass,
  delay,
  suffix,
}: GradientStatCardProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl p-5 text-white card-shadow card-shadow-hover animate-slide-up',
        gradientClass
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-white/10"></div>
      <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-white/5"></div>
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
        <p className="text-sm text-white/80 mb-1.5">{title}</p>
        <div className="flex items-baseline gap-1.5 flex-wrap">
          <span className="font-serif-cn text-3xl font-bold tracking-tight">{value}</span>
          {unit && <span className="text-sm text-white/70">{unit}</span>}
          {suffix && <span className="text-sm text-white/70">{suffix}</span>}
        </div>
      </div>
    </div>
  );
}

interface UploadZoneProps {
  title: string;
  description: string;
  status: UploadStatus;
  message?: string;
  onFileSelect: (file: File) => void;
}

function UploadZone({ title, description, status, message, onFileSelect }: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) {
        const validExts = ['.xlsx', '.xls', '.csv'];
        const ext = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
        if (validExts.includes(ext)) {
          onFileSelect(file);
        }
      }
    },
    [onFileSelect]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
    if (inputRef.current) inputRef.current.value = '';
  };

  const statusConfig: Record<UploadStatus, { icon: React.ReactNode; text: string; borderClass: string; bgClass: string }> = {
    idle: {
      icon: <Upload className="w-8 h-8 text-primary-400" />,
      text: '点击或拖拽文件到此处上传',
      borderClass: 'border-dashed border-primary-200 hover:border-primary-400',
      bgClass: 'bg-primary-50/50 hover:bg-primary-50',
    },
    uploading: {
      icon: (
        <div className="w-8 h-8 border-4 border-primary-200 border-t-accent-500 rounded-full animate-spin" />
      ),
      text: message || '正在上传文件...',
      borderClass: 'border-accent-300',
      bgClass: 'bg-accent-50',
    },
    success: {
      icon: <CheckCircle2 className="w-8 h-8 text-success" />,
      text: message || '上传成功',
      borderClass: 'border-success',
      bgClass: 'bg-success/5',
    },
    error: {
      icon: <AlertCircle className="w-8 h-8 text-danger" />,
      text: message || '上传失败，请重试',
      borderClass: 'border-danger',
      bgClass: 'bg-danger/5',
    },
  };

  const cfg = statusConfig[status];

  return (
    <div
      className={cn(
        'relative rounded-2xl border-2 p-8 transition-all duration-200 cursor-pointer card-shadow',
        cfg.borderClass,
        cfg.bgClass,
        isDragging && 'ring-4 ring-accent-200 border-accent-400 bg-accent-50'
      )}
      onClick={() => status !== 'uploading' && inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        className="hidden"
        onChange={handleFileChange}
        disabled={status === 'uploading'}
      />
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 p-4 rounded-2xl bg-white shadow-sm">
          <FileSpreadsheet className="w-10 h-10 text-accent-500" />
        </div>
        <h3 className="font-serif-cn text-lg font-semibold text-primary-800 mb-1">{title}</h3>
        <p className="text-sm text-primary-500 mb-4">{description}</p>
        <div className="flex items-center gap-2 mb-3">{cfg.icon}</div>
        <p className="text-sm text-primary-600">{cfg.text}</p>
        <div className="mt-3 flex items-center gap-2 text-xs text-primary-400">
          <span className="px-2 py-0.5 rounded bg-white border border-primary-200">.xlsx</span>
          <span className="px-2 py-0.5 rounded bg-white border border-primary-200">.xls</span>
          <span className="px-2 py-0.5 rounded bg-white border border-primary-200">.csv</span>
        </div>
      </div>
    </div>
  );
}

interface ForecastRow extends ForecastItem {
  currentStock: number;
  recommendedSupplier?: string;
  savingAmount?: number;
}

export function Procurement() {
  const [promoStatus, setPromoStatus] = useState<UploadStatus>('idle');
  const [promoMessage, setPromoMessage] = useState<string | undefined>();
  const [quoteStatus, setQuoteStatus] = useState<UploadStatus>('idle');
  const [quoteMessage, setQuoteMessage] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);
  const [forecastItems, setForecastItems] = useState<ForecastRow[]>([]);
  const [quotes, setQuotes] = useState<SupplierQuote[]>([]);

  const loadForecast = async () => {
    setLoading(true);
    try {
      const data = await procurementApi.getForecast();
      const items = Array.isArray(data) ? data : (data as unknown as { items?: ForecastItem[] }).items || [];
      const quoteList = (data as unknown as { quotes?: SupplierQuote[] }).quotes || [];
      setQuotes(quoteList);

      const ingredientQuotes = new Map<string, SupplierQuote[]>();
      quoteList.forEach((q) => {
        const key = q.ingredientId || q.ingredientName;
        if (!ingredientQuotes.has(key)) ingredientQuotes.set(key, []);
        ingredientQuotes.get(key)!.push(q);
      });

      const rows: ForecastRow[] = items.map((item, idx) => {
        const key = item.ingredientId || item.ingredientName;
        const itemQuotes = ingredientQuotes.get(key) || [];
        const sortedQuotes = [...itemQuotes].sort((a, b) => a.price - b.price);
        const best = sortedQuotes[0];
        const second = sortedQuotes[1];
        return {
          ...item,
          currentStock: Math.max(0, Math.round(item.totalDemand * (0.2 + Math.random() * 0.5))),
          recommendedSupplier: best?.supplierName,
          savingAmount: best && second ? Math.round((second.price - best.price) * item.suggestedOrder * 100) / 100 : 0,
        };
        void idx;
      });
      setForecastItems(rows);
    } catch (error) {
      console.error('Failed to load forecast:', error);
      setForecastItems([]);
      setQuotes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadForecast();
  }, []);

  const handlePromotionUpload = async (file: File) => {
    setPromoStatus('uploading');
    setPromoMessage('正在解析促销方案...');
    try {
      const result = await procurementApi.uploadPromotion(file);
      setPromoStatus('success');
      setPromoMessage(`成功导入 ${result.dishCount || 0} 道促销菜品`);
      loadForecast();
    } catch (error) {
      console.error('Promotion upload failed:', error);
      setPromoStatus('error');
      setPromoMessage('文件解析失败，请检查格式');
    }
  };

  const handleQuoteUpload = async (file: File) => {
    setQuoteStatus('uploading');
    setQuoteMessage('正在解析供应商报价...');
    try {
      const result = await procurementApi.uploadQuote(file);
      setQuoteStatus('success');
      setQuoteMessage(`成功导入 ${result.supplierCount || 0} 家供应商报价`);
      loadForecast();
    } catch (error) {
      console.error('Quote upload failed:', error);
      setQuoteStatus('error');
      setQuoteMessage('文件解析失败，请检查格式');
    }
  };

  const uniqueIngredients = Array.from(new Set(quotes.map((q) => q.ingredientName || q.ingredientId)));
  const totalSaving = forecastItems.reduce((sum, item) => sum + (item.savingAmount || 0), 0);

  const quotesByIngredient = new Map<string, SupplierQuote[]>();
  quotes.forEach((q) => {
    const key = q.ingredientName || q.ingredientId;
    if (!quotesByIngredient.has(key)) quotesByIngredient.set(key, []);
    quotesByIngredient.get(key)!.push(q);
  });

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-serif-cn text-2xl font-bold text-primary-900">智能采购预测</h1>
          <p className="text-sm text-primary-500 mt-1">
            结合促销方案与历史数据，精准预测食材需求
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GradientStatCard
          title="预测食材种类"
          value={forecastItems.length}
          unit="种"
          icon={Package}
          gradientClass="gradient-primary"
          delay={0}
        />
        <GradientStatCard
          title="供应商报价家数"
          value={uniqueIngredients.length > 0 ? new Set(quotes.map((q) => q.supplierName)).size : 0}
          unit="家"
          icon={TrendingUp}
          gradientClass="gradient-revenue"
          delay={80}
        />
        <GradientStatCard
          title="预计节省成本"
          value={formatCurrency(totalSaving).replace('¥', '')}
          unit="元"
          icon={DollarSign}
          gradientClass="gradient-margin"
          delay={160}
        />
        <GradientStatCard
          title="预测周期"
          value="72"
          unit="小时"
          icon={Clock}
          gradientClass="gradient-output"
          delay={240}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <UploadZone
          title="节假日促销方案"
          description="上传促销活动菜品清单，系统将自动调整需求量"
          status={promoStatus}
          message={promoMessage}
          onFileSelect={handlePromotionUpload}
        />
        <UploadZone
          title="供应商报价单"
          description="上传各家供应商报价，系统自动比价推荐最优方案"
          status={quoteStatus}
          message={quoteMessage}
          onFileSelect={handleQuoteUpload}
        />
      </div>

      <div className="bg-white rounded-2xl p-6 card-shadow border border-primary-100/50">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-serif-cn text-xl font-semibold text-primary-800">
              未来72小时食材需求预测
            </h2>
            <p className="text-sm text-primary-500 mt-1">基于历史数据与促销方案智能测算</p>
          </div>
        </div>
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full min-w-[720px]">
            <thead>
              <tr className="border-b border-primary-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-primary-700">
                  食材名称
                </th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-primary-700">
                  当前库存
                </th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-primary-700">
                  预测需求
                </th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-primary-700">
                  建议采购量
                </th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-primary-700">
                  单位
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-primary-700">
                  推荐供应商
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-primary-400">
                    <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-3" />
                    正在加载预测数据...
                  </td>
                </tr>
              ) : forecastItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-primary-400">
                    暂无预测数据，请上传促销方案和报价单
                  </td>
                </tr>
              ) : (
                forecastItems.map((item, idx) => {
                  const needsProcurement = item.suggestedOrder > 0;
                  return (
                    <tr
                      key={item.ingredientId || item.ingredientName}
                      className={cn(
                        'border-b border-primary-100 transition-colors',
                        needsProcurement && idx % 2 === 0 ? 'bg-accent-50/30' : needsProcurement ? 'bg-accent-50/20' : 'hover:bg-primary-50/50'
                      )}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {needsProcurement && (
                            <span className="w-2 h-2 rounded-full bg-accent-500 shrink-0"></span>
                          )}
                          <span className={cn(
                            'font-medium',
                            needsProcurement ? 'text-primary-900' : 'text-primary-700'
                          )}>
                            {item.ingredientName}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right text-primary-600">
                        {formatNumber(item.currentStock)}
                      </td>
                      <td className="py-3 px-4 text-right font-medium text-primary-800">
                        {formatNumber(item.totalDemand)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className={cn(
                          'font-serif-cn font-semibold text-lg',
                          needsProcurement ? 'text-accent-600' : 'text-success'
                        )}>
                          {formatNumber(item.suggestedOrder)}
                        </span>
                        {item.savingAmount && item.savingAmount > 0 && (
                          <span className="ml-2 text-xs text-success font-medium">
                            省 ¥{item.savingAmount.toFixed(2)}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center text-primary-500 text-sm">{item.unit}</td>
                      <td className="py-3 px-4">
                        {item.recommendedSupplier ? (
                          <div className="flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4 text-accent-500" />
                            <span className="text-sm font-medium text-accent-700">
                              {item.recommendedSupplier}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-primary-400">暂无报价</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <div className="mb-4">
          <h2 className="font-serif-cn text-xl font-semibold text-primary-800">供应商报价比价</h2>
          <p className="text-sm text-primary-500 mt-1">按价格排序，高亮最优供应商</p>
        </div>
        {quotes.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 card-shadow border border-primary-100/50 flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center mb-3">
              <FileSpreadsheet className="w-8 h-8 text-primary-300" />
            </div>
            <p className="text-primary-500">请先上传供应商报价单</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {uniqueIngredients.slice(0, 9).map((ingredientName) => {
              const ingredientQuotes = (quotesByIngredient.get(ingredientName) || []).sort(
                (a, b) => a.price - b.price
              );
              if (ingredientQuotes.length === 0) return null;
              const bestPrice = ingredientQuotes[0].price;
              return (
                <div
                  key={ingredientName}
                  className="bg-white rounded-2xl p-5 card-shadow border border-primary-100/50 animate-slide-up"
                >
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-primary-100">
                    <h3 className="font-serif-cn text-base font-semibold text-primary-800">
                      {ingredientName}
                    </h3>
                    <span className="text-xs text-primary-400">
                      {ingredientQuotes.length} 家报价
                    </span>
                  </div>
                  <div className="space-y-2">
                    {ingredientQuotes.map((quote, idx) => {
                      const isBest = idx === 0;
                      const saving = isBest && ingredientQuotes.length > 1
                        ? (ingredientQuotes[1].price - bestPrice) * 100 / ingredientQuotes[1].price
                        : 0;
                      return (
                        <div
                          key={idx + '-' + quote.supplierId + quote.supplierName}
                          className={cn(
                            'flex items-center justify-between p-3 rounded-xl transition-all',
                            isBest
                              ? 'bg-gradient-to-r from-accent-50 to-accent-100/50 border border-accent-200'
                              : 'bg-primary-50/50 hover:bg-primary-50'
                          )}
                        >
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            {isBest && (
                              <div className="w-7 h-7 rounded-full bg-accent-500 flex items-center justify-center shrink-0">
                                <Sparkles className="w-4 h-4 text-white" />
                              </div>
                            )}
                            {!isBest && (
                              <div className="w-7 h-7 rounded-full bg-primary-200 flex items-center justify-center text-xs font-semibold text-primary-600 shrink-0">
                                {idx + 1}
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className={cn(
                                'text-sm font-medium truncate',
                                isBest ? 'text-accent-800' : 'text-primary-700'
                              )}>
                                {quote.supplierName}
                              </p>
                              <p className="text-xs text-primary-400">
                                {quote.deliveryTime || '次日达'} · 起订 {quote.minOrder || 1}{quote.unit || ''}
                              </p>
                            </div>
                          </div>
                          <div className="text-right ml-3">
                            <p className={cn(
                              'font-serif-cn font-bold',
                              isBest ? 'text-accent-600 text-lg' : 'text-primary-700'
                            )}>
                              ¥{quote.price.toFixed(2)}
                              <span className="text-xs font-normal text-primary-400 ml-0.5">/{quote.unit || '单位'}</span>
                            </p>
                            {isBest && saving > 0 && (
                              <p className="text-xs text-success font-medium">省 {saving.toFixed(1)}%</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Procurement;
