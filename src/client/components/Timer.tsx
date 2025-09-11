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
    <div className={`text-center ${className}`}>
      <div className="text-sm text-reddit-text-secondary mb-1">{label}</div>
      <div className="text-lg font-mono font-bold text-reddit-orange">
        {milliseconds > 0 ? formatTime(milliseconds) : "⏰ Time's up!"}
      </div>
    </div>
  );
};
