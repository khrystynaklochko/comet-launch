import React, { useState, useMemo } from 'react';
import { MyCompanyState, RiskMitigationAction, Experiment } from '../types/intelligence';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Circle,
  TrendingDown,
  ArrowRight,
  Flame,
  Plus,
  Filter,
  Layers,
  Sparkles,
  Zap,
  Calendar,
  Compass,
  X,
  FileCheck,
  FlaskConical,
} from 'lucide-react';

interface Props {
  myCompany: MyCompanyState;
  onUpdateMyCompany?: (updated: Partial<MyCompanyState>) => void;
  onAddExperiment?: (exp: Omit<Experiment, 'id' | 'status'>) => void;
}

const DEFAULT_RISK_MITIGATIONS: RiskMitigationAction[] = [
  // 1. Pilot Drag & Evaluation Purgatory
  {
    id: 'mit-map-agreement',
    riskCategory: 'pilot_drag',
    title: 'Contractual Mutual Action Plan (MAP) with Economic Buyer',
    description:
      'Require the prospect economic buyer to sign off on a 2-page Mutual Action Plan with a scheduled go/no-go commercial review date before software setup.',
    impactScoreReduction: 9,
    difficulty: 'medium',
    estimatedDays: '3 days',
    deliverable: 'Signed MAP document with locked SLA metrics',
    precedentCompany: 'Datadog & Snowflake Enterprise Motion',
    completed: false,
  },
  {
    id: 'mit-timebound-pilot',
    riskCategory: 'pilot_drag',
    title: 'Hard 21-Day Pilot Expiration with Executive Check-In',
    description:
      'Configure automated 14-day and 20-day in-app trial expiration notices to eliminate infinite free evaluation limbo.',
    impactScoreReduction: 8,
    difficulty: 'low',
    estimatedDays: '1 day',
    deliverable: 'Timebound sandbox provisioning with auto-expiry',
    precedentCompany: 'Linear & Retool Onboarding Cadence',
    completed: false,
  },
  {
    id: 'mit-pilot-acceptance-criteria',
    riskCategory: 'pilot_drag',
    title: 'Define Exactly 3 Quantifiable Technical Success Metrics',
    description:
      'Anchor the pilot scope to 3 measurable outcomes (e.g. "Cut sync latency by 50%", "Ingest first 10,000 events successfully") rather than subjective feeling.',
    impactScoreReduction: 7,
    difficulty: 'low',
    estimatedDays: '2 days',
    deliverable: '1-page written Acceptance Criteria SLA',
    precedentCompany: 'Segment & Twilio Integration Scope',
    completed: false,
  },

  // 2. Outbound Fatigue & Spam Filtering
  {
    id: 'mit-loom-teardowns',
    riskCategory: 'outbound_fatigue',
    title: 'Switch Automated Text Drips to 45-Sec Tailored Video Audits',
    description:
      'Replace automated 5-step drip sequences with custom screen-record teardowns showing the prospect’s actual broken workflow.',
    impactScoreReduction: 9,
    difficulty: 'medium',
    estimatedDays: '4 days',
    deliverable: '20 personalized video audits sent to Tier-1 accounts',
    precedentCompany: 'Stripe Early Collison Installation Playbook',
    completed: false,
  },
  {
    id: 'mit-domain-hardening',
    riskCategory: 'outbound_fatigue',
    title: 'Secondary Domain Hardening (SPF, DKIM, DMARC Setup)',
    description:
      'Isolate corporate primary domain and warm up secondary outbound domains (max 30 emails/day) to prevent domain-wide spam blacklisting.',
    impactScoreReduction: 6,
    difficulty: 'low',
    estimatedDays: '2 days',
    deliverable: '100% Google Postmaster deliverability score on outbound inbox',
    precedentCompany: 'Ramp B2B Outbound Infrastructure',
    completed: false,
  },
  {
    id: 'mit-event-triggers',
    riskCategory: 'outbound_fatigue',
    title: 'Event-Triggered Intent Scraping (Job Postings & Tech Stack Changes)',
    description:
      'Only reach out when prospect companies post relevant job listings (e.g. hiring Data Engineers) or deploy conflicting legacy tech.',
    impactScoreReduction: 7,
    difficulty: 'medium',
    estimatedDays: '5 days',
    deliverable: 'Automated webhook alert for high-intent hiring triggers',
    precedentCompany: 'Gong Signal-Based Selling',
    completed: false,
  },

  // 3. Premature Paid Ad Burn
  {
    id: 'mit-cap-ad-spend',
    riskCategory: 'premature_ad_burn',
    title: 'Cap Paid Ads at $0 Until 5 Repeatable Organic Deals Close',
    description:
      'Halt all Google and LinkedIn paid ads to protect cash runway until founders can consistently convert organic discovery calls.',
    impactScoreReduction: 10,
    difficulty: 'low',
    estimatedDays: '1 day',
    deliverable: 'Paused ad campaigns; preserved runway',
    precedentCompany: 'Linear Zero-Paid Ad Philosophy',
    completed: false,
  },
  {
    id: 'mit-reallocate-content',
    riskCategory: 'premature_ad_burn',
    title: 'Reallocate Budget into Technical Benchmarks & Architecture Teardowns',
    description:
      'Redirect paid search budget into deep-dive engineering whitepapers and open-source benchmark repositories that drive compounding organic traffic.',
    impactScoreReduction: 7,
    difficulty: 'medium',
    estimatedDays: '7 days',
    deliverable: '1 canonical technical teardown published on Hacker News',
    precedentCompany: 'Supabase & PostHog Organic Pull',
    completed: false,
  },

  // 4. Long Sales Cycles & Procurement Traps
  {
    id: 'mit-under-card-limit',
    riskCategory: 'long_sales_cycle',
    title: 'Package a "Land Wedge" under Credit Card Discretionary Limits (<$5,000/yr)',
    description:
      'Create an entry-level tier that managers can expense directly on corporate credit cards without entering 90-day RFP or legal procurement review.',
    impactScoreReduction: 8,
    difficulty: 'low',
    estimatedDays: '2 days',
    deliverable: 'Self-serve Stripe checkout link for departmental land tier',
    precedentCompany: 'Slack & Atlassian Land-and-Expand Playbook',
    completed: false,
  },
  {
    id: 'mit-security-faq-packet',
    riskCategory: 'long_sales_cycle',
    title: 'Pre-Emptive Security & Architecture Self-Serve Dossier',
    description:
      'Publish standard SOC2 Type II, GDPR, data flow diagrams, and encryption specs in a self-serve portal to bypass 4-week infosec evaluation delays.',
    impactScoreReduction: 7,
    difficulty: 'medium',
    estimatedDays: '3 days',
    deliverable: 'Public or gated /security trust portal page',
    precedentCompany: 'Vanta & Notion Trust Center',
    completed: false,
  },

  // 5. Single-Channel Dependency
  {
    id: 'mit-plg-second-engine',
    riskCategory: 'single_channel_dependency',
    title: 'Launch an Ecosystem Extension or Integration Marketplace Listing',
    description:
      'Build a lightweight integration for GitHub, Slack, or Chrome Store to tap into pre-existing developer workflows and organic marketplace search.',
    impactScoreReduction: 8,
    difficulty: 'high',
    estimatedDays: '10 days',
    deliverable: 'Verified listing on major ecosystem marketplace',
    precedentCompany: 'Zapier & Snyk Ecosystem Wedges',
    completed: false,
  },
  {
    id: 'mit-power-user-referrals',
    riskCategory: 'single_channel_dependency',
    title: 'Customer Referral Loop with Immediate In-Product Reward',
    description:
      'Incentivize existing pilot champions to introduce peers across sibling departments in exchange for premium feature credits or dedicated SLA support.',
    impactScoreReduction: 6,
    difficulty: 'low',
    estimatedDays: '3 days',
    deliverable: 'Active in-app milestone referral trigger',
    precedentCompany: 'Dropbox & Figma Peer Expansion Loops',
    completed: false,
  },
];

