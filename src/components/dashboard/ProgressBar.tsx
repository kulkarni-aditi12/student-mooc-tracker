import React from 'react';

interface ProgressBarProps {
  progress: number;
  onChange?: (progress: number) => void;
  editable?: boolean;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress, 
  onChange, 
  editable = false, 
  color = 'purple',
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    onChange?.(value);
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">Progress</span>
        <span className="text-sm font-semibold text-purple-600">{progress}%</span>
      </div>
      
      {editable ? (
        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, rgb(147, 51, 234) 0%, rgb(147, 51, 234) ${progress}%, rgb(229, 231, 235) ${progress}%, rgb(229, 231, 235) 100%)`
            }}
          />
          <style jsx>{`
            .slider::-webkit-slider-thumb {
              appearance: none;
              height: 20px;
              width: 20px;
              border-radius: 50%;
              background: rgb(147, 51, 234);
              cursor: pointer;
              border: 2px solid white;
              box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            }
            .slider::-moz-range-thumb {
              height: 20px;
              width: 20px;
              border-radius: 50%;
              background: rgb(147, 51, 234);
              cursor: pointer;
              border: 2px solid white;
              box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            }
          `}</style>
        </div>
      ) : (
        <div className={`w-full bg-gray-200 rounded-full ${sizeClasses[size]} overflow-hidden`}>
          <div
            className={`h-full bg-gradient-to-r from-${color}-500 to-${color}-600 rounded-full transition-all duration-500 ease-out`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};