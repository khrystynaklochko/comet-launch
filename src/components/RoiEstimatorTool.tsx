import React, { useState } from 'react';
import { CompanyProfile, UnitEconomicsBenchmark } from '../types/intelligence';
import {
  Calculator,
  TrendingUp,
  DollarSign,
  Clock,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Sliders,
  Sparkles,
  Zap,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';

interface Props {
  company: CompanyProfile;
  allCompanies?: CompanyProfile[];
  onNavigateToCockpit?: () => void;
}

export const RoiEstimatorTool: React.FC<Props> = ({ company, allCompanies = [], onNavigateToCockpit }) => {
  // User input states
  const [cac, setCac] = useState<number>(1500);
  const [monthlyArpu, setMonthlyArpu] = useState<number>(350);
  const [lifetimeMonths, setLifetimeMonths] = useState<number>(24);
  const [grossMargin, setGrossMargin] = useState<number>(80);
  const [nrrPercent, setNrrPercent] = useState<number>(110);

  // Strategy scenario toggles
  const [annualPrepay, setAnnualPrepay] = useState<boolean>(false);
  const [founderOnboarding, setFounderOnboarding] = useState<boolean>(false);
  const [plgLoop, setPlgLoop] = useState<boolean>(false);

  // Selected benchmark company for comparison
  const [selectedBenchmarkId, setSelectedBenchmarkId] = useState<string>(company.id);

  const benchmarkCompany =
    allCompanies.find((c) => c.id === selectedBenchmarkId) || company;

  // Active benchmark data
  const benchmark: UnitEconomicsBenchmark = benchmarkCompany.unitEconomicsBenchmark || {
    estimatedCac: 1500,
    estimatedLtv: 28000,
    ltvCacRatio: 18.6,
    cacPaybackMonths: 5,
    grossMarginPercent: 78,
    nrrPercent: 125,
    primaryAcquisitionChannel: benchmarkCompany.distributionEngine.strongestInitialChannel,
    notes: 'Estimated benchmark from observable growth rate and sales motion.',
  };

  // Scenario adjustments
  const effectiveCac = plgLoop ? Math.round(cac * 0.55) : cac;
  const effectiveLifetime = founderOnboarding ? Math.round(lifetimeMonths * 1.4) : lifetimeMonths;
  const effectiveMonthlyArpu = annualPrepay ? Math.round(monthlyArpu * 0.85) : monthlyArpu;

  // Calculated Core Unit Economics
  // Basic LTV formula = (ARPU * Gross Margin % * Lifetime in Months) * (NRR Expansion multiplier)
  const expansionFactor = Math.max(1, 1 + (nrrPercent - 100) / 200);
  const grossMonthlyMargin = effectiveMonthlyArpu * (grossMargin / 100);
  const calculatedLtv = Math.round(grossMonthlyMargin * effectiveLifetime * expansionFactor);

  const ltvCacRatio = effectiveCac > 0 ? Number((calculatedLtv / effectiveCac).toFixed(1)) : 0;
  
  // Payback period in months = CAC / Gross Monthly Margin
  const rawPaybackMonths =
    grossMonthlyMargin > 0 ? Number((effectiveCac / grossMonthlyMargin).toFixed(1)) : 99;
  
  // If annual prepayment is enabled, cash payback is immediate (0-1 month)
  const calculatedPaybackMonths = annualPrepay ? 0 : rawPaybackMonths;

  const netProfitPerCustomer = calculatedLtv - effectiveCac;
  const impliedMonthlyChurn = effectiveLifetime > 0 ? (100 / effectiveLifetime).toFixed(1) : '0';

  // Health Rating
  let healthStatus: { label: string; color: string; badge: string; desc: string };
  if (ltvCacRatio >= 5 && calculatedPaybackMonths <= 6) {
    healthStatus = {
      label: 'Elite (Top 5% Venture Tier)',
      color: 'text-emerald-400 border-emerald-800 bg-emerald-950/60',
      badge: 'bg-emerald-500',
      desc: 'Extremely efficient capital compounding. You can aggressively pour capital into acquisition without risking solvency.',
    };
  } else if (ltvCacRatio >= 3 && calculatedPaybackMonths <= 12) {
    healthStatus = {
      label: 'Healthy (Venture-Scalable)',
      color: 'text-indigo-400 border-indigo-800 bg-indigo-950/60',
      badge: 'bg-indigo-500',
      desc: 'Standard healthy SaaS unit economics. Meets institutional Series A/B hurdles.',
    };
  } else if (ltvCacRatio >= 1.5 && calculatedPaybackMonths <= 18) {
    healthStatus = {
      label: 'Caution: Capital Inefficient',
      color: 'text-amber-400 border-amber-800 bg-amber-950/60',
      badge: 'bg-amber-500',
      desc: 'Payback is dragging on past 12 months. High burn multiple risk if growth slows down.',
    };
  } else {
    healthStatus = {
      label: 'Critical / Underwater',
      color: 'text-red-400 border-red-800 bg-red-950/60',
      badge: 'bg-red-500',
      desc: 'Acquisition cost exceeds customer lifetime margin or payback exceeds 18 months. Immediate GTM restructuring required.',
    };
  }

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-2xl space-y-6 relative overflow-hidden backdrop-blur-md">
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-mono font-semibold bg-indigo-950 text-indigo-400 border border-indigo-800/60 mb-2">
            <Calculator className="w-3.5 h-3.5" />
            ROI &amp; UNIT ECONOMICS ESTIMATOR
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            Customer Acquisition ROI vs. {benchmarkCompany.name} Benchmarks
          </h3>
          <p className="text-xs text-slate-400 max-w-2xl mt-1">
            Input your current CAC and lifetime value parameters to benchmark your payback speed, LTV:CAC efficiency, and margin durability against verified high-growth precedents.
          </p>
        </div>

        {/* Benchmark Switcher */}
        {allCompanies.length > 0 && (
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-slate-400 font-mono">Benchmark:</span>
            <select
              value={selectedBenchmarkId}
              onChange={(e) => setSelectedBenchmarkId(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white font-semibold focus:outline-none focus:border-indigo-500"
            >
              {allCompanies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.businessModel.split(' ')[0]})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Main Grid: Inputs on Left, Calculated Outputs & Comparison on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Inputs & Scenarios (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-950/80 border border-slate-800/90 rounded-xl p-4 space-y-4">
            <h4 className="text-xs font-mono uppercase text-slate-400 font-semibold flex items-center justify-between">
              <span>Your Operating Metrics</span>
              <span className="text-[11px] text-indigo-400">Live Simulation</span>
            </h4>

            {/* CAC Input */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <label className="font-semibold text-slate-300">Customer Acquisition Cost (CAC)</label>
                <span className="font-mono font-bold text-white">${cac.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min={50}
                max={15000}
                step={50}
                value={cac}
                onChange={(e) => setCac(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-0.5">
                <span>$50 (Organic PLG)</span>
                <span>$5,000 (Inside Sales)</span>
                <span>$15k (Enterprise AE)</span>
              </div>
            </div>

            {/* Monthly ARPU Input */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <label className="font-semibold text-slate-300">Monthly Contract Value (ARPU)</label>
                <span className="font-mono font-bold text-white">${monthlyArpu.toLocaleString()}/mo</span>
              </div>
              <input
                type="range"
                min={20}
                max={5000}
                step={10}
                value={monthlyArpu}
                onChange={(e) => setMonthlyArpu(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-0.5">
                <span>$20/mo ($240 ACV)</span>
                <span>$1,000/mo ($12k ACV)</span>
                <span>$5k/mo ($60k ACV)</span>
              </div>
            </div>

            {/* Customer Lifetime in Months */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <label className="font-semibold text-slate-300">Customer Lifetime</label>
                <span className="font-mono font-bold text-white">
                  {lifetimeMonths} months <span className="text-slate-500 font-normal">({impliedMonthlyChurn}% churn/mo)</span>
                </span>
              </div>
              <input
                type="range"
                min={6}
                max={60}
                step={1}
                value={lifetimeMonths}
                onChange={(e) => setLifetimeMonths(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-0.5">
                <span>6 mos (High churn)</span>
                <span>24 mos (2 yrs)</span>
                <span>60 mos (Sticky SaaS)</span>
              </div>
            </div>

            {/* Gross Margin & NRR */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <label className="font-semibold text-slate-300">Gross Margin</label>
                  <span className="font-mono font-bold text-white">{grossMargin}%</span>
                </div>
                <input
                  type="range"
                  min={40}
                  max={95}
                  step={1}
                  value={grossMargin}
                  onChange={(e) => setGrossMargin(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <label className="font-semibold text-slate-300">NRR / Expansion</label>
                  <span className="font-mono font-bold text-white">{nrrPercent}%</span>
                </div>
                <input
                  type="range"
                  min={80}
                  max={160}
                  step={5}
                  value={nrrPercent}
                  onChange={(e) => setNrrPercent(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Strategic Sensitivity Levers ("What-If" Scenarios) */}
          <div className="bg-indigo-950/20 border border-indigo-900/40 rounded-xl p-4 space-y-2.5">
            <div className="text-xs font-mono uppercase text-indigo-300 font-semibold flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5" />
              Strategic Levers Simulator
            </div>

            <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-300 hover:text-white transition">
              <input
                type="checkbox"
                checked={annualPrepay}
                onChange={(e) => setAnnualPrepay(e.target.checked)}
                className="rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-0 mt-0.5"
              />
              <div>
                <span className="font-semibold block text-slate-200">Enforce Annual Prepayment (15% discount)</span>
                <span className="text-[11px] text-slate-400">
                  Customer pays 1 year upfront. Drops cash payback to 0 months, providing zero-dilution working capital.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-300 hover:text-white transition">
              <input
                type="checkbox"
                checked={founderOnboarding}
                onChange={(e) => setFounderOnboarding(e.target.checked)}
                className="rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-0 mt-0.5"
              />
              <div>
                <span className="font-semibold block text-slate-200">White-Glove Founder Onboarding</span>
                <span className="text-[11px] text-slate-400">
                  Slices early churn by 40% (extends effective customer lifetime from {lifetimeMonths} to {Math.round(lifetimeMonths * 1.4)} months).
                </span>
              </div>
            </label>

            <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-300 hover:text-white transition">
              <input
                type="checkbox"
                checked={plgLoop}
                onChange={(e) => setPlgLoop(e.target.checked)}
                className="rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-0 mt-0.5"
              />
              <div>
                <span className="font-semibold block text-slate-200">Self-Serve Word-of-Mouth Flywheel (Linear Style)</span>
                <span className="text-[11px] text-slate-400">
                  Cuts blended CAC by 45% (from ${cac} to ${Math.round(cac * 0.55)}) via viral invite loops.
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Right Column: Calculated ROI & Benchmark Visual Comparison (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Key Metric Snapshot Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {/* LTV */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold">Calculated LTV</span>
              <div className="text-xl font-bold text-white my-1 font-mono">${calculatedLtv.toLocaleString()}</div>
              <span className="text-[10px] text-slate-500 font-mono">Gross profit basis</span>
            </div>

            {/* LTV:CAC Ratio */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold">LTV : CAC Ratio</span>
              <div className="text-xl font-bold text-indigo-300 my-1 font-mono">{ltvCacRatio}x</div>
              <span className="text-[10px] font-mono text-emerald-400">
                {ltvCacRatio >= 3 ? '✓ Venture Grade' : '⚠ Sub-optimal (<3x)'}
              </span>
            </div>

            {/* Payback Period */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold">CAC Payback</span>
              <div className="text-xl font-bold text-white my-1 font-mono">
                {calculatedPaybackMonths === 0 ? '0 mos (Upfront)' : `${calculatedPaybackMonths} mos`}
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                {calculatedPaybackMonths <= 12 ? '✓ Fast Payback' : '⚠ Heavy Burn'}
              </span>
            </div>

            {/* Net Profit per Customer */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold">Net Profit / Cust</span>
              <div className="text-xl font-bold text-emerald-400 my-1 font-mono">
                ${netProfitPerCustomer.toLocaleString()}
              </div>
              <span className="text-[10px] text-slate-500 font-mono">Post-acquisition</span>
            </div>
          </div>

          {/* Side-by-Side Visual Benchmarking Chart */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
                Head-to-Head Benchmark vs. {benchmarkCompany.name}
              </h4>
              <span className="text-[11px] font-mono text-slate-400">
                S-1 &amp; Founder Data
              </span>
            </div>

            {/* Bar 1: LTV : CAC Comparison */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">LTV : CAC Multiplier</span>
                <div className="space-x-3 text-xs font-mono">
                  <span className="text-indigo-400 font-bold">You: {ltvCacRatio}x</span>
                  <span className="text-slate-400">{benchmarkCompany.name}: {benchmark.ltvCacRatio}x</span>
                  <span className="text-slate-500">Median SaaS: 3.5x</span>
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="w-full bg-slate-900 rounded-full h-3 flex overflow-hidden">
                  <div
                    className="bg-indigo-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (ltvCacRatio / 25) * 100)}%` }}
                    title={`Your Ratio: ${ltvCacRatio}x`}
                  ></div>
                </div>
                <div className="w-full bg-slate-900/60 rounded-full h-2 flex overflow-hidden">
                  <div
                    className="bg-slate-500/80 h-2 rounded-full"
                    style={{ width: `${Math.min(100, (benchmark.ltvCacRatio / 25) * 100)}%` }}
                    title={`${benchmarkCompany.name} Ratio: ${benchmark.ltvCacRatio}x`}
                  ></div>
                </div>
              </div>
            </div>

            {/* Bar 2: Payback in Months (Lower is Better) */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">CAC Payback Speed (Months to Cash Breakeven)</span>
                <div className="space-x-3 text-xs font-mono">
                  <span className="text-indigo-400 font-bold">You: {calculatedPaybackMonths} mos</span>
                  <span className="text-slate-400">{benchmarkCompany.name}: {benchmark.cacPaybackMonths} mos</span>
                  <span className="text-slate-500">Median: 12 mos</span>
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="w-full bg-slate-900 rounded-full h-3 flex overflow-hidden">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${
                      calculatedPaybackMonths <= 6
                        ? 'bg-emerald-500'
                        : calculatedPaybackMonths <= 12
                        ? 'bg-indigo-500'
                        : 'bg-amber-500'
                    }`}
                    style={{ width: `${Math.min(100, (calculatedPaybackMonths / 24) * 100)}%` }}
                  ></div>
                </div>
                <div className="w-full bg-slate-900/60 rounded-full h-2 flex overflow-hidden">
                  <div
                    className="bg-slate-500/80 h-2 rounded-full"
                    style={{ width: `${Math.min(100, (benchmark.cacPaybackMonths / 24) * 100)}%` }}
                  ></div>
                </div>
              </div>
              <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                <span>0 mos (Instant)</span>
                <span>6 mos (Elite PLG)</span>
                <span>12 mos (Standard)</span>
                <span>24 mos (High Burn)</span>
              </div>
            </div>

            {/* Benchmark Note */}
            <div className="pt-2 border-t border-slate-900 text-xs text-slate-400 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-300">{benchmarkCompany.name} GTM Insight:</strong>{' '}
                {benchmark.notes} Primary acquisition channel was{' '}
                <span className="text-indigo-300 font-semibold">{benchmark.primaryAcquisitionChannel}</span> with an estimated{' '}
                <span className="text-white font-mono">{benchmark.grossMarginPercent}%</span> gross margin and{' '}
                <span className="text-white font-mono">{benchmark.nrrPercent}%</span> NRR.
              </div>
            </div>
          </div>

          {/* Diagnostic Health Summary Card */}
          <div className={`rounded-xl p-4 border ${healthStatus.color} transition`}>
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${healthStatus.badge}`}></span>
                <span className="font-bold text-sm text-white">{healthStatus.label}</span>
              </div>
              <span className="text-[11px] font-mono font-semibold">
                ROI Multiplier: {ltvCacRatio}x
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              {healthStatus.desc}
            </p>

            {/* Prescriptive Strategic Advice */}
            <div className="pt-2 border-t border-slate-800/80 text-xs">
              <strong className="text-white block mb-1">Recommended Move from {benchmarkCompany.name}'s History:</strong>
              {calculatedPaybackMonths > 12 ? (
                <span className="text-slate-300">
                  Your payback is lagging. Like {benchmarkCompany.name} in their early days, restrict sales outbound to customers with immediate burning operational pain and require annual commitments with upfront invoice payment before provisioning seats.
                </span>
              ) : ltvCacRatio < 3 ? (
                <span className="text-slate-300">
                  Your ACV (${monthlyArpu * 12}/year) is too low for a ${effectiveCac} CAC. Implement tiered seat pricing or usage add-ons to unlock net expansion (NRR &gt; 120%) over the account lifetime.
                </span>
              ) : (
                <span className="text-slate-300">
                  Your unit economics are in the top venture quartile. You have validated repeatable unit profitability. Next priority is testing high-velocity distribution channels to scale account volume without degrading payback.
                </span>
              )}
            </div>

            {onNavigateToCockpit && (
              <button
                onClick={onNavigateToCockpit}
                className="mt-3 w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-indigo-600/90 hover:bg-indigo-600 text-white text-xs font-semibold shadow transition"
              >
                <TrendingUp className="w-3.5 h-3.5" />
                View Full Growth Analytics Trajectory in Decision Cockpit
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
