import { useState } from 'react';
import type { RegionHeatmapData } from '../../types';
import { cn } from '../../lib/utils';
import { formatNumber, formatCurrency } from '../../utils/format';

interface TurnoverHeatmapProps {
  data: RegionHeatmapData[];
}

const CHINA_REGIONS: { name: string; x: number; y: number; w: number; h: number }[] = [
  { name: '黑龙江', x: 80, y: 5, w: 40, h: 30 },
  { name: '吉林', x: 82, y: 35, w: 36, h: 20 },
  { name: '辽宁', x: 75, y: 55, w: 38, h: 18 },
  { name: '内蒙古', x: 30, y: 20, w: 55, h: 45 },
  { name: '新疆', x: 5, y: 25, w: 40, h: 55 },
  { name: '西藏', x: 5, y: 65, w: 35, h: 35 },
  { name: '青海', x: 35, y: 60, w: 25, h: 25 },
  { name: '甘肃', x: 50, y: 50, w: 25, h: 35 },
  { name: '宁夏', x: 55, y: 45, w: 12, h: 18 },
  { name: '陕西', x: 62, y: 50, w: 18, h: 30 },
  { name: '山西', x: 72, y: 55, w: 14, h: 25 },
  { name: '河北', x: 70, y: 40, w: 20, h: 20 },
  { name: '北京', x: 78, y: 38, w: 10, h: 8 },
  { name: '天津', x: 85, y: 42, w: 8, h: 6 },
  { name: '山东', x: 80, y: 62, w: 22, h: 16 },
  { name: '河南', x: 65, y: 72, w: 22, h: 18 },
  { name: '江苏', x: 82, y: 75, w: 18, h: 14 },
  { name: '上海', x: 95, y: 78, w: 6, h: 5 },
  { name: '安徽', x: 75, y: 80, w: 18, h: 18 },
  { name: '浙江', x: 92, y: 82, w: 14, h: 14 },
  { name: '湖北', x: 60, y: 82, w: 22, h: 16 },
  { name: '湖南', x: 60, y: 95, w: 20, h: 18 },
  { name: '江西', x: 78, y: 92, w: 16, h: 20 },
  { name: '福建', x: 92, y: 95, w: 14, h: 18 },
  { name: '台湾', x: 100, y: 100, w: 6, h: 12 },
  { name: '广东', x: 72, y: 108, w: 24, h: 14 },
  { name: '广西', x: 55, y: 108, w: 22, h: 18 },
  { name: '海南', x: 68, y: 125, w: 14, h: 10 },
  { name: '四川', x: 38, y: 75, w: 28, h: 32 },
  { name: '重庆', x: 56, y: 85, w: 12, h: 12 },
  { name: '贵州', x: 50, y: 98, w: 18, h: 16 },
  { name: '云南', x: 30, y: 95, w: 24, h: 28 },
];

export default function TurnoverHeatmap({ data }: TurnoverHeatmapProps) {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  const getRegionData = (provinceName: string) => {
    return data.find((d) => d.province === provinceName || d.city === provinceName);
  };

  const getColor = (rate?: number) => {
    if (!rate) return '#e5e7eb';
    if (rate >= 3.5) return '#16a34a';
    if (rate >= 3.0) return '#22c55e';
    if (rate >= 2.7) return '#86efac';
    if (rate >= 2.5) return '#bbf7d0';
    if (rate >= 2.3) return '#fde68a';
    if (rate >= 2.0) return '#fbbf24';
    return '#f87171';
  };

  const hoveredData = hoveredRegion ? getRegionData(hoveredRegion) : null;

  return (
    <div className="bg-white rounded-xl p-5 card-shadow h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-primary-800 font-serif-cn">区域翻台率热力图</h3>
          <p className="text-xs text-primary-400 mt-0.5">各省市门店翻台效率分布</p>
        </div>
      </div>

      <div className="relative">
        <svg viewBox="0 0 115 140" className="w-full h-auto" style={{ maxHeight: 320 }}>
          {CHINA_REGIONS.map((region) => {
            const regionData = getRegionData(region.name);
            const isHovered = hoveredRegion === region.name;
            return (
              <g key={region.name}>
                <rect
                  x={region.x}
                  y={region.y}
                  width={region.w}
                  height={region.h}
                  rx={2}
                  fill={getColor(regionData?.turnoverRate)}
                  stroke={isHovered ? '#1e3a5f' : 'white'}
                  strokeWidth={isHovered ? 0.8 : 0.3}
                  className="cursor-pointer transition-all duration-200"
                  style={{
                    filter: isHovered ? 'brightness(1.1)' : undefined,
                  }}
                  onMouseEnter={() => setHoveredRegion(region.name)}
                  onMouseLeave={() => setHoveredRegion(null)}
                />
                {region.w >= 12 && region.h >= 10 && (
                  <text
                    x={region.x + region.w / 2}
                    y={region.y + region.h / 2 + 1.5}
                    textAnchor="middle"
                    className="pointer-events-none"
                    fill={regionData ? 'white' : '#9ca3af'}
                    fontSize={region.w > 18 ? 3.5 : 2.8}
                    fontWeight={regionData ? 600 : 400}
                  >
                    {region.name}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {hoveredData && (
          <div className="absolute top-2 right-2 bg-white rounded-lg shadow-lg border border-primary-100 p-3 min-w-[160px] animate-fade-in">
            <div className="font-semibold text-primary-800 text-sm mb-2">
              {hoveredData.province}
              {hoveredData.city !== hoveredData.province && ` · ${hoveredData.city}`}
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-primary-400">翻台率</span>
                <span className="font-semibold text-primary-700">{formatNumber(hoveredData.turnoverRate)} 次</span>
              </div>
              <div className="flex justify-between">
                <span className="text-primary-400">门店数</span>
                <span className="font-semibold text-primary-700">{hoveredData.storeCount} 家</span>
              </div>
              <div className="flex justify-between">
                <span className="text-primary-400">平均营收</span>
                <span className="font-semibold text-primary-700">{formatCurrency(hoveredData.avgRevenue)}</span>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-center gap-4 mt-4 pt-3 border-t border-primary-50">
          <div className="flex items-center gap-1">
            <div className="w-4 h-3 rounded" style={{ background: '#f87171' }} />
            <span className="text-[10px] text-primary-400">{'<2.0'}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-3 rounded" style={{ background: '#fbbf24' }} />
            <span className="text-[10px] text-primary-400">2.0-2.5</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-3 rounded" style={{ background: '#bbf7d0' }} />
            <span className="text-[10px] text-primary-400">2.5-3.0</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-3 rounded" style={{ background: '#22c55e' }} />
            <span className="text-[10px] text-primary-400">3.0-3.5</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-3 rounded" style={{ background: '#16a34a' }} />
            <span className="text-[10px] text-primary-400">{'>3.5'}</span>
          </div>
          <span className="text-[10px] text-primary-400 ml-2">翻台率（次/日）</span>
        </div>
      </div>
    </div>
  );
}
