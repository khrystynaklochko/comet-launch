import React, { useState, useMemo } from 'react';
import { MyCompanyState, CompanyProfile, GtmRiskItem, Experiment } from '../types/intelligence';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
} from 'recharts';
import {
  ShieldAlert,
  AlertTriangle,
  Flame,
  Zap,
  Target,
  Clock,
  DollarSign,
  TrendingDown,
  Sparkles,
  Plus,
  Sliders,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Compass,
  ArrowRight,
  Layers,
  Filter,
  BarChart2,
  PieChart,
  X,
  FlaskConical,
} from 'lucide-react';

interface Props {
  myCompany: MyCompanyState;
  onUpdateMyCompany?: (updated: Partial<MyCompanyState>) => void;
  onAddExperiment?: (exp: Omit<Experiment, 'id' | 'status'>) => void;
  allCompanies?: CompanyProfile[];
}

// Default canonical GTM risks derived from B2B seed journeys (Stripe, Linear, Supabase, Datadog)
const DEFAULT_COMPANY_RISKS: GtmRiskItem[] = [
  {
    id: 'risk-pilot-purgatory',
    name: 'Pilot Evaluation Purgatory (Enterprise Drag)',
    category: 'pipeline',
    impact: 88,
    probability: 82,
    capitalAllocationPriority: 'CRITICAL_IMMEDIATE',
    description:
      'Enterprise prospects accept free sandbox trials or indefinite POCs without economic buyer commitment, delaying cash flow and tying up engineering.',
    recommendedInvestment:
      'Allocate 15 hrs/wk founder time to require signed Mutual Action Plans (MAPs) with 21-day hard deadlines before provisioning software.',
    precedentWarning:
      'Datadog enforced 3-week pilot expirations with predetermined SLA benchmarks, preventing non-converting trials from bleeding resources.',
    estimatedRevenueAtRisk: '$35,000 ARR in delayed contract signatures',
    timeAllocationWeeklyHours: 15,
    budgetAllocationMonthlyDollars: 400,
  },
  {
    id: 'risk-premature-ad-spend',
    name: 'Premature Paid Ad Burn (Negative Unit Economics)',
    category: 'economics',
    impact: 85,
    probability: 74,
    capitalAllocationPriority: 'CRITICAL_IMMEDIATE',
    description:
      'Pouring capital into Google/LinkedIn ads before establishing repeatable organic onboarding or calculating verified LTV/CAC ratios.',
    recommendedInvestment:
      'Cut paid ad spend to $0/mo immediately; reallocate budget toward founder-led customer discovery and live onboarding teardowns.',
    precedentWarning:
      'Neither Stripe nor Linear spent on paid acquisition during their first 100 customers; paid ads mask flawed positioning.',
    estimatedRevenueAtRisk: '$1,200+/mo wasted ad burn with near-zero retention',
    timeAllocationWeeklyHours: 4,
    budgetAllocationMonthlyDollars: 0,
  },
  {
    id: 'risk-outbound-deliverability',
    name: 'Outbound Deliverability & Spam Filter Fatigue',
    category: 'channel',
    impact: 62,
    probability: 78,
    capitalAllocationPriority: 'MODERATE_MONITOR',
    description:
      'Generic text outbound sequences getting flagged by spam algorithms or ignored by executive buyers with <1% response rates.',
    recommendedInvestment:
      'Switch from automated drip campaigns to 45-second tailored Loom teardowns sent from hardened secondary domains (max 35 sends/day).',
    precedentWarning:
      'Ramp early outbound relied on hyper-specific founder audits identifying exact duplicate software spend for each CFO.',
    estimatedRevenueAtRisk: 'Total cold pipeline evaporation',
    timeAllocationWeeklyHours: 8,
    budgetAllocationMonthlyDollars: 300,
  },
  {
    id: 'risk-single-customer-concentration',
    name: 'Single-Customer Revenue Concentration (>35% MRR)',
    category: 'retention',
    impact: 92,
    probability: 44,
    capitalAllocationPriority: 'HIGH_CONTINGENCY',
    description:
      'Over-reliance on one whale pilot for the majority of initial revenue; a single budget cut or sponsor departure would jeopardize runway.',
    recommendedInvestment:
      'Aggressively diversify pipeline by targeting 5 mid-market accounts with standardized contracts rather than custom enterprise demands.',
    precedentWarning:
      'Early seed companies often build bespoke custom features for whale clients, effectively acting as an unpaid dev shop.',
    estimatedRevenueAtRisk: '35% to 50% of active monthly revenue',
    timeAllocationWeeklyHours: 12,
    budgetAllocationMonthlyDollars: 500,
  },
  {
    id: 'risk-cash-runway-cliff',
    name: 'Cash Runway Cliff (< 9 Months Remaining)',
    category: 'economics',
    impact: 95,
    probability: 48,
    capitalAllocationPriority: 'HIGH_CONTINGENCY',
    description:
      'Monthly burn exceeds sustainable revenue intake without a verified trajectory toward default alive breakeven.',
    recommendedInvestment:
      'Enforce zero discretionary software spend, accelerate contract prepayment terms (annual upfront discounts), and prioritize immediate cash collection.',
    precedentWarning:
      'YC canonical guideline: Startups with < 6 months runway face severe valuation haircuts or insolvency.',
    estimatedRevenueAtRisk: 'Startup survival & funding leverage',
    timeAllocationWeeklyHours: 10,
    budgetAllocationMonthlyDollars: 200,
  },
  {
    id: 'risk-bespoke-feature-creep',
    name: 'Bespoke Feature Creep (Agency Trap)',
    category: 'execution',
    impact: 58,
    probability: 68,
    capitalAllocationPriority: 'MODERATE_MONITOR',
    description:
      'Prospects requesting proprietary integrations or single-tenant features that detract from core product-market fit development.',
    recommendedInvestment:
      'Establish a strict 3-customer rule: never build custom product extensions unless at least 3 distinct paying customers commit in writing.',
    precedentWarning:
      'Linear rejected 80% of enterprise feature requests during private beta to maintain extreme core workflow velocity.',
    estimatedRevenueAtRisk: '6–8 weeks of lost engineering bandwidth',
    timeAllocationWeeklyHours: 6,
    budgetAllocationMonthlyDollars: 100,
  },
  {
    id: 'risk-single-channel-reliance',
    name: 'Single-Channel Distribution Vulnerability',
    category: 'channel',
    impact: 65,
    probability: 52,
    capitalAllocationPriority: 'MODERATE_MONITOR',
    description:
      'Relying solely on one platform (e.g. Hacker News launches or Slack app directory) with zero secondary inbound engine.',
    recommendedInvestment:
      'Develop an organic developer content asset (architectural benchmarks or engineering post-mortems) to establish compounding SEO.',
    precedentWarning:
      'Supabase paired quarterly launch weeks with open-source GitHub repositories to avoid reliance on social media algorithms.',
    estimatedRevenueAtRisk: 'Pipeline stagnation between viral spikes',
    timeAllocationWeeklyHours: 7,
    budgetAllocationMonthlyDollars: 400,
  },
  {
    id: 'risk-premature-scale-hires',
    name: 'Premature SDR / Sales Rep Hiring',
    category: 'execution',
    impact: 72,
    probability: 32,
    capitalAllocationPriority: 'LOW_ACCEPTABLE',
    description:
      'Hiring non-technical sales reps before founders have documented a repeatable, high-converting discovery and close script.',
    recommendedInvestment:
      'Keep sales 100% founder-led until the founding team has closed 10 paid accounts with identical onboarding criteria.',
    precedentWarning:
      'Founders who delegate sales too early fail to hear firsthand customer friction and burn $15k+/month in base salaries.',
    estimatedRevenueAtRisk: '$40,000–$60,000 in early compensation burn',
    timeAllocationWeeklyHours: 3,
    budgetAllocationMonthlyDollars: 0,
  },
];

