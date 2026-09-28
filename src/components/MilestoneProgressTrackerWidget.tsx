import React, { useState, useMemo } from 'react';
import { MyCompanyState, MilestoneProgressItem } from '../types/intelligence';
import {
  CheckCircle2,
  Circle,
  Trophy,
  Target,
  Sparkles,
  TrendingUp,
  DollarSign,
  Users,
  ShieldCheck,
  Zap,
  Plus,
  Filter,
  Flame,
  Award,
  Calendar,
  Layers,
  ChevronDown,
  ChevronUp,
  X,
  ExternalLink,
} from 'lucide-react';

interface Props {
  myCompany: MyCompanyState;
  onUpdateMyCompany?: (updated: Partial<MyCompanyState>) => void;
}

// 16 Standard Foundational Startup Milestones
const DEFAULT_FOUNDATIONAL_MILESTONES: MilestoneProgressItem[] = [
  // Phase 1: Validation Wedge & First Customer
  {
    id: 'ms-first-interview',
    category: 'customers',
    title: '5 Decision-Maker Discovery Interviews',
    description: 'Conducted 5 in-depth problem interviews with budget-holding buyers confirming acute hair-on-fire pain.',
    targetMetric: '5 interviews',
    phaseId: 'phase-1',
    completed: true,
    completedAt: 'Pre-seed Era',
  },
  {
    id: 'ms-mvp-deployed',
    category: 'product_pilot',
    title: 'MVP Deployed with Sub-15min Onboarding',
    description: 'Shipped a functional working wedge where a user can experience the "aha moment" within 15 minutes.',
    targetMetric: '< 15m to aha',
    phaseId: 'phase-1',
    completed: true,
    completedAt: 'Phase 1 MVP',
  },
  {
    id: 'ms-first-customer',
    category: 'revenue',
    title: 'First Paid Customer ($100+ Revenue)',
    description: 'Secured the first non-friend/family commercial customer paying for live software usage.',
    targetMetric: '1 Customer ($100+)',
    phaseId: 'phase-1',
    completed: true,
    completedAt: 'First Customer',
  },
  {
    id: 'ms-first-reference',
    category: 'customers',
    title: 'First Public Customer Testimonial',
    description: 'Secured written permission or public quote to use the first customer as a commercial case study.',
    targetMetric: '1 Case Study',
    phaseId: 'phase-1',
    completed: false,
  },

  // Phase 2: Repeatable Pilots ($10k-$50k ARR)
  {
    id: 'ms-first-10k-arr',
    category: 'revenue',
    title: 'First $10,000 ARR Milestone',
    description: 'Reached $850+/mo in recurring revenue, validating willingness to pay beyond early friendly pilots.',
    targetMetric: '$10k ARR ($850/mo)',
    phaseId: 'phase-2',
    completed: false,
  },
  {
    id: 'ms-10-enterprise-pilots',
    category: 'product_pilot',
    title: 'First 10 Enterprise Pilots / Customers',
    description: 'Launched 10 structured pilots with signed Mutual Action Plans (MAPs) and clear success criteria.',
    targetMetric: '10 Pilots / MAPs',
    phaseId: 'phase-2',
    completed: false,
  },
  {
    id: 'ms-3-conversions',
    category: 'revenue',
    title: '3 Enterprise Pilots Converted to Annual Contracts',
    description: 'Successfully transitioned at least 3 pilot users into paid 12-month commercial agreements.',
    targetMetric: '3 Annual Contracts',
    phaseId: 'phase-2',
    completed: false,
  },
  {
    id: 'ms-retention-cohort',
    category: 'capital_efficiency',
    title: '90-Day Logo Retention > 85%',
    description: 'Demonstrated that early paying cohorts continue using and paying after the initial 90-day honeymoon.',
    targetMetric: '> 85% Retention',
    phaseId: 'phase-2',
    completed: false,
  },

  // Phase 3: Scale Engine ($50k-$200k ARR)
  {
    id: 'ms-100k-arr',
    category: 'revenue',
    title: 'First $100,000 ARR Milestone',
    description: 'Surpassed $8,333/mo MRR. Startup enters high-growth Seed / Series A trajectory.',
    targetMetric: '$100k ARR ($8.3k/mo)',
    phaseId: 'phase-3',
    completed: false,
  },
  {
    id: 'ms-50-customers',
    category: 'customers',
    title: 'First 50 Paying Customers',
    description: 'Diversified customer base so that no single customer accounts for more than 15% of total revenue.',
    targetMetric: '50 Customers',
    phaseId: 'phase-3',
    completed: false,
  },
  {
    id: 'ms-repeatable-playbook',
    category: 'product_pilot',
    title: 'Documented Repeatable Sales Playbook',
    description: 'Codified ideal customer profile, discovery script, demo deck, and objection handling for a non-founder.',
    targetMetric: 'Documented Playbook',
    phaseId: 'phase-3',
    completed: false,
  },
  {
    id: 'ms-cac-payback',
    category: 'capital_efficiency',
    title: 'CAC Payback Period Under 6 Months',
    description: 'Customer acquisition cost is fully recouped through gross margin within 6 months of signing.',
    targetMetric: '< 6 Mo Payback',
    phaseId: 'phase-3',
    completed: false,
  },

  // Phase 4: Default Alive & Flywheels ($250k+ ARR)
  {
    id: 'ms-default-alive',
    category: 'capital_efficiency',
    title: 'Default Alive Breakeven Reached',
    description: 'Monthly recurring revenue covers monthly operating expenses. Runway becomes infinite.',
    targetMetric: 'MRR >= OpEx',
    phaseId: 'phase-4',
    completed: false,
  },
  {
    id: 'ms-100-customers',
    category: 'customers',
    title: 'First 100 Paying Customers',
    description: 'Established market leadership within the initial niche wedge, positioning for cross-product expansion.',
    targetMetric: '100 Customers',
    phaseId: 'phase-4',
    completed: false,
  },
  {
    id: 'ms-net-negative-churn',
    category: 'revenue',
    title: '120%+ Net Revenue Retention (NRR)',
    description: 'Expansion revenue from existing accounts outpaces all gross churn and contraction.',
    targetMetric: '> 120% NRR',
    phaseId: 'phase-4',
    completed: false,
  },
  {
    id: 'ms-capital-runway',
    category: 'capital_efficiency',
    title: '18+ Months Runway Preserved',
    description: 'Prudent burn management ensures high negotiating leverage without forced bridge rounds.',
    targetMetric: '> 18 Mo Runway',
    phaseId: 'phase-4',
    completed: false,
  },
];

