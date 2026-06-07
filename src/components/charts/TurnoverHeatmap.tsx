import { useState } from 'react';
import type { RegionHeatmapData } from '@/types';

interface TurnoverHeatmapProps {
  data: RegionHeatmapData[];
}

interface ProvinceShape {
  id: string;
  name: string;
  path: string;
  labelX: number;
  labelY: number;
}

const provinceShapes: ProvinceShape[] = [
  { id: 'beijing', name: '北京', path: 'M420,120 L460,110 L470,140 L450,160 L420,155 Z', labelX: 440, labelY: 138 },
  { id: 'tianjin', name: '天津', path: 'M470,140 L495,135 L500,160 L480,170 L465,158 Z', labelX: 483, labelY: 153 },
  { id: 'hebei', name: '河北', path: 'M400,90 L500,80 L520,120 L510,170 L490,190 L430,180 L400,160 L390,120 Z', labelX: 455, labelY: 125 },
  { id: 'shanxi', name: '山西', path: 'M340,110 L400,90 L390,120 L400,160 L380,200 L340,195 L320,155 Z', labelX: 360, labelY: 150 },
  { id: 'neimenggu', name: '内蒙古', path: 'M260,40 L520,10 L560,30 L540,70 L500,80 L400,90 L340,110 L280,100 L240,80 Z', labelX: 400, labelY: 55 },
  { id: 'liaoning', name: '辽宁', path: 'M500,40 L580,30 L600,60 L580,95 L540,95 L520,70 Z', labelX: 555, labelY: 62 },
  { id: 'jilin', name: '吉林', path: 'M560,5 L640,0 L655,30 L630,55 L580,45 L560,30 Z', labelX: 605, labelY: 25 },
  { id: 'heilongjiang', name: '黑龙江', path: 'M580,0 L700,0 L720,30 L690,60 L640,45 L600,30 Z', labelX: 650, labelY: 25 },
  { id: 'shanghai', name: '上海', path: 'M535,295 L560,290 L565,310 L545,320 L530,308 Z', labelX: 548, labelY: 305 },
  { id: 'jiangsu', name: '江苏', path: 'M470,260 L560,255 L570,290 L535,295 L530,308 L500,315 L470,300 Z', labelX: 520, labelY: 285 },
  { id: 'zhejiang', name: '浙江', path: 'M500,315 L565,310 L575,350 L545,375 L510,370 L495,345 Z', labelX: 535, labelY: 342 },
  { id: 'anhui', name: '安徽', path: 'M430,280 L500,275 L500,315 L495,345 L465,355 L430,340 L420,305 Z', labelX: 463, labelY: 315 },
  { id: 'fujian', name: '福建', path: 'M495,370 L545,375 L555,415 L525,440 L490,430 L480,400 Z', labelX: 518, labelY: 403 },
  { id: 'jiangxi', name: '江西', path: 'M430,355 L495,345 L480,400 L490,430 L455,450 L420,430 L410,390 Z', labelX: 453, labelY: 395 },
  { id: 'shandong', name: '山东', path: 'M400,210 L520,190 L540,230 L510,260 L470,260 L420,250 L395,230 Z', labelX: 465, labelY: 230 },
  { id: 'henan', name: '河南', path: 'M340,240 L420,230 L420,250 L430,280 L400,300 L340,295 L310,270 Z', labelX: 375, labelY: 268 },
  { id: 'hubei', name: '湖北', path: 'M330,300 L430,295 L430,340 L400,355 L340,350 L310,325 Z', labelX: 373, labelY: 325 },
  { id: 'hunan', name: '湖南', path: 'M340,360 L420,355 L420,390 L410,430 L370,450 L330,435 L315,400 Z', labelX: 370, labelY: 400 },
  { id: 'guangdong', name: '广东', path: 'M370,455 L490,450 L510,490 L475,520 L400,520 L360,495 Z', labelX: 435, labelY: 487 },
  { id: 'guangxi', name: '广西', path: 'M270,450 L370,455 L360,495 L330,520 L270,510 L245,480 Z', labelX: 310, labelY: 485 },
  { id: 'hainan', name: '海南', path: 'M320,545 L375,540 L385,570 L355,585 L320,575 Z', labelX: 350, labelY: 562 },
  { id: 'chongqing', name: '重庆', path: 'M250,350 L310,340 L320,370 L295,390 L255,385 L240,365 Z', labelX: 280, labelY: 365 },
  { id: 'sichuan', name: '四川', path: 'M160,320 L250,310 L250,350 L240,365 L255,385 L230,420 L180,425 L140,395 L130,355 Z', labelX: 200, labelY: 368 },
  { id: 'guizhou', name: '贵州', path: 'M240,430 L330,420 L330,450 L310,475 L260,480 L230,460 Z', labelX: 280, labelY: 453 },
  { id: 'yunnan', name: '云南', path: 'M130,440 L230,430 L230,460 L260,480 L240,515 L180,520 L120,495 L105,465 Z', labelX: 180, labelY: 475 },
  { id: 'xizang', name: '西藏', path: 'M20,340 L140,320 L130,355 L140,395 L105,420 L40,410 L10,375 Z', labelX: 75, labelY: 370 },
  { id: 'shaanxi', name: '陕西', path: 'M290,210 L340,200 L340,240 L310,270 L340,295 L330,325 L290,320 L270,280 L275,240 Z', labelX: 308, labelY: 265 },
  { id: 'gansu', name: '甘肃', path: 'M180,180 L290,160 L290,210 L275,240 L270,280 L230,285 L200,260 L165,230 L160,200 Z', labelX: 230, labelY: 225 },
  { id: 'qinghai', name: '青海', path: 'M80,230 L180,210 L200,260 L180,300 L110,310 L70,285 L60,255 Z', labelX: 135, labelY: 265 },
  { id: 'ningxia', name: '宁夏', path: 'M260,180 L295,175 L300,205 L280,220 L258,210 Z', labelX: 280, labelY: 198 },
  { id: 'xinjiang', name: '新疆', path: 'M10,100 L200,60 L230,110 L210,160 L180,180 L80,190 L30,170 L5,135 Z', labelX: 115, labelY: 130 },
  { id: 'taiwan', name: '台湾', path: 'M575,410 L595,405 L605,440 L585,455 L570,435 Z', labelX: 588, labelY: 430 },
];

