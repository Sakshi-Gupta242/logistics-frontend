import React from 'react';

interface BadgeProps {
  status: string;
  variant?: 'emerald' | 'blue' | 'amber' | 'purple' | 'slate' | 'rose';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ status, variant, className = '' }) => {
  let styles = 'bg-slate-800 text-slate-300 border-slate-700';

  const v = variant || (
    status === 'In Transit' || status === 'COMPLETED' ? 'emerald' :
    status === 'Available' ? 'blue' :
    status === 'Loading' || status === 'IN_PROGRESS' ? 'amber' :
    status === 'Maintenance' || status === 'FAILED' ? 'rose' : 'slate'
  );

  switch (v) {
    case 'emerald':
      styles = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      break;
    case 'blue':
      styles = 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      break;
    case 'amber':
      styles = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      break;
    case 'purple':
      styles = 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      break;
    case 'rose':
      styles = 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      break;
    default:
      styles = 'bg-slate-800 text-slate-400 border-slate-700';
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
      {status}
    </span>
  );
};
