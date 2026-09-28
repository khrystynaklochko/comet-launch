import React, { useState, useMemo } from 'react';
import { MyCompanyState, Experiment, CompanyProfile, CustomerMilestone } from '../types/intelligence';
import { SEED_COMPANIES } from '../data/seedCompanies';
import {
  Compass,
  Milestone,
  CheckCircle2,
  Clock,
  FlaskConical,
  Plus,
  ArrowRight,
  Sparkles,
  ChevronRight,
  Filter,
  Flame,
  Shield,
  Layers,
  Tag,
  AlertCircle,
  XCircle,
  HelpCircle,
  TrendingUp,
} from 'lucide-react';

interface Props {
  myCompany: MyCompanyState;
  onUpdateMyCompany?: (updated: Partial<MyCompanyState>) => void;
  onAddExperiment: (exp: Omit<Experiment, 'id' | 'status'>) => void;
  allCompanies?: CompanyProfile[];
}

interface MilestonePhase {
  phaseId: 'phase-1' | 'phase-2' | 'phase-3' | 'phase-4';
  title: string;
  customerTarget: number;
  customerRange: string;
  stageLabel: string;
  historicalPeriod: string;
  primaryChannel: string;
  salesMotion: string;
  pricingOffer: string;
  playbookTakeaway: string;
  recommendedExperiment: {
    title: string;
    hypothesis: string;
    targetIcp: string;
    channel: string;
    offer: string;
    volume: string;
    duration: string;
    successThreshold: string;
    stopCondition: string;
  };
}

