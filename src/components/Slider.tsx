import React from 'react';

interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  normalValue?: number;
}

export const Slider: React.FC<SliderProps> = ({ normalValue, ...props }) => {
  const min = props.min !== undefined ? Number(props.min) : 0;
  const max = props.max !== undefined ? Number(props.max) : 100;
  
  // Default normalValue to middle if not provided
  const nv = normalValue !== undefined ? normalValue : (min + max) / 2;
  
  const percentage = ((nv - min) / (max - min)) * 100;

  return (
    <div className="relative w-full flex items-center h-4">
      {/* Track */}
      <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-[#333] rounded-sm pointer-events-none z-0" />
      {/* Normal Value Dot */}
      <div 
        className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-gray-400 rounded-full pointer-events-none z-0"
        style={{ left: `calc(${percentage}% - 3px)` }}
      />
      <input 
        type="range" 
        {...props} 
        className={`w-full relative z-10 !bg-transparent ${props.className || ''}`}
      />
    </div>
  );
};
