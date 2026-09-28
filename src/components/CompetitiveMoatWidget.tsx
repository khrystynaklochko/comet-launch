import React, { useState, useMemo } from 'react';
import { MyCompanyState, CompanyProfile } from '../types/intelligence';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  Legend,
} from 'recharts';
import {
  Shield,
  Award,
  Zap,
  Lock,
  Database,
  Users,
  Compass,
  Sparkles,
  Sliders,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Save,
} from 'lucide-react';

interface Props {
  myCompany: MyCompanyState;
  onUpdateMyCompany?: (updated: Partial<MyCompanyState>) => void;
  allCompanies?: CompanyProfile[];
}

interface SeedMoatProfile {
  id: string;
  name: string;
  category: string;
  color: string;
  scores: {
    networkEffects: number;
    proprietaryData: number;
    switchingCosts: number;
    counterPositioning: number;
    processPower: number;
    brandCommunity: number;
  };
  primaryMoat: string;
  moatSummary: string;
}

const SEED_MOAT_BENCHMARKS: Record<string, SeedMoatProfile> = {
  stripe: {
    id: 'stripe',
    name: 'Stripe',
    category: 'Developer Payments Rails',
    color: '#6366f1', // Indigo
    scores: {
      networkEffects: 60,
      proprietaryData: 75,
      switchingCosts: 95,
      counterPositioning: 85,
      processPower: 80,
      brandCommunity: 90,
    },
    primaryMoat: 'Extreme Switching Costs',
    moatSummary: 'Once payment webhooks and subscription billing are embedded into application source code, switching cost is nearly prohibitive.',
  },
  linear: {
    id: 'linear',
    name: 'Linear',
    category: 'Productivity & Issue Tracking',
    color: '#10b981', // Emerald
    scores: {
      networkEffects: 55,
      proprietaryData: 50,
      switchingCosts: 85,
      counterPositioning: 75,
      processPower: 95,
      brandCommunity: 90,
    },
    primaryMoat: 'Process Power & Craft',
    moatSummary: 'Sub-50ms keyboard-first interaction speed and opinionated workflows created an unshakeable cult brand that Jira could not mimic without rebuilding.',
  },
  supabase: {
    id: 'supabase',
    name: 'Supabase',
    category: 'Open-Source Developer Platform',
    color: '#06b6d4', // Cyan
    scores: {
      networkEffects: 65,
      proprietaryData: 60,
      switchingCosts: 90,
      counterPositioning: 92,
      processPower: 85,
      brandCommunity: 95,
    },
    primaryMoat: 'Counter-Positioning & Open-Source Gravity',
    moatSummary: 'Gave developers full PostgreSQL without vendor lock-in, neutralizing proprietary Firebase while building massive GitHub mindshare.',
  },
  ramp: {
    id: 'ramp',
    name: 'Ramp',
    category: 'Corporate Finance & Spend Management',
    color: '#f59e0b', // Amber
    scores: {
      networkEffects: 75,
      proprietaryData: 85,
      switchingCosts: 80,
      counterPositioning: 95,
      processPower: 85,
      brandCommunity: 70,
    },
    primaryMoat: 'Counter-Positioning & Data Intelligence',
    moatSummary: 'Positioned as software that helps you spend LESS money (contrasted with traditional credit cards pushing higher interchange spend).',
  },
};

