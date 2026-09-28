import React, { useState, useMemo } from 'react';
import { MyCompanyState, CompanyProfile } from '../types/intelligence';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import {
  Sparkles,
  Sliders,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  Zap,
  ArrowRight,
  CheckCircle2,
  BookmarkPlus,
  HelpCircle,
} from 'lucide-react';

interface Props {
  myCompany: MyCompanyState;
  onUpdateMyCompany?: (updated: Partial<MyCompanyState>) => void;
  allCompanies?: CompanyProfile[];
}

export const WhatIfScenarioSimulator: React.FC<Props> = ({
  myCompany,
  onUpdateMyCompany,
  allCompanies = [],
}) => {
  // Baseline financial values from company state
  const baseCash = myCompany.financials?.cashBalance || 450000;
  const baseRev = myCompany.financials?.monthlyRevenue || 8500;
  const baseOpEx = myCompany.financials?.operatingExpenses || 38000;
  const baseArpu = myCompany.unitEconomics?.monthlyArpu || 450;

  // Simulator Inputs
  const [baselineGtmSpend, setBaselineGtmSpend] = useState<number>(3000); // $3k/mo baseline GTM
  const [simulatedGtmSpend, setSimulatedGtmSpend] = useState<number>(7500); // adjusted GTM spend
  const [leadVolume, setLeadVolume] = useState<number>(60); // monthly active prospects
  const [baselineConvRate, setBaselineConvRate] = useState<number>(15); // 15% pilot-to-paid baseline
  const [simulatedConvRate, setSimulatedConvRate] = useState<number>(28); // 28% simulated conversion rate
  const [arpu, setArpu] = useState<number>(baseArpu); // Monthly ARPU
  const [activePreset, setActivePreset] = useState<string>('founder_sprint');
  const [chartView, setChartView] = useState<'revenue' | 'cash'>('revenue');

  // Apply Presets
  const applyPreset = (preset: string) => {
    setActivePreset(preset);
    if (preset === 'founder_sprint') {
      // Lean spend, high conversion sprint
      setSimulatedGtmSpend(3500);
      setSimulatedConvRate(32);
      setLeadVolume(50);
      setArpu(baseArpu);
    } else if (preset === 'aggressive_outbound') {
      // Higher GTM spend, higher volume, moderate conversion
      setSimulatedGtmSpend(12000);
      setSimulatedConvRate(18);
      setLeadVolume(140);
      setArpu(baseArpu);
    } else if (preset === 'capital_preservation') {
      // Minimized GTM spend, focus on high-intent referrals
      setSimulatedGtmSpend(1000);
      setSimulatedConvRate(22);
      setLeadVolume(35);
      setArpu(baseArpu);
    } else if (preset === 'upmarket_acv') {
      // Target larger ACV, lower conversion, moderate spend
      setSimulatedGtmSpend(6000);
      setSimulatedConvRate(14);
      setLeadVolume(45);
      setArpu(Math.round(baseArpu * 2.5));
    }
  };

  // Calculations
  const calculations = useMemo(() => {
    // Current baseline run-rate
    const baseNewCustomersPerMonth = (leadVolume * (baselineConvRate / 100));
    const baseNewMrrPerMonth = baseNewCustomersPerMonth * arpu;
    const baseNetBurn = baseOpEx - baseRev;
    const baseRunwayMonths = baseNetBurn > 0 ? Number((baseCash / baseNetBurn).toFixed(1)) : 999;

    // Simulated run-rate
    // Scale lead volume proportionally if GTM spend increases
    const spendRatio = simulatedGtmSpend / Math.max(500, baselineGtmSpend);
    const adjustedLeadVolume = Math.round(leadVolume * Math.pow(spendRatio, 0.7)); // diminishing returns on volume
    const simNewCustomersPerMonth = (adjustedLeadVolume * (simulatedConvRate / 100));
    const simNewMrrPerMonth = simNewCustomersPerMonth * arpu;

    const gtmSpendDelta = simulatedGtmSpend - baselineGtmSpend;
    const simOpEx = baseOpEx + gtmSpendDelta;

    // Month-by-month trajectory simulation over 12 months
    const trajectory = [];
    let baseRunningCash = baseCash;
    let baseRunningRev = baseRev;
    let simRunningCash = baseCash;
    let simRunningRev = baseRev;

    let breakevenMonth: number | null = null;

    for (let m = 0; m <= 12; m++) {
      if (m > 0) {
        baseRunningRev += baseNewMrrPerMonth;
        const baseMonthBurn = baseOpEx - baseRunningRev;
        baseRunningCash = Math.max(0, baseRunningCash - baseMonthBurn);

        simRunningRev += simNewMrrPerMonth;
        const simMonthBurn = simOpEx - simRunningRev;
        simRunningCash = Math.max(0, simRunningCash - simMonthBurn);

        // Check if simulated cash overtakes baseline cash (breakeven on incremental spend)
        if (breakevenMonth === null && simRunningCash > baseRunningCash) {
          breakevenMonth = m;
        }
      }

      trajectory.push({
        month: m === 0 ? 'Now' : `M${m}`,
        monthNum: m,
        baseRevenue: Math.round(baseRunningRev),
        simulatedRevenue: Math.round(simRunningRev),
        baseCash: Math.round(baseRunningCash),
        simulatedCash: Math.round(simRunningCash),
        cashDelta: Math.round(simRunningCash - baseRunningCash),
        revenueDelta: Math.round(simRunningRev - baseRunningRev),
      });
    }

    const simFinalRev = trajectory[12].simulatedRevenue;
    const baseFinalRev = trajectory[12].baseRevenue;
    const revDeltaAtM12 = simFinalRev - baseFinalRev;
    const m12SimNetBurn = simOpEx - simFinalRev;
    const simRunwayMonths = m12SimNetBurn <= 0 ? 999 : Number((trajectory[12].simulatedCash / Math.max(1000, m12SimNetBurn)).toFixed(1));
    const runwayDelta = (simFinalRev > simOpEx) ? 999 : Number((simRunwayMonths - baseRunwayMonths).toFixed(1));

    // Magic Number (Net New ARR added / Annualized incremental GTM spend)
    const annualGtmDelta = gtmSpendDelta * 12;
    const netNewArrAdded = (simFinalRev - baseFinalRev) * 12;
    const efficiencyRatio = annualGtmDelta > 0 ? Number((netNewArrAdded / annualGtmDelta).toFixed(2)) : 5.0;

    return {
      baseNewMrrPerMonth: Math.round(baseNewMrrPerMonth),
      simNewMrrPerMonth: Math.round(simNewMrrPerMonth),
      baseFinalRev,
      simFinalRev,
      revDeltaAtM12,
      baseRunwayMonths,
      simRunwayMonths,
      runwayDelta,
      gtmSpendDelta,
      breakevenMonth,
      adjustedLeadVolume,
      efficiencyRatio,
      trajectory,
    };
  }, [
    baseCash,
    baseRev,
    baseOpEx,
    arpu,
    baselineGtmSpend,
    simulatedGtmSpend,
    leadVolume,
    baselineConvRate,
    simulatedConvRate,
  ]);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6 relative overflow-hidden backdrop-blur-md">
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-mono font-semibold bg-indigo-950 text-indigo-400 border border-indigo-800/60 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            WHAT-IF SCENARIO SIMULATOR
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            GTM Spend &amp; Conversion Sensitivity Modeling
          </h3>
          <p className="text-xs text-slate-400 max-w-2xl mt-1">
            Test hypotheses on expanding marketing budgets vs. optimizing conversion rates. See the instant projected impact on 12-month recurring revenue, cash burn, and runway breakeven.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => applyPreset('founder_sprint')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition ${
              activePreset === 'founder_sprint'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Founder MAP Sprint
          </button>
          <button
            onClick={() => applyPreset('aggressive_outbound')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition ${
              activePreset === 'aggressive_outbound'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            SDR Outbound Push
          </button>
          <button
            onClick={() => applyPreset('capital_preservation')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition ${
              activePreset === 'capital_preservation'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Bootstrapped Lean
          </button>
          <button
            onClick={() => applyPreset('upmarket_acv')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition ${
              activePreset === 'upmarket_acv'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Upmarket ACV
          </button>
        </div>
      </div>

      {/* KPI Impact Delta Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Revenue Impact at M12 */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold">12-Mo Revenue Impact</span>
          <div className="text-2xl font-bold text-emerald-400 my-0.5 font-mono">
            {calculations.revDeltaAtM12 >= 0 ? `+$${calculations.revDeltaAtM12.toLocaleString()}` : `-$${Math.abs(calculations.revDeltaAtM12).toLocaleString()}`}
            <span className="text-xs text-slate-400 font-normal">/mo</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            Simulated: <strong className="text-white">${calculations.simFinalRev.toLocaleString()}/mo</strong>
          </span>
        </div>

        {/* Incremental GTM Spend */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold">GTM Monthly Budget</span>
          <div className="text-2xl font-bold text-white my-0.5 font-mono">
            ${simulatedGtmSpend.toLocaleString()}
            <span className="text-xs text-slate-400 font-normal">/mo</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            Delta: {calculations.gtmSpendDelta >= 0 ? `+$${calculations.gtmSpendDelta.toLocaleString()}` : `-$${Math.abs(calculations.gtmSpendDelta).toLocaleString()}`}/mo
          </span>
        </div>

        {/* Runway Breakeven */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold">Spend Breakeven</span>
          <div className="text-2xl font-bold text-indigo-300 my-0.5 font-mono">
            {calculations.breakevenMonth !== null ? `Month ${calculations.breakevenMonth}` : 'Accretive / Neutral'}
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            When revenue pays back spend
          </span>
        </div>

        {/* Capital Efficiency Ratio */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold">GTM Magic Number</span>
          <div className={`text-2xl font-bold my-0.5 font-mono ${calculations.efficiencyRatio >= 1.5 ? 'text-emerald-400' : calculations.efficiencyRatio >= 0.8 ? 'text-amber-400' : 'text-red-400'}`}>
            {calculations.efficiencyRatio}x
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            {calculations.efficiencyRatio >= 1.5 ? 'High Capital Efficiency' : 'Low Leverage Spend'}
          </span>
        </div>
      </div>

      {/* Main Grid: Dual Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Scenario Sliders (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-4">
            <h4 className="text-xs font-mono uppercase text-slate-400 font-semibold flex items-center justify-between">
              <span>Adjust Scenario Levers</span>
              <Sliders className="w-3.5 h-3.5 text-indigo-400" />
            </h4>

            {/* Lever 1: GTM Spend */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Monthly GTM Spend</span>
                <span className="font-mono font-bold text-indigo-400">${simulatedGtmSpend.toLocaleString()}/mo</span>
              </div>
              <input
                type="range"
                min={500}
                max={25000}
                step={500}
                value={simulatedGtmSpend}
                onChange={(e) => {
                  setSimulatedGtmSpend(Number(e.target.value));
                  setActivePreset('custom');
                }}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-0.5">
                <span>$500 (Organic)</span>
                <span>$7.5k (Hybrid)</span>
                <span>$25k (Scale)</span>
              </div>
            </div>

            {/* Lever 2: Conversion Rate */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Pilot / Pipeline Conversion Rate</span>
                <span className="font-mono font-bold text-emerald-400">{simulatedConvRate}%</span>
              </div>
              <input
                type="range"
                min={5}
                max={60}
                step={1}
                value={simulatedConvRate}
                onChange={(e) => {
                  setSimulatedConvRate(Number(e.target.value));
                  setActivePreset('custom');
                }}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-0.5">
                <span>5% (Friction)</span>
                <span>15% (Baseline)</span>
                <span>60% (Elite MAPs)</span>
              </div>
            </div>

            {/* Lever 3: Monthly Prospect / Lead Volume */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Monthly Prospect Volume</span>
                <span className="font-mono font-bold text-white">{calculations.adjustedLeadVolume} prospects</span>
              </div>
              <input
                type="range"
                min={20}
                max={250}
                step={5}
                value={leadVolume}
                onChange={(e) => {
                  setLeadVolume(Number(e.target.value));
                  setActivePreset('custom');
                }}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-0.5">
                <span>20 accounts</span>
                <span>60 accounts</span>
                <span>250 accounts</span>
              </div>
            </div>

            {/* Lever 4: Monthly ARPU */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Average Revenue Per User (Monthly ARPU)</span>
                <span className="font-mono font-bold text-white">${arpu.toLocaleString()}/mo</span>
              </div>
              <input
                type="range"
                min={100}
                max={3000}
                step={50}
                value={arpu}
                onChange={(e) => {
                  setArpu(Number(e.target.value));
                  setActivePreset('custom');
                }}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-0.5">
                <span>$100 (Self-serve)</span>
                <span>$450 (Standard)</span>
                <span>$3,000 (Mid-Market)</span>
              </div>
            </div>
          </div>

          {/* Quick Comparative Table */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-2 text-xs font-mono">
            <span className="text-slate-400 font-sans font-semibold uppercase text-[10px] block">
              12-Month Projections Comparison:
            </span>
            <div className="grid grid-cols-3 gap-2 py-1 border-b border-slate-800/80 text-[11px]">
              <span className="text-slate-500">Metric</span>
              <span className="text-slate-400 text-center">Baseline</span>
              <span className="text-emerald-400 text-center font-bold">Scenario</span>
            </div>
            <div className="grid grid-cols-3 gap-2 py-0.5 text-[11px]">
              <span className="text-slate-400">MRR at M12:</span>
              <span className="text-slate-300 text-center">${calculations.baseFinalRev.toLocaleString()}</span>
              <span className="text-emerald-400 text-center font-bold">${calculations.simFinalRev.toLocaleString()}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 py-0.5 text-[11px]">
              <span className="text-slate-400">GTM Spend:</span>
              <span className="text-slate-300 text-center">${baselineGtmSpend.toLocaleString()}/mo</span>
              <span className="text-indigo-300 text-center font-bold">${simulatedGtmSpend.toLocaleString()}/mo</span>
            </div>
            <div className="grid grid-cols-3 gap-2 py-0.5 text-[11px]">
              <span className="text-slate-400">Conversion:</span>
              <span className="text-slate-300 text-center">{baselineConvRate}%</span>
              <span className="text-emerald-400 text-center font-bold">{simulatedConvRate}%</span>
            </div>
          </div>
        </div>

        {/* Right Column: Recharts Chart & Strategy Diagnostic (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  12-Month Projected Trajectory
                </span>
                <span className="text-[10px] font-mono text-slate-400">(Baseline vs Scenario)</span>
              </div>

              {/* Chart Toggle */}
              <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-xs font-mono">
                <button
                  onClick={() => setChartView('revenue')}
                  className={`px-2 py-1 rounded text-[11px] font-semibold transition ${
                    chartView === 'revenue'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Revenue Curve
                </button>
                <button
                  onClick={() => setChartView('cash')}
                  className={`px-2 py-1 rounded text-[11px] font-semibold transition ${
                    chartView === 'cash'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Cash &amp; Runway
                </button>
              </div>
            </div>

            {/* Recharts Area / Line Chart */}
            <div className="h-64 w-full pt-1">
              <ResponsiveContainer width="100%" height="100%">
                {chartView === 'revenue' ? (
                  <AreaChart data={calculations.trajectory} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="simRevenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 11 }} />
                    <YAxis
                      stroke="#64748b"
                      tick={{ fontSize: 11 }}
                      tickFormatter={(val) => `$${Math.round(val / 1000)}k`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#334155',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                      formatter={(val: any, name?: any) => [
                        `$${Number(val).toLocaleString()}/mo`,
                        name === 'simulatedRevenue' ? 'Scenario Revenue' : 'Baseline Revenue',
                      ]}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                    <Line
                      type="monotone"
                      dataKey="baseRevenue"
                      stroke="#64748b"
                      strokeDasharray="4 4"
                      strokeWidth={2}
                      dot={false}
                      name="baseRevenue"
                    />
                    <Area
                      type="monotone"
                      dataKey="simulatedRevenue"
                      stroke="#10b981"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#simRevenueGradient)"
                      name="simulatedRevenue"
                    />
                  </AreaChart>
                ) : (
                  <LineChart data={calculations.trajectory} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 11 }} />
                    <YAxis
                      stroke="#64748b"
                      tick={{ fontSize: 11 }}
                      tickFormatter={(val) => `$${Math.round(val / 1000)}k`}
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
                        name === 'simulatedCash' ? 'Scenario Cash' : 'Baseline Cash',
                      ]}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                    <Line
                      type="monotone"
                      dataKey="baseCash"
                      stroke="#94a3b8"
                      strokeDasharray="4 4"
                      strokeWidth={2}
                      dot={false}
                      name="baseCash"
                    />
                    <Line
                      type="monotone"
                      dataKey="simulatedCash"
                      stroke="#6366f1"
                      strokeWidth={2.5}
                      dot={false}
                      name="simulatedCash"
                    />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>

            <div className="flex justify-between items-center text-[11px] font-mono text-slate-500 pt-1 border-t border-slate-900">
              <span>M12 Baseline: ${calculations.baseFinalRev.toLocaleString()}/mo</span>
              <span className="text-emerald-400 font-bold">
                Net Delta: +${calculations.revDeltaAtM12.toLocaleString()}/mo
              </span>
              <span>Efficiency: {calculations.efficiencyRatio}x ARR:Spend</span>
            </div>
          </div>

          {/* Strategic Decision Verdict */}
          <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Strategic Simulator Verdict
              </span>
              <span className="text-[11px] font-mono text-indigo-400 font-semibold">
                Historical Precedent Check
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {simulatedConvRate > baselineConvRate && simulatedGtmSpend - baselineGtmSpend <= 3000 ? (
                <span>
                  <strong>High-Leverage Execution:</strong> Prioritizing conversion rate (e.g. from {baselineConvRate}% to {simulatedConvRate}%) over gross ad spend creates an accelerating cash flywheel without risking runway. This mirrors <strong>Linear</strong> and <strong>Supabase</strong>, who doubled down on high-touch developer onboarding rather than premature outbound scaling.
                </span>
              ) : simulatedGtmSpend - baselineGtmSpend > 5000 && simulatedConvRate <= baselineConvRate ? (
                <span>
                  <strong>High Burn Risk Warning:</strong> Pouring more capital into GTM (${simulatedGtmSpend.toLocaleString()}/mo) without improving pilot conversion creates cash drag, burning capital {Math.abs(calculations.runwayDelta)} months earlier before reaching repeatability.
                </span>
              ) : (
                <span>
                  <strong>Balanced Growth Trajectory:</strong> This scenario generates an additional <strong>${calculations.revDeltaAtM12.toLocaleString()} in MRR</strong> by Month 12, achieving full payback on incremental spend by Month {calculations.breakevenMonth || 6}.
                </span>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
