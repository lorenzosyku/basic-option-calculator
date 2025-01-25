import React from 'react';

// Define interfaces for payload and tooltip props
interface PayloadEntry {
  name: string;
  value: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: PayloadEntry[];
  label?: string | number;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip bg-white p-2 border rounded shadow">
        <p className="label">
          <strong>Stock Price:</strong> ${parseFloat(String(label)).toFixed(2)}
        </p>
        {payload.map((entry, index) => {
          const value = entry.value;
          const valueClass =
            value > 0 ? "text-green-500" : value < 0 ? "text-red-500" : "";
          return (
            <p
              key={`tooltip-${index}`}
              className={`font-medium ${valueClass}`}
            >
              <strong>{entry.name}:</strong> ${value.toFixed(2)}
            </p>
          );
        })}
      </div>
    );
  }
  return null;
};

export default CustomTooltip;