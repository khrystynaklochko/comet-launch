import React, { useState, useMemo } from 'react';
import { MyCompanyState, Experiment, CompanyProfile } from '../types/intelligence';
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
  Legend,
  ReferenceLine,
} from 'recharts';
import {
  TrendingUp,
  Zap,
  Sliders,
  DollarSign,
  Clock,
  UserMinus,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Flame,
  Layers,
  HelpCircle,
  FlaskConical,
  BarChart2,
  Calendar,
  Users,
  Repeat,
  Percent,
} from 'lucide-react';

interface Props {
  myCompany: MyCompanyState;
  onUpdateMyCompany?: (updated: Partial<MyCompanyState>) => void;
  onAddExperiment?: (exp: Omit<Experiment, 'id' | 'status'>) => void;
  allCompanies?: CompanyProfile[];
}

interface VelocityPreset {
  id: string;
  name: string;
  cycleDays: number;
  multiplier: number;
  description: string;
  precedent: string;
}

const VELOCITY_PRESETS: VelocityPreset[] = [
  {
    id: 'lightning',
    name: 'Lightning (10-Day Cycle)',
    cycleDays: 10,
    multiplier: 2.2,
    description: 'Instant sandbox onboarding & Collison live setup; prospects purchase during or right after first call.',
    precedent: 'Stripe Early Collison Installation',
  },
  {
    id: 'accelerated',
    name: 'Accelerated (21-Day Cycle)',
    cycleDays: 21,
    multiplier: 1.5,
    description: 'Hard 3-week pilot deadline locked with signed Mutual Action Plan before provisioning software.',
    precedent: 'Datadog Enterprise MAP Motion',
  },
  {
    id: 'standard',
    name: 'Standard B2B (45-Day Cycle)',
    cycleDays: 45,
    multiplier: 1.0,
    description: 'Typical mid-market sales cycle with discovery, demo, committee review, and legal signature.',
    precedent: 'Standard Seed B2B Baseline',
  },
  {
    id: 'lagging',
    name: 'Enterprise Drag (90-Day Cycle)',
    cycleDays: 90,
    multiplier: 0.55,
    description: 'Multi-layer procurement, endless infosec reviews, and free pilot purgatory delaying closed-won status.',
    precedent: 'Legacy Enterprise Software',
  },
];

interface ChurnPreset {
  id: string;
  name: string;
  churnRate: number; // monthly %
  expansionRate: number; // monthly %
  tag: string;
  color: string;
  description: string;
}

const CHURN_PRESETS: ChurnPreset[] = [
  {
    id: 'negative',
    name: 'Net Negative Churn (-1.5% Net)',
    churnRate: 1.0,
    expansionRate: 2.5,
    tag: '118% NRR (Elite PLG)',
    color: 'text-emerald-400 border-emerald-800 bg-emerald-950/60',
    description: 'Seat expansion and usage growth in existing accounts outpace lost revenue (Linear / Figma model).',
  },
  {
    id: 'top-decile',
    name: 'Best-in-Class (1.0% / mo)',
    churnRate: 1.0,
    expansionRate: 0.8,
    tag: '<12% Annual Churn',
    color: 'text-teal-400 border-teal-800 bg-teal-950/60',
    description: 'Sticky workflow integration with proactive customer onboarding and high switching costs.',
  },
  {
    id: 'healthy',
    name: 'Healthy B2B (2.0% / mo)',
    churnRate: 2.0,
    expansionRate: 0.5,
    tag: 'Standard Seed Benchmark',
    color: 'text-indigo-400 border-indigo-800 bg-indigo-950/60',
    description: 'Acceptable early churn while refining Ideal Customer Profile (ICP) and onboarding playbook.',
  },
  {
    id: 'elevated',
    name: 'Elevated Friction (4.5% / mo)',
    churnRate: 4.5,
    expansionRate: 0.2,
    tag: 'Warning: Leaky Bucket',
    color: 'text-amber-400 border-amber-800 bg-amber-950/60',
    description: 'Noticeable drop-off after 60-90 days due to poor workflow adoption or target ICP misalignment.',
  },
  {
    id: 'severe',
    name: 'Severe Leakage (7.0% / mo)',
    churnRate: 7.0,
    expansionRate: 0.0,
    tag: 'Critical Churn Crisis',
    color: 'text-red-400 border-red-800 bg-red-950/60',
    description: 'High customer churn nullifies new customer acquisition, trapping the startup in a treadmill.',
  },
];