export const StrategicRoadmapTimelineWidget: React.FC<Props> = ({
  myCompany,
  onUpdateMyCompany,
  onAddExperiment,
  allCompanies = SEED_COMPANIES,
}) => {
  // Selected Seed Company Benchmark
  const [selectedSeedId, setSelectedSeedId] = useState<string>('stripe');
  const [statusFilter, setStatusFilter] = useState<'all' | 'testing' | 'validated' | 'backlog'>('all');
  const [activeExpandedPhase, setActiveExpandedPhase] = useState<string | null>(null);

  // Find active seed company profile
  const seedCompany = useMemo(() => {
    return allCompanies.find((c) => c.id === selectedSeedId) || allCompanies[0] || SEED_COMPANIES[0];
  }, [allCompanies, selectedSeedId]);

  // Current customer count from user state
  const payingCustomers = myCompany.payingCustomers || 0;

  // Determine current active phase for user
  const currentPhaseIndex = useMemo(() => {
    if (payingCustomers === 0) return 0; // Phase 1 (0 to 1)
    if (payingCustomers < 10) return 1; // Phase 2 (1 to 10)
    if (payingCustomers < 100) return 2; // Phase 3 (10 to 100)
    return 3; // Phase 4 (100 to 1,000+)
  }, [payingCustomers]);

  // Build the 4 Milestone Phases based on selected seed company
  const milestonePhases: MilestonePhase[] = useMemo(() => {
    const ms = seedCompany.milestones || [];
    const m1 = ms.find((m) => m.customerCount === 1) || {
      period: 'Months 1-6',
      primaryChannel: seedCompany.distributionEngine.strongestInitialChannel,
      salesMotion: 'Direct founder-led alpha onboarding',
      pricing: 'At-cost or free beta pilot',
    };
    const m10 = ms.find((m) => m.customerCount === 10) || {
      period: 'Months 6-12',
      primaryChannel: 'High-touch founder network & community outreach',
      salesMotion: 'IRC / Shared Slack channel onboarding',
      pricing: 'Standard published pricing',
    };
    const m100 = ms.find((m) => m.customerCount === 100) || {
      period: 'Months 12-24',
      primaryChannel: seedCompany.distributionEngine.subsequentChannels[0] || 'Public Launch + WOM',
      salesMotion: 'Developer self-serve / standardized playbook',
      pricing: 'Published transparent tiers',
    };
    const m1000 = ms.find((m) => m.customerCount === 1000) || {
      period: 'Months 24-36',
      primaryChannel: seedCompany.distributionEngine.subsequentChannels[1] || 'Platform ecosystem & integrations',
      salesMotion: 'Bottom-up expansion + inside sales',
      pricing: 'Volume discounting & enterprise tiers',
    };

    // Seed-specific customized playbooks
    const seedId = seedCompany.id;

    return [
      {
        phaseId: 'phase-1',
        title: 'Validation Wedge',
        customerTarget: 1,
        customerRange: '0 to 1 Customer',
        stageLabel: 'Pre-MVP / First Customer',
        historicalPeriod: m1.period,
        primaryChannel: m1.primaryChannel,
        salesMotion: m1.salesMotion,
        pricingOffer: m1.pricing,
        playbookTakeaway:
          seedId === 'stripe'
            ? 'Patrick Collison manually installed the API code on the laptops of their first users (280 North and DailyBooth) to eliminate developer hesitation.'
            : seedId === 'linear'
            ? 'Onboarded 10 high-standard engineering design leads via personal alpha keys to perfect keyboard navigation ergonomics.'
            : seedId === 'supabase'
            ? 'Launched on Hacker News with open-source code and paired with early contributors on Discord.'
            : 'Conducted founder-led outbound to corporate finance leads, proving software ROI before building complex billing.',
        recommendedExperiment: {
          title: `Founder-Assisted Onboarding Live Sprint (${seedCompany.name} Playbook)`,
          hypothesis: 'Pairing live over Zoom to execute the initial setup command with the customer removes 90% of technical inertia.',
          targetIcp: 'Next 3 inbound or outbound developer prospects',
          channel: 'Direct scheduled 30-min onboarding pairing session',
          offer: 'Guaranteed 15-minute implementation with founder on screen',
          volume: '3 prospects',
          duration: '7 days',
          successThreshold: '>= 2 prospects fully deployed within 48 hours',
          stopCondition: '< 1 prospect agrees to live pairing session',
        },
      },
      {
        phaseId: 'phase-2',
        title: 'Repeatable Onboarding & Value Proof',
        customerTarget: 10,
        customerRange: '1 to 10 Customers',
        stageLabel: 'Early Pilots (< $20k ARR)',
        historicalPeriod: m10.period,
        primaryChannel: m10.primaryChannel,
        salesMotion: m10.salesMotion,
        pricingOffer: m10.pricing,
        playbookTakeaway:
          seedId === 'stripe'
            ? 'Eliminated manual pilot drag by embedding clear 2.9% + 30¢ flat pricing and providing real-time IRC support.'
            : seedId === 'linear'
            ? 'Created shared Slack channels with every pilot team; fixed reported bugs within 2 hours to earn unshakeable trust.'
            : seedId === 'supabase'
            ? 'Monitored database creations manually and emailed founders personalized tips when query performance lagged.'
            : 'Enforced upfront annual commitments by quantifying exact SaaS spend waste eliminated during audit calls.',
        recommendedExperiment: {
          title: '14-Day Pilot Mutual Action Plan (MAP) with Upfront Commitment',
          hypothesis: 'Requiring an upfront signed MAP with defined success criteria and credit card on file doubles pilot-to-paid conversion.',
          targetIcp: 'Active pilot prospects evaluating the product',
          channel: 'Founder onboarding call & shared Slack channel',
          offer: '14-day capped trial with automated conversion to annual plan unless canceled',
          volume: '4 pilot accounts',
          duration: '14 days',
          successThreshold: '>= 3 accounts successfully convert to paid tier',
          stopCondition: 'If 3 prospects refuse credit card upfront, refine collateral',
        },
      },
      {
        phaseId: 'phase-3',
        title: 'Scalable Channel & Product Gravity',
        customerTarget: 100,
        customerRange: '10 to 100 Customers',
        stageLabel: '5-20 Customers ($20k-$100k ARR)',
        historicalPeriod: m100.period,
        primaryChannel: m100.primaryChannel,
        salesMotion: m100.salesMotion,
        pricingOffer: m100.pricing,
        playbookTakeaway:
          seedId === 'stripe'
            ? 'Launched interactive API documentation with copy-paste code snippets; word-of-mouth spread across Hacker News.'
            : seedId === 'linear'
            ? 'Published "The Linear Method" manifesto, establishing their point of view and driving viral organic signups without ad spend.'
            : seedId === 'supabase'
            ? 'Instituted quarterly "Launch Weeks" to release 5 major features in 5 days, dominating tech Twitter mindshare.'
            : 'Standardized outbound email sequences for CFOs with automated vendor contract analysis tools.',
        recommendedExperiment: {
          title: 'Technical Manifesto & High-Value Architecture Teardown',
          hypothesis: 'Publishing an in-depth technical teardown of legacy modernization traps will drive high-intent inbound developer leads at zero CAC.',
          targetIcp: 'VPs of Engineering and Lead Architects on Hacker News & LinkedIn',
          channel: 'Engineering blog manifesto & technical communities',
          offer: 'Free architectural benchmark tool with instant report',
          volume: '2,500 readers / 25 demo requests',
          duration: '21 days',
          successThreshold: '>= 10 qualified pilot discovery calls booked',
          stopCondition: '< 300 page views after 5 days of distribution',
        },
      },
      {
        phaseId: 'phase-4',
        title: 'Ecosystem & Expansion Flywheels',
        customerTarget: 1000,
        customerRange: '100 to 1,000+ Customers',
        stageLabel: '20-100+ Scale Stage ($100k+ ARR)',
        historicalPeriod: m1000.period,
        primaryChannel: m1000.primaryChannel,
        salesMotion: m1000.salesMotion,
        pricingOffer: m1000.pricing,
        playbookTakeaway:
          seedId === 'stripe'
            ? 'Introduced Stripe Connect to power marketplaces (Lyft, Shopify), letting platforms bring thousands of sub-merchants.'
            : seedId === 'linear'
            ? 'Expanded from engineering teams into product managers and designers, compounding seat count with >140% NRR.'
            : seedId === 'supabase'
            ? 'Rolled out enterprise compute clusters, SOC2 compliance, and dedicated support packages for high-growth tech firms.'
            : 'Integrated natively into NetSuite, QuickBooks, and Sage, turning accounting software into automated distribution channels.',
        recommendedExperiment: {
          title: 'Native CI/CD Integration & Marketplace Partner Listing',
          hypothesis: 'Listing a verified GitHub Action and IDE plugin generates automated daily organic trial activations from developers.',
          targetIcp: 'Engineering teams with active GitHub Actions pipelines',
          channel: 'GitHub Marketplace & VS Code Extension Store',
          offer: 'One-click automated scan of legacy codebase dependencies',
          volume: '100 marketplace installs',
          duration: '30 days',
          successThreshold: '>= 15 teams actively running weekly scans',
          stopCondition: '< 10 installs after 14 days',
        },
      },
    ];
  }, [seedCompany]);

  // Map experiments to phases
  // If an experiment has an explicit milestoneTarget, map it; otherwise assign based on index/status
  const experimentsByPhase = useMemo(() => {
    const map: Record<string, Experiment[]> = {
      'phase-1': [],
      'phase-2': [],
      'phase-3': [],
      'phase-4': [],
    };

    const exps = myCompany.experiments || [];

    exps.forEach((exp, idx) => {
      // Filter by status if selected
      if (statusFilter !== 'all' && exp.status !== statusFilter) {
        return;
      }

      if (exp.milestoneTarget) {
        if (exp.milestoneTarget <= 1) map['phase-1'].push(exp);
        else if (exp.milestoneTarget <= 10) map['phase-2'].push(exp);
        else if (exp.milestoneTarget <= 100) map['phase-3'].push(exp);
        else map['phase-4'].push(exp);
      } else {
        // Fallback intelligent distribution
        if (idx === 0) map['phase-2'].push(exp);
        else if (idx === 1) map['phase-1'].push(exp);
        else if (idx % 2 === 0) map['phase-3'].push(exp);
        else map['phase-2'].push(exp);
      }
    });

    return map;
  }, [myCompany.experiments, statusFilter]);

  // Handler to update an experiment's milestone phase or status
  const handleUpdateExperimentStatus = (expId: string, newStatus: Experiment['status']) => {
    if (!onUpdateMyCompany) return;
    const updated = (myCompany.experiments || []).map((exp) =>
      exp.id === expId ? { ...exp, status: newStatus } : exp
    );
    onUpdateMyCompany({ experiments: updated });
  };

  const handleMoveExperimentPhase = (expId: string, targetMilestone: number) => {
    if (!onUpdateMyCompany) return;
    const updated = (myCompany.experiments || []).map((exp) =>
      exp.id === expId ? { ...exp, milestoneTarget: targetMilestone } : exp
    );
    onUpdateMyCompany({ experiments: updated });
  };

  const handleAddPlaybookExperiment = (phase: MilestonePhase) => {
    onAddExperiment({
      ...phase.recommendedExperiment,
      milestoneTarget: phase.customerTarget,
    });
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6 relative overflow-hidden backdrop-blur-md">
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-mono font-semibold bg-blue-950 text-blue-400 border border-blue-800/60 mb-2">
            <Milestone className="w-3.5 h-3.5" />
            STRATEGIC ROADMAP &amp; EXPERIMENT TIMELINE
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            Historical Growth Milestones vs. Active Experiments
          </h3>
          <p className="text-xs text-slate-400 max-w-2xl mt-1">
            Maps your Experiment Board against verified seed growth phases ({seedCompany.name}'s 0 to 1, 1 to 10, 10 to 100, and 100 to 1,000 customer eras).
          </p>
        </div>

        {/* Seed Company Selector Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs">
          <span className="text-[11px] font-mono text-slate-500 px-1 hidden sm:inline">Benchmark:</span>
          {allCompanies.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedSeedId(c.id)}
              className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                selectedSeedId === c.id
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Status Filter Bar & Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-medium flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-blue-400" />
            Filter Experiments:
          </span>
          <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-[11px] font-mono">
            {(['all', 'testing', 'validated', 'backlog'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2 py-0.5 rounded capitalize transition ${
                  statusFilter === st ? 'bg-slate-800 text-white font-bold' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 text-slate-400 text-xs font-mono">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            Current Focus: <strong className="text-white">Phase {currentPhaseIndex + 1} ({milestonePhases[currentPhaseIndex]?.customerRange})</strong>
          </span>
          <span>•</span>
          <span>{myCompany.experiments?.length || 0} Total Experiments</span>
        </div>
      </div>

      {/* Timeline Roadmap Horizontal Step Track */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {milestonePhases.map((phase, idx) => {
          const isCurrentPhase = idx === currentPhaseIndex;
          const isCompletedPhase = idx < currentPhaseIndex;
          const phaseExperiments = experimentsByPhase[phase.phaseId] || [];
          const validatedCount = phaseExperiments.filter((e) => e.status === 'validated').length;
          const readinessPct = phaseExperiments.length > 0 ? Math.round((validatedCount / phaseExperiments.length) * 100) : 0;

          return (
            <div
              key={phase.phaseId}
              className={`rounded-xl border transition flex flex-col justify-between p-4 relative ${
                isCurrentPhase
                  ? 'bg-slate-900/95 border-blue-500/80 ring-1 ring-blue-500/30 shadow-lg shadow-blue-500/5'
                  : isCompletedPhase
                  ? 'bg-slate-950/80 border-emerald-900/50'
                  : 'bg-slate-950/60 border-slate-800/80'
              }`}
            >
              {/* Active Stage Indicator Badge */}
              {isCurrentPhase && (
                <div className="absolute -top-2.5 left-4 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-600 text-white shadow-md flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                  YOU ARE HERE
                </div>
              )}

              {/* Phase Header */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-400 font-semibold uppercase">
                    Phase {idx + 1} • {phase.customerRange}
                  </span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                      isCompletedPhase
                        ? 'text-emerald-400 border-emerald-800 bg-emerald-950/50'
                        : isCurrentPhase
                        ? 'text-blue-400 border-blue-800 bg-blue-950/50'
                        : 'text-slate-500 border-slate-800 bg-slate-900'
                    }`}
                  >
                    Target: #{phase.customerTarget}
                  </span>
                </div>

                <h4 className="text-base font-bold text-white tracking-tight">
                  {phase.title}
                </h4>

                <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800/60">
                  <span>{seedCompany.name} Era:</span>
                  <span className="text-slate-300 font-semibold">{phase.historicalPeriod}</span>
                </div>

                {/* Seed Company Historical Strategy Card */}
                <div className="bg-slate-950/90 rounded-lg p-2.5 border border-slate-800/80 space-y-1.5 text-xs">
                  <div className="text-[10px] font-mono text-blue-400 font-semibold uppercase flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    {seedCompany.name} Playbook
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {phase.playbookTakeaway}
                  </p>
                  <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-900 font-mono space-y-0.5">
                    <div>Channel: <strong className="text-slate-300 font-sans">{phase.primaryChannel}</strong></div>
                    <div>Motion: <strong className="text-slate-300 font-sans">{phase.salesMotion}</strong></div>
                  </div>
                </div>

                {/* Experiments Section Header */}
                <div className="pt-2">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-slate-300 flex items-center gap-1">
                      <FlaskConical className="w-3.5 h-3.5 text-blue-400" />
                      Experiments ({phaseExperiments.length})
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">
                      {validatedCount}/{phaseExperiments.length} Validated
                    </span>
                  </div>

                  {/* Readiness Progress Bar */}
                  <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden mb-2">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all"
                      style={{ width: `${readinessPct}%` }}
                    ></div>
                  </div>

                  {/* Experiment Cards Stack */}
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {phaseExperiments.length === 0 ? (
                      <div className="p-3 rounded-lg border border-dashed border-slate-800 text-center text-[11px] text-slate-500">
                        No active experiments mapped to this milestone yet.
                      </div>
                    ) : (
                      phaseExperiments.map((exp) => (
                        <div
                          key={exp.id}
                          className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800 hover:border-slate-700 transition space-y-1.5"
                        >
                          <div className="flex items-start justify-between gap-1.5">
                            <span className="font-semibold text-xs text-white leading-snug line-clamp-2">
                              {exp.title}
                            </span>
                            <span
                              className={`px-1.5 py-0.5 rounded text-[9px] font-mono uppercase font-bold shrink-0 ${
                                exp.status === 'validated'
                                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                  : exp.status === 'testing'
                                  ? 'bg-amber-950 text-amber-300 border border-amber-800'
                                  : exp.status === 'killed'
                                  ? 'bg-red-950 text-red-300 border border-red-800'
                                  : 'bg-slate-800 text-slate-300 border border-slate-700'
                              }`}
                            >
                              {exp.status}
                            </span>
                          </div>

                          <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                            {exp.hypothesis}
                          </p>

                          <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[10px] text-slate-500">
                            <span className="truncate max-w-[120px]">{exp.channel}</span>

                            {/* Status quick toggle */}
                            <div className="flex items-center gap-1 font-mono">
                              {exp.status !== 'validated' && (
                                <button
                                  onClick={() => handleUpdateExperimentStatus(exp.id, 'validated')}
                                  title="Mark as Validated"
                                  className="text-emerald-400 hover:text-emerald-300 transition"
                                >
                                  ✓
                                </button>
                              )}
                              {exp.status !== 'testing' && (
                                <button
                                  onClick={() => handleUpdateExperimentStatus(exp.id, 'testing')}
                                  title="Mark as In Testing"
                                  className="text-amber-400 hover:text-amber-300 transition"
                                >
                                  ▶
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Add Benchmark Experiment Button */}
              <div className="pt-3 mt-3 border-t border-slate-800">
                <button
                  onClick={() => handleAddPlaybookExperiment(phase)}
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-blue-950/60 hover:bg-blue-900/60 text-blue-300 hover:text-white text-xs font-semibold border border-blue-800/50 transition shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5 text-blue-400" />
                  Add {seedCompany.name} Playbook
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Strategic Synthesis Callout */}
      <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-blue-950 border border-blue-800/60 text-blue-400 shrink-0 mt-0.5">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h5 className="text-sm font-bold text-white flex items-center gap-2">
              Timeline Execution Law ({seedCompany.name} Precedent)
            </h5>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Never execute Phase 3 distribution experiments (such as paid ads, self-serve automated onboarding, or broad content marketing) before having <strong>at least 1 validated onboarding experiment in Phase 2</strong>. Running top-of-funnel experiments before pilot conversion is solved burns runway on leaky buckets.
            </p>
          </div>
        </div>

        <div className="text-right shrink-0">
          <span className="text-[11px] font-mono text-slate-400 block">Current Milestone Target:</span>
          <span className="text-base font-bold text-white font-mono">
            Customer #{milestonePhases[currentPhaseIndex]?.customerTarget} ({milestonePhases[currentPhaseIndex]?.customerRange})
          </span>
        </div>
      </div>
    </div>
  );
};
