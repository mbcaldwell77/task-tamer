import { useState } from 'react';

interface SliderProps {
  label: string;
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  minLabel: string;
  maxLabel: string;
}

export const Slider = ({ label, min, max, value, onChange, minLabel, maxLabel }: SliderProps) => {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div className="space-y-3">
      <label className="block text-lg font-semibold text-text-primary">{label}</label>
      <div className="flex items-center gap-4">
        <span className="text-2xl">{minLabel}</span>
        <div className="flex-1 relative">
          <input
            type="range"
            min={min}
            max={max}
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value))}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onTouchStart={() => setIsDragging(true)}
            onTouchEnd={() => setIsDragging(false)}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #888 0%, #888 ${((value - min) / (max - min)) * 100}%, #333 ${((value - min) / (max - min)) * 100}%, #333 100%)`,
            }}
          />
          <style>{`
            .slider::-webkit-slider-thumb {
              appearance: none;
              width: 20px;
              height: 20px;
              border-radius: 50%;
              background: #888;
              cursor: pointer;
              transition: all 150ms;
            }
            .slider::-webkit-slider-thumb:hover {
              background: #999;
              transform: scale(1.1);
            }
            .slider::-moz-range-thumb {
              width: 20px;
              height: 20px;
              border-radius: 50%;
              background: #888;
              cursor: pointer;
              border: none;
              transition: all 150ms;
            }
            .slider::-moz-range-thumb:hover {
              background: #999;
              transform: scale(1.1);
            }
          `}</style>
        </div>
        <span className="text-2xl">{maxLabel}</span>
      </div>
      <div className="flex justify-between text-sm text-text-secondary px-8">
        <span>Poor</span>
        <span>Great</span>
      </div>
    </div>
  );
};