function getTurnoverColor(rate: number): string {
  if (rate < 2.5) return '#ef4444';
  if (rate < 3.0) return '#f97316';
  if (rate < 3.5) return '#10b981';
  return '#065f46';
}

function getTurnoverColorOpacity(rate: number): string {
  const baseColor = getTurnoverColor(rate);
  const normalizedRate = Math.min(Math.max((rate - 1.5) / 3, 0.3), 1);
  const opacity = Math.round(normalizedRate * 255).toString(16).padStart(2, '0');
  return baseColor + opacity;
}

export default function TurnoverHeatmap({ data }: TurnoverHeatmapProps) {
  const [hoveredProvince, setHoveredProvince] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const dataMap = new Map(data.map((d) => [d.city, d]));

  const handleMouseMove = (e: React.MouseEvent, provinceName: string) => {
    setHoveredProvince(provinceName);
    const rect = (e.currentTarget as SVGElement).closest('svg')?.getBoundingClientRect();
    if (rect) {
      setTooltipPosition({
        x: e.clientX - rect.left + 15,
        y: e.clientY - rect.top + 15,
      });
    }
  };

  const handleMouseLeave = () => {
    setHoveredProvince(null);
  };

  const hoveredData = hoveredProvince ? dataMap.get(hoveredProvince) : null;

  const legendItems = [
    { label: '< 2.5', color: '#ef4444' },
    { label: '2.5 - 3.0', color: '#f97316' },
    { label: '3.0 - 3.5', color: '#10b981' },
    { label: '> 3.5', color: '#065f46' },
  ];

  return (
    <div className="bg-white rounded-xl card-shadow p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-serif-cn text-xl font-semibold text-primary-800">
          全国区域翻台率热力图
        </h3>
        <div className="flex items-center gap-4">
          <span className="text-sm text-primary-500">翻台率（次/天）</span>
          <div className="flex items-center gap-2">
            {legendItems.map((item) => (
              <div key={item.label} className="flex items-center gap-1">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs text-primary-600">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative">
        <svg viewBox="0 0 730 600" className="w-full h-auto">
          <defs>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.15" />
            </filter>
          </defs>

          {provinceShapes.map((province) => {
            const provinceData = dataMap.get(province.name);
            const turnoverRate = provinceData?.turnoverRate ?? 0;
            const fillColor = provinceData
              ? getTurnoverColorOpacity(turnoverRate)
              : '#e5e7eb';
            const isHovered = hoveredProvince === province.name;

            return (
              <g key={province.id}>
                <path
                  d={province.path}
                  fill={fillColor}
                  stroke={isHovered ? '#f97316' : '#ffffff'}
                  strokeWidth={isHovered ? 2.5 : 1}
                  className="cursor-pointer transition-all duration-200"
                  style={{
                    filter: isHovered ? 'url(#shadow)' : 'none',
                    transform: isHovered ? 'scale(1.02)' : 'scale(1)',
                    transformOrigin: 'center',
                  }}
                  onMouseMove={(e) => handleMouseMove(e, province.name)}
                  onMouseLeave={handleMouseLeave}
                />
                <text
                  x={province.labelX}
                  y={province.labelY}
                  textAnchor="middle"
                  className="pointer-events-none select-none"
                  fontSize="10"
                  fill={provinceData ? '#ffffff' : '#6b7280'}
                  fontWeight={isHovered ? 700 : 500}
                >
                  {province.name}
                </text>
              </g>
            );
          })}
        </svg>

        {hoveredData && (
          <div
            className="absolute pointer-events-none bg-primary-900 text-white px-4 py-3 rounded-lg shadow-xl z-10 animate-fade-in"
            style={{
              left: tooltipPosition.x,
              top: tooltipPosition.y,
              minWidth: '180px',
            }}
          >
            <div className="font-serif-cn text-lg font-semibold text-accent-400 mb-2">
              {hoveredData.city}
              <span className="text-sm text-primary-300 ml-2">
                ({hoveredData.province})
              </span>
            </div>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-primary-300">翻台率</span>
                <span
                  className="font-semibold"
                  style={{ color: getTurnoverColor(hoveredData.turnoverRate) }}
                >
                  {hoveredData.turnoverRate.toFixed(2)} 次/天
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-primary-300">门店数量</span>
                <span className="font-semibold">{hoveredData.storeCount} 家</span>
              </div>
              <div className="flex justify-between">
                <span className="text-primary-300">平均营收</span>
                <span className="font-semibold text-accent-400">
                  ¥{hoveredData.avgRevenue.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
