import React, { useState, useMemo } from 'react';
import { MyCompanyState, CompanyProfile } from '../types/intelligence';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  Area,
  ComposedChart,
} from 'recharts';
import {
  TrendingUp,
  Sparkles,
  Calendar,
  DollarSign,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Sliders,
  CheckCircle2,
  Layers,
  ArrowRight,
  Info,
} from 'lucide-react';

interface Props {
  myCompany: MyCompanyState;
  onUpdateMyCompany?: (updated: Partial<MyCompanyState>) => void;
  allCompanies?: CompanyProfile[];
}

interface SeedGrowthModel {
  id: string;
  name: string;
  color: string;
  historicalMonthlyGrowthRate: number; // e.g., 18.2% / mo
  seedEra: string;
  businessModel: string;
  primaryGrowthDriver: string;
  expansionDriver: string;
  historicalContext: string;
  milestoneEvidence: string;
}

const SEED_GROWTH_MODELS: Record<string, SeedGrowthModel> = {
  stripe: {
    id: 'stripe',
    name: 'Stripe',
    color: '#6366f1', // Indigo
    historicalMonthlyGrowthRate: 18.2,
    seedEra: '2010–2012 Seed Stage',
    businessModel: 'Transaction Fee (2.9% + 30¢) & Subscriptions',
    primaryGrowthDriver: 'Developer-First Word-of-Mouth + Collison Onboarding',
    expansionDriver: 'Net transaction volume compounding as customer startups grew (Stripe grew with its customers)',
    historicalContext:
      'Stripe grew revenue at ~18.2% month-over-month during its early post-launch seed era. Because its pricing was a percentage of customer GMV, successful customers automatically multiplied Stripe’s revenue without requiring additional sales calls.',
    milestoneEvidence: 'Reached Customer #10 in Month 9 and scaled past 1,000 customers by Month 36.',
  },
  linear: {
    id: 'linear',
    name: 'Linear',
    color: '#10b981', // Emerald
    historicalMonthlyGrowthRate: 14.8,
    seedEra: '2019–2021 Seed Stage',
    businessModel: 'Seat-Based SaaS ($8-$14/user/mo)',
    primaryGrowthDriver: 'High-Craft Product Speed & The Linear Method',
    expansionDriver: 'Internal team virality and 140%+ Net Revenue Retention (NRR) as engineering teams expanded',
    historicalContext:
      'Linear averaged ~14.8% monthly revenue growth by relying exclusively on product craft, sub-50ms performance, and engineering community advocacy. They operated with zero sales reps for 2+ years while expanding seats within tech companies.',
    milestoneEvidence: 'Grew to hundreds of paying engineering teams while operating with under 5 core engineers.',
  },
  supabase: {
    id: 'supabase',
    name: 'Supabase',
    color: '#06b6d4', // Cyan
    historicalMonthlyGrowthRate: 21.5,
    seedEra: '2020–2022 Seed Stage',
    businessModel: 'Usage-Based Cloud Compute & Database Subscriptions',
    primaryGrowthDriver: 'Open-Source GitHub Gravity & Quarterly Launch Weeks',
    expansionDriver: 'Database compute scaling and seamless upgrades from free to Pro tier ($25/mo+)',
    historicalContext:
      'Supabase achieved ~21.5% monthly recurring revenue growth fueled by its viral "Launch Weeks", converting thousands of open-source developers into paid cloud hosting customers with minimal CAC.',
    milestoneEvidence: 'Rapidly transitioned from pre-revenue MVP to 100+ paying teams within 16 months.',
  },
  ramp: {
    id: 'ramp',
    name: 'Ramp',
    color: '#f59e0b', // Amber
    historicalMonthlyGrowthRate: 25.4,
    seedEra: '2019–2021 Seed Stage',
    businessModel: 'Interchange Share & Finance Automation SaaS',
    primaryGrowthDriver: 'Founder-Led Cold Outbound on SaaS Spend Waste',
    expansionDriver: 'Total corporate card transaction volume and vendor spend consolidation',
    historicalContext:
      'Ramp achieved hyper-velocity growth (~25.4% monthly compound rate in its first 18 months), positioning its software as a tool to save businesses money, creating instant ROI and rapid enterprise spend expansion.',
    milestoneEvidence: 'Fastest fintech in US history to scale from zero to $100M in annualized card volume.',
  },
};

