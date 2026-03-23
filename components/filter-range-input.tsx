"use client";

export function FilterRangeInput({
  label,
  minValue,
  maxValue,
  onMinChange,
  onMaxChange,
  disabled = false,
}: {
  label: string;
  minValue: string;
  maxValue: string;
  onMinChange: (v: string) => void;
  onMaxChange: (v: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <span className={`text-xs w-20 flex-shrink-0 ${disabled ? "text-gray-300" : "text-gray-600"}`}>
        {label}
      </span>
      <div className="flex-1 flex items-center gap-1">
        <input
          type="number"
          step="any"
          placeholder="最小"
          value={minValue}
          onChange={(e) => onMinChange(e.target.value)}
          disabled={disabled}
          className={`w-full px-2 py-1.5 border border-gray-200 rounded text-xs ${
            disabled
              ? "bg-gray-50 text-gray-300 cursor-not-allowed"
              : "bg-white text-gray-700 focus:border-blue-400 focus:outline-none"
          }`}
        />
        <span className="text-xs text-gray-300">~</span>
        <input
          type="number"
          step="any"
          placeholder="最大"
          value={maxValue}
          onChange={(e) => onMaxChange(e.target.value)}
          disabled={disabled}
          className={`w-full px-2 py-1.5 border border-gray-200 rounded text-xs ${
            disabled
              ? "bg-gray-50 text-gray-300 cursor-not-allowed"
              : "bg-white text-gray-700 focus:border-blue-400 focus:outline-none"
          }`}
        />
      </div>
    </div>
  );
}