interface GrowthGoalDefinition {
  id: string;
  label: string;
  shortLabel: string;
  milestoneIds: string[];
  description: string;
  targetHorizon: string;
}

const GROWTH_GOALS: GrowthGoalDefinition[] = [
  {
    id: 'goal-pilots',
    label: 'Primary Growth Goal: First 10 Enterprise Pilots / $10k ARR',
    shortLabel: 'First 10 Pilots & $10k ARR',
    milestoneIds: [
      'ms-first-interview',
      'ms-mvp-deployed',
      'ms-first-customer',
      'ms-first-reference',
      'ms-first-10k-arr',
      'ms-10-enterprise-pilots',
    ],
    description: 'Lock in product-market fit signal and transition from early friendly users to commercial pilot agreements.',
    targetHorizon: 'Next 90 Days',
  },
  {
    id: 'goal-scale-100k',
    label: 'Scale Goal: $100k ARR & Repeatable Channel',
    shortLabel: '$100k ARR Scale Engine',
    milestoneIds: [
      'ms-first-10k-arr',
      'ms-10-enterprise-pilots',
      'ms-3-conversions',
      'ms-retention-cohort',
      'ms-100k-arr',
      'ms-50-customers',
      'ms-repeatable-playbook',
      'ms-cac-payback',
    ],
    description: 'Establish predictable acquisition channels, achieve 6-month CAC payback, and cross the six-figure ARR barrier.',
    targetHorizon: 'Next 6-12 Months',
  },
  {
    id: 'goal-default-alive',
    label: 'Independence Goal: Default Alive Breakeven',
    shortLabel: 'Default Alive & Infinite Runway',
    milestoneIds: [
      'ms-100k-arr',
      'ms-50-customers',
      'ms-repeatable-playbook',
      'ms-default-alive',
      'ms-100-customers',
      'ms-net-negative-churn',
      'ms-capital-runway',
    ],
    description: 'Cover operating expenses with recurring revenue to eliminate existential survival risk.',
    targetHorizon: 'Next 12-18 Months',
  },
];