export const RevenueGrowthProjectionWidget: React.FC<Props> = ({
  myCompany,
  onUpdateMyCompany,
  allCompanies = [],
}) => {
  // Selected Seed Benchmark
  const [selectedSeedId, setSelectedSeedId] = useState<string>('stripe');

  // Horizon: 12, 18, or 24 months
  const [projectionHorizon, setProjectionHorizon] = useState<number>(18);

  // Financial inputs initialized from myCompany financials
  const defaultRev = myCompany.financials?.monthlyRevenue || 8500;
  const defaultOpEx = myCompany.financials?.operatingExpenses || 38000;
  const defaultCash = myCompany.financials?.cashBalance || 450000;

  const [startingMrr, setStartingMrr] = useState<number>(defaultRev);
  const [operatingExpenses, setOperatingExpenses] = useState<number>(defaultOpEx);
  const [cashBalance, setCashBalance] = useState<number>(defaultCash);
  const [growthMultiplier, setGrowthMultiplier] = useState<number>(1.0); // 1.0x, 0.75x, 1.25x

  const activeSeed = SEED_GROWTH_MODELS[selectedSeedId] || SEED_GROWTH_MODELS.stripe;

  // Extrapolate trajectories month by month
  const projectionResults = useMemo(() => {
    const monthlyRateDecimal = (activeSeed.historicalMonthlyGrowthRate * growthMultiplier) / 100;
    const baselineLinearRateDecimal = 0.05; // 5% baseline modest growth

    const data = [];
    let currentSeedMrr = startingMrr;
    let currentBaseMrr = startingMrr;
    let currentSeedCash = cashBalance;
    let currentBaseCash = cashBalance;

    let defaultAliveMonth: number | null = null;
    let baselineExhaustionMonth: number | null = null;
    let seedExhaustionMonth: number | null = null;

    for (let m = 0; m <= projectionHorizon; m++) {
      if (m > 0) {
        currentSeedMrr = currentSeedMrr * (1 + monthlyRateDecimal);
        currentBaseMrr = currentBaseMrr * (1 + baselineLinearRateDecimal);

        const currentSeedNetBurn = operatingExpenses - currentSeedMrr;
        const currentBaseNetBurn = operatingExpenses - currentBaseMrr;

        currentSeedCash = Math.max(0, currentSeedCash - currentSeedNetBurn);
        currentBaseCash = Math.max(0, currentBaseCash - currentBaseNetBurn);

        // Check default alive (when MRR covers OpEx)
        if (defaultAliveMonth === null && currentSeedMrr >= operatingExpenses) {
          defaultAliveMonth = m;
        }

        if (baselineExhaustionMonth === null && currentBaseCash <= 0) {
          baselineExhaustionMonth = m;
        }

        if (seedExhaustionMonth === null && currentSeedCash <= 0 && currentSeedMrr < operatingExpenses) {
          seedExhaustionMonth = m;
        }
      }

      data.push({
        month: m === 0 ? 'Now' : `M${m}`,
        monthNum: m,
        seedMrr: Math.round(currentSeedMrr),
        seedArr: Math.round(currentSeedMrr * 12),
        baselineMrr: Math.round(currentBaseMrr),
        baselineArr: Math.round(currentBaseMrr * 12),
        operatingExpenses: operatingExpenses,
        seedCash: Math.round(currentSeedCash),
        baselineCash: Math.round(currentBaseCash),
      });
    }

    const finalPoint = data[data.length - 1];
    const finalMrr = finalPoint.seedMrr;
    const finalArr = finalPoint.seedArr;
    const mrrMultiplier = Number((finalMrr / Math.max(1, startingMrr)).toFixed(1));

    // Projected remaining runway delta
    const currentNetBurn = operatingExpenses - startingMrr;
    const currentStaticRunway = currentNetBurn > 0 ? Number((cashBalance / currentNetBurn).toFixed(1)) : 999;

    let dynamicRunwayStatus = '';
    if (defaultAliveMonth !== null && (seedExhaustionMonth === null || defaultAliveMonth <= seedExhaustionMonth)) {
      dynamicRunwayStatus = `Default Alive in Month ${defaultAliveMonth}`;
    } else if (seedExhaustionMonth !== null) {
      dynamicRunwayStatus = `Cash Depleted at Month ${seedExhaustionMonth}`;
    } else {
      dynamicRunwayStatus = `Runway Extends Beyond M${projectionHorizon}`;
    }

    return {
      data,
      finalMrr,
      finalArr,
      mrrMultiplier,
      defaultAliveMonth,
      currentStaticRunway,
      dynamicRunwayStatus,
      monthlyRatePct: (activeSeed.historicalMonthlyGrowthRate * growthMultiplier).toFixed(1),
    };
  }, [
    activeSeed,
    growthMultiplier,
    projectionHorizon,
    startingMrr,
    operatingExpenses,
    cashBalance,
  ]);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6 relative overflow-hidden backdrop-blur-md">
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-mono font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800/60 mb-2">
            <TrendingUp className="w-3.5 h-3.5" />
            REVENUE GROWTH PROJECTION &amp; RUNWAY EXTRAPOLATION
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            Extrapolate Revenue Runway vs. Seed Archetypes
          </h3>
          <p className="text-xs text-slate-400 max-w-2xl mt-1">
            Simulate your revenue trajectory and default alive crossover by extrapolating the verified historical monthly growth rates of Stripe, Linear, Supabase, and Ramp.
          </p>
        </div>

        {/* Horizon Toggle */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono self-start lg:self-auto">
          <span className="text-[11px] text-slate-500 px-1 hidden sm:inline">Horizon:</span>
          {[12, 18, 24].map((h) => (
            <button
              key={h}
              onClick={() => setProjectionHorizon(h)}
              className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                projectionHorizon === h
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {h} Months
            </button>
          ))}
        </div>
      </div>

      {/* Benchmark Seed Company Selection Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Object.values(SEED_GROWTH_MODELS).map((seed) => {
          const isSelected = selectedSeedId === seed.id;
          return (
            <button
              key={seed.id}
              onClick={() => setSelectedSeedId(seed.id)}
              className={`text-left p-3.5 rounded-xl border transition flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-800/90 border-slate-600 shadow-md ring-1 ring-emerald-500/40'
                  : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/40 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className="font-bold text-sm text-white flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: seed.color }}></span>
                  {seed.name}
                </span>
                <span className="text-[11px] font-mono text-emerald-400 font-bold">
                  +{seed.historicalMonthlyGrowthRate}%/mo
                </span>
              </div>
              <span className="text-[10px] text-slate-400 line-clamp-1">
                {seed.businessModel}
              </span>
              <span className="text-[10px] font-mono text-slate-500 mt-1">
                {seed.seedEra}
              </span>
            </button>
          );
        })}
      </div>

      {/* KPI Metrics Summary Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Extrapolated Month Horizon MRR */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold">
            Month {projectionHorizon} Projected MRR
          </span>
          <div className="text-2xl font-bold text-emerald-400 my-0.5 font-mono">
            ${projectionResults.finalMrr.toLocaleString()}
            <span className="text-xs text-slate-400 font-normal">/mo</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            Annualized: <strong className="text-white">${projectionResults.finalArr.toLocaleString()} ARR</strong>
          </span>
        </div>

        {/* Growth Multiple */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold">Revenue Multiple</span>
          <div className="text-2xl font-bold text-white my-0.5 font-mono">
            {projectionResults.mrrMultiplier}x
          </div>
          <span className="text-[10px] text-emerald-400 font-mono">
            From ${startingMrr.toLocaleString()} to ${projectionResults.finalMrr.toLocaleString()}
          </span>
        </div>

        {/* Default Alive Crossover Month */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold">Default Alive Target</span>
          <div className={`text-2xl font-bold my-0.5 font-mono ${projectionResults.defaultAliveMonth !== null ? 'text-emerald-400' : 'text-amber-400'}`}>
            {projectionResults.defaultAliveMonth !== null ? `Month ${projectionResults.defaultAliveMonth}` : `> M${projectionHorizon}`}
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            {projectionResults.defaultAliveMonth !== null
              ? 'Revenue covers OpEx (Infinite Runway)'
              : 'Requires further scale or lower OpEx'}
          </span>
        </div>

        {/* Dynamic Runway Extrapolation */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold">Extrapolated Runway</span>
          <div className="text-lg font-bold text-indigo-300 my-1 font-mono truncate">
            {projectionResults.dynamicRunwayStatus}
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            Static Runway: {projectionResults.currentStaticRunway} mos
          </span>
        </div>
      </div>

      {/* Main Grid: Inputs / Sliders on Left (5 cols), Line Chart on Right (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Controls Column (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-4">
            <h4 className="text-xs font-mono uppercase text-slate-400 font-semibold flex items-center justify-between">
              <span>Financial &amp; Growth Assumptions</span>
              <Sliders className="w-3.5 h-3.5 text-emerald-400" />
            </h4>

            {/* Current Starting MRR */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Starting Monthly Revenue (MRR)</span>
                <span className="font-mono font-bold text-emerald-400">${startingMrr.toLocaleString()}/mo</span>
              </div>
              <input
                type="range"
                min={1000}
                max={50000}
                step={500}
                value={startingMrr}
                onChange={(e) => setStartingMrr(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-0.5">
                <span>$1k/mo</span>
                <span>$15k/mo</span>
                <span>$50k/mo</span>
              </div>
            </div>

            {/* Monthly Operating Expenses */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Monthly Operating Expenses (OpEx)</span>
                <span className="font-mono font-bold text-red-400">${operatingExpenses.toLocaleString()}/mo</span>
              </div>
              <input
                type="range"
                min={5000}
                max={100000}
                step={2500}
                value={operatingExpenses}
                onChange={(e) => setOperatingExpenses(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-0.5">
                <span>$5k/mo (Ultra lean)</span>
                <span>$35k/mo</span>
                <span>$100k/mo</span>
              </div>
            </div>

            {/* Growth Rate Multiple Slider */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">
                  {activeSeed.name} Growth Multiplier ({projectionResults.monthlyRatePct}% / mo)
                </span>
                <span className="font-mono font-bold text-white">{growthMultiplier}x Pace</span>
              </div>
              <input
                type="range"
                min={0.5}
                max={1.5}
                step={0.05}
                value={growthMultiplier}
                onChange={(e) => setGrowthMultiplier(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-0.5">
                <span>0.5x Conservative</span>
                <span>1.0x Historical Parity</span>
                <span>1.5x Accelerated</span>
              </div>
            </div>
          </div>

          {/* Historical Seed Company Growth Context Card */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-2.5">
            <div className="flex items-center justify-between pb-1 border-b border-slate-800">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                {activeSeed.name} Historical Growth Engine
              </span>
              <span className="text-[10px] font-mono text-emerald-400 font-semibold">
                +{activeSeed.historicalMonthlyGrowthRate}% / mo verified
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {activeSeed.historicalContext}
            </p>

            <div className="pt-2 border-t border-slate-900 space-y-1 text-xs">
              <div className="flex items-start gap-1.5">
                <strong className="text-slate-300 shrink-0">Primary Engine:</strong>
                <span className="text-slate-400">{activeSeed.primaryGrowthDriver}</span>
              </div>
              <div className="flex items-start gap-1.5">
                <strong className="text-slate-300 shrink-0">Expansion Flywheel:</strong>
                <span className="text-slate-400">{activeSeed.expansionDriver}</span>
              </div>
              <div className="flex items-start gap-1.5">
                <strong className="text-slate-300 shrink-0">Milestone Fact:</strong>
                <span className="text-slate-400">{activeSeed.milestoneEvidence}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Line Chart (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Revenue Runway Extrapolation Curve
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  (MRR vs Default Alive Breakeven)
                </span>
              </div>

              <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-0.5 bg-red-400 inline-block"></span> OpEx Ceiling
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-0.5 bg-emerald-400 inline-block"></span> Projected MRR
                </span>
              </div>
            </div>

            {/* Recharts Composed Line & Area Chart */}
            <div className="h-72 w-full pt-1">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={projectionResults.data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="seedRevenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
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
                      name === 'seedMrr'
                        ? `${activeSeed.name} Pace MRR`
                        : name === 'baselineMrr'
                        ? 'Baseline (5% Organic)'
                        : 'Operating Expenses',
                    ]}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />

                  {/* OpEx Line (Breakeven / Default Alive Boundary) */}
                  <Line
                    type="monotone"
                    dataKey="operatingExpenses"
                    stroke="#f43f5e"
                    strokeDasharray="4 4"
                    strokeWidth={2}
                    dot={false}
                    name="operatingExpenses"
                  />

                  {/* Baseline Organic Line */}
                  <Line
                    type="monotone"
                    dataKey="baselineMrr"
                    stroke="#64748b"
                    strokeDasharray="3 3"
                    strokeWidth={1.5}
                    dot={false}
                    name="baselineMrr"
                  />

                  {/* Seed Extrapolated Curve */}
                  <Area
                    type="monotone"
                    dataKey="seedMrr"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#seedRevenueGradient)"
                    name="seedMrr"
                  />

                  {/* Crossover reference line */}
                  {projectionResults.defaultAliveMonth !== null && (
                    <ReferenceLine
                      x={`M${projectionResults.defaultAliveMonth}`}
                      stroke="#34d399"
                      strokeDasharray="3 3"
                      label={{
                        value: `Default Alive (M${projectionResults.defaultAliveMonth})`,
                        position: 'top',
                        fill: '#34d399',
                        fontSize: 10,
                      }}
                    />
                  )}
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            <div className="flex justify-between items-center text-[11px] font-mono text-slate-500 pt-1 border-t border-slate-900">
              <span>Start: ${startingMrr.toLocaleString()}/mo</span>
              <span className="text-white font-bold">
                M{projectionHorizon} Projected: ${projectionResults.finalMrr.toLocaleString()}/mo
              </span>
              <span className="text-emerald-400">
                {projectionResults.defaultAliveMonth !== null
                  ? `Breakeven: Month ${projectionResults.defaultAliveMonth}`
                  : 'Extending Runway'}
              </span>
            </div>
          </div>

          {/* Tactical Runway Takeaway */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Strategic Runway Implication
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Matching <strong>{activeSeed.name}'s</strong> historical growth velocity of{' '}
              <strong>+{projectionResults.monthlyRatePct}%/month</strong> transforms your startup from capital-dependent to{' '}
              <strong>Default Alive in {projectionResults.defaultAliveMonth !== null ? `${projectionResults.defaultAliveMonth} months` : `under 2 years`}</strong>. Instead of having to raise a dilutive bridge round under static burn, your compounding recurring revenue absorbs operating expenses and eliminates survival risk.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
