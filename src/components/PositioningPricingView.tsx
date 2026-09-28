import React from 'react';
import { CompanyProfile } from '../types/intelligence';
import { Layers, DollarSign, ArrowRight, MousePointerClick, Target, Sparkles } from 'lucide-react';

interface Props {
  company: CompanyProfile;
}

export const PositioningPricingView: React.FC<Props> = ({ company }) => {
  return (
    <div className="space-y-8">
      {/* Positioning Evolution Section */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-mono font-semibold bg-indigo-950 text-indigo-400 border border-indigo-800/60 mb-2">
              <Layers className="w-3.5 h-3.5" />
              MESSAGING &amp; CATEGORY EXPANSION
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Positioning Evolution: Headline → Subhead → CTA → ICP
            </h2>
            <p className="text-xs text-slate-400">
              Observe how the core value proposition expanded from an acute technical wedge into an enterprise category-defining platform.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {company.positioningEvolution.map((p, idx) => (
            <div
              key={idx}
              className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 flex flex-col justify-between hover:border-slate-700 transition relative overflow-hidden group"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-60"></div>
              
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-slate-800 text-slate-200 border border-slate-700">
                    Era {p.year}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">Phase #{idx + 1}</span>
                </div>

                {/* Simulated Web Card */}
                <div className="bg-slate-900/90 rounded-lg p-3.5 border border-slate-800/80 mb-4 shadow-inner">
                  <div className="text-xs text-slate-500 font-mono mb-1">HOMEPAGE HERO:</div>
                  <h4 className="text-base font-bold text-white leading-snug mb-2 group-hover:text-indigo-300 transition">
                    "{p.headline}"
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed italic mb-3">
                    "{p.subheadline}"
                  </p>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-indigo-600/90 text-white text-[11px] font-semibold">
                    <MousePointerClick className="w-3 h-3" />
                    CTA: {p.cta}
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-slate-500 font-semibold block text-[10px] uppercase tracking-wider">Target ICP in this era</span>
                    <span className="text-slate-200 font-medium">{p.targetIcp}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-semibold block text-[10px] uppercase tracking-wider">Promised Core Outcome</span>
                    <span className="text-emerald-300 font-medium">{p.promisedOutcome}</span>
                  </div>
                </div>
              </div>

              {idx < company.positioningEvolution.length - 1 && (
                <div className="pt-3 mt-4 border-t border-slate-900/90 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Repositioning vector</span>
                  <ArrowRight className="w-3.5 h-3.5 text-indigo-400" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Pricing Evolution Section */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 shadow-xl">
        <div className="mb-5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-mono font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800/60 mb-2">
            <DollarSign className="w-3.5 h-3.5" />
            MONETIZATION ARCHITECTURE
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Pricing &amp; Packaging Evolution
          </h2>
          <p className="text-xs text-slate-400">
            Pricing reveals strategy changes better than almost anything else. Track how pricing evolved from early feedback-gathering to enterprise value capture.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {company.pricingEvolution.map((price, idx) => (
            <div
              key={idx}
              className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
                  {price.era}
                </span>
                <span className="text-[11px] font-mono text-slate-500">Tier #{idx + 1}</span>
              </div>
              <div className="text-sm font-semibold text-white my-2">{price.model}</div>
              <p className="text-xs text-slate-400 leading-relaxed pt-2 border-t border-slate-900">
                {price.notes}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
