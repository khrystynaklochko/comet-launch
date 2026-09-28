import React, { useState, useMemo } from 'react';
import { MyCompanyState } from '../types/intelligence';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Legend,
} from 'recharts';
import {
  Flame,
  DollarSign,
  Clock,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  Sliders,
  ShieldCheck,
  Sparkles,
  Calendar,
  Save,
  Zap,
  ArrowRight,
  Percent,
  Layers,
  Activity,
} from 'lucide-react';

interface Props {
  myCompany: MyCompanyState;
  onUpdateMyCompany?: (updated: Partial<MyCompanyState>) => void;
}

export const BurnRateRunwayWidget: React.FC<Props> = ({
  myCompany,
  onUpdateMyCompany,
}) => {
  // Financial inputs initialized from myCompany or sensible seed startup defaults
  const initialFinancials = myCompany.financials || {
    cashBalance: 450000,
    monthlyRevenue: 8500,
    operatingExpenses: 38000,
  };

  const [cashBalance, setCashBalance] = useState<number>(initialFinancials.cashBalance);
  const [monthlyRevenue, setMonthlyRevenue] = useState<number>(initialFinancials.monthlyRevenue);
  const [operatingExpenses, setOperatingExpenses] = useState<number>(initialFinancials.operatingExpenses);
  const [monthlyGrowthRate, setMonthlyGrowthRate] = useState<number>(8); // 8% monthly revenue growth

  // Interactive Burn Reduction Simulation Slider (0% to 30%, default 15%)
  const [burnReductionPct, setBurnReductionPct] = useState<number>(15);

  // Additional Scenario Levers
  const [closePipeline, setClosePipeline] = useState<boolean>(false);
  const [annualPrepayment, setAnnualPrepayment] = useState<boolean>(false);

  // View toggle: Runway Trajectory (Cash Balance vs Burn) or Monthly Cashflow Bars
  const [chartView, setChartView] = useState<'trajectory' | 'cashflow'>('trajectory');

  // Baseline calculations (without reduction)
  const baselineGrossBurn = operatingExpenses;
  const baselineRevenue = monthlyRevenue;
  const baselineNetBurn = Math.max(0, baselineGrossBurn - baselineRevenue);
  const isBaselineProfitable = baselineNetBurn <= 0;

  const baselineRunwayMonths = isBaselineProfitable
    ? 999
    : cashBalance > 0
    ? Number((cashBalance / Math.max(1, baselineNetBurn)).toFixed(1))
    : 0;

  // Simulated calculations (with burn reduction + levers)
  const monthlySavings = Math.round(operatingExpenses * (burnReductionPct / 100));
  const reducedGrossBurn = operatingExpenses - monthlySavings;

  const additionalRevFromPipeline = closePipeline ? 5000 : 0;
  const upfrontCashBoost = annualPrepayment ? 30000 : 0; // Prepayment injection

  const simulatedRevenue = monthlyRevenue + additionalRevFromPipeline;
  const simulatedNetBurn = Math.max(0, reducedGrossBurn - simulatedRevenue);
  const isSimulatedProfitable = simulatedNetBurn <= 0;

  const simulatedCashBalance = cashBalance + upfrontCashBoost;
  const simulatedRunwayMonths = isSimulatedProfitable
    ? 999
    : simulatedCashBalance > 0
    ? Number((simulatedCashBalance / Math.max(1, simulatedNetBurn)).toFixed(1))
    : 0;

  // Runway extension metrics
  const runwayExtensionMonths =
    isSimulatedProfitable && !isBaselineProfitable
      ? '∞ (Default Alive)'
      : isBaselineProfitable
      ? '0.0'
      : Number((simulatedRunwayMonths - baselineRunwayMonths).toFixed(1));

  const runwayExtensionPct =
    baselineRunwayMonths > 0 && typeof runwayExtensionMonths === 'number'
      ? Math.round((runwayExtensionMonths / baselineRunwayMonths) * 100)
      : 0;

  // Zero Cash Date estimations
  const formatZeroCashDate = (months: number, isProfitable: boolean) => {
    if (isProfitable) return 'Default Alive (Infinite)';
    if (months <= 0) return 'Immediate Depletion';
    const now = new Date();
    const futureDate = new Date(now.getTime() + months * 30.41 * 24 * 60 * 60 * 1000);
    return futureDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const baselineZeroCashDate = useMemo(
    () => formatZeroCashDate(baselineRunwayMonths, isBaselineProfitable),
    [baselineRunwayMonths, isBaselineProfitable]
  );

  const simulatedZeroCashDate = useMemo(
    () => formatZeroCashDate(simulatedRunwayMonths, isSimulatedProfitable),
    [simulatedRunwayMonths, isSimulatedProfitable]
  );

  // Generate Month-by-Month Projection Data for Recharts
  const maxProjectionMonths = Math.min(
    36,
    Math.max(14, Math.ceil(Math.max(baselineRunwayMonths, typeof simulatedRunwayMonths === 'number' ? simulatedRunwayMonths : 18)) + 3)
  );

  const projectionData = useMemo(() => {
    const data = [];
    let bCash = cashBalance;
    let sCash = simulatedCashBalance;

    let bRev = baselineRevenue;
    let sRev = simulatedRevenue;

    const growthFactor = 1 + monthlyGrowthRate / 100;

    for (let m = 0; m <= maxProjectionMonths; m++) {
      if (m > 0) {
        bRev = bRev * growthFactor;
        sRev = sRev * growthFactor;

        const bNetBurn = Math.max(0, baselineGrossBurn - bRev);
        const sNetBurn = Math.max(0, reducedGrossBurn - sRev);

        bCash = Math.round(bCash - bNetBurn);
        sCash = Math.round(sCash - sNetBurn);
      }

      data.push({
        month: m === 0 ? 'Now' : `M+${m}`,
        baselineCash: Math.max(0, bCash),
        simulatedCash: Math.max(0, sCash),
        baselineBurn: Math.round(Math.max(0, baselineGrossBurn - bRev)),
        simulatedBurn: Math.round(Math.max(0, reducedGrossBurn - sRev)),
        monthlySavings: monthlySavings,
        isBaselineExhausted: bCash <= 0,
        isSimulatedExhausted: sCash <= 0,
      });

      // Break if both are exhausted and we have plotted enough
      if (bCash <= 0 && sCash <= 0 && m >= 12) {
        break;
      }
    }
    return data;
  }, [
    cashBalance,
    simulatedCashBalance,
    baselineRevenue,
    simulatedRevenue,
    baselineGrossBurn,
    reducedGrossBurn,
    monthlyGrowthRate,
    monthlySavings,
    maxProjectionMonths,
  ]);

  // Save updated baseline financials
  const handleSaveFinancials = () => {
    if (onUpdateMyCompany) {
      onUpdateMyCompany({
        financials: {
          cashBalance,
          monthlyRevenue,
          operatingExpenses,
        },
      });
    }
  };

  // Health classification based on simulated runway
  const effectiveRunway = typeof simulatedRunwayMonths === 'number' ? simulatedRunwayMonths : 999;
  const isHealthy = effectiveRunway >= 18 || isSimulatedProfitable;
  const isModerate = effectiveRunway >= 10 && effectiveRunway < 18;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6 relative overflow-hidden backdrop-blur-md">
      <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-mono font-semibold bg-amber-950 text-amber-400 border border-amber-800/60 mb-2">
            <Flame className="w-3.5 h-3.5" />
            CASH RUNWAY PROJECTION &amp; BURN OPTIMIZATION
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            Cash Runway Projection: Balance vs. Monthly Burn Rate
          </h3>
          <p className="text-xs text-slate-400 max-w-2xl mt-1">
            Visualize your liquid cash depletion curve against monthly net burn. Simulate how reducing expenses by <strong>10%–20%</strong> unlocks critical operational runway to reach default alive status.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start lg:self-auto">
          {/* Chart View Switcher */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setChartView('trajectory')}
              className={`px-3 py-1 rounded-lg transition ${
                chartView === 'trajectory' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Cash Curve
            </button>
            <button
              onClick={() => setChartView('cashflow')}
              className={`px-3 py-1 rounded-lg transition ${
                chartView === 'cashflow' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Burn Rate Comparison
            </button>
          </div>

          <button
            onClick={handleSaveFinancials}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition cursor-pointer"
          >
            <Save className="w-3.5 h-3.5 text-indigo-400" />
            <span>Save Inputs</span>
          </button>
        </div>
      </div>

      {/* Burn Reduction Simulator Banner (The Core 10-20% Lever) */}
      <div className="bg-gradient-to-r from-indigo-950/60 via-slate-950 to-slate-950 border border-indigo-800/50 rounded-xl p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold font-mono text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5" />
                Burn Reduction Simulator (10% – 20% Levers)
              </span>
              <span className="px-2 py-0.2 rounded-full text-[10px] font-mono font-bold bg-indigo-900/60 text-indigo-300 border border-indigo-700/80">
                ACTIVE: {burnReductionPct}% BURN CUT
              </span>
            </div>
            <h4 className="text-sm font-bold text-white mt-1">
              Simulate How Reducing Monthly Burn Extends Operational Runway
            </h4>
          </div>

          {/* Quick preset buttons */}
          <div className="flex items-center gap-1.5 text-xs font-mono">
            <span className="text-slate-400 text-[11px] mr-1 hidden sm:inline">Quick Presets:</span>
            {[0, 10, 15, 20, 25].map((pct) => (
              <button
                key={pct}
                onClick={() => setBurnReductionPct(pct)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                  burnReductionPct === pct
                    ? 'bg-indigo-600 text-white shadow'
                    : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {pct}%
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Slider & Live Impact Delta */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
          {/* Slider input (7 cols) */}
          <div className="md:col-span-7 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-medium flex items-center gap-1">
                <span>Reduce Monthly OpEx by:</span>
                <strong className="text-indigo-400 font-mono text-sm">{burnReductionPct}%</strong>
              </span>
              <span className="text-emerald-400 font-mono font-semibold">
                Saves +${monthlySavings.toLocaleString()} / month (${(monthlySavings * 12).toLocaleString()} / yr)
              </span>
            </div>

            <input
              type="range"
              min={0}
              max={30}
              step={1}
              value={burnReductionPct}
              onChange={(e) => setBurnReductionPct(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />

            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>0% (Status Quo)</span>
              <span className="text-indigo-300 font-bold">10% (SaaS &amp; Vendor Trim)</span>
              <span className="text-indigo-400 font-bold">15% (Target Efficiency)</span>
              <span className="text-emerald-400 font-bold">20% (Max Extension)</span>
              <span>30%</span>
            </div>
          </div>

          {/* Unlocked Runway Gain Metric Card (5 cols) */}
          <div className="md:col-span-5 bg-slate-900/90 border border-indigo-900/60 rounded-xl p-3.5 flex items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                Runway Extension Unlocked
              </span>
              <div className="text-xl font-bold font-mono text-emerald-400 flex items-center gap-1.5 mt-0.5">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                <span>
                  {typeof runwayExtensionMonths === 'number'
                    ? `+${runwayExtensionMonths} months`
                    : runwayExtensionMonths}
                </span>
                {typeof runwayExtensionMonths === 'number' && runwayExtensionMonths > 0 && (
                  <span className="text-xs font-semibold text-emerald-300 font-mono">
                    (+{runwayExtensionPct}%)
                  </span>
                )}
              </div>
              <span className="text-[11px] text-slate-400 font-mono block mt-0.5">
                Depletion pushed to: <strong className="text-white">{simulatedZeroCashDate}</strong>
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-800/50 text-emerald-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Row: Cash Balance vs Monthly Burn Rate */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* KPI 1: Current Liquid Cash Balance */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-mono uppercase font-semibold">Liquid Cash Balance</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 my-1 font-mono">
            ${cashBalance.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            {annualPrepayment ? `+$30k prepaid injected` : `Active cash reserve`}
          </span>
        </div>

        {/* KPI 2: Monthly Net Burn Rate (Current vs Simulated) */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-mono uppercase font-semibold">Monthly Net Burn</span>
            <Flame className="w-4 h-4 text-red-400" />
          </div>
          <div className="flex items-baseline gap-2 my-1">
            <div className="text-2xl font-bold text-red-400 font-mono">
              ${simulatedNetBurn.toLocaleString()}
              <span className="text-xs font-normal text-slate-400">/mo</span>
            </div>
            {burnReductionPct > 0 && (
              <span className="text-xs line-through text-slate-500 font-mono">
                ${baselineNetBurn.toLocaleString()}
              </span>
            )}
          </div>
          <span className="text-[10px] text-emerald-400 font-mono font-semibold">
            {burnReductionPct > 0 ? `-${burnReductionPct}% burn reduction active` : `Baseline burn rate`}
          </span>
        </div>

        {/* KPI 3: Operational Runway (Months) */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-mono uppercase font-semibold">Operational Runway</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2 my-1">
            <div
              className={`text-2xl font-bold font-mono ${
                isSimulatedProfitable
                  ? 'text-emerald-400'
                  : effectiveRunway >= 18
                  ? 'text-emerald-400'
                  : effectiveRunway >= 10
                  ? 'text-amber-400'
                  : 'text-red-400'
              }`}
            >
              {isSimulatedProfitable ? '∞ Alive' : `${simulatedRunwayMonths} mos`}
            </div>
            {burnReductionPct > 0 && typeof baselineRunwayMonths === 'number' && (
              <span className="text-xs text-slate-500 line-through font-mono">
                {baselineRunwayMonths} mos
              </span>
            )}
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            Zero cash: <strong className="text-slate-200">{simulatedZeroCashDate}</strong>
          </span>
        </div>

        {/* KPI 4: Capital Preservation (Annualized) */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-mono uppercase font-semibold">Annual Capital Saved</span>
            <Activity className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-white my-1 font-mono">
            ${(monthlySavings * 12).toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            Equivalent to ~1 seed engineer hire
          </span>
        </div>
      </div>

      {/* Main Grid: Parameters on Left, Recharts Projection Chart on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Financial Parameter Sliders & Levers (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3.5">
            <h4 className="text-xs font-mono uppercase text-slate-400 font-semibold flex items-center justify-between">
              <span>Financial Baseline Inputs</span>
              <Sliders className="w-3.5 h-3.5 text-indigo-400" />
            </h4>

            {/* Liquid Cash Balance Slider */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Liquid Cash in Bank</span>
                <span className="font-mono font-bold text-emerald-400">${cashBalance.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min={20000}
                max={2000000}
                step={10000}
                value={cashBalance}
                onChange={(e) => setCashBalance(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-0.5">
                <span>$20k</span>
                <span>$500k (Seed)</span>
                <span>$2M (Series A)</span>
              </div>
            </div>

            {/* Monthly Operating Expenses (OpEx) */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Monthly Gross OpEx</span>
                <span className="font-mono font-bold text-red-400">${operatingExpenses.toLocaleString()}/mo</span>
              </div>
              <input
                type="range"
                min={5000}
                max={150000}
                step={2500}
                value={operatingExpenses}
                onChange={(e) => setOperatingExpenses(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-500"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-0.5">
                <span>$5k/mo</span>
                <span>$38k/mo</span>
                <span>$150k/mo</span>
              </div>
            </div>

            {/* Monthly Cash Revenue (MRR) */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Monthly Cash Revenue (MRR)</span>
                <span className="font-mono font-bold text-white">${monthlyRevenue.toLocaleString()}/mo</span>
              </div>
              <input
                type="range"
                min={0}
                max={100000}
                step={1000}
                value={monthlyRevenue}
                onChange={(e) => setMonthlyRevenue(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-0.5">
                <span>$0</span>
                <span>$20k/mo</span>
                <span>$100k/mo</span>
              </div>
            </div>

            {/* Monthly Growth Rate */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Monthly Revenue Growth</span>
                <span className="font-mono font-bold text-indigo-400">{monthlyGrowthRate}% / mo</span>
              </div>
              <input
                type="range"
                min={0}
                max={25}
                step={1}
                value={monthlyGrowthRate}
                onChange={(e) => setMonthlyGrowthRate(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-0.5">
                <span>0% (Flat)</span>
                <span>8% (Steady)</span>
                <span>25% (Hyper)</span>
              </div>
            </div>
          </div>

          {/* Secondary Capital Inflow Levers */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-2.5">
            <h5 className="text-[11px] font-mono uppercase text-slate-400 font-semibold flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-amber-400" />
              Additional Cashflow Accelerators
            </h5>

            <label className="flex items-start gap-2 cursor-pointer text-xs text-slate-300 hover:text-white transition">
              <input
                type="checkbox"
                checked={closePipeline}
                onChange={(e) => setClosePipeline(e.target.checked)}
                className="rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-0 mt-0.5"
              />
              <div>
                <span className="font-semibold block text-slate-200">Close 2 Active Pilots (+ $5k/mo MRR)</span>
                <span className="text-[10px] text-slate-400">
                  Enforces 21-day Mutual Action Plans to turn unpaid pilots into paying customers.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-2 cursor-pointer text-xs text-slate-300 hover:text-white transition">
              <input
                type="checkbox"
                checked={annualPrepayment}
                onChange={(e) => setAnnualPrepayment(e.target.checked)}
                className="rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-0 mt-0.5"
              />
              <div>
                <span className="font-semibold block text-slate-200">Mandate Annual Upfront Invoicing (+ $30k)</span>
                <span className="text-[10px] text-slate-400">
                  Offers a 15% discount for annual wire payments to immediately boost bank reserves.
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Right Column: Recharts Comparative Cash Runway Chart (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  {chartView === 'trajectory'
                    ? 'Cash Balance Trajectory: Baseline vs. Optimized Runway'
                    : 'Monthly Net Burn Comparison (Current vs. -' + burnReductionPct + '%)'}
                </h4>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 font-semibold">
                {burnReductionPct > 0 ? `+${runwayExtensionMonths} Extra Months` : 'Baseline View'}
              </span>
            </div>

            {/* Recharts Composed Chart (Cash Trajectory + Burn Line) */}
            <div className="h-72 w-full pt-1">
              <ResponsiveContainer width="100%" height="100%">
                {chartView === 'trajectory' ? (
                  <ComposedChart data={projectionData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="optimizedCashGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="baselineCashGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 10 }} />
                    <YAxis
                      stroke="#64748b"
                      tick={{ fontSize: 10 }}
                      tickFormatter={(val) => `$${Math.round(val / 1000)}k`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#334155',
                        borderRadius: '8px',
                        fontSize: '11px',
                      }}
                      formatter={(val: any, name?: any) => [
                        `$${Number(val).toLocaleString()}`,
                        name === 'simulatedCash'
                          ? `Optimized Cash (-${burnReductionPct}% Burn)`
                          : name === 'baselineCash'
                          ? 'Baseline Cash (Current Burn)'
                          : name,
                      ]}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />

                    <ReferenceLine
                      y={50000}
                      stroke="#f59e0b"
                      strokeDasharray="3 3"
                      label={{
                        value: 'Safety Threshold ($50k)',
                        position: 'insideTopLeft',
                        fill: '#f59e0b',
                        fontSize: 9,
                      }}
                    />

                    {/* Baseline Cash Depletion Line (Dashed) */}
                    <Line
                      type="monotone"
                      dataKey="baselineCash"
                      name="Baseline Cash (Current Burn)"
                      stroke="#f43f5e"
                      strokeWidth={2}
                      strokeDasharray="4 4"
                      dot={false}
                    />

                    {/* Simulated / Optimized Cash Area (Solid Emerald) */}
                    <Area
                      type="monotone"
                      dataKey="simulatedCash"
                      name={`Optimized Cash (-${burnReductionPct}% Burn)`}
                      stroke="#10b981"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#optimizedCashGradient)"
                    />
                  </ComposedChart>
                ) : (
                  <ComposedChart data={projectionData.slice(0, 12)} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 10 }} />
                    <YAxis
                      stroke="#64748b"
                      tick={{ fontSize: 10 }}
                      tickFormatter={(val) => `$${Math.round(val / 1000)}k`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#334155',
                        borderRadius: '8px',
                        fontSize: '11px',
                      }}
                      formatter={(val: any, name?: any) => [
                        `$${Number(val).toLocaleString()}`,
                        name === 'baselineBurn'
                          ? 'Baseline Monthly Burn'
                          : name === 'simulatedBurn'
                          ? `Optimized Monthly Burn (-${burnReductionPct}%)`
                          : name,
                      ]}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />

                    <Bar
                      dataKey="baselineBurn"
                      name="Baseline Monthly Burn"
                      fill="#ef4444"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="simulatedBurn"
                      name={`Optimized Monthly Burn (-${burnReductionPct}%)`}
                      fill="#10b981"
                      radius={[4, 4, 0, 0]}
                    />
                  </ComposedChart>
                )}
              </ResponsiveContainer>
            </div>

            {/* Trajectory comparison summary bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-900 text-[11px] font-mono">
              <div className="p-2 rounded bg-slate-900/60 border border-slate-800 text-slate-300">
                <span className="text-red-400 block font-semibold">Current Baseline:</span>
                Runway: <strong>{baselineRunwayMonths} mos</strong> • Zero cash:{' '}
                <span className="text-slate-400">{baselineZeroCashDate}</span>
              </div>

              <div className="p-2 rounded bg-emerald-950/20 border border-emerald-900/50 text-emerald-200">
                <span className="text-emerald-400 block font-semibold">
                  With {burnReductionPct}% Burn Cut:
                </span>
                Runway: <strong>{simulatedRunwayMonths} mos</strong> • Zero cash:{' '}
                <span className="text-emerald-300 font-bold">{simulatedZeroCashDate}</span>
              </div>
            </div>
          </div>

          {/* Strategic Context & Action Plan */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Seed Stage Operational Efficiency Playbook:
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                Stripe &amp; Linear Benchmark
              </span>
            </div>

            <p className="text-slate-300 text-[11px] leading-relaxed">
              Reducing monthly burn by <strong>15%–20%</strong> during seed phase typically preserves enough runway to avoid premature fundraising at unfavorable down-round valuations. The highest-leverage cuts:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[10px] text-slate-300 font-mono">
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <strong className="text-white block font-sans mb-0.5">1. SaaS Seat Audit</strong>
                Eliminate duplicate tools, unassigned seats, and redundant analytics (-$1.5k/mo).
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <strong className="text-white block font-sans mb-0.5">2. Pause Paid Ads</strong>
                Shift $0 to paid acquisition until organic conversion &gt; 10% is locked (-$2.0k/mo).
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <strong className="text-white block font-sans mb-0.5">3. Annual Upfronts</strong>
                Require 12-month prepayment with a 15% discount to pull cash forward immediately.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const CashRunwayProjectionChart = BurnRateRunwayWidget;
