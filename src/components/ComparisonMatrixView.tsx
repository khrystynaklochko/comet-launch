import React, { useState } from 'react';
import { CompanyProfile } from '../types/intelligence';
import { Scale, Check, Plus, Trash2, ArrowUpDown } from 'lucide-react';

interface Props {
  allCompanies: CompanyProfile[];
}

export const ComparisonMatrixView: React.FC<Props> = ({ allCompanies }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(() => {
    // Default to first 3 companies
    return allCompanies.slice(0, 3).map((c) => c.id);
  });

  const toggleCompany = (id: string) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length > 2) {
        setSelectedIds(selectedIds.filter((item) => item !== id));
      }
    } else {
      if (selectedIds.length < 4) {
        setSelectedIds([...selectedIds, id]);
      }
    }
  };

  const comparedCompanies = allCompanies.filter((c) => selectedIds.includes(c.id));

  return (
    <div className="space-y-6">
      {/* Selector bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-mono font-semibold bg-indigo-950 text-indigo-400 border border-indigo-800/60 mb-1">
              <Scale className="w-3.5 h-3.5" />
              CROSS-COMPANY BENCHMARKING
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Multi-Company Strategic Comparison Matrix
            </h2>
            <p className="text-xs text-slate-400">
              Select 2 to 4 startups to compare their original wedges, first customer channels, sales motions, and defensible moats.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {allCompanies.map((c) => {
              const isSelected = selectedIds.includes(c.id);
              return (
                <button
                  key={c.id}
                  onClick={() => toggleCompany(c.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3" />}
                  {c.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl shadow-2xl overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/80">
              <th className="p-4 text-xs font-mono uppercase text-slate-400 font-semibold w-48 sticky left-0 bg-slate-950/95 z-10">
                Dimension
              </th>
              {comparedCompanies.map((c) => (
                <th key={c.id} className="p-4 text-sm font-bold text-white w-64 border-l border-slate-800/80">
                  <div className="flex items-center justify-between">
                    <span>{c.name}</span>
                    <span className="text-[11px] font-mono font-normal text-slate-400">{c.foundingYear}</span>
                  </div>
                  <div className="text-[11px] font-normal text-indigo-400 font-mono mt-0.5">{c.category}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 text-xs text-slate-300">
            {/* Origin & Wedge */}
            <tr className="hover:bg-slate-800/30">
              <td className="p-4 font-semibold text-white bg-slate-950/40 sticky left-0">Initial Wedge</td>
              {comparedCompanies.map((c) => (
                <td key={c.id} className="p-4 border-l border-slate-800/80">
                  <span className="text-indigo-300 font-medium">{c.originStory.initialWedge}</span>
                </td>
              ))}
            </tr>

            {/* Months to MVP / First Customer */}
            <tr className="hover:bg-slate-800/30">
              <td className="p-4 font-semibold text-white bg-slate-950/40 sticky left-0">Velocity to First User</td>
              {comparedCompanies.map((c) => (
                <td key={c.id} className="p-4 border-l border-slate-800/80 font-mono">
                  <div>MVP: <strong className="text-white">{c.originStory.monthsToMvp} months</strong></div>
                  <div>First customer: <strong className="text-white">{c.originStory.monthsToFirstCustomer} months</strong></div>
                </td>
              ))}
            </tr>

            {/* First Customer Acquisition Channel */}
            <tr className="hover:bg-slate-800/30">
              <td className="p-4 font-semibold text-white bg-slate-950/40 sticky left-0">First Customer #1 Channel</td>
              {comparedCompanies.map((c) => (
                <td key={c.id} className="p-4 border-l border-slate-800/80">
                  <div className="font-semibold text-white mb-0.5">{c.firstCustomers[0]?.channel || 'Founder Outbound'}</div>
                  <div className="text-slate-400 text-[11px]">{c.firstCustomers[0]?.nameOrType}</div>
                </td>
              ))}
            </tr>

            {/* Founder Involvement */}
            <tr className="hover:bg-slate-800/30">
              <td className="p-4 font-semibold text-white bg-slate-950/40 sticky left-0">Manual Founder Labor</td>
              {comparedCompanies.map((c) => (
                <td key={c.id} className="p-4 border-l border-slate-800/80 leading-relaxed text-slate-300">
                  {c.firstCustomers[0]?.founderInvolvement || 'High-touch founder onboarding'}
                </td>
              ))}
            </tr>

            {/* Distribution Motion */}
            <tr className="hover:bg-slate-800/30">
              <td className="p-4 font-semibold text-white bg-slate-950/40 sticky left-0">Primary GTM Engine</td>
              {comparedCompanies.map((c) => (
                <td key={c.id} className="p-4 border-l border-slate-800/80">
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-950 text-indigo-300 border border-indigo-800/60 inline-block mb-1">
                    {c.distributionEngine.motionType}
                  </span>
                  <div className="text-slate-400 text-[11px] leading-relaxed">{c.distributionEngine.strongestInitialChannel}</div>
                </td>
              ))}
            </tr>

            {/* Sales Motion & Cycle */}
            <tr className="hover:bg-slate-800/30">
              <td className="p-4 font-semibold text-white bg-slate-950/40 sticky left-0">Sales Cycle &amp; POC</td>
              {comparedCompanies.map((c) => (
                <td key={c.id} className="p-4 border-l border-slate-800/80">
                  <div>Cycle: <span className="text-white font-medium">{c.salesMachine.estimatedSalesCycle}</span></div>
                  <div className="text-slate-400 text-[11px] mt-0.5">POC: {c.salesMachine.pocModel}</div>
                </td>
              ))}
            </tr>

            {/* Pricing Model */}
            <tr className="hover:bg-slate-800/30">
              <td className="p-4 font-semibold text-white bg-slate-950/40 sticky left-0">Monetization Model</td>
              {comparedCompanies.map((c) => (
                <td key={c.id} className="p-4 border-l border-slate-800/80">
                  <div className="font-semibold text-white">{c.businessModel}</div>
                  <div className="text-slate-400 text-[11px] mt-1">First: {c.pricingEvolution[0]?.model}</div>
                </td>
              ))}
            </tr>

            {/* Virality / Organic Engine */}
            <tr className="hover:bg-slate-800/30">
              <td className="p-4 font-semibold text-white bg-slate-950/40 sticky left-0">Virality / Flywheel</td>
              {comparedCompanies.map((c) => (
                <td key={c.id} className="p-4 border-l border-slate-800/80 leading-relaxed text-slate-300">
                  {c.distributionEngine.viralityMechanism}
                </td>
              ))}
            </tr>

            {/* Moat & Defensibility */}
            <tr className="hover:bg-slate-800/30">
              <td className="p-4 font-semibold text-white bg-slate-950/40 sticky left-0">Defensible Moat</td>
              {comparedCompanies.map((c) => (
                <td key={c.id} className="p-4 border-l border-slate-800/80 text-emerald-300 font-medium">
                  {c.strategyDecomposition.moat}
                </td>
              ))}
            </tr>

            {/* Pitfalls Avoided */}
            <tr className="hover:bg-slate-800/30">
              <td className="p-4 font-semibold text-white bg-slate-950/40 sticky left-0">Stress / Pitfall Avoided</td>
              {comparedCompanies.map((c) => (
                <td key={c.id} className="p-4 border-l border-slate-800/80 text-amber-300/90 text-[11px]">
                  {c.strategyDecomposition.failurePointsAvoided}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
