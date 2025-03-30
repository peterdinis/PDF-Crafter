
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface ColorPickerProps {
  label: string;
  color: string;
  onChange: (color: string) => void;
  className?: string;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ 
  label, 
  color, 
  onChange,
  className = "" 
}) => {
  // Prevent event propagation to avoid closing modals
  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    onChange(e.target.value);
  };

  return (
    <div className={`space-y-2 color-picker ${className}`} onMouseDown={handleMouseDown} onClick={handleClick}>
      <Label>{label}</Label>
      <div className="flex items-center gap-2">
        <Input
          type="color"
          value={color}
          onChange={handleChange}
          className="w-12 h-10 p-1 cursor-pointer"
          onClick={handleClick}
        />
        <Input
          type="text"
          value={color}
          onChange={handleChange}
          className="flex-1"
          maxLength={7}
          onClick={handleClick}
        />
      </div>
    </div>
  );
};
