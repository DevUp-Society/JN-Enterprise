import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

interface HighDensityChartProps {
  data: { label: string; value: number }[];
  color?: string;
  height?: number;
}

export default function HighDensityChart({ data, color = '#000000', height = 300 }: HighDensityChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const maxVal = Math.max(...data.map(d => d.value), 1);
  const width = 1000;
  
  const points = useMemo((): { x: number; y: number }[] => {
    if (data.length < 2) return [];
    const step = width / (data.length - 1);
    return data.map((d, i) => ({
      x: i * step,
      y: height - (d.value / maxVal) * height
    }));
  }, [data, maxVal, height]);

  const getPathData = (pts: { x: number; y: number }[]) => {
    if (pts.length < 2) return '';
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i];
      const p1 = pts[i + 1];
      const cp1x = p0.x + (p1.x - p0.x) / 2;
      const cp1y = p0.y;
      const cp2x = p0.x + (p1.x - p0.x) / 2;
      const cp2y = p1.y;
      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1.x} ${p1.y}`;
    }
    return d;
  };

  const actualPath = useMemo(() => getPathData(points), [points]);

  const areaData = useMemo(() => {
    if (points.length < 2) return '';
    const start = `M ${points[0].x} ${height}`;
    const line = actualPath.replace('M', 'L');
    return `${start} ${line} L ${points[points.length - 1].x} ${height} Z`;
  }, [points, actualPath, height]);

  return (
    <div className="relative w-full overflow-visible" style={{ height }}>
      <svg 
        viewBox={`0 0 ${width} ${height}`} 
        className="w-full h-full overflow-visible"
        preserveAspectRatio="none"
        onMouseLeave={() => setHoveredIndex(null)}
      >
        <defs>
          <linearGradient id="spline-gradient-v3" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#000000" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Area Fill */}
        <motion.path 
          d={areaData}
          fill="url(#spline-gradient-v3)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />

        {/* Spline Path */}
        <motion.path 
          d={actualPath}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />

        {/* Interaction zones */}
        {points.map((p, i) => (
          <rect 
            key={i}
            x={p.x - (width/data.length)/2}
            y={0}
            width={width/data.length}
            height={height}
            fill="transparent"
            onMouseEnter={() => setHoveredIndex(i)}
            className="cursor-crosshair"
          />
        ))}

        {hoveredIndex !== null && (
          <>
            <line 
              x1={points[hoveredIndex].x} 
              y1={0} 
              x2={points[hoveredIndex].x} 
              y2={height} 
              stroke={color} 
              strokeWidth="1" 
              strokeDasharray="4 4" 
              opacity="0.3" 
            />
            <circle 
              cx={points[hoveredIndex].x} 
              cy={points[hoveredIndex].y} 
              r="6" 
              fill={color} 
              stroke="white" 
              strokeWidth="2" 
              className="shadow-2xl"
            />
          </>
        )}
      </svg>

      {hoveredIndex !== null && (
        <div 
          className="absolute z-20 pointer-events-none bg-[#000000] border border-white/20 shadow-2xl p-4 min-w-[160px]"
          style={{ 
            left: `${(points[hoveredIndex].x / width) * 100}%`,
            top: `${(points[hoveredIndex].y / height) * 100}%`,
            transform: 'translate(-50%, -130%)'
          }}
        >
          <div className="space-y-1">
             <p className="text-[7px] font-black text-black/40 uppercase tracking-[0.3em] italic">DATAPOINT_SYNC_</p>
             <div className="flex items-end justify-between">
                <p className="text-sm font-black text-white tracking-tighter">${data[hoveredIndex].value.toLocaleString()}</p>
                <p className="text-[7px] font-bold text-white/20 uppercase">{data[hoveredIndex].label}</p>
             </div>
          </div>
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[#000000]" />
        </div>
      )}
    </div>
  );
}










