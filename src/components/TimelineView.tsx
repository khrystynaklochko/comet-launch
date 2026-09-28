import React, { useState } from 'react';
import { CompanyProfile } from '../types/intelligence';
import { ConfidenceBadge } from './ConfidenceBadge';
import { GitBranch, AlertTriangle, ShieldCheck, CheckCircle2, Filter, Zap, Activity } from 'lucide-react';

interface Props {
  company: CompanyProfile;
}

export const TimelineView: React.FC<Props> = ({ company }) => {
  const [filterType, setFilterType] = useState<'all' | 'strategic' | 'stress'>('all');

  return (
    <div className="space-y-8">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-mono font-semibold bg-indigo-950 text-indigo-400 border border-indigo-800/60 mb-1">
            <GitBranch className="w-3.5 h-3.5" />
            CHRONOLOGICAL EVIDENCE GRAPH
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Strategic Moves &amp; Stress Signals Timeline
          </h2>
          <p className="text-xs text-slate-400">
            Every point connects observable facts, strategic objectives, and subsequent effects. Stress signals separate factual evidence from strategic interpretations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              filterType === 'all'
                ? 'bg-indigo-600 text-white shadow'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            All Events
          </button>
          <button
            onClick={() => setFilterType('strategic')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              filterType === 'strategic'
                ? 'bg-indigo-600 text-white shadow'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Strategic Moves
          </button>
          <button
            onClick={() => setFilterType('stress')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              filterType === 'stress'
                ? 'bg-amber-600 text-white shadow'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Stress &amp; Risk Signals
          </button>
        </div>
      </div>

      {/* Two-Column Layout: Left for Moves, Right for Stress Signals or Unified List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Strategic Moves Column */}
        {(filterType === 'all' || filterType === 'strategic') && (
          <div className={filterType === 'all' ? 'lg:col-span-7 space-y-4' : 'lg:col-span-12 space-y-4'}>
            <div className="flex items-center justify-between px-1">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                Strategic Moves &amp; Inflection Points
              </h3>
              <span className="text-xs text-slate-500 font-mono">
                {company.strategicMoves.length} moves recorded
              </span>
            </div>

            <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
              {company.strategicMoves.map((move, i) => (
                <div key={i} className="relative group">
                  <div className="absolute -left-6 top-3 w-3 h-3 rounded-full bg-indigo-500 border-2 border-slate-900 group-hover:scale-125 transition"></div>
                  
                  <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-md hover:border-slate-700 transition">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-slate-800 text-slate-200">
                          {move.year}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-indigo-950 text-indigo-300 border border-indigo-800/60">
                          {move.type}
                        </span>
                      </div>
                      <ConfidenceBadge level={move.confidence} />
                    </div>

                    <h4 className="text-sm font-bold text-white mb-1.5">{move.title}</h4>

                    <div className="space-y-1.5 text-xs">
                      <div>
                        <span className="text-slate-500 font-semibold block text-[10px] uppercase">Strategic Objective</span>
                        <p className="text-slate-300 leading-relaxed">{move.objective}</p>
                      </div>
                      <div className="pt-1.5 border-t border-slate-800/80">
                        <span className="text-slate-500 font-semibold block text-[10px] uppercase">Observable Subsequent Effect</span>
                        <p className="text-emerald-300/90 font-medium leading-relaxed">{move.observableEffect}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stress & Risk Signals Column */}
        {(filterType === 'all' || filterType === 'stress') && (
          <div className={filterType === 'all' ? 'lg:col-span-5 space-y-4' : 'lg:col-span-12 space-y-4'}>
            <div className="flex items-center justify-between px-1">
              <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Stress &amp; Risk Signals
              </h3>
              <span className="text-xs text-slate-500 font-mono">
                {company.stressSignals.length} signals
              </span>
            </div>

            <div className="space-y-4">
              {company.stressSignals.map((signal, i) => (
                <div
                  key={i}
                  className="bg-amber-950/10 border border-amber-900/40 rounded-xl p-4 shadow-md hover:border-amber-700/60 transition"
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-amber-950/70 text-amber-400 border border-amber-800/50">
                        {signal.period}
                      </span>
                      <span className="text-xs font-semibold text-slate-300">{signal.type}</span>
                    </div>
                    <ConfidenceBadge level={signal.confidence} />
                  </div>

                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-slate-500 font-semibold block text-[10px] uppercase">Observable Public Fact</span>
                      <p className="text-slate-200 font-medium leading-relaxed">{signal.observableFact}</p>
                    </div>
                    <div className="pt-2 border-t border-amber-900/30">
                      <span className="text-amber-400/90 font-semibold block text-[10px] uppercase">Strategic Interpretation</span>
                      <p className="text-slate-300 leading-relaxed italic">
                        "{signal.strategicInterpretation}"
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {company.stressSignals.length === 0 && (
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 text-center text-xs text-slate-400">
                  No public critical distress events detected.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Evidence & Provenance Store */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Underlying Evidence Graph &amp; Provenance Citations
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {company.evidenceGraph.length} verified citations
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {company.evidenceGraph.map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-950/80 border border-slate-800/90 rounded-lg p-3 text-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono text-slate-400">{item.date}</span>
                  <ConfidenceBadge level={item.confidence} />
                </div>
                <p className="text-slate-200 font-medium leading-snug mb-2">{item.fact}</p>
              </div>
              <div className="text-[11px] text-slate-400 border-t border-slate-900 pt-1.5 flex items-center gap-1">
                <span className="text-slate-500 font-semibold">Source:</span>
                <span className="truncate">{item.source}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