export const CompetitiveMoatWidget: React.FC<Props> = ({
  myCompany,
  onUpdateMyCompany,
  allCompanies = [],
}) => {
  // Top 3 selected seed companies to benchmark against
  const [selectedSeedIds, setSelectedSeedIds] = useState<string[]>(['stripe', 'linear', 'supabase']);

  // User's own company moat scores (0-100)
  const [userScores, setUserScores] = useState({
    networkEffects: myCompany.moatScores?.networkEffects ?? 35,
    proprietaryData: myCompany.moatScores?.proprietaryData ?? 65,
    switchingCosts: myCompany.moatScores?.switchingCosts ?? 70,
    counterPositioning: myCompany.moatScores?.counterPositioning ?? 60,
    processPower: myCompany.moatScores?.processPower ?? 75,
    brandCommunity: myCompany.moatScores?.brandCommunity ?? 40,
  });

  const moatDimensions = [
    { key: 'switchingCosts', label: 'Switching Costs', icon: Lock, desc: 'Friction to rip & replace' },
    { key: 'processPower', label: 'Process Power', icon: Zap, desc: 'Execution speed & ergonomics' },
    { key: 'counterPositioning', label: 'Counter-Positioning', icon: Compass, desc: 'Uncopyable business model' },
    { key: 'proprietaryData', label: 'Proprietary Data', icon: Database, desc: 'Unique telemetry feedback loops' },
    { key: 'brandCommunity', label: 'Brand & Community', icon: Award, desc: 'Cult developer mindshare' },
    { key: 'networkEffects', label: 'Network Effects', icon: Users, desc: 'Value compounds with users' },
  ];

  const handleScoreChange = (key: keyof typeof userScores, val: number) => {
    const updated = { ...userScores, [key]: val };
    setUserScores(updated);
    if (onUpdateMyCompany) {
      onUpdateMyCompany({ moatScores: updated });
    }
  };

  const toggleSeedCompany = (id: string) => {
    if (selectedSeedIds.includes(id)) {
      if (selectedSeedIds.length > 1) {
        setSelectedSeedIds(selectedSeedIds.filter((item) => item !== id));
      }
    } else {
      if (selectedSeedIds.length < 3) {
        setSelectedSeedIds([...selectedSeedIds, id]);
      } else {
        // Replace the last item
        setSelectedSeedIds([selectedSeedIds[0], selectedSeedIds[1], id]);
      }
    }
  };

  // Recharts Spider/Radar Data
  const radarChartData = useMemo(() => {
    return moatDimensions.map((dim) => {
      const row: any = {
        dimension: dim.label,
        [myCompany.name || 'Your Company']: (userScores as any)[dim.key],
      };

      selectedSeedIds.forEach((id) => {
        const seed = SEED_MOAT_BENCHMARKS[id];
        if (seed) {
          row[seed.name] = (seed.scores as any)[dim.key];
        }
      });

      return row;
    });
  }, [userScores, selectedSeedIds, myCompany.name]);

  // Overall User Moat Score
  const overallUserMoat = useMemo(() => {
    const values = Object.values(userScores);
    return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
  }, [userScores]);

  // Find user's strongest dimension
  const strongestDimension = useMemo(() => {
    let maxKey = 'processPower';
    let maxVal = -1;
    (Object.entries(userScores) as [keyof typeof userScores, number][]).forEach(([key, val]) => {
      if (val > maxVal) {
        maxVal = val;
        maxKey = key;
      }
    });
    return moatDimensions.find((d) => d.key === maxKey) || moatDimensions[0];
  }, [userScores]);

  // Find biggest gap vs benchmark average
  const biggestGap = useMemo(() => {
    let maxGap = -999;
    let worstDim = moatDimensions[0];

    moatDimensions.forEach((dim) => {
      const seedAvg =
        selectedSeedIds.reduce((sum, id) => sum + (SEED_MOAT_BENCHMARKS[id]?.scores as any)[dim.key], 0) /
        selectedSeedIds.length;
      const userVal = (userScores as any)[dim.key];
      const gap = seedAvg - userVal;
      if (gap > maxGap) {
        maxGap = gap;
        worstDim = dim;
      }
    });

    return { dim: worstDim, gap: Math.round(maxGap) };
  }, [userScores, selectedSeedIds]);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6 relative overflow-hidden backdrop-blur-md">
      <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-mono font-semibold bg-purple-950 text-purple-400 border border-purple-800/60 mb-2">
            <Shield className="w-3.5 h-3.5" />
            COMPETITIVE MOAT &amp; DEFENSIBILITY BENCHMARK
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            Moat Strength vs. Seed Archetypes (Spider Chart)
          </h3>
          <p className="text-xs text-slate-400 max-w-2xl mt-1">
            Quantify your defensibility across 6 fundamental moat dimensions (Switching Costs, Process Power, Network Effects, Proprietary Data, Counter-Positioning, Brand) compared against the top 3 seed leaders.
          </p>
        </div>

        {/* Seed Company Selector (Pick Top 3) */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs">
          <span className="text-[11px] font-mono text-slate-500 px-1 hidden sm:inline">Benchmark:</span>
          {Object.values(SEED_MOAT_BENCHMARKS).map((seed) => {
            const isSelected = selectedSeedIds.includes(seed.id);
            return (
              <button
                key={seed.id}
                onClick={() => toggleSeedCompany(seed.id)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-slate-800 text-white shadow border border-slate-700'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: seed.color }}></span>
                {seed.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Overall Moat Score */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold">Your Moat Index</span>
          <div className="text-2xl font-bold text-purple-400 my-0.5 font-mono">
            {overallUserMoat}/100
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            {overallUserMoat >= 70 ? 'Defensible Citadel' : overallUserMoat >= 50 ? 'Emerging Moat' : 'Vulnerable to Copycats'}
          </span>
        </div>

        {/* Primary Moat Anchor */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold">Primary Anchor</span>
          <div className="text-base font-bold text-white my-1 font-sans truncate">
            {strongestDimension.label}
          </div>
          <span className="text-[10px] text-emerald-400 font-mono">
            Score: {(userScores as any)[strongestDimension.key]}/100
          </span>
        </div>

        {/* Biggest Defensibility Gap */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold">Key Vulnerability</span>
          <div className="text-base font-bold text-amber-400 my-1 font-sans truncate">
            {biggestGap.dim.label}
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            {biggestGap.gap > 0 ? `-${biggestGap.gap} pts below seed cohort` : 'Parity with cohort'}
          </span>
        </div>

        {/* Peer Benchmark Count */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold">Active Peers</span>
          <div className="text-2xl font-bold text-indigo-300 my-0.5 font-mono">
            {selectedSeedIds.length} Archetypes
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            {selectedSeedIds.map((id) => SEED_MOAT_BENCHMARKS[id]?.name).join(', ')}
          </span>
        </div>
      </div>

      {/* Main Grid: Spider Chart (6 cols) & Sliders / Action Plan (6 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Radar Spider Chart (6 cols) */}
        <div className="lg:col-span-6 bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              6-Axis Defensibility Spider Chart
            </h4>
            <span className="text-[10px] font-mono text-slate-400">Scale 0–100 Defensibility</span>
          </div>

          <div className="h-80 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarChartData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis
                  dataKey="dimension"
                  stroke="#94a3b8"
                  tick={{ fill: '#cbd5e1', fontSize: 10 }}
                />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 100]}
                  stroke="#475569"
                  tick={{ fill: '#64748b', fontSize: 9 }}
                />

                {/* User's Startup Radar */}
                <Radar
                  name={myCompany.name || 'Your Company'}
                  dataKey={myCompany.name || 'Your Company'}
                  stroke="#c084fc"
                  fill="#a855f7"
                  fillOpacity={0.4}
                  strokeWidth={2.5}
                />

                {/* Selected Seed Companies */}
                {selectedSeedIds.map((id) => {
                  const seed = SEED_MOAT_BENCHMARKS[id];
                  if (!seed) return null;
                  return (
                    <Radar
                      key={seed.id}
                      name={seed.name}
                      dataKey={seed.name}
                      stroke={seed.color}
                      fill={seed.color}
                      fillOpacity={0.15}
                      strokeWidth={1.5}
                    />
                  );
                })}

                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '11px',
                  }}
                  formatter={(val: any, name?: any) => [`${val}/100 Moat`, name]}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="text-[11px] font-mono text-slate-500 text-center flex items-center justify-center gap-4 pt-1">
            <span className="text-purple-400 font-semibold">● {myCompany.name || 'Your Startup'}</span>
            {selectedSeedIds.map((id) => (
              <span key={id} style={{ color: SEED_MOAT_BENCHMARKS[id]?.color }}>
                ● {SEED_MOAT_BENCHMARKS[id]?.name}
              </span>
            ))}
          </div>
        </div>

        {/* Sliders & Moat Hardening Roadmap (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3.5">
            <h4 className="text-xs font-mono uppercase text-slate-400 font-semibold flex items-center justify-between">
              <span>Calibrate Your Startup's Moat Scores</span>
              <Sliders className="w-3.5 h-3.5 text-purple-400" />
            </h4>

            <div className="space-y-3">
              {moatDimensions.map((dim) => {
                const val = (userScores as any)[dim.key];
                const Icon = dim.icon;
                return (
                  <div key={dim.key}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <div className="flex items-center gap-1.5">
                        <Icon className="w-3.5 h-3.5 text-purple-400" />
                        <span className="text-slate-300 font-medium">{dim.label}</span>
                      </div>
                      <span className="font-mono font-bold text-purple-300">{val}/100</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      step={5}
                      value={val}
                      onChange={(e) => handleScoreChange(dim.key as any, Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                      <span>{dim.desc}</span>
                      <span>{val >= 75 ? 'Strong Moat' : val >= 50 ? 'Moderate' : 'Fragile'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actionable Seed Moat Hardening Roadmap */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Tactical Moat Hardening Playbook
            </h4>

            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80 flex items-start gap-2">
                <Lock className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block mb-0.5">Deepen Switching Costs (The Stripe Playbook):</strong>
                  Ensure your software integrates into multiple daily developer routines (CLI tools, CI/CD webhooks, or automated migration scripts). When rip-and-replace requires engineering refactoring, churn drops below 0.5%/mo.
                </div>
              </div>

              <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80 flex items-start gap-2">
                <Compass className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block mb-0.5">Double Down on Counter-Positioning (The Supabase Playbook):</strong>
                  Adopt a radical transparency or open-source pricing philosophy that incumbents cannot match without destroying their own margin structure.
                </div>
              </div>

              <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80 flex items-start gap-2">
                <Zap className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block mb-0.5">Process Power &amp; Execution Velocity (The Linear Playbook):</strong>
                  Keep software interaction under 100ms. When users experience seamless craft, legacy feature checklists from slow incumbents cease to matter.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
