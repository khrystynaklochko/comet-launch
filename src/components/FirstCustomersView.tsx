import React, { useState } from 'react';
import { CompanyProfile, FirstCustomer } from '../types/intelligence';
import { ConfidenceBadge } from './ConfidenceBadge';
import { Users, UserCheck, Flame, Briefcase, FileCheck, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

interface Props {
  company: CompanyProfile;
}

export const FirstCustomersView: React.FC<Props> = ({ company }) => {
  const [selectedCustomer, setSelectedCustomer] = useState<number>(1);

  const activeCustomer =
    company.firstCustomers.find((c) => c.number === selectedCustomer) || company.firstCustomers[0];

  return (
    <div className="space-y-8">
      {/* Hero explanation banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-900/50 rounded-xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mb-2">
              <Zap className="w-3.5 h-3.5 text-indigo-400" />
              THE CRITICAL 0 TO 10 RECONSTRUCTION
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              How {company.name} Acquired Their First Customers
            </h2>
            <p className="text-slate-300 text-sm mt-1 max-w-3xl">
              Most startup failures happen in the fog between MVP and 10 paying customers. Here is the verified, evidence-backed breakdown of how {company.name} got into the room, who signed, what was promised, and the manual founder labor required.
            </p>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3 text-xs text-slate-400 min-w-[200px]">
            <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider mb-1">Breakout Channel</div>
            <div className="text-white font-semibold text-sm">{company.distributionEngine.strongestInitialChannel}</div>
          </div>
        </div>
      </div>

      {/* Customer 1-10 Granular Stepper & Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Customer Selector List */}
        <div className="lg:col-span-4 space-y-2.5">
          <div className="text-xs font-mono uppercase text-slate-400 font-semibold px-1 flex items-center justify-between">
            <span>Reconstructed Customers</span>
            <span>{company.firstCustomers.length} profiled</span>
          </div>

          <div className="space-y-2">
            {company.firstCustomers.map((cust) => {
              const isSelected = cust.number === selectedCustomer;
              return (
                <button
                  key={cust.number}
                  onClick={() => setSelectedCustomer(cust.number)}
                  className={`w-full text-left p-3.5 rounded-xl border transition flex items-start gap-3 relative ${
                    isSelected
                      ? 'bg-slate-800/90 border-indigo-500 shadow-lg text-white'
                      : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/50 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono font-bold shrink-0 ${
                      isSelected
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    #{cust.number}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="font-semibold text-sm truncate">{cust.nameOrType}</span>
                      <span className="text-[10px] font-mono text-slate-500 shrink-0">{cust.date}</span>
                    </div>
                    <div className="text-xs text-slate-400 truncate">{cust.channel}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Customer Dossier Card */}
        <div className="lg:col-span-8">
          {activeCustomer && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-xl relative backdrop-blur-md">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-950 border border-indigo-800 flex items-center justify-center font-mono font-bold text-lg text-indigo-400">
                    #{activeCustomer.number}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      {activeCustomer.nameOrType}
                    </h3>
                    <div className="text-xs font-mono text-slate-400">
                      Acquisition Date: <span className="text-slate-200">{activeCustomer.date}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <ConfidenceBadge level={activeCustomer.confidence} />
                </div>
              </div>

              {/* Grid of Key Dimensions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-5">
                <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-3.5">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
                    Acquisition Channel
                  </div>
                  <div className="text-sm font-medium text-slate-200">{activeCustomer.channel}</div>
                </div>

                <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-3.5">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Target Buyer Persona
                  </div>
                  <div className="text-sm font-medium text-slate-200">{activeCustomer.buyerPersona}</div>
                </div>

                <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-3.5">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    <Flame className="w-3.5 h-3.5 text-amber-400" />
                    Burning Initial Pain
                  </div>
                  <div className="text-sm font-medium text-slate-200">{activeCustomer.initialPain}</div>
                </div>

                <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-3.5">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    <FileCheck className="w-3.5 h-3.5 text-cyan-400" />
                    Contract Terms &amp; ACV
                  </div>
                  <div className="text-sm font-medium text-slate-200">
                    {activeCustomer.contractType}
                    <span className="text-slate-400 text-xs ml-2">({activeCustomer.estimatedAcv})</span>
                  </div>
                </div>
              </div>

              {/* Founder Involvement Section */}
              <div className="bg-indigo-950/20 border border-indigo-900/50 rounded-lg p-4 mb-4">
                <div className="text-xs font-semibold text-indigo-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-indigo-400" />
                  Founder Manual Involvement ("Doing Things That Don't Scale")
                </div>
                <p className="text-sm text-slate-200 leading-relaxed">
                  {activeCustomer.founderInvolvement}
                </p>
              </div>

              {/* Provenance & Evidence Citation */}
              <div className="bg-slate-950/80 border border-slate-800/80 rounded-lg p-3 text-xs flex items-center justify-between text-slate-400">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>
                    <strong className="text-slate-300">Evidence Sourced From:</strong> {activeCustomer.evidence}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Scaling Milestones: 1 -> 10 -> 100 -> 1000 Customers */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Customer Scaling Milestones (1 → 10 → 100 → 1,000)
            </h3>
            <p className="text-xs text-slate-400">
              Notice how the primary acquisition channel, target ICP, sales motion, and pricing evolved at each inflection point.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {company.milestones.map((m, idx) => (
            <div
              key={idx}
              className="bg-slate-950/70 border border-slate-800/90 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-indigo-950 text-indigo-300 border border-indigo-800/60">
                    {m.customerCount === 1 ? 'Customer #1' : `~${m.customerCount.toLocaleString()} Customers`}
                  </span>
                  <span className="text-xs font-mono text-slate-400">{m.period}</span>
                </div>

                <div className="space-y-2.5 text-xs my-3">
                  <div>
                    <span className="text-slate-500 font-semibold block text-[10px] uppercase">Primary Channel</span>
                    <span className="text-slate-200 font-medium">{m.primaryChannel}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-semibold block text-[10px] uppercase">Target ICP</span>
                    <span className="text-slate-300">{m.icp}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-semibold block text-[10px] uppercase">Sales Motion</span>
                    <span className="text-slate-300">{m.salesMotion}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-semibold block text-[10px] uppercase">Pricing Era</span>
                    <span className="text-slate-300">{m.pricing}</span>
                  </div>
                </div>
              </div>

              {idx < company.milestones.length - 1 && (
                <div className="pt-2 border-t border-slate-900 text-slate-500 text-[11px] flex items-center justify-end gap-1">
                  <span>Next milestone</span>
                  <ArrowRight className="w-3 h-3 text-slate-500" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
