import React, { useState, useMemo } from 'react';
import { MyCompanyState, ResourceAllocationState, ResourceChannelAllocation } from '../types/intelligence';
import {
  Clock,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Sliders,
  RotateCcw,
  Zap,
  Target,
  ArrowRight,
  ShieldAlert,
  Percent,
  Compass,
  PieChart as PieChartIcon,
  BarChart3,
  Flame,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from 'recharts';

interface Props {
  myCompany: MyCompanyState;
  onUpdateMyCompany?: (updated: Partial<MyCompanyState>) => void;
}

const DEFAULT_CHANNELS: ResourceChannelAllocation[] = [
  {
    id: 'ch-direct-outbound',
    name: 'Direct Outbound & Live Onboarding',
    timeHours: 18,
    budgetDollars: 400,
    category: 'direct_outbound',
    benchmarkTimePct: 45,
    benchmarkBudgetPct: 15,
    efficiencyTier: 'high',
  },
  {
    id: 'ch-community',
    name: 'Community & Dev Ecosystem',
    timeHours: 10,
    budgetDollars: 300,
    category: 'community',
    benchmarkTimePct: 25,
    benchmarkBudgetPct: 15,
    efficiencyTier: 'high',
  },
  {
    id: 'ch-technical-content',
    name: 'Technical Content & Manifestos',
    timeHours: 8,
    budgetDollars: 500,
    category: 'technical_content',
    benchmarkTimePct: 20,
    benchmarkBudgetPct: 20,
    efficiencyTier: 'high',
  },
  {
    id: 'ch-paid-ads',
    name: 'Paid Search & Social Ads',
    timeHours: 2,
    budgetDollars: 1200,
    category: 'paid_channels',
    benchmarkTimePct: 5,
    benchmarkBudgetPct: 10,
    efficiencyTier: 'low',
  },
  {
    id: 'ch-integrations',
    name: 'Integrations & Ecosystem Wedges',
    timeHours: 4,
    budgetDollars: 400,
    category: 'integrations_plg',
    benchmarkTimePct: 15,
    benchmarkBudgetPct: 20,
    efficiencyTier: 'medium',
  },
  {
    id: 'ch-events',
    name: 'Conferences & Partnerships',
    timeHours: 2,
    budgetDollars: 600,
    category: 'events_partnerships',
    benchmarkTimePct: 5,
    benchmarkBudgetPct: 20,
    efficiencyTier: 'medium',
  },
];

const PRESETS = [
  {
    id: 'founder-led',
    label: 'Founder-Led Hustle (Phase 1 / Stripe Style)',
    description: '70% direct outreach & live user pairing. $0 paid ads. Maximize learning velocity.',
    allocations: {
      'ch-direct-outbound': { time: 24, budget: 300 },
      'ch-community': { time: 10, budget: 200 },
      'ch-technical-content': { time: 6, budget: 300 },
      'ch-paid-ads': { time: 0, budget: 0 },
      'ch-integrations': { time: 3, budget: 200 },
      'ch-events': { time: 1, budget: 200 },
    },
  },
  {
    id: 'developer-gravity',
    label: 'Community Pull (Linear / Supabase Style)',
    description: 'Focus on technical craft, Discord/community pairings, and architectural teardowns.',
    allocations: {
      'ch-direct-outbound': { time: 12, budget: 300 },
      'ch-community': { time: 16, budget: 500 },
      'ch-technical-content': { time: 12, budget: 600 },
      'ch-paid-ads': { time: 0, budget: 0 },
      'ch-integrations': { time: 6, budget: 400 },
      'ch-events': { time: 2, budget: 200 },
    },
  },
  {
    id: 'balanced-scale',
    label: 'Balanced B2B SaaS (Phase 3 Expansion)',
    description: 'Diversified channel mix with outbound automation, content SEO, and marketplace listings.',
    allocations: {
      'ch-direct-outbound': { time: 14, budget: 600 },
      'ch-community': { time: 8, budget: 400 },
      'ch-technical-content': { time: 8, budget: 800 },
      'ch-paid-ads': { time: 4, budget: 1200 },
      'ch-integrations': { time: 6, budget: 800 },
      'ch-events': { time: 4, budget: 700 },
    },
  },
];

export const ResourceAllocationWidget: React.FC<Props> = ({
  myCompany,
  onUpdateMyCompany,
}) => {
  // Initialize state from company or default
  const savedState = myCompany.resourceAllocation;
  const [channels, setChannels] = useState<ResourceChannelAllocation[]>(
    savedState?.channels || DEFAULT_CHANNELS
  );

  const [activePreset, setActivePreset] = useState<string>(
    savedState?.selectedPreset || 'founder-led'
  );

  const [viewMode, setViewMode] = useState<'comparison' | 'time' | 'budget'>('comparison');

  // Total Hours and Budget Calculations
  const totalWeeklyHours = useMemo(() => {
    return channels.reduce((sum, ch) => sum + ch.timeHours, 0);
  }, [channels]);

  const totalMonthlyBudget = useMemo(() => {
    return channels.reduce((sum, ch) => sum + ch.budgetDollars, 0);
  }, [channels]);

  // Paying customers count
  const payingCustomers = myCompany.payingCustomers || 0;

  // Sync to parent if updated
  const syncState = (newChannels: ResourceChannelAllocation[], presetId?: string) => {
    setChannels(newChannels);
    if (onUpdateMyCompany) {
      onUpdateMyCompany({
        resourceAllocation: {
          totalWeeklyHours: newChannels.reduce((sum, ch) => sum + ch.timeHours, 0),
          totalMonthlyBudget: newChannels.reduce((sum, ch) => sum + ch.budgetDollars, 0),
          channels: newChannels,
          selectedPreset: presetId || activePreset,
        },
      });
    }
  };

  // Update specific channel
  const handleUpdateChannel = (
    channelId: string,
    field: 'timeHours' | 'budgetDollars',
    value: number
  ) => {
    const updated = channels.map((ch) =>
      ch.id === channelId ? { ...ch, [field]: Math.max(0, value) } : ch
    );
    syncState(updated);
  };

  // Apply a preset
  const handleApplyPreset = (presetId: string) => {
    const preset = PRESETS.find((p) => p.id === presetId);
    if (!preset) return;

    setActivePreset(presetId);
    const updated = channels.map((ch) => {
      const pAlloc = (preset.allocations as any)[ch.id];
      if (pAlloc) {
        return {
          ...ch,
          timeHours: pAlloc.time,
          budgetDollars: pAlloc.budget,
        };
      }
      return ch;
    });

    syncState(updated, presetId);
  };

  // Strategic Efficiency Health Score (0 to 100)
  const efficiencyAnalysis = useMemo(() => {
    let score = 85;
    const warnings: string[] = [];
    const positives: string[] = [];

    const directChannel = channels.find((c) => c.category === 'direct_outbound');
    const paidChannel = channels.find((c) => c.category === 'paid_channels');
    const communityChannel = channels.find((c) => c.category === 'community');

    const directTimePct = totalWeeklyHours > 0 ? ((directChannel?.timeHours || 0) / totalWeeklyHours) * 100 : 0;
    const paidBudgetPct = totalMonthlyBudget > 0 ? ((paidChannel?.budgetDollars || 0) / totalMonthlyBudget) * 100 : 0;
    const paidTimePct = totalWeeklyHours > 0 ? ((paidChannel?.timeHours || 0) / totalWeeklyHours) * 100 : 0;

    // Check 1: Paid Ads early on
    if (payingCustomers < 10 && paidBudgetPct > 20) {
      score -= 25;
      warnings.push(
        `High Premature Ad Spend: Allocating ${Math.round(paidBudgetPct)}% of budget to Paid Ads with only ${payingCustomers} customer(s). Seed playbooks (Stripe, Linear) spent $0 on paid acquisition until product-market fit was locked.`
      );
    } else if (paidBudgetPct <= 10) {
      positives.push('Lean Paid Exposure: Disciplined organic focus protects runway from premature ad burning.');
    }

    // Check 2: Direct founder outbound time
    if (payingCustomers < 10 && directTimePct < 30) {
      score -= 20;
      warnings.push(
        `Insufficient Founder-Led Outbound: Only ${Math.round(directTimePct)}% of weekly time spent on direct prospect discovery/pairing. Pre-10 customer stage requires >=40% founder selling.`
      );
    } else if (directTimePct >= 40) {
      positives.push('Strong Founder Presence: Substantial weekly founder time dedicated to direct selling and live onboarding.');
    }

    // Check 3: Community / Developer leverage
    const commTimePct = totalWeeklyHours > 0 ? ((communityChannel?.timeHours || 0) / totalWeeklyHours) * 100 : 0;
    if (commTimePct >= 20) {
      positives.push('Organic Community Gravity: Active investment in developer watering holes and peer referrals.');
    }

    const clampedScore = Math.max(20, Math.min(100, score));

    return {
      score: clampedScore,
      warnings,
      positives,
      directTimePct: Math.round(directTimePct),
      paidBudgetPct: Math.round(paidBudgetPct),
    };
  }, [channels, totalWeeklyHours, totalMonthlyBudget, payingCustomers]);

  // Chart Data preparation
  const chartData = useMemo(() => {
    return channels.map((ch) => {
      const timePct = totalWeeklyHours > 0 ? Math.round((ch.timeHours / totalWeeklyHours) * 100) : 0;
      const budgetPct = totalMonthlyBudget > 0 ? Math.round((ch.budgetDollars / totalMonthlyBudget) * 100) : 0;

      return {
        name: ch.name.length > 18 ? ch.name.substring(0, 16) + '...' : ch.name,
        fullName: ch.name,
        timePct,
        benchmarkTimePct: ch.benchmarkTimePct,
        budgetPct,
        benchmarkBudgetPct: ch.benchmarkBudgetPct,
        timeHours: ch.timeHours,
        budgetDollars: ch.budgetDollars,
      };
    });
  }, [channels, totalWeeklyHours, totalMonthlyBudget]);

  // Auto Rebalance Helper
  const handleAutoRebalance = () => {
    const updated = channels.map((ch) => {
      // Rebalance based on benchmark percentages
      const targetHours = Math.round((ch.benchmarkTimePct / 100) * totalWeeklyHours);
      const targetBudget = Math.round((ch.benchmarkBudgetPct / 100) * totalMonthlyBudget);
      return {
        ...ch,
        timeHours: targetHours,
        budgetDollars: targetBudget,
      };
    });
    syncState(updated);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6 relative overflow-hidden backdrop-blur-md">
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-mono font-semibold bg-indigo-950 text-indigo-400 border border-indigo-800/60 mb-2">
            <Sliders className="w-3.5 h-3.5" />
            RESOURCE ALLOCATION &amp; OPERATIONAL EFFICIENCY
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            GTM Budget &amp; Founder Time Allocation Engine
          </h3>
          <p className="text-xs text-slate-400 max-w-2xl mt-1">
            Optimize weekly founder bandwidth and marketing spend across channels to avoid premature scaling traps and maximize customer learning velocity.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs">
          <span className="text-[11px] font-mono text-slate-500 px-1 hidden sm:inline">Strategy Archetype:</span>
          {PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => handleApplyPreset(p.id)}
              className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                activePreset === p.id
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {p.label.split(' ')[0]} {p.label.split(' ')[1]}
            </button>
          ))}
        </div>
      </div>

      {/* Summary KPI Cards & Efficiency Score */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Founder Weekly Hours */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-indigo-950/60 border border-indigo-800/50 text-indigo-400 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
              Founder GTM Time
            </span>
            <div className="text-xl font-bold font-mono text-white">
              {totalWeeklyHours} <span className="text-xs text-slate-400 font-normal">hrs/week</span>
            </div>
            <div className="text-[11px] text-slate-400">
              {Math.round(totalWeeklyHours / 5)} hrs/workday allocated
            </div>
          </div>
        </div>

        {/* KPI 2: Total Monthly GTM Budget */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-800/50 text-emerald-400 shrink-0">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
              Monthly GTM Budget
            </span>
            <div className="text-xl font-bold font-mono text-white">
              ${totalMonthlyBudget.toLocaleString()}{' '}
              <span className="text-xs text-slate-400 font-normal">/mo</span>
            </div>
            <div className="text-[11px] text-slate-400">
              ${Math.round(totalMonthlyBudget / Math.max(1, totalWeeklyHours))} per founder hr
            </div>
          </div>
        </div>

        {/* KPI 3: Efficiency Health Score */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 flex items-center gap-3">
          <div
            className={`p-2.5 rounded-lg border shrink-0 ${
              efficiencyAnalysis.score >= 80
                ? 'bg-emerald-950/60 border-emerald-800/50 text-emerald-400'
                : efficiencyAnalysis.score >= 60
                ? 'bg-amber-950/60 border-amber-800/50 text-amber-400'
                : 'bg-red-950/60 border-red-800/50 text-red-400'
            }`}
          >
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
              GTM Efficiency Index
            </span>
            <div className="text-xl font-bold font-mono text-white flex items-center gap-1.5">
              <span>{efficiencyAnalysis.score}/100</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold uppercase ${
                  efficiencyAnalysis.score >= 80
                    ? 'text-emerald-400 bg-emerald-950/60'
                    : efficiencyAnalysis.score >= 60
                    ? 'text-amber-400 bg-amber-950/60'
                    : 'text-red-400 bg-red-950/60'
                }`}
              >
                {efficiencyAnalysis.score >= 80 ? 'Optimal' : efficiencyAnalysis.score >= 60 ? 'Moderate' : 'Leaky'}
              </span>
            </div>
            <div className="text-[11px] text-slate-400">Benchmarked vs. early seed</div>
          </div>
        </div>

        {/* KPI 4: Direct Selling Ratio */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-purple-950/60 border border-purple-800/50 text-purple-400 shrink-0">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
              Direct Selling Share
            </span>
            <div className="text-xl font-bold font-mono text-white">
              {efficiencyAnalysis.directTimePct}%{' '}
              <span className="text-xs text-slate-400 font-normal">of time</span>
            </div>
            <div className="text-[11px] text-slate-400">
              Target: &gt;= 40% in early stage
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area: Chart vs Diagnostic Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Recharts Comparative Distribution Chart */}
        <div className="lg:col-span-7 bg-slate-950/80 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-400" />
              <h4 className="text-sm font-bold text-white">
                Resource Allocation: Current vs. Seed Benchmark
              </h4>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-[11px] font-mono">
              <button
                onClick={() => setViewMode('comparison')}
                className={`px-2 py-0.5 rounded transition ${
                  viewMode === 'comparison' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Time %
              </button>
              <button
                onClick={() => setViewMode('budget')}
                className={`px-2 py-0.5 rounded transition ${
                  viewMode === 'budget' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Budget %
              </button>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="name"
                  angle={-18}
                  textAnchor="end"
                  interval={0}
                  tick={{ fontSize: 10 }}
                />
                <YAxis unit="%" tick={{ fontSize: 10 }} />
                <Tooltip
                  formatter={(val: any, name: any) => [
                    `${val}%`,
                    name === 'timePct'
                      ? 'Your Time Allocation'
                      : name === 'benchmarkTimePct'
                      ? 'Seed Benchmark Time'
                      : name === 'budgetPct'
                      ? 'Your Budget Allocation'
                      : 'Seed Benchmark Budget',
                  ]}
                  labelFormatter={(lbl) => {
                    const item = chartData.find((d) => d.name === lbl);
                    return item ? item.fullName : lbl;
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
                />

                {viewMode === 'comparison' || viewMode === 'time' ? (
                  <>
                    <Bar
                      dataKey="timePct"
                      name="Your Time %"
                      fill="#6366f1"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="benchmarkTimePct"
                      name="Seed Benchmark Time %"
                      fill="#94a3b8"
                      radius={[4, 4, 0, 0]}
                    />
                  </>
                ) : (
                  <>
                    <Bar
                      dataKey="budgetPct"
                      name="Your Budget %"
                      fill="#10b981"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="benchmarkBudgetPct"
                      name="Seed Benchmark Budget %"
                      fill="#94a3b8"
                      radius={[4, 4, 0, 0]}
                    />
                  </>
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px] text-slate-400">
            <span>Stripe &amp; Linear allocated &gt;70% of initial resources to Direct Outbound + High-touch Community.</span>
            <button
              onClick={handleAutoRebalance}
              className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 transition"
            >
              <RotateCcw className="w-3 h-3" />
              Auto-Align to Benchmark
            </button>
          </div>
        </div>

        {/* Right: Operational Diagnostics & Warnings */}
        <div className="lg:col-span-5 bg-slate-950/80 border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Operational Diagnostics &amp; Risk Heat
              </h4>
              <span className="text-[10px] font-mono text-slate-400">Stage: {myCompany.stage}</span>
            </div>

            {/* Warnings list */}
            {efficiencyAnalysis.warnings.length > 0 ? (
              <div className="space-y-2">
                {efficiencyAnalysis.warnings.map((warn, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg bg-red-950/30 border border-red-900/60 text-xs text-red-200 flex items-start gap-2.5 leading-relaxed"
                  >
                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <span>{warn}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-900/60 text-xs text-emerald-200 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Zero premature scaling leaks detected. Your budget and time are aligned with high-velocity learning.</span>
              </div>
            )}

            {/* Positives list */}
            <div className="space-y-1.5 pt-1">
              {efficiencyAnalysis.positives.map((pos, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-300 leading-relaxed">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{pos}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actionable Rebalancing Recommendation Box */}
          <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-xs space-y-1.5">
            <div className="font-semibold text-white flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-indigo-400" />
              Strategic Efficiency Recommendation:
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              {efficiencyAnalysis.paidBudgetPct > 20
                ? `Reclaim $${Math.round(totalMonthlyBudget * (efficiencyAnalysis.paidBudgetPct - 10) / 100)} from Paid Ads and channel it into technical content distribution and founder onboarding incentives.`
                : `Continue pairing live with prospects. Every hour spent on direct Zoom onboarding provides 10x the insight of quantitative ad analytics.`}
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Channel Sliders & Budget Controls Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-400" />
            Fine-Tune Channel Time &amp; Spend Distribution
          </h4>
          <span className="text-xs text-slate-400">
            Adjust sliders to simulate shifts in founder focus and marketing runway.
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {channels.map((ch) => {
            const timePct = totalWeeklyHours > 0 ? Math.round((ch.timeHours / totalWeeklyHours) * 100) : 0;
            const budgetPct = totalMonthlyBudget > 0 ? Math.round((ch.budgetDollars / totalMonthlyBudget) * 100) : 0;

            return (
              <div
                key={ch.id}
                className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-3 hover:border-slate-700 transition"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="truncate">
                    <h5 className="text-xs font-bold text-white truncate">{ch.name}</h5>
                    <span className="text-[10px] font-mono text-slate-400">
                      Tier: <strong className={ch.efficiencyTier === 'high' ? 'text-emerald-400' : ch.efficiencyTier === 'medium' ? 'text-amber-400' : 'text-slate-400'}>{ch.efficiencyTier.toUpperCase()}</strong>
                    </span>
                  </div>

                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-900 text-slate-300 border border-slate-800 shrink-0">
                    {timePct}% Time • {budgetPct}% $
                  </span>
                </div>

                {/* Time Slider */}
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-indigo-400" /> Founder Time:
                    </span>
                    <span className="font-mono font-bold text-white">
                      {ch.timeHours} hrs/wk ({timePct}%)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="30"
                    step="1"
                    value={ch.timeHours}
                    onChange={(e) =>
                      handleUpdateChannel(ch.id, 'timeHours', parseInt(e.target.value) || 0)
                    }
                    className="w-full accent-indigo-500 cursor-pointer h-1.5 rounded-lg"
                  />
                </div>

                {/* Budget Slider */}
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-400 flex items-center gap-1">
                      <DollarSign className="w-3 h-3 text-emerald-400" /> Monthly Spend:
                    </span>
                    <span className="font-mono font-bold text-white">
                      ${ch.budgetDollars}/mo ({budgetPct}%)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="5000"
                    step="100"
                    value={ch.budgetDollars}
                    onChange={(e) =>
                      handleUpdateChannel(ch.id, 'budgetDollars', parseInt(e.target.value) || 0)
                    }
                    className="w-full accent-emerald-500 cursor-pointer h-1.5 rounded-lg"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