export const GtmRiskHeatmapWidget: React.FC<Props> = ({
  myCompany,
  onUpdateMyCompany,
  onAddExperiment,
  allCompanies = [],
}) => {
  // View mode switcher: Heatmap Scatter (Impact vs Probability) OR Channel Radar Matrix
  const [viewMode, setViewMode] = useState<'matrix' | 'radar'>('matrix');

  // Filter by Quadrant / Priority
  const [selectedQuadrant, setSelectedQuadrant] = useState<string>('all');

  // Selected risk for deep dive
  const [selectedRiskId, setSelectedRiskId] = useState<string>('risk-pilot-purgatory');

  // Add custom risk modal
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Custom risk form state
  const [customName, setCustomName] = useState('');
  const [customCategory, setCustomCategory] = useState<GtmRiskItem['category']>('pipeline');
  const [customImpact, setCustomImpact] = useState<number>(75);
  const [customProbability, setCustomProbability] = useState<number>(70);
  const [customDesc, setCustomDesc] = useState('');
  const [customRec, setCustomRec] = useState('');

  // Combine default with custom risks and sync with company
  const companyRisks: GtmRiskItem[] = useMemo(() => {
    const custom = myCompany.customGtmRisks || [];
    return [...DEFAULT_COMPANY_RISKS, ...custom];
  }, [myCompany.customGtmRisks]);

  // Dynamically calculate quadrant and capital allocation priority
  const processedRisks = useMemo(() => {
    return companyRisks.map((risk) => {
      let priority: GtmRiskItem['capitalAllocationPriority'] = 'LOW_ACCEPTABLE';

      if (risk.impact >= 50 && risk.probability >= 50) {
        priority = 'CRITICAL_IMMEDIATE';
      } else if (risk.impact >= 50 && risk.probability < 50) {
        priority = 'HIGH_CONTINGENCY';
      } else if (risk.impact < 50 && risk.probability >= 50) {
        priority = 'MODERATE_MONITOR';
      } else {
        priority = 'LOW_ACCEPTABLE';
      }

      // Urgency score determines Z-axis bubble size in ScatterChart
      const urgency = Math.round((risk.impact * 0.6 + risk.probability * 0.4) * 4);

      return {
        ...risk,
        capitalAllocationPriority: priority,
        urgency: Math.max(120, Math.min(460, urgency)),
      };
    });
  }, [companyRisks]);

  // Selected risk object
  const activeRisk = useMemo(() => {
    return processedRisks.find((r) => r.id === selectedRiskId) || processedRisks[0];
  }, [processedRisks, selectedRiskId]);

  // Filtered risks for Scatter plot and list
  const filteredRisks = useMemo(() => {
    if (selectedQuadrant === 'all') return processedRisks;
    if (selectedQuadrant === 'critical')
      return processedRisks.filter((r) => r.capitalAllocationPriority === 'CRITICAL_IMMEDIATE');
    if (selectedQuadrant === 'contingency')
      return processedRisks.filter((r) => r.capitalAllocationPriority === 'HIGH_CONTINGENCY');
    if (selectedQuadrant === 'operational')
      return processedRisks.filter((r) => r.capitalAllocationPriority === 'MODERATE_MONITOR');
    if (selectedQuadrant === 'low')
      return processedRisks.filter((r) => r.capitalAllocationPriority === 'LOW_ACCEPTABLE');
    return processedRisks;
  }, [processedRisks, selectedQuadrant]);

  // Top Critical Immediate Threats (Quadrant 1)
  const criticalThreats = useMemo(() => {
    return processedRisks
      .filter((r) => r.capitalAllocationPriority === 'CRITICAL_IMMEDIATE')
      .sort((a, b) => b.impact * b.probability - a.impact * a.probability);
  }, [processedRisks]);

  // Handle Risk Metric Adjustment (Impact or Probability slider)
  const handleUpdateRiskMetric = (riskId: string, field: 'impact' | 'probability', value: number) => {
    const updated = companyRisks.map((r) =>
      r.id === riskId ? { ...r, [field]: Math.max(0, Math.min(100, value)) } : r
    );

    // Save to company custom risks if custom or persist
    if (onUpdateMyCompany) {
      onUpdateMyCompany({
        customGtmRisks: updated.filter((r) => r.id.startsWith('custom-')),
      });
    }
  };

  // Launch Mitigation Experiment on the Experiment Board
  const handleLaunchExperiment = (risk: GtmRiskItem) => {
    if (!onAddExperiment) return;

    onAddExperiment({
      title: `Mitigation: ${risk.name}`,
      hypothesis: `If we execute "${risk.recommendedInvestment}", we will neutralize this bottleneck and protect ${risk.estimatedRevenueAtRisk} because ${risk.description.toLowerCase()}`,
      targetIcp: 'Active commercial prospects & pilot accounts',
      channel: risk.category.toUpperCase(),
      offer: 'Standardized Mutual Action Plan & SLA',
      volume: '15 accounts',
      duration: '2 weeks',
      successThreshold: '100% elimination of uncommitted pilots / $0 wasted ad spend',
      stopCondition: 'Zero progress after 7 days',
    });

    setToastMessage(`✓ Created Experiment on Board for "${risk.name}"!`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Handle Create Custom Risk
  const handleCreateCustomRisk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    const newRisk: GtmRiskItem = {
      id: `custom-risk-${Date.now()}`,
      name: customName.trim(),
      category: customCategory,
      impact: customImpact,
      probability: customProbability,
      capitalAllocationPriority:
        customImpact >= 50 && customProbability >= 50
          ? 'CRITICAL_IMMEDIATE'
          : customImpact >= 50
          ? 'HIGH_CONTINGENCY'
          : customProbability >= 50
          ? 'MODERATE_MONITOR'
          : 'LOW_ACCEPTABLE',
      description: customDesc.trim() || 'Custom identified bottleneck threat.',
      recommendedInvestment:
        customRec.trim() || 'Allocate dedicated founder time to resolve operational friction.',
      precedentWarning: 'Founder custom diagnostic.',
      estimatedRevenueAtRisk: '$10,000+ pipeline at risk',
      timeAllocationWeeklyHours: 8,
      budgetAllocationMonthlyDollars: 300,
    };

    const currentCustom = myCompany.customGtmRisks || [];
    if (onUpdateMyCompany) {
      onUpdateMyCompany({
        customGtmRisks: [...currentCustom, newRisk],
      });
    }

    setSelectedRiskId(newRisk.id);
    setShowAddModal(false);
    setCustomName('');
    setCustomDesc('');
    setCustomRec('');
    setToastMessage(`✓ Added risk: "${newRisk.name}"`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Color helper based on priority quadrant
  const getRiskColor = (priority: GtmRiskItem['capitalAllocationPriority']) => {
    switch (priority) {
      case 'CRITICAL_IMMEDIATE':
        return '#ef4444'; // Red
      case 'HIGH_CONTINGENCY':
        return '#f59e0b'; // Amber
      case 'MODERATE_MONITOR':
        return '#6366f1'; // Indigo
      case 'LOW_ACCEPTABLE':
        return '#10b981'; // Emerald
    }
  };

  // Channel Radar Data (preserved for secondary tab)
  const radarDimensions = [
    { key: 'cacPaybackRisk', label: 'CAC Payback Risk' },
    { key: 'cycleDrag', label: 'Sales Cycle Drag' },
    { key: 'execComplexity', label: 'Execution Complexity' },
    { key: 'channelFatigue', label: 'Channel Saturation' },
    { key: 'founderDrain', label: 'Founder Drain' },
    { key: 'scalabilityCeiling', label: 'Scalability Ceiling' },
  ];

  const radarChartData = useMemo(() => {
    return [
      { dimension: 'CAC Payback Risk', Outbound: 35, Content: 45, Partnerships: 65, PaidAds: 88 },
      { dimension: 'Sales Cycle Drag', Outbound: 45, Content: 60, Partnerships: 80, PaidAds: 55 },
      { dimension: 'Execution Complexity', Outbound: 40, Content: 50, Partnerships: 75, PaidAds: 70 },
      { dimension: 'Channel Saturation', Outbound: 75, Content: 35, Partnerships: 40, PaidAds: 85 },
      { dimension: 'Founder Drain', Outbound: 70, Content: 55, Partnerships: 80, PaidAds: 35 },
      { dimension: 'Scalability Ceiling', Outbound: 55, Content: 25, Partnerships: 45, PaidAds: 75 },
    ];
  }, []);

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
            GTM RISK HEATMAP &amp; CAPITAL ALLOCATION MATRIX
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            Risk Heatmap: Impact vs. Probability
          </h3>
          <p className="text-xs text-slate-400 max-w-2xl mt-1">
            Plots identified operational bottlenecks across <strong>Impact</strong> and <strong>Probability</strong> to isolate which failure modes demand immediate capital and founder time investment.
          </p>
        </div>

        {/* View Switcher & Add Risk Button */}
        <div className="flex items-center gap-2 self-start lg:self-auto">
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setViewMode('matrix')}
              className={`px-3 py-1 rounded-lg transition flex items-center gap-1.5 ${
                viewMode === 'matrix' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              <span>Impact vs Probability</span>
            </button>
            <button
              onClick={() => setViewMode('radar')}
              className={`px-3 py-1 rounded-lg transition flex items-center gap-1.5 ${
                viewMode === 'radar' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Channel Radar</span>
            </button>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Add Risk</span>
          </button>
        </div>
      </div>

      {/* Immediate Capital Priority Banner (Quadrant 1 Callout) */}
      <div className="bg-gradient-to-r from-red-950/40 via-slate-900 to-slate-900 border border-red-900/60 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-red-950/80 border border-red-800 text-red-400 shrink-0 mt-0.5">
            <Flame className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Top Immediate Capital &amp; Founder Time Priority
              </span>
              <span className="px-2 py-0.2 rounded-full text-[10px] font-mono font-bold bg-red-900/60 text-red-300 border border-red-700/80">
                QUADRANT 1 (HIGH IMPACT + HIGH PROBABILITY)
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              <strong>{criticalThreats[0]?.name || 'Enterprise Pilot Drag'}:</strong>{' '}
              {criticalThreats[0]?.recommendedInvestment ||
                'Allocate 15 hrs/wk founder time to require signed Mutual Action Plans.'}
            </p>
            <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-slate-400 mt-1.5">
              <span className="text-red-300 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5" />
                At Risk: {criticalThreats[0]?.estimatedRevenueAtRisk}
              </span>
              <span>•</span>
              <span className="text-indigo-300 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Recommended Bandwidth: {criticalThreats[0]?.timeAllocationWeeklyHours} hrs/week
              </span>
            </div>
          </div>
        </div>

        {criticalThreats[0] && onAddExperiment && (
          <button
            onClick={() => handleLaunchExperiment(criticalThreats[0])}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs shadow-lg transition shrink-0 cursor-pointer self-start md:self-auto"
          >
            <FlaskConical className="w-3.5 h-3.5" />
            <span>Launch Mitigation Test</span>
          </button>
        )}
      </div>

      {viewMode === 'matrix' ? (
        /* ================= 2D IMPACT VS PROBABILITY MATRIX VIEW ================= */
        <div className="space-y-6">
          {/* Quadrant Filter Pills */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-1 border-b border-slate-800 text-xs">
            <div className="flex flex-wrap items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-500 mr-1" />
              {[
                { id: 'all', label: 'All Identified Risks', count: processedRisks.length },
                {
                  id: 'critical',
                  label: '🚨 Critical (Immediate Investment)',
                  count: processedRisks.filter((r) => r.capitalAllocationPriority === 'CRITICAL_IMMEDIATE')
                    .length,
                },
                {
                  id: 'contingency',
                  label: '⚠️ Contingency (High Impact)',
                  count: processedRisks.filter((r) => r.capitalAllocationPriority === 'HIGH_CONTINGENCY')
                    .length,
                },
                {
                  id: 'operational',
                  label: '⚙️ Operational (High Probability)',
                  count: processedRisks.filter((r) => r.capitalAllocationPriority === 'MODERATE_MONITOR')
                    .length,
                },
                {
                  id: 'low',
                  label: '✓ Low Concern',
                  count: processedRisks.filter((r) => r.capitalAllocationPriority === 'LOW_ACCEPTABLE')
                    .length,
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedQuadrant(tab.id)}
                  className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                    selectedQuadrant === tab.id
                      ? 'bg-indigo-600 text-white font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>

            <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
              Bubble size represents overall urgency &amp; capital at risk
            </span>
          </div>

          {/* Grid Layout: Left = Recharts Scatter Plot (7 cols), Right = Active Risk Detail Card (5 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Recharts Scatter Plot Canvas (7 cols) */}
            <div className="lg:col-span-7 bg-slate-950/80 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
                <div className="flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-indigo-400" />
                  <span className="font-bold text-white">
                    2x2 Strategic Risk Heatmap (Impact vs. Probability)
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  Click any bubble to inspect details &amp; countermeasures
                </span>
              </div>

              {/* 4 Quadrants Legend Bar */}
              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                <div className="p-1.5 rounded bg-amber-950/20 border border-amber-900/40 text-amber-300">
                  Top-Left: <strong>CONTINGENCY</strong> (Low P / High I)
                </div>
                <div className="p-1.5 rounded bg-red-950/30 border border-red-900/50 text-red-300">
                  Top-Right: <strong>CRITICAL PRIORITY</strong> (High P / High I)
                </div>
                <div className="p-1.5 rounded bg-emerald-950/20 border border-emerald-900/40 text-emerald-300">
                  Bottom-Left: <strong>LOW CONCERN</strong> (Low P / Low I)
                </div>
                <div className="p-1.5 rounded bg-indigo-950/20 border border-indigo-900/40 text-indigo-300">
                  Bottom-Right: <strong>OPERATIONAL FRICTION</strong> (High P / Low I)
                </div>
              </div>

              {/* Recharts Scatter Chart */}
              <div className="h-80 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: -10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                    
                    {/* X-Axis: Probability (0-100%) */}
                    <XAxis
                      type="number"
                      dataKey="probability"
                      name="Probability"
                      unit="%"
                      domain={[0, 100]}
                      tick={{ fill: '#94a3b8', fontSize: 10 }}
                      label={{
                        value: 'Probability (%) →',
                        position: 'insideBottomRight',
                        offset: -12,
                        fill: '#94a3b8',
                        fontSize: 10,
                      }}
                    />

                    {/* Y-Axis: Impact (0-100%) */}
                    <YAxis
                      type="number"
                      dataKey="impact"
                      name="Impact"
                      unit="%"
                      domain={[0, 100]}
                      tick={{ fill: '#94a3b8', fontSize: 10 }}
                      label={{
                        value: 'Impact (%) ↑',
                        angle: -90,
                        position: 'insideLeft',
                        offset: 15,
                        fill: '#94a3b8',
                        fontSize: 10,
                      }}
                    />

                    <ZAxis type="number" dataKey="urgency" range={[140, 500]} name="Urgency Score" />

                    {/* 50% Threshold Reference Lines */}
                    <ReferenceLine x={50} stroke="#64748b" strokeDasharray="4 4" />
                    <ReferenceLine y={50} stroke="#64748b" strokeDasharray="4 4" />

                    {/* Tooltip */}
                    <Tooltip
                      cursor={{ strokeDasharray: '3 3' }}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload as GtmRiskItem;
                          return (
                            <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-2xl max-w-xs space-y-1.5 text-xs">
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-bold text-white leading-tight">{data.name}</span>
                                <span
                                  className="w-2.5 h-2.5 rounded-full shrink-0"
                                  style={{ backgroundColor: getRiskColor(data.capitalAllocationPriority) }}
                                ></span>
                              </div>
                              <div className="flex items-center gap-3 text-[11px] font-mono text-slate-300">
                                <span>Impact: <strong className="text-white">{data.impact}%</strong></span>
                                <span>Probability: <strong className="text-white">{data.probability}%</strong></span>
                              </div>
                              <div className="text-[10px] font-mono text-red-300">
                                At Risk: {data.estimatedRevenueAtRisk}
                              </div>
                              <p className="text-[11px] text-slate-400 italic">
                                "{data.recommendedInvestment}"
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />

                    <Scatter
                      name="GTM Company Risks"
                      data={filteredRisks}
                      onClick={(node: any) => setSelectedRiskId(node.payload?.id || node.id)}
                      className="cursor-pointer"
                    >
                      {filteredRisks.map((entry) => {
                        const isSelected = entry.id === selectedRiskId;
                        return (
                          <Cell
                            key={`cell-${entry.id}`}
                            fill={getRiskColor(entry.capitalAllocationPriority)}
                            stroke={isSelected ? '#ffffff' : getRiskColor(entry.capitalAllocationPriority)}
                            strokeWidth={isSelected ? 3 : 1}
                            fillOpacity={isSelected ? 0.95 : 0.75}
                          />
                        );
                      })}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                <span>Coordinates: (Probability %, Impact %)</span>
                <span className="font-mono text-red-400 font-semibold">
                  Top-Right = Immediate Capital &amp; Founder Time Sink
                </span>
              </div>
            </div>

            {/* Right: Selected Risk Deep-Dive & Countermeasure Card (5 cols) */}
            <div className="lg:col-span-5 bg-slate-950/80 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: getRiskColor(activeRisk.capitalAllocationPriority) }}
                    ></span>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                      {activeRisk.category} BOTTLENECK
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white mt-1 leading-snug">
                    {activeRisk.name}
                  </h4>
                </div>

                <span
                  className="px-2 py-0.5 rounded text-[10px] font-mono font-bold shrink-0 border"
                  style={{
                    color: getRiskColor(activeRisk.capitalAllocationPriority),
                    borderColor: `${getRiskColor(activeRisk.capitalAllocationPriority)}80`,
                    backgroundColor: `${getRiskColor(activeRisk.capitalAllocationPriority)}15`,
                  }}
                >
                  {activeRisk.capitalAllocationPriority.replace('_', ' ')}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {activeRisk.description}
              </p>

              {/* Sliders to dynamically adjust Impact & Probability */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 space-y-2.5 text-xs">
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold">
                  <span className="flex items-center gap-1">
                    <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                    Tune Probability &amp; Impact:
                  </span>
                  <span className="font-mono text-white">
                    P: {activeRisk.probability}% • I: {activeRisk.impact}%
                  </span>
                </div>

                {/* Probability Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Likelihood (Probability):</span>
                    <span className="font-mono text-indigo-300 font-bold">{activeRisk.probability}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={activeRisk.probability}
                    onChange={(e) =>
                      handleUpdateRiskMetric(activeRisk.id, 'probability', parseInt(e.target.value) || 0)
                    }
                    className="w-full accent-indigo-500 cursor-pointer h-1.5 rounded-lg"
                  />
                </div>

                {/* Impact Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Severity (Impact):</span>
                    <span className="font-mono text-red-300 font-bold">{activeRisk.impact}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={activeRisk.impact}
                    onChange={(e) =>
                      handleUpdateRiskMetric(activeRisk.id, 'impact', parseInt(e.target.value) || 0)
                    }
                    className="w-full accent-red-500 cursor-pointer h-1.5 rounded-lg"
                  />
                </div>
              </div>

              {/* Capital & Time Allocation Requirement Box */}
              <div className="p-3 rounded-xl bg-indigo-950/20 border border-indigo-900/40 text-xs space-y-1.5">
                <span className="font-bold text-indigo-300 flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-indigo-400" />
                  Recommended Capital &amp; Founder Time Allocation:
                </span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {activeRisk.recommendedInvestment}
                </p>
                <div className="flex items-center gap-3 pt-1 text-[10px] font-mono text-slate-400">
                  <span>Founder Time: <strong className="text-white">{activeRisk.timeAllocationWeeklyHours} hrs/wk</strong></span>
                  <span>•</span>
                  <span>Spend: <strong className="text-white">${activeRisk.budgetAllocationMonthlyDollars}/mo</strong></span>
                </div>
              </div>

              {/* Historical Precedent */}
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] space-y-1">
                <span className="font-bold text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Historical Seed Precedent:
                </span>
                <p className="text-slate-400 leading-relaxed">
                  {activeRisk.precedentWarning}
                </p>
              </div>

              {/* Action Button: Launch Experiment */}
              {onAddExperiment && (
                <button
                  onClick={() => handleLaunchExperiment(activeRisk)}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FlaskConical className="w-4 h-4" />
                  <span>Launch Mitigation Test for This Risk</span>
                </button>
              )}
            </div>
          </div>

          {/* Full Risks Table */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <div className="p-3.5 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-400" />
                Ranked Identified Risks &amp; Capital Urgency
              </h4>
              <span className="text-[10px] font-mono text-slate-400">
                Sorted by Combined Risk Score
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-[10px] font-mono text-slate-400 uppercase bg-slate-950">
                    <th className="py-2.5 px-3">Identified Failure Mode</th>
                    <th className="py-2.5 px-2 text-center">Category</th>
                    <th className="py-2.5 px-2 text-center">Impact</th>
                    <th className="py-2.5 px-2 text-center">Probability</th>
                    <th className="py-2.5 px-2 text-center">Capital Priority</th>
                    <th className="py-2.5 px-3">Recommended Investment</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                  {processedRisks
                    .slice()
                    .sort((a, b) => b.impact * b.probability - a.impact * a.probability)
                    .map((risk) => (
                      <tr
                        key={risk.id}
                        onClick={() => setSelectedRiskId(risk.id)}
                        className={`cursor-pointer transition hover:bg-slate-900/60 ${
                          selectedRiskId === risk.id ? 'bg-slate-900/90' : ''
                        }`}
                      >
                        <td className="py-2.5 px-3 font-bold text-white flex items-center gap-2 font-sans">
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: getRiskColor(risk.capitalAllocationPriority) }}
                          ></span>
                          <span className="truncate max-w-xs">{risk.name}</span>
                        </td>
                        <td className="py-2.5 px-2 text-center text-slate-400 uppercase text-[10px]">
                          {risk.category}
                        </td>
                        <td className="py-2.5 px-2 text-center text-red-400 font-bold">
                          {risk.impact}%
                        </td>
                        <td className="py-2.5 px-2 text-center text-indigo-400 font-bold">
                          {risk.probability}%
                        </td>
                        <td className="py-2.5 px-2 text-center">
                          <span
                            className="px-2 py-0.5 rounded text-[10px] font-bold border"
                            style={{
                              color: getRiskColor(risk.capitalAllocationPriority),
                              borderColor: `${getRiskColor(risk.capitalAllocationPriority)}80`,
                              backgroundColor: `${getRiskColor(risk.capitalAllocationPriority)}15`,
                            }}
                          >
                            {risk.capitalAllocationPriority.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-300 font-sans text-[11px] truncate max-w-sm">
                          {risk.recommendedInvestment}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLaunchExperiment(risk);
                            }}
                            className="text-indigo-400 hover:text-indigo-300 font-semibold text-xs flex items-center gap-1 ml-auto"
                          >
                            <span>Test</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* ================= SECONDARY CHANNEL RADAR VIEW ================= */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-6 bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider pb-2 border-b border-slate-800 flex items-center justify-between">
              <span>Channel Risk Radar (0-100 Risk Score)</span>
              <span className="text-[10px] font-mono text-slate-400">Stage: {myCompany.stage}</span>
            </h4>

            <div className="h-80 w-full pt-1">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarChartData}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis dataKey="dimension" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" tick={{ fill: '#64748b', fontSize: 9 }} />
                  <Radar name="Outbound" dataKey="Outbound" stroke="#6366f1" fill="#6366f1" fillOpacity={0.25} />
                  <Radar name="Content" dataKey="Content" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
                  <Radar name="Partnerships" dataKey="Partnerships" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.2} />
                  <Radar name="Paid Ads" dataKey="PaidAds" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.2} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-3">
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider pb-2 border-b border-slate-800">
                Channel Failure Mode Summary
              </h4>
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-900/60 text-emerald-200">
                  <strong>Direct Outbound:</strong> Optimal for first 10 customers. High founder drain, but fastest path to unvarnished customer feedback and zero ad waste.
                </div>
                <div className="p-3 rounded-lg bg-indigo-950/30 border border-indigo-900/60 text-indigo-200">
                  <strong>Content &amp; DevRel:</strong> Compounding organic engine. Requires 90–180 days to index; combine with outbound to sustain short-term pipeline.
                </div>
                <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-900/60 text-amber-200">
                  <strong>Partnerships:</strong> Avoid until 20+ ecstatic customers exist. Resellers and platforms do not sell unproven software.
                </div>
                <div className="p-3 rounded-lg bg-red-950/30 border border-red-900/60 text-red-200">
                  <strong>Paid Ads:</strong> Severe capital trap in early stages. Burns venture runway before unit economics and retention curves are locked.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Custom Risk Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-indigo-400" />
                Add Identified Company Risk
              </h4>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomRisk} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Risk / Bottleneck Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Enterprise Infosec Security Audit Drag"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Category</label>
                <select
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="pipeline">Pipeline &amp; Pilots</option>
                  <option value="economics">Economics &amp; Runway</option>
                  <option value="channel">Channel Fatigue</option>
                  <option value="retention">Retention &amp; Churn</option>
                  <option value="execution">Execution Drag</option>
                  <option value="market">Market &amp; Competition</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Impact: <strong className="text-red-400">{customImpact}%</strong>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={customImpact}
                    onChange={(e) => setCustomImpact(parseInt(e.target.value) || 50)}
                    className="w-full accent-red-500 cursor-pointer h-1.5 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Probability: <strong className="text-indigo-400">{customProbability}%</strong>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={customProbability}
                    onChange={(e) => setCustomProbability(parseInt(e.target.value) || 50)}
                    className="w-full accent-indigo-500 cursor-pointer h-1.5 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Why is this a threat to your current stage..."
                  value={customDesc}
                  onChange={(e) => setCustomDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Recommended Investment</label>
                <input
                  type="text"
                  placeholder="e.g., Publish SOC2 self-serve packet to bypass 4-week infosec queue"
                  value={customRec}
                  onChange={(e) => setCustomRec(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                />
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
                  Plot on Heatmap
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
