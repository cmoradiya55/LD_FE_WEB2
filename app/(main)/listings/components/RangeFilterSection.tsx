'use client';

import { useMemo } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

type Formatter = (value: number) => string;

interface RangeFilterSectionProps {
  title: string;
  min: number;
  max: number;
  step?: number;
  valueMin: number;
  valueMax: number;
  stops?: number[];
  expanded: boolean;
  onToggle: () => void;
  onChange: (min: number, max: number) => void;
  onClear?: () => void;
  formatValue?: Formatter;
  unitSuffix?: string;
}

// A reusable double range slider section used for Budget, Model Year, and Kms Driven filters.
export function RangeFilterSection({
  title,
  min,
  max,
  step = 1,
  valueMin,
  valueMax,
  stops,
  expanded,
  onToggle,
  onChange,
  onClear,
  formatValue,
  unitSuffix,
}: RangeFilterSectionProps) {

  console.log(title, "min : ",  min);
  console.log(title, "max : ", max);
  console.log(title, "valueMin : ",  valueMin);
  console.log(title, "valueMax : ",  valueMax);
  
  const format = (val: number) => {
    if (formatValue) return formatValue(val);
    return `${val}${unitSuffix ? ` ${unitSuffix}` : ''}`;
  };

  const constrainedMin = Math.max(min, Math.min(valueMin, valueMax));
  const constrainedMax = Math.min(max, Math.max(valueMax, valueMin));

  const snapToStops = (value: number) => {
    if (!stops || stops.length === 0) return value;
    return stops.reduce((closest, stop) =>
      Math.abs(stop - value) < Math.abs(closest - value) ? stop : closest
    , stops[0]);
  };

  const minPercent = useMemo(
    () => ((constrainedMin - min) / (max - min)) * 100,
    [constrainedMin, min, max]
  );
  const maxPercent = useMemo(
    () => ((constrainedMax - min) / (max - min)) * 100,
    [constrainedMax, min, max]
  );

  const handleMinChange = (newValue: number) => {
    const snapped = snapToStops(newValue);
    const nextMin = Math.min(snapped, constrainedMax - step);
    onChange(nextMin, constrainedMax);
  };

  const handleMaxChange = (newValue: number) => {
    const snapped = snapToStops(newValue);
    const nextMax = Math.max(snapped, constrainedMin + step);
    onChange(constrainedMin, nextMax);
  };

  return (
    <div className="mb-4 border-b border-gray-200 pb-4">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between"
      >
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        )}
      </button>

      {expanded && (
        <div className="space-y-3 mt-3">
          {/* Range values */}
          <div className="flex justify-between text-xs font-semibold text-primary-700">
            <span>{format(constrainedMin)}</span>
            <span>{format(constrainedMax)}</span>
          </div>

          {/* Slider */}
          <div className="relative pt-3 pb-2">
            <div className="absolute left-0 right-0 top-5 h-1 bg-gray-200 rounded-full" />
            <div
              className="absolute top-5 h-1 bg-primary-600 rounded-full"
              style={{
                left: `${minPercent}%`,
                width: `${Math.max(0, maxPercent - minPercent)}%`,
              }}
            />

            <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={constrainedMin}
              onChange={(e) => handleMinChange(Number(e.target.value))}
              className="absolute z-20 w-full h-1 appearance-none bg-transparent focus:outline-none slider-thumb"
            />
            
            <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={constrainedMax}
              onChange={(e) => handleMaxChange(Number(e.target.value))}
              className="absolute z-20 w-full h-1 appearance-none bg-transparent focus:outline-none slider-thumb"
            />

            {/* Stops */}
            {stops && stops.length > 0 && (
              <div className="absolute left-0 right-0 bottom-2">
                {stops.map((stop, index) => {
                  const stopPercent =
                    stops.length === 1 ? 0 : (index / (stops.length - 1)) * 100;
                  return (
                    <div
                      key={stop}
                      className="absolute"
                      style={{ left: `${stopPercent}%`, transform: 'translateX(-50%)' }}
                    >
                      <div className="w-0.5 h-2 bg-gray-300" />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Min / Max labels */}
          <div className="flex justify-between text-xs text-gray-400">
            <span>Minimum</span>
            <span>Maximum</span>
          </div>

          {onClear && (
            <button
              onClick={onClear}
              className="text-xs text-gray-600 hover:text-primary-600 underline"
            >
              Clear
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// Basic slider thumb styling; relies on Tailwind base styles for the rest.
// Note: Tailwind doesn't style range thumbs, so we add a small scoped utility class.
const style = `
  .slider-thumb::-webkit-slider-thumb {
    appearance: none;
    height: 18px;
    width: 18px;
    border-radius: 9999px;
    background: white;
    border: 2px solid #2563eb; /* primary-600 */
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  }
  .slider-thumb::-moz-range-thumb {
    height: 18px;
    width: 18px;
    border-radius: 9999px;
    background: white;
    border: 2px solid #2563eb;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  }
  .slider-thumb {
    pointer-events: none;
  }
  .slider-thumb::-webkit-slider-thumb {
    pointer-events: all;
  }
  .slider-thumb::-moz-range-thumb {
    pointer-events: all;
  }
`;

// Inject the scoped style once.
if (typeof document !== 'undefined' && !document.getElementById('range-filter-style')) {
  const styleTag = document.createElement('style');
  styleTag.id = 'range-filter-style';
  styleTag.innerHTML = style;
  document.head.appendChild(styleTag);
}

