import React, { useState, useMemo } from 'react';
import { MyCompanyState, CompanyProfile } from '../types/intelligence';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import {
  TrendingUp,
  BarChart3,
  Sliders,
  DollarSign,
  Clock,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Layers,
  ArrowUpRight,
} from 'lucide-react';

interface Props {
  myCompany: MyCompanyState;
  onUpdateMyCompany?: (updated: Partial<MyCompanyState>) => void;
  benchmarkCompanies?: CompanyProfile[];
}

export const GrowthAnalyticsDashboard: React.FC<Props> = ({
  myCompany,
  onUpdateMyCompany,
  benchmarkCompanies = [],
}) => {
  // Unit economics state initialized from myCompany or standard baseline
  const initialData = myCompany.unitEconomics || {
    cac: 1500,
    monthlyArpu: 350,
    lifetimeMonths: 24,
    grossMargin: 80,
    nrrPercent: 115,
  };

  const [cac, setCac] = useState<number>(initialData.cac);
  const [monthlyArpu, setMonthlyArpu] = useState<number>(initialData.monthlyArpu);
  const [lifetimeMonths, setLifetimeMonths] = useState<number>(initialData.lifetimeMonths);
  const [grossMargin, setGrossMargin] = useState<number>(initialData.grossMargin);
  const [nrrPercent, setNrrPercent] = useState<number>(initialData.nrrPercent);

  // Time horizon: 12, 24, or 36 months
  const [horizonMonths, setHorizonMonths] = useState<12 | 24 | 36>(24);

  // Active chart view tab
  const [activeChart, setActiveChart] = useState<'ratio' | 'cashflow' | 'comparison'>('ratio');

  // Strategy levers
  const [leverPlg, setLeverPlg] = useState<boolean>(false);
  const [leverOnboarding, setLeverOnboarding] = useState<boolean>(false);
  const [leverExpansion, setLeverExpansion] = useState<boolean>(false);

  // Selected benchmark company for comparison curve
  const [selectedBenchmarkId, setSelectedBenchmarkId] = useState<string>(
    benchmarkCompanies[0]?.id || 'linear'
  );

  const selectedBenchmark =
    benchmarkCompanies.find((c) => c.id === selectedBenchmarkId) || benchmarkCompanies[0];

  // Adjust values based on toggled levers
  const effectiveCac = leverPlg ? Math.round(cac * 0.6) : cac; // 40% reduction in CAC
  const effectiveLifetime = leverOnboarding ? Math.round(lifetimeMonths * 1.35) : lifetimeMonths;
  const effectiveNrr = leverExpansion ? nrrPercent + 15 : nrrPercent;

  // Monthly expansion factor
  const monthlyExpansionMultiplier = Math.pow(effectiveNrr / 100, 1 / 12);
  const monthlyGrossMarginPercent = grossMargin / 100;

  // Generate Month-by-Month Projection Data for Recharts
  const projectionData = useMemo(() => {
    const data = [];
    let cumulativeGrossProfit = 0;
    const benchmarkLtv = selectedBenchmark?.unitEconomicsBenchmark?.estimatedLtv || 12000;
    const benchmarkCac = selectedBenchmark?.unitEconomicsBenchmark?.estimatedCac || 800;
    const benchmarkPayback = selectedBenchmark?.unitEconomicsBenchmark?.cacPaybackMonths || 6;
    const benchmarkFinalRatio = selectedBenchmark?.unitEconomicsBenchmark?.ltvCacRatio || 15;

    for (let month = 1; month <= horizonMonths; month++) {
      // Retention decay factor (survival probability in this month)
      const survivalProbability =
        month <= effectiveLifetime
          ? 1 - (month - 1) * (0.6 / effectiveLifetime)
          : Math.max(0.1, 0.4 * Math.exp(-(month - effectiveLifetime) / 12));

      // ARPU with expansion factor
      const expandedArpu = monthlyArpu * Math.pow(monthlyExpansionMultiplier, month - 1);
      const monthlyGrossProfit = expandedArpu * monthlyGrossMarginPercent * survivalProbability;

      cumulativeGrossProfit += monthlyGrossProfit;

      const currentLtv = Math.round(cumulativeGrossProfit);
      const ratio = effectiveCac > 0 ? Number((currentLtv / effectiveCac).toFixed(2)) : 0;
      const netCashPosition = Math.round(currentLtv - effectiveCac);

      // Model benchmark curve for comparison
      // S-curve growth towards benchmark final ratio
      const benchmarkProgress = Math.min(1, month / (benchmarkPayback * 2.5));
      const benchmarkCurrentRatio = Number(
        (1 + (benchmarkFinalRatio - 1) * Math.pow(benchmarkProgress, 1.4)).toFixed(2)
      );

      data.push({
        month: `M${month}`,
        monthNum: month,
        ltvCacRatio: ratio,
        benchmarkRatio: benchmarkCurrentRatio,
        cumulativeLtv: currentLtv,
        cacHurdle: effectiveCac,
        netCashPosition: netCashPosition,
        monthlyRevenue: Math.round(expandedArpu),
        isBreakeven: netCashPosition >= 0,
      });
    }

    return data;
  }, [
    horizonMonths,
    effectiveCac,
    monthlyArpu,
    effectiveLifetime,
    monthlyGrossMarginPercent,
    monthlyExpansionMultiplier,
    selectedBenchmark,
  ]);

  // Key KPI calculations
  const finalMonthData = projectionData[projectionData.length - 1];
  const m12Data = projectionData[Math.min(11, projectionData.length - 1)];
  const paybackPoint = projectionData.find((d) => d.netCashPosition >= 0);
  const paybackMonths = paybackPoint ? paybackPoint.monthNum : '> 36';

  const handleSaveToCompany = () => {
    if (onUpdateMyCompany) {
      onUpdateMyCompany({
        unitEconomics: {
          cac,
          monthlyArpu,
          lifetimeMonths,
          grossMargin,
          nrrPercent,
        },
      });
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6 relative overflow-hidden backdrop-blur-md">
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-mono font-semibold bg-indigo-950 text-indigo-400 border border-indigo-800/60 mb-2">
            <TrendingUp className="w-3.5 h-3.5" />
            GROWTH ANALYTICS &amp; LTV/CAC TRAJECTORY
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            Cohort Unit Economics Over Time
          </h3>
          <p className="text-xs text-slate-400 max-w-2xl mt-1">
            Visualizing how account lifetime value compounds month-by-month against the initial acquisition hurdle. Benchmark your cohort expansion curve against top historical startups.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Time Horizon Selector */}
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <span className="text-[11px] font-mono text-slate-500 px-2">Horizon:</span>
            {[12, 24, 36].map((months) => (
              <button
                key={months}
                onClick={() => setHorizonMonths(months as any)}
                className={`px-2.5 py-1 rounded font-mono font-semibold transition ${
                  horizonMonths === months
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {months}M
              </button>
            ))}
          </div>

          {/* Benchmark Selector */}
          {benchmarkCompanies.length > 0 && (
            <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800 text-xs">
              <span className="text-[11px] font-mono text-slate-500">Benchmark:</span>
              <select
                value={selectedBenchmarkId}
                onChange={(e) => setSelectedBenchmarkId(e.target.value)}
                className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
              >
                {benchmarkCompanies.map((c) => (
                  <option key={c.id} value={c.id} className="bg-slate-900 text-white">
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Save to Company button */}
          <button
            onClick={handleSaveToCompany}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/90 hover:bg-indigo-600 text-white text-xs font-semibold shadow transition border border-indigo-500/40"
            title="Persist this baseline into your startup operating model"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Save Baseline
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold">12-Month LTV:CAC</span>
          <div className="text-xl font-bold text-white my-0.5 font-mono">{m12Data?.ltvCacRatio}x</div>
          <span className="text-[10px] text-slate-500 font-mono">
            {m12Data?.ltvCacRatio >= 3 ? '✓ Venture Grade' : 'Lagging (< 3x)'}
          </span>
        </div>

        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold">
            {horizonMonths}M LTV:CAC Ratio
          </span>
          <div className="text-xl font-bold text-indigo-400 my-0.5 font-mono">
            {finalMonthData?.ltvCacRatio}x
          </div>
          <span className="text-[10px] text-indigo-300/80 font-mono">
            {finalMonthData?.ltvCacRatio >= 5 ? 'Elite compounding' : 'Standard growth'}
          </span>
        </div>

        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold">Payback Breakeven</span>
          <div className="text-xl font-bold text-emerald-400 my-0.5 font-mono">
            {paybackMonths} {typeof paybackMonths === 'number' ? 'months' : ''}
          </div>
          <span className="text-[10px] text-slate-500 font-mono">
            {typeof paybackMonths === 'number' && paybackMonths <= 12 ? '✓ Fast Payback' : 'Needs attention'}
          </span>
        </div>

        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold">
            {horizonMonths}M Net Profit / Acct
          </span>
          <div className="text-xl font-bold text-white my-0.5 font-mono">
            ${finalMonthData?.netCashPosition.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-500 font-mono">Post-CAC margin</span>
        </div>

        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between col-span-2 md:col-span-1">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold">Effective CAC</span>
          <div className="text-xl font-bold text-white my-0.5 font-mono">${effectiveCac.toLocaleString()}</div>
          <span className="text-[10px] text-slate-500 font-mono">
            {leverPlg ? 'PLG discounted' : 'Blended acquisition'}
          </span>
        </div>
      </div>

      {/* Main Interactive Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Inputs & Levers (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3.5">
            <h4 className="text-xs font-mono uppercase text-slate-400 font-semibold flex items-center justify-between">
              <span>Unit Economics Drivers</span>
              <Sliders className="w-3.5 h-3.5 text-indigo-400" />
            </h4>

            {/* CAC Slider */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Customer Acquisition Cost</span>
                <span className="font-mono font-bold text-white">${cac.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min={100}
                max={10000}
                step={50}
                value={cac}
                onChange={(e) => setCac(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            {/* Monthly ARPU Slider */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Monthly Contract (ARPU)</span>
                <span className="font-mono font-bold text-white">${monthlyArpu.toLocaleString()}/mo</span>
              </div>
              <input
                type="range"
                min={25}
                max={3000}
                step={25}
                value={monthlyArpu}
                onChange={(e) => setMonthlyArpu(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            {/* Lifetime Months */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Expected Lifetime</span>
                <span className="font-mono font-bold text-white">{lifetimeMonths} months</span>
              </div>
              <input
                type="range"
                min={6}
                max={48}
                step={1}
                value={lifetimeMonths}
                onChange={(e) => setLifetimeMonths(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            {/* Gross Margin & NRR */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Gross Margin</span>
                  <span className="font-mono font-bold text-white">{grossMargin}%</span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={95}
                  step={1}
                  value={grossMargin}
                  onChange={(e) => setGrossMargin(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Annual NRR</span>
                  <span className="font-mono font-bold text-white">{nrrPercent}%</span>
                </div>
                <input
                  type="range"
                  min={85}
                  max={150}
                  step={5}
                  value={nrrPercent}
                  onChange={(e) => setNrrPercent(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Strategy Levers Multipliers */}
          <div className="bg-indigo-950/20 border border-indigo-900/40 rounded-xl p-3.5 space-y-2">
            <h5 className="text-[11px] font-mono uppercase text-indigo-300 font-semibold flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-indigo-400" />
              Strategic Growth Levers
            </h5>

            <label className="flex items-start gap-2 cursor-pointer text-xs text-slate-300 hover:text-white transition">
              <input
                type="checkbox"
                checked={leverPlg}
                onChange={(e) => setLeverPlg(e.target.checked)}
                className="rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-0 mt-0.5"
              />
              <div>
                <span className="font-semibold block text-slate-200">PLG Word-of-Mouth Engine</span>
                <span className="text-[10px] text-slate-400">Reduces blended CAC by 40%</span>
              </div>
            </label>

            <label className="flex items-start gap-2 cursor-pointer text-xs text-slate-300 hover:text-white transition">
              <input
                type="checkbox"
                checked={leverOnboarding}
                onChange={(e) => setLeverOnboarding(e.target.checked)}
                className="rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-0 mt-0.5"
              />
              <div>
                <span className="font-semibold block text-slate-200">High-Touch Onboarding</span>
                <span className="text-[10px] text-slate-400">Extends account lifetime by 35%</span>
              </div>
            </label>

            <label className="flex items-start gap-2 cursor-pointer text-xs text-slate-300 hover:text-white transition">
              <input
                type="checkbox"
                checked={leverExpansion}
                onChange={(e) => setLeverExpansion(e.target.checked)}
                className="rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-0 mt-0.5"
              />
              <div>
                <span className="font-semibold block text-slate-200">Usage-Based Expansion Tier</span>
                <span className="text-[10px] text-slate-400">Boosts NRR by +15%</span>
              </div>
            </label>
          </div>
        </div>

        {/* Right Column: Recharts Visualization (8 cols) */}
        <div className="lg:col-span-8 bg-slate-950/80 border border-slate-800 rounded-xl p-5 space-y-4">
          {/* Chart View Switcher */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setActiveChart('ratio')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                  activeChart === 'ratio'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-white bg-slate-900'
                }`}
              >
                LTV / CAC Trajectory
              </button>
              <button
                onClick={() => setActiveChart('cashflow')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                  activeChart === 'cashflow'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-white bg-slate-900'
                }`}
              >
                Cash Payback Curve
              </button>
              <button
                onClick={() => setActiveChart('comparison')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                  activeChart === 'comparison'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-white bg-slate-900'
                }`}
              >
                LTV vs. CAC Hurdle
              </button>
            </div>

            <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2">
              <span className="inline-flex items-center gap-1">
                <span className="w-2.5 h-0.5 bg-indigo-400"></span> You
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="w-2.5 h-0.5 bg-slate-500 border-dashed"></span> {selectedBenchmark?.name}
              </span>
            </div>
          </div>

          {/* Recharts Container */}
          <div className="h-72 w-full pt-2">
            {activeChart === 'ratio' && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={projectionData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <defs>
                    <linearGradient id="ratioGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 11 }} tickFormatter={(val) => `${val}x`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                    formatter={(val: any, name?: any) => [
                      `${val}x`,
                      name === 'ltvCacRatio' ? 'Your LTV:CAC' : `${selectedBenchmark?.name} Benchmark`,
                    ]}
                    labelFormatter={(label) => `Cohort Month ${label}`}
                  />
                  {/* Reference Line for 3.0x (Standard Venture-Grade Bar) */}
                  <ReferenceLine
                    y={3.0}
                    stroke="#10b981"
                    strokeDasharray="4 4"
                    label={{
                      value: '3.0x Venture Bar',
                      position: 'insideTopRight',
                      fill: '#10b981',
                      fontSize: 10,
                    }}
                  />
                  {/* Reference Line for 5.0x (Elite Benchmark) */}
                  <ReferenceLine
                    y={5.0}
                    stroke="#a855f7"
                    strokeDasharray="4 4"
                    label={{
                      value: '5.0x Elite Tier',
                      position: 'insideTopRight',
                      fill: '#a855f7',
                      fontSize: 10,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="ltvCacRatio"
                    stroke="#818cf8"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#ratioGradient)"
                    name="ltvCacRatio"
                  />
                  <Line
                    type="monotone"
                    dataKey="benchmarkRatio"
                    stroke="#94a3b8"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={false}
                    name="benchmarkRatio"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}

            {activeChart === 'cashflow' && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={projectionData} margin={{ top: 10, right: 10, left: -5, bottom: 0 }}>
                  <defs>
                    <linearGradient id="cashGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <YAxis
                    stroke="#64748b"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(val) => `$${(val / 1000).toFixed(1)}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                    formatter={(val: any, name?: any) => [
                      `$${Number(val).toLocaleString()}`,
                      name === 'netCashPosition' ? 'Net Cash Position' : 'Cumulative Gross Profit',
                    ]}
                    labelFormatter={(label) => `Cohort Month ${label}`}
                  />
                  {/* Zero Breakeven Reference line */}
                  <ReferenceLine
                    y={0}
                    stroke="#f43f5e"
                    strokeDasharray="3 3"
                    label={{
                      value: 'Breakeven ($0)',
                      position: 'insideBottomLeft',
                      fill: '#f43f5e',
                      fontSize: 10,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="netCashPosition"
                    stroke="#34d399"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#cashGradient)"
                    name="netCashPosition"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}

            {activeChart === 'comparison' && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={projectionData} margin={{ top: 10, right: 10, left: -5, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <YAxis
                    stroke="#64748b"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(val) => `$${(val / 1000).toFixed(1)}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                    formatter={(val: any, name?: any) => [
                      `$${Number(val).toLocaleString()}`,
                      name === 'cumulativeLtv' ? 'Cumulative LTV' : 'Acquisition Cost (CAC)',
                    ]}
                  />
                  <Bar dataKey="cumulativeLtv" fill="#6366f1" radius={[4, 4, 0, 0]} name="cumulativeLtv" />
                  <Line
                    type="monotone"
                    dataKey="cacHurdle"
                    stroke="#f43f5e"
                    strokeWidth={2}
                    dot={false}
                    name="cacHurdle"
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Strategic Insight Callout */}
          <div className="pt-3 border-t border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
            <div className="flex items-start gap-2 text-slate-300">
              <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Growth Analytics Takeaway:</strong>{' '}
                {typeof paybackMonths === 'number' && paybackMonths <= 8 ? (
                  <span>
                    Your cohort crosses cash breakeven at <strong>Month {paybackMonths}</strong> and expands to{' '}
                    <strong className="text-indigo-400">{finalMonthData?.ltvCacRatio}x LTV/CAC</strong> by Month {horizonMonths}. You have proven capital efficiency; your primary strategic mandate is scaling top-of-funnel account volume.
                  </span>
                ) : (
                  <span>
                    Cash payback takes <strong>{paybackMonths} months</strong>. To compress payback into the sub-10 month venture band, test an annual prepayment incentive (reducing cash drag) or implement a self-serve PLG invite loop.
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400 shrink-0">
              <span>{selectedBenchmark?.name} Baseline:</span>
              <span className="text-white font-bold">{selectedBenchmark?.unitEconomicsBenchmark?.ltvCacRatio || 15}x</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
