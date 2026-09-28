import React from 'react';
import { ConfidenceLevel } from '../types/intelligence';

interface Props {
  level: ConfidenceLevel;
  className?: string;
}

export const ConfidenceBadge: React.FC<Props> = ({ level, className = '' }) => {
  switch (level) {
    case 'REPORTED':
      return (
        <span
          title="Verified public fact: sourced from founder interviews, SEC filings, or official announcements"
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-emerald-950/70 text-emerald-400 border border-emerald-800/60 ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          REPORTED
        </span>
      );
    case 'ESTIMATED':
      return (
        <span
          title="Industry estimate: triangulated from headcount, market benchmarks, or third-party reports"
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-amber-950/70 text-amber-400 border border-amber-800/60 ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
          ESTIMATED
        </span>
      );
    case 'INFERRED':
      return (
        <span
          title="Strategic hypothesis: deduced from observable business moves and structural incentives"
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-purple-950/70 text-purple-400 border border-purple-800/60 ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
          INFERRED
        </span>
      );
    default:
      return null;
  }
};
