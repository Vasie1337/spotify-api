'use client';

interface TimeRangeSwitchProps {
  timeRange: 'short_term' | 'long_term';
  onChange: (range: 'short_term' | 'long_term') => void;
}

export function TimeRangeSwitch({ timeRange, onChange }: TimeRangeSwitchProps) {
  return (
    <div className="flex items-center gap-4 mb-8">
      <button
        onClick={() => onChange('short_term')}
        className={`px-4 py-2 rounded-full transition-all ${
          timeRange === 'short_term'
            ? 'bg-[#1DB954] text-white font-medium'
            : 'text-gray-400 hover:text-white'
        }`}
      >
        Last 4 Weeks
      </button>
      <button
        onClick={() => onChange('long_term')}
        className={`px-4 py-2 rounded-full transition-all ${
          timeRange === 'long_term'
            ? 'bg-[#1DB954] text-white font-medium'
            : 'text-gray-400 hover:text-white'
        }`}
      >
        All Time
      </button>
    </div>
  );
} 