export const MilestoneProgressTrackerWidget: React.FC<Props> = ({
  myCompany,
  onUpdateMyCompany,
}) => {
  // Use saved milestones or fallback to foundational milestones
  const milestones: MilestoneProgressItem[] = useMemo(() => {
    if (myCompany.trackedMilestones && myCompany.trackedMilestones.length > 0) {
      return myCompany.trackedMilestones;
    }
    return DEFAULT_FOUNDATIONAL_MILESTONES;
  }, [myCompany.trackedMilestones]);

  // Current active growth goal
  const [selectedGoalId, setSelectedGoalId] = useState<string>(
    myCompany.currentGoalId || 'goal-pilots'
  );

  // Filters
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [phaseFilter, setPhaseFilter] = useState<string>('all');

  // Custom milestone modal/creator state
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customDesc, setCustomDesc] = useState('');
  const [customTarget, setCustomTarget] = useState('');
  const [customCategory, setCustomCategory] = useState<MilestoneProgressItem['category']>('revenue');
  const [customPhase, setCustomPhase] = useState<MilestoneProgressItem['phaseId']>('phase-2');

  const activeGoal = useMemo(() => {
    return GROWTH_GOALS.find((g) => g.id === selectedGoalId) || GROWTH_GOALS[0];
  }, [selectedGoalId]);

  // Calculations
  const totalCount = milestones.length;
  const completedCount = milestones.filter((m) => m.completed).length;
  const overallPercentage = Math.round((completedCount / Math.max(1, totalCount)) * 100);

  // Goal-specific calculations
  const goalMilestones = useMemo(() => {
    return milestones.filter((m) => activeGoal.milestoneIds.includes(m.id));
  }, [milestones, activeGoal]);

  const goalCompletedCount = goalMilestones.filter((m) => m.completed).length;
  const goalPercentage = Math.round(
    (goalCompletedCount / Math.max(1, goalMilestones.length)) * 100
  );

  // Filtered milestone list
  const filteredMilestones = useMemo(() => {
    return milestones.filter((m) => {
      if (categoryFilter !== 'all' && m.category !== categoryFilter) return false;
      if (phaseFilter !== 'all' && m.phaseId !== phaseFilter) return false;
      return true;
    });
  }, [milestones, categoryFilter, phaseFilter]);

  // Toggle milestone completion
  const handleToggleMilestone = (id: string) => {
    const updated = milestones.map((m) => {
      if (m.id === id) {
        const nextState = !m.completed;
        return {
          ...m,
          completed: nextState,
          completedAt: nextState ? new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : undefined,
        };
      }
      return m;
    });

    if (onUpdateMyCompany) {
      onUpdateMyCompany({ trackedMilestones: updated });
    }
  };

  const handleSelectGoal = (goalId: string) => {
    setSelectedGoalId(goalId);
    if (onUpdateMyCompany) {
      onUpdateMyCompany({ currentGoalId: goalId });
    }
  };

  const handleCreateCustomMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim()) return;

    const newMilestone: MilestoneProgressItem = {
      id: `custom-${Date.now()}`,
      title: customTitle.trim(),
      description: customDesc.trim() || 'Custom strategic milestone defined by founder.',
      targetMetric: customTarget.trim() || undefined,
      category: customCategory,
      phaseId: customPhase,
      completed: false,
    };

    const updated = [...milestones, newMilestone];
    if (onUpdateMyCompany) {
      onUpdateMyCompany({ trackedMilestones: updated });
    }

    setCustomTitle('');
    setCustomDesc('');
    setCustomTarget('');
    setShowAddModal(false);
  };

  // Find next upcoming milestone for guidance
  const nextUpMilestone = useMemo(() => {
    return goalMilestones.find((m) => !m.completed) || milestones.find((m) => !m.completed);
  }, [goalMilestones, milestones]);

  // Category Icon & Label mapping
  const categoryMeta: Record<string, { label: string; icon: any; color: string }> = {
    revenue: { label: 'Revenue & ARR', icon: DollarSign, color: 'text-emerald-500' },
    customers: { label: 'Customer Cohorts', icon: Users, color: 'text-indigo-500' },
    product_pilot: { label: 'Product & Pilots', icon: Zap, color: 'text-purple-500' },
    capital_efficiency: { label: 'Capital Efficiency', icon: ShieldCheck, color: 'text-amber-500' },
  };

  // SVG Gauge calculations
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (goalPercentage / 100) * circumference;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6 relative overflow-hidden backdrop-blur-md">
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-mono font-semibold bg-indigo-950 text-indigo-400 border border-indigo-800/60 mb-2">
            <Trophy className="w-3.5 h-3.5" />
            MILESTONE PROGRESS TRACKER &amp; GROWTH TARGETS
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            Key Startup Milestones vs. Growth Goal
          </h3>
          <p className="text-xs text-slate-400 max-w-2xl mt-1">
            Mark off foundational venture milestones (first $10k ARR, first 10 enterprise pilots, default alive breakeven) and track real-time completion toward your primary target.
          </p>
        </div>

        {/* Goal Selector Switcher */}
        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs self-start lg:self-auto">
          <span className="text-[11px] font-mono text-slate-500 px-1 hidden sm:inline">Active Target:</span>
          {GROWTH_GOALS.map((g) => (
            <button
              key={g.id}
              onClick={() => handleSelectGoal(g.id)}
              className={`px-2.5 py-1 rounded-lg font-semibold transition text-xs ${
                selectedGoalId === g.id
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {g.shortLabel}
            </button>
          ))}
        </div>
      </div>

      {/* Hero KPI Gauge & Target Card Row */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-slate-950/70 border border-slate-800 rounded-xl p-5">
        {/* Left: Circular Completion Gauge */}
        <div className="md:col-span-4 flex items-center gap-5 justify-center md:justify-start border-b md:border-b-0 md:border-r border-slate-800/80 pb-4 md:pb-0 md:pr-4">
          <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r={radius}
                className="stroke-slate-800"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="60"
                cy="60"
                r={radius}
                className="stroke-indigo-500 transition-all duration-700 ease-out"
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-bold font-mono text-white leading-none">
                {goalPercentage}%
              </span>
              <span className="text-[10px] font-mono text-indigo-400 font-semibold mt-0.5">
                GOAL TARGET
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
              Goal Completion
            </span>
            <div className="text-lg font-bold text-white">
              {goalCompletedCount} of {goalMilestones.length} Milestones
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-1.5 pt-0.5">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Overall Total: {completedCount}/{totalCount} ({overallPercentage}%)</span>
            </div>
          </div>
        </div>

        {/* Middle: Active Target Context */}
        <div className="md:col-span-5 space-y-1.5">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-indigo-400" />
            <h4 className="text-sm font-bold text-white">{activeGoal.label}</h4>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {activeGoal.description}
          </p>
          <div className="flex items-center gap-4 text-[11px] font-mono text-slate-400 pt-1">
            <span>Horizon: <strong className="text-indigo-300 font-sans">{activeGoal.targetHorizon}</strong></span>
            <span>•</span>
            <span>Remaining: <strong className="text-amber-300 font-sans">{goalMilestones.length - goalCompletedCount} key actions</strong></span>
          </div>
        </div>

        {/* Right: Next Recommended Milestone Unlock */}
        <div className="md:col-span-3 bg-slate-900/90 border border-slate-800 rounded-lg p-3 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase font-bold text-amber-400 flex items-center gap-1">
              <Flame className="w-3 h-3 text-amber-400" />
              Next Priority
            </span>
            <span className="text-[10px] font-mono text-slate-500">Unlocks Next Phase</span>
          </div>
          {nextUpMilestone ? (
            <div>
              <div className="text-xs font-bold text-white line-clamp-1">{nextUpMilestone.title}</div>
              <div className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">{nextUpMilestone.description}</div>
              <button
                onClick={() => handleToggleMilestone(nextUpMilestone.id)}
                className="mt-2 w-full py-1 px-2 rounded bg-indigo-950 hover:bg-indigo-900 border border-indigo-800 text-indigo-300 hover:text-white text-[11px] font-semibold transition flex items-center justify-center gap-1"
              >
                <CheckCircle2 className="w-3 h-3 text-indigo-400" />
                Mark as Achieved
              </button>
            </div>
          ) : (
            <div className="text-xs text-emerald-400 font-medium py-1">
              🎉 All milestones for this goal unlocked!
            </div>
          )}
        </div>
      </div>

      {/* Filter and Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-2.5 py-1 rounded-lg font-medium transition ${
              categoryFilter === 'all'
                ? 'bg-slate-800 text-white font-bold border border-slate-700'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Categories ({milestones.length})
          </button>
          {Object.entries(categoryMeta).map(([catKey, meta]) => {
            const Icon = meta.icon;
            const count = milestones.filter((m) => m.category === catKey).length;
            return (
              <button
                key={catKey}
                onClick={() => setCategoryFilter(catKey)}
                className={`px-2.5 py-1 rounded-lg font-medium transition flex items-center gap-1.5 ${
                  categoryFilter === catKey
                    ? 'bg-slate-800 text-white font-bold border border-slate-700'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${meta.color}`} />
                <span>{meta.label} ({count})</span>
              </button>
            );
          })}
        </div>

        {/* Add Custom Milestone Button */}
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 hover:text-white font-semibold transition border border-indigo-800/60 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 text-indigo-400" />
          <span>Add Custom Milestone</span>
        </button>
      </div>

      {/* Milestone Interactive Checklist Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredMilestones.map((ms) => {
          const isPartOfActiveGoal = activeGoal.milestoneIds.includes(ms.id);
          const CatIcon = categoryMeta[ms.category]?.icon || Target;

          return (
            <div
              key={ms.id}
              onClick={() => handleToggleMilestone(ms.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between select-none relative group ${
                ms.completed
                  ? 'bg-emerald-950/20 border-emerald-900/60 hover:border-emerald-800/80 shadow-sm'
                  : isPartOfActiveGoal
                  ? 'bg-slate-950/80 border-slate-800 hover:border-indigo-500/60 ring-1 ring-indigo-500/20 shadow'
                  : 'bg-slate-950/40 border-slate-800/60 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    {ms.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-500 group-hover:text-indigo-400 shrink-0 transition" />
                    )}
                    <h5
                      className={`text-xs font-bold leading-snug ${
                        ms.completed
                          ? 'text-emerald-300 line-through decoration-emerald-500/60'
                          : 'text-white'
                      }`}
                    >
                      {ms.title}
                    </h5>
                  </div>

                  {isPartOfActiveGoal && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-indigo-950 text-indigo-300 border border-indigo-800/60 shrink-0">
                      GOAL
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed mb-3 pl-7">
                  {ms.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[10px] font-mono pl-7">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <CatIcon className="w-3 h-3 text-slate-500" />
                  <span>{ms.targetMetric || ms.phaseId.replace('phase-', 'Phase ')}</span>
                </div>

                {ms.completed ? (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    ✓ {ms.completedAt || 'Achieved'}
                  </span>
                ) : (
                  <span className="text-slate-500 group-hover:text-slate-300 transition">
                    Click to complete
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Custom Milestone Creation Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-indigo-400" />
                Add Custom Startup Milestone
              </h4>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomMilestone} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Milestone Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., First $25k ARR or SOC2 Type II Certified"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="What validation criteria or proof proves this milestone is achieved?"
                  value={customDesc}
                  onChange={(e) => setCustomDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Category</label>
                  <select
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="revenue">Revenue & ARR</option>
                    <option value="customers">Customers & Cohorts</option>
                    <option value="product_pilot">Product & Pilots</option>
                    <option value="capital_efficiency">Capital Efficiency</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Target Metric</label>
                  <input
                    type="text"
                    placeholder="e.g., $25k ARR"
                    value={customTarget}
                    onChange={(e) => setCustomTarget(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition"
                >
                  Save Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
