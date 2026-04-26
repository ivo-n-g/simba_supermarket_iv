import React from 'react';

interface PriceRangeSliderProps {
  min: number;
  max: number;
  minPrice: number;
  maxPrice: number;
  onMinChange: (val: number) => void;
  onMaxChange: (val: number) => void;
}

const PriceRangeSlider: React.FC<PriceRangeSliderProps> = ({
  min,
  max,
  minPrice,
  maxPrice,
  onMinChange,
  onMaxChange
}) => {
  const minPercent = ((minPrice - min) / (max - min)) * 100;
  const maxPercent = ((maxPrice - min) / (max - min)) * 100;

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="relative w-full h-12 flex items-center">
        {/* Track Background */}
        <div className="absolute w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
        
        {/* Active Track Highlight */}
        <div 
          className="absolute h-2 bg-primary dark:bg-secondary rounded-full opacity-50"
          style={{
            left: `${minPercent}%`,
            right: `${100 - maxPercent}%`
          }}
        ></div>

        {/* Min Input */}
        <input
          type="range"
          min={min}
          max={max}
          step={100}
          value={minPrice}
          onChange={(e) => {
            const value = Math.min(Number(e.target.value), maxPrice - 100);
            onMinChange(value);
          }}
          className="absolute w-full appearance-none bg-transparent pointer-events-none z-30"
          style={{
            WebkitAppearance: 'none',
            // Custom CSS for thumb centering and visibility
          }}
        />

        {/* Max Input */}
        <input
          type="range"
          min={min}
          max={max}
          step={100}
          value={maxPrice}
          onChange={(e) => {
            const value = Math.max(Number(e.target.value), minPrice + 100);
            onMaxChange(value);
          }}
          className="absolute w-full appearance-none bg-transparent pointer-events-none z-20"
          style={{
            WebkitAppearance: 'none'
          }}
        />

        {/* Custom Thumbs for better visibility */}
        <div 
          className="absolute w-6 h-6 bg-white border-2 border-primary dark:border-secondary rounded-full shadow-lg z-40 pointer-events-none flex items-center justify-center transform -translate-x-1/2"
          style={{ left: `${minPercent}%` }}
        >
            <div className="w-1.5 h-1.5 bg-primary dark:bg-secondary rounded-full"></div>
        </div>
        
        <div 
          className="absolute w-6 h-6 bg-white border-2 border-primary dark:border-secondary rounded-full shadow-lg z-40 pointer-events-none flex items-center justify-center transform -translate-x-1/2"
          style={{ left: `${maxPercent}%` }}
        >
            <div className="w-1.5 h-1.5 bg-primary dark:bg-secondary rounded-full"></div>
        </div>

        {/* Value Labels that follow the thumbs */}
        <div 
            className="absolute -top-6 px-2 py-1 bg-primary text-white text-[9px] font-black rounded-lg transform -translate-x-1/2 whitespace-nowrap z-50 pointer-events-none animate-in fade-in"
            style={{ left: `${minPercent}%` }}
        >
            {minPrice.toLocaleString()}
        </div>
        
        <div 
            className="absolute -top-6 px-2 py-1 bg-primary text-white text-[9px] font-black rounded-lg transform -translate-x-1/2 whitespace-nowrap z-50 pointer-events-none animate-in fade-in"
            style={{ left: `${maxPercent}%` }}
        >
            {maxPrice.toLocaleString()}
        </div>
      </div>
      
      <style>{`
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          pointer-events: auto;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          cursor: pointer;
        }
        input[type='range']::-moz-range-thumb {
          pointer-events: auto;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
};

export default PriceRangeSlider;
