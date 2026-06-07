import { useEffect, useState, useRef, useCallback } from 'react';
import { Upload, FileSpreadsheet, TrendingUp, Package, DollarSign, Clock, CheckCircle2, Sparkles } from 'lucide-react';
import { api } from '../services/api';
import type { ForecastItem, SupplierQuote } from '../types';
import { formatCurrency, formatNumber } from '../utils/format';
import { cn } from '../lib/utils';

export default function Procurement() {
  const [forecast, setForecast] = useState<ForecastItem[]>([]);
  const [quotes, setQuotes] = useState<SupplierQuote[]>([]);
  const [totalSavedCost, setTotalSavedCost] = useState(0);
  const [loading, setLoading] = useState(true);
  const [promotionFile, setPromotionFile] = useState<File | null>(null);
  const [quoteFile, setQuoteFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<{ promotion?: string; quote?: string }>({});
  const promotionInputRef = useRef<HTMLInputElement>(null);
  const quoteInputRef = useRef<HTMLInputElement>(null);

  const loadForecast = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.procurement.forecast();
      setForecast(data.forecast);
      setQuotes(data.quotes);
      setTotalSavedCost(data.totalSavedCost);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadForecast();
  }, [loadForecast]);

  const handlePromotionUpload = async (file: File) => {
    setPromotionFile(file);
    setUploadStatus((s) => ({ ...s, promotion: 'uploading' }));
    try {
      await api.procurement.uploadPromotion(file.name);
      setUploadStatus((s) => ({ ...s, promotion: 'success' }));
    } catch {
      setUploadStatus((s) => ({ ...s, promotion: 'error' }));
    }
  };

  const handleQuoteUpload = async (file: File) => {
    setQuoteFile(file);
    setUploadStatus((s) => ({ ...s, quote: 'uploading' }));
    try {
      await api.procurement.uploadQuote(file.name);
      setUploadStatus((s) => ({ ...s, quote: 'success' }));
    } catch {
      setUploadStatus((s) => ({ ...s, quote: 'error' }));
    }
  };

  const getQuotesForIngredient = (ingredientId: string) => {
    return quotes.filter((q) => q.ingredientId === ingredientId);
  };

  const statsCards = [
    {
      title: '预测食材种类',
      value: forecast.length,
      unit: '种',
      icon: <Package size={20} />,
      gradientClass: 'gradient-turnover',
    },
    {
      title: '供应商报价',
      value: new Set(quotes.map((q) => q.supplierId)).size,
      unit: '家',
      icon: <FileSpreadsheet size={20} />,
      gradientClass: 'gradient-margin',
    },
    {
      title: '预计节省成本',
      value: formatCurrency(totalSavedCost),
      icon: <DollarSign size={20} />,
      gradientClass: 'gradient-revenue',
    },
    {
      title: '预测周期',
      value: '72',
      unit: '小时',
      icon: <Clock size={20} />,
      gradientClass: 'gradient-output',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold font-serif-cn text-primary-800">智能采购预测</h1>
        <p className="text-sm text-primary-400 mt-1">结合促销方案与历史数据，精准预测食材需求，推荐最优采购方案</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statsCards.map((card, idx) => (
          <div
            key={idx}
            className={cn(
              'relative rounded-xl p-4 overflow-hidden card-shadow',
              card.gradientClass,
            )}
            style={{ animationDelay: `${idx * 50}ms` }}
          >
            <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full bg-white/10" />
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-white/80">{card.title}</span>
                <div className="text-white/80">{card.icon}</div>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold font-serif-cn text-white">{card.value}</span>
                {card.unit && <span className="text-sm text-white/70">{card.unit}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 card-shadow">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <FileSpreadsheet size={16} className="text-white" />
            </div>
            <div>
              <h3 className="text-base font-semibold font-serif-cn text-primary-800">节假日促销方案</h3>
              <p className="text-xs text-primary-400">上传Excel格式促销方案，自动提取促销菜品与折扣</p>
            </div>
          </div>
          <div
            onClick={() => promotionInputRef.current?.click()}
            className={cn(
              'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all',
              uploadStatus.promotion === 'success'
                ? 'border-success bg-success/5'
                : 'border-primary-200 bg-primary-50/30 hover:border-primary-400 hover:bg-primary-50',
            )}
          >
            <input
              ref={promotionInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handlePromotionUpload(e.target.files[0])}
            />
            {uploadStatus.promotion === 'success' ? (
              <>
                <CheckCircle2 size={36} className="mx-auto text-success mb-2" />
                <div className="text-sm font-medium text-success mb-1">上传成功</div>
                <div className="text-xs text-primary-400">{promotionFile?.name}</div>
              </>
            ) : uploadStatus.promotion === 'uploading' ? (
              <>
                <div className="w-9 h-9 mx-auto mb-2 rounded-full border-2 border-primary-300 border-t-primary-600 animate-spin" />
                <div className="text-sm font-medium text-primary-600">解析中...</div>
              </>
            ) : (
              <>
                <Upload size={36} className="mx-auto text-primary-300 mb-2" />
                <div className="text-sm font-medium text-primary-600 mb-1">点击或拖拽上传促销方案</div>
                <div className="text-xs text-primary-400">支持 .xlsx、.xls、.csv 格式</div>
              </>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 card-shadow">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg gradient-margin flex items-center justify-center">
              <DollarSign size={16} className="text-white" />
            </div>
            <div>
              <h3 className="text-base font-semibold font-serif-cn text-primary-800">供应商报价单</h3>
              <p className="text-xs text-primary-400">上传供应商报价单，系统自动比价推荐最优方案</p>
            </div>
          </div>
          <div
            onClick={() => quoteInputRef.current?.click()}
            className={cn(
              'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all',
              uploadStatus.quote === 'success'
                ? 'border-success bg-success/5'
                : 'border-primary-200 bg-primary-50/30 hover:border-primary-400 hover:bg-primary-50',
            )}
          >
            <input
              ref={quoteInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleQuoteUpload(e.target.files[0])}
            />
            {uploadStatus.quote === 'success' ? (
              <>
                <CheckCircle2 size={36} className="mx-auto text-success mb-2" />
                <div className="text-sm font-medium text-success mb-1">上传成功</div>
                <div className="text-xs text-primary-400">{quoteFile?.name}</div>
              </>
            ) : uploadStatus.quote === 'uploading' ? (
              <>
                <div className="w-9 h-9 mx-auto mb-2 rounded-full border-2 border-primary-300 border-t-primary-600 animate-spin" />
                <div className="text-sm font-medium text-primary-600">解析中...</div>
              </>
            ) : (
              <>
                <Upload size={36} className="mx-auto text-primary-300 mb-2" />
                <div className="text-sm font-medium text-primary-600 mb-1">点击或拖拽上传报价单</div>
                <div className="text-xs text-primary-400">支持 .xlsx、.xls、.csv 格式</div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 card-shadow">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg gradient-wastage flex items-center justify-center">
            <TrendingUp size={16} className="text-white" />
          </div>
          <div>
            <h3 className="text-base font-semibold font-serif-cn text-primary-800">未来72小时食材需求预测</h3>
            <p className="text-xs text-primary-400">基于历史销量、促销活动、季节因素智能预测</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="animate-pulse text-primary-400">加载中...</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-primary-100">
                  <th className="text-left py-3 px-3 font-medium text-primary-500 text-xs">食材名称</th>
                  <th className="text-right py-3 px-3 font-medium text-primary-500 text-xs">当前库存</th>
                  <th className="text-right py-3 px-3 font-medium text-primary-500 text-xs">预测需求</th>
                  <th className="text-right py-3 px-3 font-medium text-primary-500 text-xs">建议采购量</th>
                  <th className="text-right py-3 px-3 font-medium text-primary-500 text-xs">单位</th>
                  <th className="text-left py-3 px-3 font-medium text-primary-500 text-xs">推荐供应商</th>
                </tr>
              </thead>
              <tbody>
                {forecast.map((item, idx) => {
                  const itemQuotes = getQuotesForIngredient(item.ingredientId);
                  const recommended = itemQuotes.find((q) => q.isRecommended);
                  const needToOrder = item.suggestedOrder - item.currentStock;
                  return (
                    <tr key={item.ingredientId} className="border-b border-primary-50 hover:bg-primary-50/30 transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-medium text-primary-800">{item.ingredientName}</div>
                      </td>
                      <td className="text-right py-3 px-3 text-primary-600">{formatNumber(item.currentStock, 0)}</td>
                      <td className="text-right py-3 px-3 text-primary-600">{formatNumber(item.totalDemand, 0)}</td>
                      <td className="text-right py-3 px-3">
                        <span className={cn('font-semibold', needToOrder > 0 ? 'text-accent-600' : 'text-success')}>
                          {formatNumber(item.suggestedOrder, 0)}
                        </span>
                        {needToOrder > 0 && (
                          <div className="text-[10px] text-accent-500 mt-0.5">需采购 +{formatNumber(needToOrder, 0)}</div>
                        )}
                      </td>
                      <td className="text-right py-3 px-3 text-primary-500">{item.unit}</td>
                      <td className="py-3 px-3">
                        {recommended ? (
                          <div>
                            <div className="flex items-center gap-1">
                              <Sparkles size={12} className="text-accent-500" />
                              <span className="font-medium text-primary-700">{recommended.supplierName}</span>
                            </div>
                            <div className="text-xs text-primary-400 mt-0.5">
                              ¥{recommended.price}/{item.unit} · {recommended.deliveryTime}
                            </div>
                            {recommended.savedCost && recommended.savedCost > 0 && (
                              <div className="text-[10px] text-success mt-0.5">可节省 ¥{formatNumber(recommended.savedCost, 0)}</div>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-primary-400">暂无报价</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl p-6 card-shadow">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg gradient-margin flex items-center justify-center">
            <DollarSign size={16} className="text-white" />
          </div>
          <div>
            <h3 className="text-base font-semibold font-serif-cn text-primary-800">供应商报价比价</h3>
            <p className="text-xs text-primary-400">同种食材不同供应商价格对比，高亮最优选择</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from(new Set(quotes.map((q) => q.ingredientId))).map((ingredientId) => {
            const ingredientQuotes = quotes.filter((q) => q.ingredientId === ingredientId);
            const ingredientName = ingredientQuotes[0]?.ingredientName;
            const unit = ingredientQuotes[0]?.ingredientName.includes('猪') || ingredientQuotes[0]?.ingredientName.includes('鲈') || ingredientQuotes[0]?.ingredientName.includes('虾') || ingredientQuotes[0]?.ingredientName.includes('兰花') ? 'kg' : ingredientQuotes[0]?.ingredientName.includes('豆腐') ? '盒' : '个';
            return (
              <div key={ingredientId} className="border border-primary-100 rounded-xl p-4">
                <div className="font-semibold font-serif-cn text-primary-800 mb-3">{ingredientName}</div>
                <div className="space-y-2">
                  {ingredientQuotes
                    .sort((a, b) => a.price - b.price)
                    .map((q) => (
                      <div
                        key={q.supplierId}
                        className={cn(
                          'flex items-center justify-between p-2.5 rounded-lg transition-all',
                          q.isRecommended
                            ? 'bg-accent-50 border border-accent-200'
                            : 'bg-primary-50/50',
                        )}
                      >
                        <div className="flex items-center gap-2">
                          {q.isRecommended && (
                            <Sparkles size={14} className="text-accent-500" />
                          )}
                          <div>
                            <div className={cn('text-sm', q.isRecommended ? 'font-semibold text-accent-700' : 'text-primary-700')}>
                              {q.supplierName}
                            </div>
                            <div className="text-[10px] text-primary-400">
                              起订 {q.minOrder}{unit} · {q.deliveryTime}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={cn('font-bold', q.isRecommended ? 'text-accent-600' : 'text-primary-700')}>
                            ¥{q.price.toFixed(1)}
                          </div>
                          <div className="text-[10px] text-primary-400">/{unit}</div>
                          {q.savedCost && q.savedCost > 0 && (
                            <div className="text-[10px] text-success font-medium">省 ¥{formatNumber(q.savedCost, 0)}</div>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