export const GrowthSimulatorWidget: React.FC<Props> = ({
  myCompany,
  onUpdateMyCompany,
  onAddExperiment,
  allCompanies = [],
}) => {
  // Horizon selector: 6, 9, or 12 months
  const [horizonMonths, setHorizonMonths] = useState<6 | 9 | 12>(12);

  // Chart view: 'revenue' (MRR/ARR Curve) or 'breakdown' (New MRR vs Churned MRR)
  const [chartMode, setChartMode] = useState<'revenue' | 'breakdown'>('revenue');

  // Baseline metrics derived from myCompany state
  const baseMonthlyRevenue = myCompany.financials?.monthlyRevenue || 8500;
  const basePayingCustomers = myCompany.payingCustomers || 10;
  const baseArpu =
    myCompany.unitEconomics?.monthlyArpu ||
    (basePayingCustomers > 0 ? Math.round(baseMonthlyRevenue / basePayingCustomers) : 850);

  // Interactive Sliders / Inputs
  const [currentMrr, setCurrentMrr] = useState<number>(baseMonthlyRevenue);
  const [monthlyArpu, setMonthlyArpu] = useState<number>(baseArpu || 850);
  const [monthlyPipelineOpportunities, setMonthlyPipelineOpportunities] = useState<number>(20);
  const [baseConversionRate, setBaseConversionRate] = useState<number>(15); // 15% close rate

  // Deal Velocity Control
  const [selectedVelocityId, setSelectedVelocityId] = useState<string>('accelerated');
  const [velocityMultiplier, setVelocityMultiplier] = useState<number>(1.5);

  // Churn & Expansion Controls
  const [selectedChurnId, setSelectedChurnId] = useState<string>('negative');
  const [monthlyChurnPct, setMonthlyChurnPct] = useState<number>(1.0); // 1.0% / mo
  const [monthlyExpansionPct, setMonthlyExpansionPct] = useState<number>(2.5); // 2.5% / mo expansion

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Handle Preset Velocity Selection
  const handleSelectVelocityPreset = (preset: VelocityPreset) => {
    setSelectedVelocityId(preset.id);
    setVelocityMultiplier(preset.multiplier);
  };

  // Handle Preset Churn Selection
  const handleSelectChurnPreset = (preset: ChurnPreset) => {
    setSelectedChurnId(preset.id);
    setMonthlyChurnPct(preset.churnRate);
    setMonthlyExpansionPct(preset.expansionRate);
  };

  // Month-by-month trajectory simulation
  const simulationResults = useMemo(() => {
    const data = [];

    // Baseline trajectory: standard deal velocity (1.0x) and baseline standard churn (3.5% churn, 0% expansion)
    const baselineChurnRate = 0.035;
    const baselineExpansionRate = 0.005;
    const baselineDealsPerMonth = Math.round(
      monthlyPipelineOpportunities * (baseConversionRate / 100) * 1.0
    );

    // Simulated trajectory: user-tuned velocity and churn/expansion
    const simChurnRate = monthlyChurnPct / 100;
    const simExpansionRate = monthlyExpansionPct / 100;
    const simDealsPerMonth = Math.round(
      monthlyPipelineOpportunities * (baseConversionRate / 100) * velocityMultiplier
    );

    let bMrr = currentMrr;
    let bCustomers = Math.max(1, Math.round(currentMrr / Math.max(1, monthlyArpu)));

    let sMrr = currentMrr;
    let sCustomers = bCustomers;

    let totalSimRevenueCumulative = 0;
    let totalBaseRevenueCumulative = 0;

    for (let m = 0; m <= horizonMonths; m++) {
      if (m === 0) {
        data.push({
          month: 'Now',
          monthNum: 0,
          simulatedMrr: Math.round(sMrr),
          simulatedArr: Math.round(sMrr * 12),
          baselineMrr: Math.round(bMrr),
          baselineArr: Math.round(bMrr * 12),
          simNewMrr: 0,
          simChurnedMrr: 0,
          simNetNewMrr: 0,
          simCustomers: sCustomers,
          baseCustomers: bCustomers,
        });
        totalSimRevenueCumulative += sMrr;
        totalBaseRevenueCumulative += bMrr;
        continue;
      }

      // 1. Calculate Baseline Progression
      const bChurnedMrr = Math.round(bMrr * baselineChurnRate);
      const bExpansionMrr = Math.round(bMrr * baselineExpansionRate);
      const bNewMrr = baselineDealsPerMonth * monthlyArpu;
      bMrr = Math.max(0, bMrr - bChurnedMrr + bExpansionMrr + bNewMrr);
      const bLostCustomers = Math.round(bCustomers * baselineChurnRate);
      bCustomers = Math.max(0, bCustomers - bLostCustomers + baselineDealsPerMonth);
      totalBaseRevenueCumulative += bMrr;

      // 2. Calculate Simulated Progression
      const sChurnedMrr = Math.round(sMrr * simChurnRate);
      const sExpansionMrr = Math.round(sMrr * simExpansionRate);
      const sNewMrr = simDealsPerMonth * monthlyArpu;
      const sNetNewMrr = sNewMrr + sExpansionMrr - sChurnedMrr;
      sMrr = Math.max(0, sMrr + sNetNewMrr);

      const sLostCustomers = Math.round(sCustomers * simChurnRate);
      sCustomers = Math.max(0, sCustomers - sLostCustomers + simDealsPerMonth);
      totalSimRevenueCumulative += sMrr;

      data.push({
        month: `M+${m}`,
        monthNum: m,
        simulatedMrr: Math.round(sMrr),
        simulatedArr: Math.round(sMrr * 12),
        baselineMrr: Math.round(bMrr),
        baselineArr: Math.round(bMrr * 12),
        simNewMrr: Math.round(sNewMrr + sExpansionMrr),
        simChurnedMrr: Math.round(sChurnedMrr),
        simNetNewMrr: Math.round(sNetNewMrr),
        simCustomers: sCustomers,
        baseCustomers: bCustomers,
      });
    }

    const finalSim = data[data.length - 1];
    const finalBase = data[data.length - 1];

    const mrrDelta = finalSim.simulatedMrr - finalBase.baselineMrr;
    const arrDelta = finalSim.simulatedArr - finalBase.baselineArr;
    const percentageLift = Math.round((mrrDelta / Math.max(1, finalBase.baselineMrr)) * 100);

    // Net Revenue Retention (Annualized estimation)
    const annualizedNrr = Math.round((1 - simChurnRate * 12 + simExpansionRate * 12) * 100);

    // Revenue saved by avoiding baseline churn over the horizon
    const cumulativeDelta = totalSimRevenueCumulative - totalBaseRevenueCumulative;

    return {
      data,
      finalSimMrr: finalSim.simulatedMrr,
      finalSimArr: finalSim.simulatedArr,
      finalBaseMrr: finalBase.baselineMrr,
      finalBaseArr: finalBase.baselineArr,
      finalSimCustomers: finalSim.simCustomers,
      finalBaseCustomers: finalBase.baseCustomers,
      mrrDelta,
      arrDelta,
      percentageLift,
      annualizedNrr,
      cumulativeDelta,
      simDealsPerMonth,
      baselineDealsPerMonth,
    };
  }, [
    horizonMonths,
    currentMrr,
    monthlyArpu,
    monthlyPipelineOpportunities,
    baseConversionRate,
    velocityMultiplier,
    monthlyChurnPct,
    monthlyExpansionPct,
  ]);

  // Convert scenario to a test on the Experiment Board
  const handleLaunchExperiment = (type: 'velocity' | 'churn') => {
    if (!onAddExperiment) return;

    if (type === 'velocity') {
      onAddExperiment({
        title: `Deal Velocity Acceleration: Shorten Sales Cycle to ${
          VELOCITY_PRESETS.find((v) => v.id === selectedVelocityId)?.cycleDays || 21
        } Days`,
        hypothesis: `If we enforce strict 21-day Mutual Action Plans with predetermined SLA milestones, deal closing velocity will increase by ${Math.round(
          (velocityMultiplier - 1) * 100
        )}% because enterprise buyers eliminate prolonged evaluation purgatory.`,
        targetIcp: myCompany.targetIcp || 'Active commercial pipeline accounts',
        channel: 'SALES_CYCLE_OPTIMIZATION',
        offer: 'Time-bounded pilot agreement with 15% upfront discount',
        volume: '15 opportunities',
        duration: '3 weeks',
        successThreshold: `>= 35% reduction in days-to-close with >= 20% conversion rate`,
        stopCondition: 'Zero signed Mutual Action Plans after 10 discovery calls',
      });
      setToastMessage('✓ Created Deal Velocity Experiment on the Experiment Board!');
    } else {
      onAddExperiment({
        title: `Negative Churn & Expansion Loop: Reduce Churn to ${monthlyChurnPct}%/mo`,
        hypothesis: `If we introduce in-product team milestone triggers and proactive onboarding teardowns, monthly customer churn will decrease to <=${monthlyChurnPct}% and expansion will rise by ${monthlyExpansionPct}%/mo because users encounter immediate time-to-value.`,
        targetIcp: 'Active paying accounts past day 30',
        channel: 'RETENTION_AND_EXPANSION',
        offer: 'Proactive onboarding health check & team collaboration seat unlock',
        volume: '25 accounts',
        duration: '4 weeks',
        successThreshold: `Zero logo churn in cohort + >= 2 seat expansion requests`,
        stopCondition: 'More than 2 cancel requests in the test cohort',
      });
      setToastMessage('✓ Created Retention & Expansion Experiment on the Experiment Board!');
    }

    setTimeout(() => setToastMessage(null), 3500);
  };

  const activeVelocity =
    VELOCITY_PRESETS.find((v) => v.id === selectedVelocityId) || VELOCITY_PRESETS[1];
  const activeChurn =
    CHURN_PRESETS.find((c) => c.id === selectedChurnId) || CHURN_PRESETS[0];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6 relative overflow-hidden backdrop-blur-md">
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-white" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-mono font-semibold bg-indigo-950 text-indigo-400 border border-indigo-800/60 mb-2">
            <Zap className="w-3.5 h-3.5" />
            GROWTH SIMULATOR &amp; TRAJECTORY ENGINE
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            6–12 Month Revenue Growth Simulator
          </h3>
          <p className="text-xs text-slate-400 max-w-2xl mt-1">
            Simulate your projected revenue trajectory across 6 to 12 months using your company's current metrics. Adjust <strong>churn rates</strong> and <strong>deal velocity</strong> to forecast their compounding impact on MRR, ARR, and cash generation.
          </p>
        </div>

        {/* Horizon Toggle & Chart Mode Switcher */}
        <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
          {/* Horizon Selector (6, 9, 12 mos) */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
            <span className="text-[11px] text-slate-500 px-1 hidden sm:inline">Horizon:</span>
            {([6, 9, 12] as const).map((h) => (
              <button
                key={h}
                onClick={() => setHorizonMonths(h)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                  horizonMonths === h
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {h} Months
              </button>
            ))}
          </div>

          {/* Mode Switcher: Revenue curve vs Net breakdown */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setChartMode('revenue')}
              className={`px-3 py-1 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                chartMode === 'revenue'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>MRR Curve</span>
            </button>
            <button
              onClick={() => setChartMode('breakdown')}
              className={`px-3 py-1 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                chartMode === 'breakdown'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>New vs Churn</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Outcomes Banner: Projected MRR, Delta Lift, and Net Revenue Retention */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* KPI 1: Projected MRR at End of Horizon */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-mono uppercase font-semibold">
              M+{horizonMonths} Projected MRR
            </span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="my-1.5">
            <div className="text-2xl font-bold font-mono text-emerald-400 leading-none">
              ${simulationResults.finalSimMrr.toLocaleString()}
              <span className="text-xs font-normal text-slate-400">/mo</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1 font-mono">
              <span>Status quo:</span>
              <span className="line-through text-slate-500">
                ${simulationResults.finalBaseMrr.toLocaleString()}/mo
              </span>
            </div>
          </div>
          <span className="text-[10px] text-emerald-300 font-mono font-semibold">
            +{simulationResults.percentageLift}% compound uplift
          </span>
        </div>

        {/* KPI 2: Annual Run Rate (ARR) at Horizon */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-mono uppercase font-semibold">
              M+{horizonMonths} Projected ARR
            </span>
            <TrendingUp className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="my-1.5">
            <div className="text-2xl font-bold font-mono text-white leading-none">
              ${simulationResults.finalSimArr.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1 font-mono">
              <span>Added Value:</span>
              <span className="text-emerald-400 font-bold">
                +${simulationResults.arrDelta.toLocaleString()} ARR
              </span>
            </div>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            Annualized contract value run rate
          </span>
        </div>

        {/* KPI 3: Net Revenue Retention (NRR) */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-mono uppercase font-semibold">Net Revenue Retention</span>
            <Repeat className="w-4 h-4 text-teal-400" />
          </div>
          <div className="my-1.5">
            <div
              className={`text-2xl font-bold font-mono leading-none ${
                simulationResults.annualizedNrr >= 115
                  ? 'text-emerald-400'
                  : simulationResults.annualizedNrr >= 100
                  ? 'text-teal-400'
                  : 'text-amber-400'
              }`}
            >
              {simulationResults.annualizedNrr}%
            </div>
            <div className="text-[11px] text-slate-400 mt-1 font-mono">
              {simulationResults.annualizedNrr >= 100 ? (
                <span className="text-emerald-400">✓ Expansion outpaces churn</span>
              ) : (
                <span className="text-amber-400">⚠️ Net revenue leak</span>
              )}
            </div>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            {monthlyChurnPct}% churn / +{monthlyExpansionPct}% expansion
          </span>
        </div>

        {/* KPI 4: Customer Base & Deal Velocity Impact */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-mono uppercase font-semibold">Projected Customers</span>
            <Users className="w-4 h-4 text-amber-400" />
          </div>
          <div className="my-1.5">
            <div className="text-2xl font-bold font-mono text-white leading-none">
              {simulationResults.finalSimCustomers} paying
            </div>
            <div className="text-[11px] text-slate-400 mt-1 font-mono">
              <span>Vel: </span>
              <strong className="text-indigo-400">{simulationResults.simDealsPerMonth} deals/mo</strong>
              <span className="text-slate-500"> vs {simulationResults.baselineDealsPerMonth} base</span>
            </div>
          </div>
          <span className="text-[10px] text-indigo-300 font-mono">
            Cycle: {activeVelocity.cycleDays} days ({velocityMultiplier}x velocity)
          </span>
        </div>
      </div>

      {/* Main Interactive Controls: Deal Velocity & Churn/Expansion */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* LEVER 1: Deal Velocity Controls */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-indigo-950/80 border border-indigo-800 text-indigo-400">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Lever 1: Deal Velocity &amp; Sales Cycle Compression
                </h4>
                <p className="text-[11px] text-slate-400">
                  Shortening days-to-close compounds closed-won conversion velocity.
                </p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-950 text-indigo-300 border border-indigo-800/80">
              {velocityMultiplier}x SPEED
            </span>
          </div>

          {/* Velocity Presets */}
          <div className="space-y-2">
            <span className="text-[11px] font-medium text-slate-300 block">
              Select Sales Cycle Motion:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {VELOCITY_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleSelectVelocityPreset(preset)}
                  className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                    selectedVelocityId === preset.id
                      ? 'bg-indigo-950/60 border-indigo-600 text-white shadow-sm'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{preset.name}</span>
                    <span className="text-[10px] font-mono text-indigo-400 font-bold">
                      {preset.multiplier}x
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 leading-snug">
                    {preset.description}
                  </p>
                  <span className="text-[9px] font-mono text-slate-500 block mt-1">
                    Ref: {preset.precedent}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Fine-Tuning Slider: Velocity Multiplier */}
          <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">Fine-Tune Deal Velocity Multiplier:</span>
              <span className="font-mono font-bold text-indigo-400">{velocityMultiplier.toFixed(2)}x</span>
            </div>
            <input
              type="range"
              min={0.5}
              max={2.5}
              step={0.05}
              value={velocityMultiplier}
              onChange={(e) => {
                setVelocityMultiplier(parseFloat(e.target.value));
                setSelectedVelocityId('custom');
              }}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>0.5x (Slow)</span>
              <span>1.0x (Standard)</span>
              <span>1.5x (Accelerated)</span>
              <span className="text-indigo-400 font-bold">2.5x (Extreme Velocity)</span>
            </div>
          </div>

          {/* Action button */}
          {onAddExperiment && (
            <button
              onClick={() => handleLaunchExperiment('velocity')}
              className="w-full py-2 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-700/60 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <FlaskConical className="w-3.5 h-3.5" />
              <span>Launch Velocity Experiment on Board</span>
            </button>
          )}
        </div>

        {/* LEVER 2: Churn & Retention Controls */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-teal-950/80 border border-teal-800 text-teal-400">
                <Repeat className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Lever 2: Churn Suppression &amp; Expansion Loop
                </h4>
                <p className="text-[11px] text-slate-400">
                  Model net retention dynamics to plug leaky pipeline bucket.
                </p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-teal-950 text-teal-300 border border-teal-800/80">
              {monthlyChurnPct}% CHURN / +{monthlyExpansionPct}% EXP
            </span>
          </div>

          {/* Churn Presets */}
          <div className="space-y-2">
            <span className="text-[11px] font-medium text-slate-300 block">
              Select Retention &amp; Churn Scenario:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {CHURN_PRESETS.slice(0, 4).map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleSelectChurnPreset(preset)}
                  className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                    selectedChurnId === preset.id
                      ? 'bg-teal-950/60 border-teal-600 text-white shadow-sm'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{preset.name}</span>
                  </div>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border inline-block mt-1 ${preset.color}`}>
                    {preset.tag}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1 leading-snug">
                    {preset.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Churn & Expansion Sliders */}
          <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-3.5 space-y-3">
            {/* Churn Slider */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">Monthly Logo/Revenue Churn Rate:</span>
                <span className="font-mono font-bold text-red-400">{monthlyChurnPct.toFixed(1)}% / mo</span>
              </div>
              <input
                type="range"
                min={0.0}
                max={8.0}
                step={0.1}
                value={monthlyChurnPct}
                onChange={(e) => {
                  setMonthlyChurnPct(parseFloat(e.target.value));
                  setSelectedChurnId('custom');
                }}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-500"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span className="text-emerald-400 font-bold">0% (Zero Churn)</span>
                <span>2% (Healthy)</span>
                <span>4.5% (Elevated)</span>
                <span className="text-red-400 font-bold">8% (Crisis)</span>
              </div>
            </div>

            {/* Expansion Slider */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">Monthly Retained Cohort Expansion:</span>
                <span className="font-mono font-bold text-emerald-400">+{monthlyExpansionPct.toFixed(1)}% / mo</span>
              </div>
              <input
                type="range"
                min={0.0}
                max={6.0}
                step={0.1}
                value={monthlyExpansionPct}
                onChange={(e) => {
                  setMonthlyExpansionPct(parseFloat(e.target.value));
                  setSelectedChurnId('custom');
                }}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>0% (Flat)</span>
                <span>1.5% (Moderate)</span>
                <span className="text-emerald-400 font-bold">3% (Strong PLG)</span>
                <span>6% (Hyper Expansion)</span>
              </div>
            </div>
          </div>

          {/* Action button */}
          {onAddExperiment && (
            <button
              onClick={() => handleLaunchExperiment('churn')}
              className="w-full py-2 rounded-lg bg-teal-600/20 hover:bg-teal-600 text-teal-300 hover:text-white border border-teal-700/60 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <FlaskConical className="w-3.5 h-3.5" />
              <span>Launch Retention Experiment on Board</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Recharts Projection Chart */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>
                {chartMode === 'revenue'
                  ? `Projected MRR Growth Trajectory (Next ${horizonMonths} Months)`
                  : `Monthly Inflow vs. Churn Breakdown (Next ${horizonMonths} Months)`}
              </span>
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Comparing Status Quo (current metrics) vs. Simulated Optimization (Velocity: {velocityMultiplier}x • Churn: {monthlyChurnPct}% • Expansion: +{monthlyExpansionPct}%)
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="text-slate-400">
              End MRR: <strong className="text-emerald-400 font-bold">${simulationResults.finalSimMrr.toLocaleString()}</strong>
            </span>
            <span>•</span>
            <span className="text-slate-400">
              Cumulative Added: <strong className="text-indigo-400 font-bold">+${simulationResults.cumulativeDelta.toLocaleString()}</strong>
            </span>
          </div>
        </div>

        {/* Recharts Canvas */}
        <div className="h-80 w-full pt-1">
          <ResponsiveContainer width="100%" height="100%">
            {chartMode === 'revenue' ? (
              <ComposedChart data={simulationResults.data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="simulatedMrrGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
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
                    name === 'simulatedMrr'
                      ? 'Simulated MRR (Optimized)'
                      : name === 'baselineMrr'
                      ? 'Baseline MRR (Status Quo)'
                      : name,
                  ]}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />

                {/* Baseline Line (Status Quo) */}
                <Line
                  type="monotone"
                  dataKey="baselineMrr"
                  name="Baseline MRR (Status Quo)"
                  stroke="#94a3b8"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={false}
                />

                {/* Simulated Area (Green/Emerald Optimized) */}
                <Area
                  type="monotone"
                  dataKey="simulatedMrr"
                  name="Simulated MRR (Optimized)"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#simulatedMrrGradient)"
                />
              </ComposedChart>
            ) : (
              <ComposedChart data={simulationResults.data.slice(1)} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
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
                    name === 'simNewMrr'
                      ? 'New MRR Added + Expansion'
                      : name === 'simChurnedMrr'
                      ? 'Churned MRR Lost'
                      : name === 'simNetNewMrr'
                      ? 'Net New MRR Growth'
                      : name,
                  ]}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />

                <Bar
                  dataKey="simNewMrr"
                  name="New MRR Added + Expansion"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="simChurnedMrr"
                  name="Churned MRR Lost"
                  fill="#ef4444"
                  radius={[4, 4, 0, 0]}
                />
                <Line
                  type="monotone"
                  dataKey="simNetNewMrr"
                  name="Net New MRR Growth"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                />
              </ComposedChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Month-by-month Trajectory Table Preview */}
        <div className="pt-2 border-t border-slate-900 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
          <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
            <span className="text-slate-400 block">Starting Baseline:</span>
            <strong className="text-white text-xs">${currentMrr.toLocaleString()}/mo</strong>
            <span className="text-slate-500 block mt-0.5">{myCompany.payingCustomers || 10} active accounts</span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
            <span className="text-slate-400 block">Baseline M+{horizonMonths}:</span>
            <strong className="text-slate-300 text-xs">${simulationResults.finalBaseMrr.toLocaleString()}/mo</strong>
            <span className="text-slate-500 block mt-0.5">{simulationResults.finalBaseCustomers} accounts</span>
          </div>

          <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-900/50">
            <span className="text-emerald-400 block font-semibold">Simulated M+{horizonMonths}:</span>
            <strong className="text-emerald-300 text-xs font-bold">
              ${simulationResults.finalSimMrr.toLocaleString()}/mo
            </strong>
            <span className="text-emerald-400/80 block mt-0.5">{simulationResults.finalSimCustomers} accounts</span>
          </div>

          <div className="p-2.5 rounded-lg bg-indigo-950/20 border border-indigo-900/50">
            <span className="text-indigo-400 block font-semibold">Net Strategic Lift:</span>
            <strong className="text-indigo-300 text-xs font-bold">
              +${simulationResults.mrrDelta.toLocaleString()}/mo
            </strong>
            <span className="text-indigo-400/80 block mt-0.5">
              (+${simulationResults.arrDelta.toLocaleString()} ARR)
            </span>
          </div>
        </div>
      </div>

      {/* Strategic Playbook Insights */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="font-bold text-white flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Seed Stage Growth Multiplier Principles:
          </span>
          <span className="text-[10px] font-mono text-slate-400">
            B2B SaaS Growth Mechanics
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-[11px] text-slate-300 leading-relaxed">
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
            <strong className="text-indigo-300 block font-sans">
              1. Deal Velocity Compounding
            </strong>
            <p className="text-slate-400">
              Halving sales cycles from 45 days to 21 days doubles deal throughput without spending extra capital on marketing. Strict Mutual Action Plans eliminate evaluation limbo.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
            <strong className="text-teal-300 block font-sans">
              2. The Negative Churn Flywheel
            </strong>
            <p className="text-slate-400">
              When seat or usage expansion (+2.5%/mo) outpaces churn (1%/mo), your installed customer base expands automatically every month even if zero new logos are closed.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
            <strong className="text-emerald-300 block font-sans">
              3. Default Alive Acceleration
            </strong>
            <p className="text-slate-400">
              Simulating both levers together increases 12-month ARR by over +50%, closing the cash burn deficit months faster to guarantee default alive status.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
