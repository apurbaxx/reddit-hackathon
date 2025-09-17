import React from 'react';

interface TimerProps {
  milliseconds: number;
  label: string;
  className?: string;
}

export const Timer: React.FC<TimerProps> = ({ milliseconds, label, className = '' }) => {
  const formatTime = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };

  return (
    <div className={`text-center p-2 rounded-md ${className}`}>
      <div className="text-sm text-gray-400 mb-1 font-mono">{label}</div>
      <div className="text-lg font-mono font-bold text-white">
        {milliseconds > 0 ? formatTime(milliseconds) : "⏰ Time's up!"}
      </div>
    </div>
  );
};
