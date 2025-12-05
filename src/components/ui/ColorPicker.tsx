'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Input } from './Input';

export interface ColorPickerProps {
  label?: string;
  value: string;
  onChange: (color: string) => void;
  error?: string;
  helperText?: string;
  disabled?: boolean;
}

/**
 * ColorPicker Component
 *
 * A color picker with hex input and native color picker
 */
export const ColorPicker: React.FC<ColorPickerProps> = ({
  label,
  value,
  onChange,
  error,
  helperText,
  disabled = false,
}) => {
  const [hexValue, setHexValue] = useState(value);
  const colorInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setHexValue(value);
  }, [value]);

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setHexValue(newValue);

    // Validate hex color
    if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(newValue)) {
      onChange(newValue);
    }
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setHexValue(newColor);
    onChange(newColor);
  };

  const openColorPicker = () => {
    if (!disabled && colorInputRef.current) {
      colorInputRef.current.click();
    }
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
          {label}
        </label>
      )}

      <div className="flex gap-3">
        {/* Color preview and picker trigger */}
        <button
          type="button"
          onClick={openColorPicker}
          disabled={disabled}
          className="flex-shrink-0 w-12 h-12 rounded-lg border-2 border-neutral-300 dark:border-neutral-600 overflow-hidden transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: hexValue }}
          aria-label="Pick color"
        >
          <input
            ref={colorInputRef}
            type="color"
            value={hexValue}
            onChange={handleColorChange}
            disabled={disabled}
            className="sr-only"
          />
        </button>

        {/* Hex input */}
        <div className="flex-1">
          <Input
            type="text"
            value={hexValue}
            onChange={handleHexChange}
            placeholder="#000000"
            disabled={disabled}
            error={error}
            helperText={helperText}
            fullWidth
            maxLength={7}
          />
        </div>
      </div>
    </div>
  );
};