export const ActionableRiskMitigationWidget: React.FC<Props> = ({
  myCompany,
  onUpdateMyCompany,
  onAddExperiment,
}) => {
  // Saved completed step IDs
  const completedIds = useMemo(() => {
    return new Set(myCompany.completedRiskMitigationSteps || []);
  }, [myCompany.completedRiskMitigationSteps]);

  // Combine default with any custom mitigations
  const allActions: RiskMitigationAction[] = useMemo(() => {
    const custom = myCompany.customRiskMitigations || [];
    const base = DEFAULT_RISK_MITIGATIONS.map((act) => ({
      ...act,
      completed: completedIds.has(act.id),
      completedAt: completedIds.has(act.id) ? 'Mitigated' : undefined,
    }));
    const customWithCompleted = custom.map((act) => ({
      ...act,
      completed: completedIds.has(act.id),
      completedAt: completedIds.has(act.id) ? 'Mitigated' : undefined,
    }));
    return [...base, ...customWithCompleted];
  }, [completedIds, myCompany.customRiskMitigations]);

  // Filters
  const [selectedRiskCategory, setSelectedRiskCategory] = useState<string>('all');
  const [showAddCustomModal, setShowAddCustomModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Custom step form
  const [customTitle, setCustomTitle] = useState('');
  const [customDesc, setCustomDesc] = useState('');
  const [customDeliverable, setCustomDeliverable] = useState('');
  const [customCategory, setCustomCategory] = useState<RiskMitigationAction['riskCategory']>('pilot_drag');
  const [customImpact, setCustomImpact] = useState<number>(8);

  // Compute Initial Baseline Risk Score (0-100) based on stage, paying customers, and bottleneck
  const baselineRiskScore = useMemo(() => {
    let score = 78;
    const paying = myCompany.payingCustomers || 0;
    const bottleneck = (myCompany.bottleneck || '').toLowerCase();

    if (paying >= 20) score -= 25;
    else if (paying >= 5) score -= 12;

    if (bottleneck.includes('pilot') || bottleneck.includes('convert')) score += 10;
    if (bottleneck.includes('reply') || bottleneck.includes('outbound')) score += 8;
    if (bottleneck.includes('burn') || bottleneck.includes('cac')) score += 12;

    return Math.min(95, Math.max(50, score));
  }, [myCompany.payingCustomers, myCompany.bottleneck]);

  // Calculate points reduced from completed steps
  const totalPointsReduced = useMemo(() => {
    return allActions
      .filter((a) => a.completed)
      .reduce((sum, a) => sum + a.impactScoreReduction, 0);
  }, [allActions]);

  // Current Residual Risk Score
  const currentRiskScore = Math.max(15, baselineRiskScore - totalPointsReduced);

  // Risk Rating Tier
  const riskTier = useMemo(() => {
    if (currentRiskScore >= 68) return { label: 'CRITICAL EXPOSURE', color: 'text-red-400', bg: 'bg-red-950/60 border-red-800' };
    if (currentRiskScore >= 42) return { label: 'MODERATE RISK', color: 'text-amber-400', bg: 'bg-amber-950/60 border-amber-800' };
    return { label: 'HIGHLY DEFENDED', color: 'text-emerald-400', bg: 'bg-emerald-950/60 border-emerald-800' };
  }, [currentRiskScore]);

  // Filtered action list
  const filteredActions = useMemo(() => {
    return allActions.filter((act) => {
      if (selectedRiskCategory !== 'all' && act.riskCategory !== selectedRiskCategory) {
        return false;
      }
      return true;
    });
  }, [allActions, selectedRiskCategory]);

  const completedCount = allActions.filter((a) => a.completed).length;
  const completionPercentage = Math.round((completedCount / Math.max(1, allActions.length)) * 100);

  // Toggle step completion
  const handleToggleStep = (stepId: string) => {
    const isNowCompleted = !completedIds.has(stepId);
    const newCompletedSet = new Set(completedIds);

    if (isNowCompleted) {
      newCompletedSet.add(stepId);
      const action = allActions.find((a) => a.id === stepId);
      showToast(`✓ Step Completed: -${action?.impactScoreReduction || 8} pts GTM Risk!`);
    } else {
      newCompletedSet.delete(stepId);
    }

    if (onUpdateMyCompany) {
      onUpdateMyCompany({
        completedRiskMitigationSteps: Array.from(newCompletedSet),
      });
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Convert step to Experiment on the Experiment Board
  const handleLaunchAsExperiment = (action: RiskMitigationAction) => {
    if (!onAddExperiment) return;

    onAddExperiment({
      title: `Risk Mitigation: ${action.title}`,
      hypothesis: `If we execute "${action.title}", we will mitigate acute GTM risk because ${action.description.toLowerCase()}`,
      targetIcp: 'Active commercial pipeline / targeted accounts',
      channel: action.riskCategory.replace('_', ' ').toUpperCase(),
      offer: action.deliverable,
      volume: '10 accounts',
      duration: action.estimatedDays || '2 weeks',
      successThreshold: `Deliverable completed: ${action.deliverable}`,
      stopCondition: 'Zero progress after 5 days',
    });

    showToast(`✓ Created Experiment for "${action.title}"!`);
  };

  // Create custom mitigation
  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim()) return;

    const newAction: RiskMitigationAction = {
      id: `custom-mit-${Date.now()}`,
      title: customTitle.trim(),
      description: customDesc.trim() || 'Custom operational risk mitigation action.',
      impactScoreReduction: customImpact,
      difficulty: 'medium',
      estimatedDays: '3 days',
      deliverable: customDeliverable.trim() || 'Custom mitigation deliverable verified',
      precedentCompany: 'Founder Direct Execution',
      riskCategory: customCategory,
      completed: false,
    };

    const currentCustom = myCompany.customRiskMitigations || [];
    if (onUpdateMyCompany) {
      onUpdateMyCompany({
        customRiskMitigations: [...currentCustom, newAction],
      });
    }

    setCustomTitle('');
    setCustomDesc('');
    setCustomDeliverable('');
    setShowAddCustomModal(false);
    showToast(`✓ Added custom mitigation step "${newAction.title}"`);
  };

  // Category mapping
  const riskCategories = [
    { id: 'all', label: 'All Identified Risks' },
    { id: 'pilot_drag', label: 'Pilot Drag & Conversion' },
    { id: 'outbound_fatigue', label: 'Outbound & Deliverability' },
    { id: 'premature_ad_burn', label: 'Premature Ad Burn' },
    { id: 'long_sales_cycle', label: 'Long Sales Cycles' },
    { id: 'single_channel_dependency', label: 'Channel Dependency' },
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6 relative overflow-hidden backdrop-blur-md">
      <div className="absolute top-0 right-0 w-80 h-80 bg-red-500/5 rounded-full blur-3xl pointer-events-none"></div>

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
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-mono font-semibold bg-red-950 text-red-400 border border-red-800/60 mb-2">
            <ShieldAlert className="w-3.5 h-3.5" />
            ACTIONABLE GTM RISK MITIGATION
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            Step-by-Step Risk Mitigation Checklist
          </h3>
          <p className="text-xs text-slate-400 max-w-2xl mt-1">
            Execute tactical de-risking actions based on your identified GTM bottlenecks. Mark steps as completed to measurably reduce your startup’s GTM risk score in real-time.
          </p>
        </div>

        {/* Add Custom Button */}
        <button
          onClick={() => setShowAddCustomModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 hover:text-white font-semibold text-xs border border-indigo-800/60 transition self-start lg:self-auto cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 text-indigo-400" />
          <span>Add Custom De-Risking Step</span>
        </button>
      </div>

      {/* Dynamic Risk Score Gauge & Status Banner */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center bg-slate-950/80 border border-slate-800 rounded-xl p-5">
        {/* Risk Score Visual */}
        <div className="md:col-span-4 flex items-center gap-4 justify-center md:justify-start border-b md:border-b-0 md:border-r border-slate-800/80 pb-4 md:pb-0 md:pr-4">
          <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
            {/* Circular Progress Ring */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                className="stroke-slate-800"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                className={`transition-all duration-700 ease-out ${
                  currentRiskScore >= 68
                    ? 'stroke-red-500'
                    : currentRiskScore >= 42
                    ? 'stroke-amber-500'
                    : 'stroke-emerald-500'
                }`}
                strokeWidth="8"
                strokeDasharray={251.2}
                strokeDashoffset={251.2 - (currentRiskScore / 100) * 251.2}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-xl font-bold font-mono text-white leading-none">
                {currentRiskScore}
              </span>
              <span className="text-[9px] font-mono text-slate-400 font-semibold mt-0.5">
                RISK PTS
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
              Residual GTM Risk
            </span>
            <div className={`text-xs font-bold font-mono px-2 py-0.5 rounded border inline-block ${riskTier.bg} ${riskTier.color}`}>
              {riskTier.label}
            </div>
            <div className="text-[11px] text-emerald-400 font-mono font-semibold pt-0.5 flex items-center gap-1">
              <TrendingDown className="w-3.5 h-3.5" />
              <span>-{totalPointsReduced} pts mitigated</span>
            </div>
          </div>
        </div>

        {/* Progress Bar & Next Priority Action */}
        <div className="md:col-span-8 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold text-white">Mitigation Checklist Execution</span>
              <p className="text-[11px] text-slate-400">
                {completedCount} of {allActions.length} de-risking actions completed ({completionPercentage}%)
              </p>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              Baseline Risk: <strong className="text-slate-200">{baselineRiskScore} pts</strong>
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>

          {/* Context tip */}
          <div className="flex items-center gap-2 text-[11px] text-slate-300 bg-slate-900/60 p-2 rounded-lg border border-slate-800/80">
            <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>
              <strong>Operational Rule:</strong> Converting unstructured pilots to Mutual Action Plans cuts enterprise sales cycle drag by up to 50%.
            </span>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-1.5 pb-1 border-b border-slate-800 text-xs">
        <Filter className="w-3.5 h-3.5 text-slate-500 mr-1" />
        {riskCategories.map((c) => {
          const count = allActions.filter(
            (a) => c.id === 'all' || a.riskCategory === c.id
          ).length;
          return (
            <button
              key={c.id}
              onClick={() => setSelectedRiskCategory(c.id)}
              className={`px-2.5 py-1 rounded-lg font-medium transition ${
                selectedRiskCategory === c.id
                  ? 'bg-slate-800 text-white font-bold border border-slate-700'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {c.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Interactive Step-by-Step Checklist */}
      <div className="space-y-3">
        {filteredActions.map((action) => (
          <div
            key={action.id}
            className={`p-4 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
              action.completed
                ? 'bg-emerald-950/20 border-emerald-900/60 shadow-sm'
                : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
            }`}
          >
            {/* Left: Checkbox & Details */}
            <div className="flex items-start gap-3 flex-1">
              <button
                onClick={() => handleToggleStep(action.id)}
                className="mt-0.5 shrink-0 focus:outline-none cursor-pointer"
                title={action.completed ? 'Mark as Incomplete' : 'Mark as Completed'}
              >
                {action.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-500 hover:text-indigo-400 transition" />
                )}
              </button>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h4
                    onClick={() => handleToggleStep(action.id)}
                    className={`text-xs font-bold cursor-pointer transition ${
                      action.completed
                        ? 'text-emerald-300 line-through decoration-emerald-500/60'
                        : 'text-white hover:text-indigo-300'
                    }`}
                  >
                    {action.title}
                  </h4>

                  {/* Risk Reduction Badge */}
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
                    -{action.impactScoreReduction} PTS RISK
                  </span>

                  {/* Precedent Badge */}
                  <span className="text-[10px] font-mono text-slate-400">
                    Ref: <strong className="text-slate-300 font-sans">{action.precedentCompany}</strong>
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                  {action.description}
                </p>

                {/* Deliverable & Effort Info */}
                <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-slate-400 pt-1">
                  <span className="flex items-center gap-1 text-indigo-300">
                    <FileCheck className="w-3.5 h-3.5 text-indigo-400" />
                    Deliverable: <strong className="text-white font-sans">{action.deliverable}</strong>
                  </span>
                  <span>•</span>
                  <span>Effort: <strong className="text-slate-300 font-sans">{action.estimatedDays}</strong></span>
                  <span>•</span>
                  <span>Difficulty: <strong className="text-slate-300 uppercase">{action.difficulty}</strong></span>
                </div>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 self-start md:self-auto shrink-0 pl-8 md:pl-0">
              {onAddExperiment && (
                <button
                  onClick={() => handleLaunchAsExperiment(action)}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-[11px] font-semibold flex items-center gap-1 transition"
                  title="Launch this mitigation step as a bounded test on the Experiment Board"
                >
                  <FlaskConical className="w-3 h-3 text-indigo-400" />
                  <span>Test in Board</span>
                </button>
              )}

              <button
                onClick={() => handleToggleStep(action.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                  action.completed
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/80 hover:bg-emerald-900'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow'
                }`}
              >
                {action.completed ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Completed</span>
                  </>
                ) : (
                  <span>Mark Done</span>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Custom Mitigation Modal */}
      {showAddCustomModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-indigo-400" />
                Add Custom Risk Mitigation Step
              </h4>
              <button
                onClick={() => setShowAddCustomModal(false)}
                className="text-slate-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCustom} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Step Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Implement Automated SSO to bypass Enterprise IT objection"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Tactical Description *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Describe the exact action to de-risk this operational bottleneck..."
                  value={customDesc}
                  onChange={(e) => setCustomDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Measurable Deliverable *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Live SAML/Okta integration verified in staging"
                  value={customDeliverable}
                  onChange={(e) => setCustomDeliverable(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Risk Category</label>
                  <select
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="pilot_drag">Pilot Drag</option>
                    <option value="outbound_fatigue">Outbound Fatigue</option>
                    <option value="premature_ad_burn">Premature Ad Burn</option>
                    <option value="long_sales_cycle">Long Sales Cycle</option>
                    <option value="single_channel_dependency">Channel Dependency</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Impact Score Reduction</label>
                  <input
                    type="number"
                    min="1"
                    max="15"
                    value={customImpact}
                    onChange={(e) => setCustomImpact(parseInt(e.target.value) || 5)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddCustomModal(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition"
                >
                  Save Step
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
