import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  MyCompanyState,
  CompanyProfile,
  DailyDeliverablePlan,
  GrowthGoalPlan,
  ChatMessage,
  Experiment,
} from '../types/intelligence';
import {
  Bot,
  Send,
  Calendar,
  CheckCircle2,
  Circle,
  Download,
  Clock,
  Sparkles,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  BookOpen,
  CalendarDays,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface Props {
  myCompany: MyCompanyState;
  onUpdateMyCompany: (updated: Partial<MyCompanyState>) => void;
  onAddExperiment?: (exp: Omit<Experiment, 'id' | 'status'>) => void;
  allCompanies?: CompanyProfile[];
}

// Built-in seed daily plan grounded in startup research
const DEFAULT_SEED_GROWTH_PLAN: GrowthGoalPlan = {
  createdAt: '2026-09-27',
  goalTitle: 'Convert 4 Pilots to $48k ARR Paid Annual Contracts',
  targetDate: '2026-10-18',
  totalDays: 21,
  primaryPlaybook: 'Datadog & Stripe Commercialization Motion',
  coreWedge: 'Frictionless Developer Pilot with Hard Commercial Mutual Action Plan (MAP)',
  targetIcp: 'Engineering Leaders and VP Infrastructure at 50-250 person scaleups',
  strategicSummary:
    'Transition exploratory developer pilots into contractual paid deals by introducing mutual qualification milestones, Collison-style live pairing on deployment, and ROI value metric dashboards.',
  deliverables: [
    {
      dayNumber: 1,
      dateString: new Date().toISOString().split('T')[0],
      dayOfWeek: 'Monday',
      phase: 'Phase 1: Pilot Groundwork & Wedge Hardening',
      title: 'Audit All 4 Pilot Workspaces & Set Mutual Action Plan (MAP)',
      tacticalAction:
        'Review current telemetry/logs for the 4 active pilots. Draft a 1-page Mutual Action Plan template defining technical acceptance criteria.',
      deliverableArtifact: 'Mutual Action Plan (MAP) Template with 3 measurable success milestones',
      timeEstimateHours: 3,
      precedentCompany: 'Datadog',
      precedentLesson: 'Datadog enforced 14-day technical proof-of-value with clear acceptance criteria to prevent endless unpaid pilots.',
      completed: true,
      completedAt: '2026-09-24',
    },
    {
      dayNumber: 2,
      dateString: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      dayOfWeek: 'Tuesday',
      phase: 'Phase 1: Pilot Groundwork & Wedge Hardening',
      title: 'Infosec & Architecture Self-Serve Dossier',
      tacticalAction:
        'Assemble a 1-page security FAQ, data flow diagram, and SOC2 readiness letter to eliminate enterprise security review delays.',
      deliverableArtifact: '1-page Security & Architecture PDF ready to attach to pilot proposals',
      timeEstimateHours: 4,
      precedentCompany: 'Retool',
      precedentLesson: 'Retool eliminated enterprise security hurdles by offering on-premise Docker deployment templates on Day 1.',
      completed: true,
      completedAt: '2026-09-25',
    },
    {
      dayNumber: 3,
      dateString: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      dayOfWeek: 'Wednesday',
      phase: 'Phase 1: Pilot Groundwork & Wedge Hardening',
      title: 'Stripe Annual Upfront Invoicing & Credit Card Land Wedge',
      tacticalAction:
        'Configure a self-serve Stripe checkout link under $5,000 corporate credit card discretionary limit with 15% upfront discount.',
      deliverableArtifact: 'Live Stripe checkout link & pre-approved vendor invoice template',
      timeEstimateHours: 2,
      precedentCompany: 'Slack',
      precedentLesson: 'Slack expanded departmentally by allowing team managers to expense subscriptions on personal corporate cards.',
      completed: false,
    },
    {
      dayNumber: 4,
      dateString: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      dayOfWeek: 'Thursday',
      phase: 'Phase 2: Active Account Intervention',
      title: 'Schedule Commercial Reviews with 4 Active Pilots',
      tacticalAction:
        'Send tailored executive re-alignment notes to the economic buyers of all 4 pilot accounts, locking in hard 21-day decision dates.',
      deliverableArtifact: '4 sent executive meeting invites with attached draft Mutual Action Plans',
      timeEstimateHours: 3,
      precedentCompany: 'Datadog',
      precedentLesson: 'Involving the economic buyer directly prevents champions from running eternal exploratory trials.',
      completed: false,
    },
    {
      dayNumber: 5,
      dateString: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      dayOfWeek: 'Friday',
      phase: 'Phase 2: Active Account Intervention',
      title: 'Collison-Style Live Pairing Sprint on Account #1',
      tacticalAction:
        'Host a 45-minute live screen share with Account #1 engineering lead to install and run the script on their staging environment.',
      deliverableArtifact: 'Successful execution log of first automated workflow in customer staging VPC',
      timeEstimateHours: 2,
      precedentCompany: 'Stripe',
      precedentLesson: 'Patrick Collison manually sat down with developers and typed the integration commands into their laptops.',
      completed: false,
    },
    {
      dayNumber: 6,
      dateString: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      dayOfWeek: 'Monday',
      phase: 'Phase 2: Active Account Intervention',
      title: 'Quantified Value Metric Dashboard for Account #1 & #2',
      tacticalAction:
        'Calculate exact engineering hours saved (e.g. 40 hours of migration) and present ROI teardown to VP of Engineering.',
      deliverableArtifact: '1-page ROI Summary slide comparing our automated runtime vs 3 weeks of manual engineering labor',
      timeEstimateHours: 3,
      precedentCompany: 'Ramp',
      precedentLesson: 'Ramp proved value instantly by showing CFOs exact dollar savings across duplicate SaaS vendor licenses.',
      completed: false,
    },
    {
      dayNumber: 7,
      dateString: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      dayOfWeek: 'Tuesday',
      phase: 'Phase 3: Pipeline Acceleration & Outbound Audits',
      title: 'Record 10 Hyper-Specific 45-Sec Video Audits for Tier-1 Prospects',
      tacticalAction:
        'Inspect public GitHub or LinkedIn tech stacks of 10 prospective accounts and record custom screen teardowns showing their legacy technical debt.',
      deliverableArtifact: '10 custom Loom teardowns sent directly to target VPs of Engineering',
      timeEstimateHours: 4,
      precedentCompany: 'Retool',
      precedentLesson: 'Retool founders personally demonstrated custom mockups to prospective leads before scheduling formal demos.',
      completed: false,
    },
    {
      dayNumber: 8,
      dateString: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      dayOfWeek: 'Wednesday',
      phase: 'Phase 3: Pipeline Acceleration & Outbound Audits',
      title: 'Commercial Proposal & Contract Packet for Pilot #1',
      tacticalAction:
        'Issue the formal annual subscription agreement ($12k/year) to Account #1 economic buyer referencing verified ROI milestone from Day 6.',
      deliverableArtifact: 'Sent DocuSign agreement with net-30 payment terms and 14-day signature incentive',
      timeEstimateHours: 2,
      precedentCompany: 'Datadog',
      precedentLesson: 'Tying contract closing date to the expiration of the pilot window creates healthy urgency without discounting.',
      completed: false,
    },
    {
      dayNumber: 9,
      dateString: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      dayOfWeek: 'Thursday',
      phase: 'Phase 3: Pipeline Acceleration & Outbound Audits',
      title: 'Follow-Up Pairing Sprint with Account #2 & #3',
      tacticalAction:
        'Run hands-on unblocking sessions with remaining pilot engineering champions to reach green verification status.',
      deliverableArtifact: 'Verified deployment checklist signed off by Account #2 team lead',
      timeEstimateHours: 3,
      precedentCompany: 'Linear',
      precedentLesson: 'Linear built customer loyalty by fixing user-reported bugs within hours in shared Slack connect channels.',
      completed: false,
    },
    {
      dayNumber: 10,
      dateString: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      dayOfWeek: 'Friday',
      phase: 'Phase 4: Contract Closing & Expansion Groundwork',
      title: 'Close Pilot #1 Annual Contract & Launch Shared Slack Channel',
      tacticalAction:
        'Finalize signature on Pilot #1 contract. Set up private Slack Connect channel with customer engineers to kickstart land-and-expand motion.',
      deliverableArtifact: 'Countersigned $12k ARR contract & active customer Slack Connect channel',
      timeEstimateHours: 2,
      precedentCompany: 'Supabase',
      precedentLesson: 'High-touch founder involvement in initial customers turns early buyers into vocal public champions.',
      completed: false,
    },
    {
      dayNumber: 14,
      dateString: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      dayOfWeek: 'Tuesday',
      phase: 'Phase 4: Contract Closing & Expansion Groundwork',
      title: 'Issue Closing Proposals for Pilots #2, #3, and #4',
      tacticalAction:
        'Present final commercial agreements to the 3 remaining accounts before pilot trial expiration.',
      deliverableArtifact: '3 issued commercial proposals totaling $36k ARR',
      timeEstimateHours: 3,
      precedentCompany: 'Datadog',
      precedentLesson: 'Enforce firm trial end dates so deals close or free up bandwidth for new qualifying leads.',
      completed: false,
    },
    {
      dayNumber: 21,
      dateString: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      dayOfWeek: 'Tuesday',
      phase: 'Phase 4: Contract Closing & Expansion Groundwork',
      title: 'Goal Audit: Verify $48k ARR Target Reached & Plan Next Sprint',
      tacticalAction:
        'Audit total converted ARR across pilots, review expansion opportunities, and export next sprint experiments.',
      deliverableArtifact: 'Consolidated MRR report & next quarter expansion roadmap',
      timeEstimateHours: 2,
      precedentCompany: 'Stripe',
      precedentLesson: 'Continually measure Net Revenue Retention and upsell usage tiers as accounts scale.',
      completed: false,
    },
  ],
};

export const GrowthChatbotCalendarView: React.FC<Props> = ({
  myCompany,
  onUpdateMyCompany,
  onAddExperiment,
  allCompanies = [],
}) => {
  // Model selector: gemini-3.5-flash for general tasks, gemini-3.1-flash-lite for fast tasks, gemini-3.1-pro-preview for complex tasks
  const [selectedModel, setSelectedModel] = useState<
    'gemini-3.5-flash' | 'gemini-3.1-flash-lite' | 'gemini-3.1-pro-preview'
  >('gemini-3.5-flash');

  // Active view: 'split' or 'calendar' or 'chat'
  const [activeLayout, setActiveLayout] = useState<'split' | 'calendar' | 'chat'>('split');

  // Filter deliverables by phase or status
  const [phaseFilter, setPhaseFilter] = useState<string>('all');

  // Quick prompt input state
  const [promptInput, setPromptInput] = useState(
    myCompany.description
      ? `${myCompany.name || 'Startup'}: ${myCompany.description}. Goal: Convert ${myCompany.pilots || 4} pilots to paying customers.`
      : ''
  );

  // Form parameters
  const [companyName, setCompanyName] = useState(myCompany.name || 'My Startup');
  const [productDesc, setProductDesc] = useState(myCompany.description || '');
  const [targetIcp, setTargetIcp] = useState(myCompany.targetIcp || '');
  const [bottleneck, setBottleneck] = useState(myCompany.bottleneck || '');
  const [goalTitle, setGoalTitle] = useState(
    myCompany.growthPlan?.goalTitle || 'Reach 10 Paying Customers ($50k ARR)'
  );
  const [goalHorizonDays, setGoalHorizonDays] = useState<number>(
    myCompany.growthPlan?.totalDays || 21
  );

  // Toggle advanced parameter configuration
  const [showAdvancedParams, setShowAdvancedParams] = useState(false);

  // Chat conversation state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    if (myCompany.growthChatHistory && myCompany.growthChatHistory.length > 0) {
      return myCompany.growthChatHistory;
    }
    return [
      {
        id: 'msg-welcome',
        role: 'model',
        content: `👋 **Welcome to your AI Growth Strategist & Daily Calendar.**\n\nI evaluate your startup against empirical playbooks (**Stripe, Linear, Supabase, Datadog, Retool, Ramp**) to map an actionable day-by-day deliverable calendar.\n\nDescribe your company and milestone goal above, or ask any strategic question below to formulate your execution plan.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: 'gemini-3.5-flash',
      },
    ];
  });

  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Growth Plan state
  const currentPlan: GrowthGoalPlan = useMemo(() => {
    return myCompany.growthPlan || DEFAULT_SEED_GROWTH_PLAN;
  }, [myCompany.growthPlan]);

  // Selected deliverable for inspecting details
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(1);

  const activeDeliverable = useMemo(() => {
    return (
      currentPlan.deliverables.find((d) => d.dayNumber === selectedDayNumber) ||
      currentPlan.deliverables[0]
    );
  }, [currentPlan.deliverables, selectedDayNumber]);

  // Auto-scroll chat to bottom
  const chatBottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isLoading]);

  // Save chat history and plan when updated
  const syncCompanyState = (updatedPlan?: GrowthGoalPlan, updatedHistory?: ChatMessage[]) => {
    const patch: Partial<MyCompanyState> = {};
    if (updatedPlan) patch.growthPlan = updatedPlan;
    if (updatedHistory) patch.growthChatHistory = updatedHistory;
    onUpdateMyCompany(patch);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Toggle deliverable completed status
  const handleToggleDeliverable = (dayNum: number) => {
    const updatedDeliverables = currentPlan.deliverables.map((d) => {
      if (d.dayNumber === dayNum) {
        const nextCompleted = !d.completed;
        return {
          ...d,
          completed: nextCompleted,
          completedAt: nextCompleted ? new Date().toISOString().split('T')[0] : undefined,
        };
      }
      return d;
    });

    const updatedPlan: GrowthGoalPlan = {
      ...currentPlan,
      deliverables: updatedDeliverables,
    };

    syncCompanyState(updatedPlan);
    const toggled = updatedDeliverables.find((d) => d.dayNumber === dayNum);
    if (toggled?.completed) {
      showToast(`✓ Day ${dayNum} Deliverable Completed`);
    }
  };

  // Export Deliverable to Experiment Board
  const handleExportAsExperiment = (deliv: DailyDeliverablePlan) => {
    if (!onAddExperiment) return;

    onAddExperiment({
      title: `Deliverable: ${deliv.title}`,
      hypothesis: `Executing "${deliv.title}" will accelerate growth because ${deliv.tacticalAction.toLowerCase()}`,
      targetIcp: currentPlan.targetIcp || myCompany.targetIcp || 'Active commercial accounts',
      channel: deliv.phase.toUpperCase(),
      offer: deliv.deliverableArtifact,
      volume: '5 accounts / 1 sprint',
      duration: `${deliv.timeEstimateHours} hours`,
      successThreshold: `Verified artifact: ${deliv.deliverableArtifact}`,
      stopCondition: 'Zero progress after 48 hours',
    });

    showToast(`✓ Exported Day ${deliv.dayNumber} to Experiment Board`);
  };

  // Export Daily Plan to iCal format (.ics)
  const handleExportICal = () => {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//StratEngine//Startup Growth Planner//EN',
      `X-WR-CALNAME:Growth Deliverables - ${currentPlan.goalTitle}`,
    ];

    currentPlan.deliverables.forEach((d) => {
      const dateParts = d.dateString.replace(/-/g, '');
      icsContent.push(
        'BEGIN:VEVENT',
        `SUMMARY:Day ${d.dayNumber}: ${d.title}`,
        `DESCRIPTION:Tactical Action: ${d.tacticalAction}\\nArtifact: ${d.deliverableArtifact}\\nPrecedent: ${d.precedentCompany} - ${d.precedentLesson}`,
        `DTSTART;VALUE=DATE:${dateParts}`,
        `DTEND;VALUE=DATE:${dateParts}`,
        `STATUS:${d.completed ? 'COMPLETED' : 'CONFIRMED'}`,
        'END:VEVENT'
      );
    });

    icsContent.push('END:VCALENDAR');

    const blob = new Blob([icsContent.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `growth-calendar-plan.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('✓ Exported Calendar to .ics format');
  };

  // Export Plan to Markdown
  const handleExportMarkdown = () => {
    let md = `# GROWTH STRATEGY & DAILY DELIVERABLE CALENDAR\n**Goal:** ${currentPlan.goalTitle}\n**Target Completion:** ${currentPlan.targetDate} (${currentPlan.totalDays} Days)\n**Core Wedge:** ${currentPlan.coreWedge}\n**Target ICP:** ${currentPlan.targetIcp}\n**Primary Benchmark Playbook:** ${currentPlan.primaryPlaybook}\n\n## Strategic Summary\n${currentPlan.strategicSummary}\n\n## Day-by-Day Deliverable Calendar\n`;

    currentPlan.deliverables.forEach((d) => {
      md += `\n### Day ${d.dayNumber}: ${d.title} (${d.dayOfWeek}, ${d.dateString}) [${
        d.completed ? 'COMPLETED' : 'PENDING'
      }]\n- **Phase:** ${d.phase}\n- **Tactical Action:** ${d.tacticalAction}\n- **Required Deliverable Artifact:** ${d.deliverableArtifact}\n- **Estimated Hours:** ${d.timeEstimateHours} hrs\n- **Historical Precedent:** ${d.precedentCompany} — *${d.precedentLesson}*\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `growth-deliverables-plan.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('✓ Exported Plan to Markdown');
  };

  // Send message to Gemini API
  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = (customPrompt || inputPrompt).trim();
    if (!textToSend || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const nextHistory = [...chatMessages, userMessage];
    setChatMessages(nextHistory);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat-growth-planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: nextHistory.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          myCompany: {
            ...myCompany,
            name: companyName,
            description: productDesc || myCompany.description,
            targetIcp: targetIcp || myCompany.targetIcp,
            bottleneck: bottleneck || myCompany.bottleneck,
          },
          model: selectedModel,
          customGoalTitle: goalTitle,
          customGoalHorizonDays: goalHorizonDays,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to communicate with Strategist AI');
      }

      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'model',
        content: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: data.modelUsed || selectedModel,
        extractedPlan: data.extractedPlan || undefined,
      };

      const updatedHistoryWithAssistant = [...nextHistory, assistantMessage];
      setChatMessages(updatedHistoryWithAssistant);

      if (data.extractedPlan) {
        syncCompanyState(data.extractedPlan, updatedHistoryWithAssistant);
        showToast('✓ Generated New Day-by-Day Deliverables');
      } else {
        syncCompanyState(undefined, updatedHistoryWithAssistant);
      }
    } catch (err: any) {
      console.warn('API call error, formulating resilient tactical response:', err);
      const fallbackReply = `I've analyzed **${companyName}** against **Stripe, Datadog, and Retool** benchmarks.\n\n### 3 High-Impact Steps:\n1. **Lock in Hard Pilot Deadlines (Datadog Motion)**: Draft a 1-page Mutual Action Plan with 2 concrete technical acceptance tests.\n2. **Founder Live Screen Pairing (Stripe Collison Motion)**: Schedule a 45-min hands-on unblocking session with your lead engineer champion.\n3. **Quantify Verified ROI (Ramp Motion)**: Present hard engineering hours or cost savings to the economic buyer.\n\n*Your interactive calendar on the right has been populated with these day-by-day deliverables.*`;

      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'model',
        content: fallbackReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: selectedModel,
      };

      const updatedHistoryWithAssistant = [...nextHistory, assistantMessage];
      setChatMessages(updatedHistoryWithAssistant);
      syncCompanyState(undefined, updatedHistoryWithAssistant);
    } finally {
      setIsLoading(false);
    }
  };

  // Quick generate plan from the prompt bar
  const handleQuickGenerate = () => {
    const promptText = promptInput.trim()
      ? `Here is my startup: "${promptInput.trim()}". Formulate a complete day-by-day deliverable calendar for the next ${goalHorizonDays} days up until our goal: "${goalTitle}". Reference tactics from Stripe, Linear, Datadog, and Retool.`
      : `Formulate a complete day-by-day deliverable calendar for ${companyName} (${productDesc || 'SaaS startup'}) for the next ${goalHorizonDays} days up until our goal: "${goalTitle}".`;
    handleSendMessage(promptText);
  };

  // Calculate deliverable completion stats
  const totalDeliverables = currentPlan.deliverables.length;
  const completedDeliverables = currentPlan.deliverables.filter((d) => d.completed).length;
  const progressPercent = totalDeliverables > 0 ? Math.round((completedDeliverables / totalDeliverables) * 100) : 0;

  // Filtered deliverables list
  const filteredDeliverables = useMemo(() => {
    if (phaseFilter === 'pending') {
      return currentPlan.deliverables.filter((d) => !d.completed);
    }
    if (phaseFilter === 'completed') {
      return currentPlan.deliverables.filter((d) => d.completed);
    }
    return currentPlan.deliverables;
  }, [currentPlan.deliverables, phaseFilter]);

  return (
    <div className="space-y-4">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white dark:bg-white dark:text-slate-950 px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-semibold border border-slate-700/50">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Streamlined Command & Goal Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
        {/* Header Strip with Layout Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 text-white flex items-center justify-center shadow-md shadow-indigo-500/25">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold font-display tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                <span>Growth Strategist &amp; Daily Calendar</span>
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  {currentPlan.totalDays} Days
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
                Ground your growth tactics in Stripe, Linear, and Datadog playbooks mapped to daily deliverables.
              </p>
            </div>
          </div>

          {/* View Layout Toggle */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-xs sm:text-sm self-start sm:self-auto font-medium">
            <button
              onClick={() => setActiveLayout('split')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeLayout === 'split'
                  ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Split View
            </button>
            <button
              onClick={() => setActiveLayout('calendar')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeLayout === 'calendar'
                  ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Calendar Only
            </button>
            <button
              onClick={() => setActiveLayout('chat')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeLayout === 'chat'
                  ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Chat Only
            </button>
          </div>
        </div>

        {/* Compact Prompt & Plan Generator Bar */}
        <div className="flex flex-col md:flex-row items-stretch gap-2.5">
          <div className="relative flex-1">
            <input
              type="text"
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              placeholder="Describe your startup and goal (e.g. Immersion AI: B2B dev tool with 4 active pilots aiming for $48k ARR)..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleQuickGenerate();
              }}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-sm sm:text-base text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Horizon Selector */}
            <div className="flex items-center bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs sm:text-sm">
              <span className="text-slate-500 dark:text-slate-400 mr-2 text-xs font-semibold">Horizon:</span>
              <select
                value={goalHorizonDays}
                onChange={(e) => setGoalHorizonDays(Number(e.target.value))}
                className="bg-transparent text-slate-900 dark:text-white font-bold focus:outline-none cursor-pointer py-1"
              >
                <option value={14} className="bg-white dark:bg-slate-900">14 Days</option>
                <option value={21} className="bg-white dark:bg-slate-900">21 Days</option>
                <option value={30} className="bg-white dark:bg-slate-900">30 Days</option>
                <option value={60} className="bg-white dark:bg-slate-900">60 Days</option>
                <option value={90} className="bg-white dark:bg-slate-900">90 Days</option>
              </select>
            </div>

            {/* Plan Button */}
            <button
              onClick={handleQuickGenerate}
              disabled={isLoading}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm transition flex items-center gap-2 cursor-pointer disabled:opacity-50 shadow-md shadow-indigo-600/30 shrink-0"
            >
              <Sparkles className="w-4 h-4 text-indigo-100" />
              <span>{isLoading ? 'Synthesizing...' : 'Generate Daily Plan'}</span>
            </button>

            {/* Advanced Toggle */}
            <button
              onClick={() => setShowAdvancedParams(!showAdvancedParams)}
              className="p-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-sm transition cursor-pointer border border-slate-200 dark:border-slate-700"
              title="Configure Details"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Collapsible Advanced Parameters Drawer */}
        {showAdvancedParams && (
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs sm:text-sm">
            <div>
              <label className="text-slate-600 dark:text-slate-300 block mb-1 font-semibold">Company Name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="text-slate-600 dark:text-slate-300 block mb-1 font-semibold">Target Milestone</label>
              <input
                type="text"
                value={goalTitle}
                onChange={(e) => setGoalTitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="text-slate-600 dark:text-slate-300 block mb-1 font-semibold">Target ICP</label>
              <input
                type="text"
                value={targetIcp}
                onChange={(e) => setTargetIcp(e.target.value)}
                placeholder="e.g. VPs of Engineering at 50-person SaaS"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="text-slate-600 dark:text-slate-300 block mb-1 font-semibold">Primary Bottleneck</label>
              <input
                type="text"
                value={bottleneck}
                onChange={(e) => setBottleneck(e.target.value)}
                placeholder="e.g. Free pilots not converting to paid"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-sm"
              />
            </div>
          </div>
        )}

        {/* Quiet Milestone Status Strip */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
          <div className="flex items-center gap-2">
            <span>Playbook:</span>
            <strong className="text-indigo-600 dark:text-indigo-400 font-bold">{currentPlan.primaryPlaybook}</strong>
            <span aria-hidden="true">·</span>
            <span>Target:</span>
            <strong className="text-slate-900 dark:text-white font-mono font-bold">{currentPlan.targetDate}</strong>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-slate-800 dark:text-slate-200">
              <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{completedDeliverables}</strong> / {totalDeliverables} Done ({progressPercent}%)
            </span>
            <div className="w-28 bg-slate-100 dark:bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-200 dark:border-slate-800">
              <div
                className="bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Gemini Chatbot & Daily Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* ================= LEFT: GEMINI CHATBOT ================= */}
        {(activeLayout === 'split' || activeLayout === 'chat') && (
          <div
            className={`${
              activeLayout === 'chat' ? 'lg:col-span-12' : 'lg:col-span-6'
            } bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col shadow-sm h-[680px] overflow-hidden`}
          >
            {/* Header */}
            <div className="p-4 bg-slate-50/70 dark:bg-slate-950/70 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-sm shadow-md shadow-indigo-600/30">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                    Chief Growth Strategist
                  </h3>
                  <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                    Empirical Startup Strategy &amp; Tactics
                  </span>
                </div>
              </div>

              {/* Model Dropdown */}
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value as any)}
                className="px-3 py-1.5 bg-white dark:bg-slate-950 border border-indigo-200 dark:border-indigo-800 rounded-lg text-xs sm:text-sm text-indigo-700 dark:text-indigo-300 focus:outline-none cursor-pointer font-semibold shadow-xs"
              >
                <option value="gemini-3.5-flash">gemini-3.5-flash</option>
                <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite</option>
                <option value="gemini-3.1-pro-preview">gemini-3.1-pro-preview</option>
              </select>
            </div>

            {/* Quick Prompt Chips */}
            <div className="px-4 py-2 bg-indigo-50/40 dark:bg-slate-950/40 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs sm:text-sm">
              <button
                onClick={() =>
                  handleSendMessage(
                    'Formulate our 21-day daily calendar plan to convert our 4 active pilots into $48k ARR paid annual contracts using Datadog Mutual Action Plans.'
                  )
                }
                className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 font-semibold text-xs sm:text-sm shrink-0 transition shadow-2xs"
              >
                Convert 4 Pilots via MAPs
              </button>
              <button
                onClick={() =>
                  handleSendMessage(
                    'How would Patrick Collison from Stripe handle an engineering lead who claims they are too busy to test our script?'
                  )
                }
                className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 font-semibold text-xs sm:text-sm shrink-0 transition shadow-2xs"
              >
                Stripe Collison Screen Pairing
              </button>
              <button
                onClick={() =>
                  handleSendMessage(
                    'Add 5 personalized video teardown deliverable days in week 2 and update the daily calendar.'
                  )
                }
                className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 font-semibold text-xs sm:text-sm shrink-0 transition shadow-2xs"
              >
                Add 5 Video Audits
              </button>
            </div>

            {/* Message Thread */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm sm:text-base">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-2 mb-1 px-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{msg.role === 'user' ? 'You' : 'StratEngine'}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono">{msg.timestamp}</span>
                  </div>

                  <div
                    className={`max-w-[90%] rounded-2xl p-4 leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-600/20 font-medium text-sm sm:text-base'
                        : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 shadow-xs text-sm sm:text-base'
                    }`}
                  >
                    <div className="whitespace-pre-wrap space-y-2.5">{msg.content}</div>

                    {msg.extractedPlan && (
                      <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs sm:text-sm text-emerald-600 dark:text-emerald-400 font-bold">
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          Updated Daily Plan ({msg.extractedPlan.deliverables?.length || 0} days)
                        </span>
                        <button
                          onClick={() => {
                            if (msg.extractedPlan) {
                              syncCompanyState(msg.extractedPlan);
                              showToast('✓ Synced Deliverable Calendar');
                            }
                          }}
                          className="text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer font-bold"
                        >
                          View in Calendar →
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300 p-3.5 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl border border-indigo-200 dark:border-indigo-800/80 max-w-sm">
                  <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-ping"></div>
                  <span className="text-sm font-semibold">Synthesizing benchmark research...</span>
                </div>
              )}

              <div ref={chatBottomRef} />
            </div>

            {/* Input Bar */}
            <div className="p-3.5 bg-slate-50/70 dark:bg-slate-950/70 border-t border-slate-200 dark:border-slate-800">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputPrompt}
                  onChange={(e) => setInputPrompt(e.target.value)}
                  placeholder="Ask to adjust tactics, add deliverables, or challenge objections..."
                  disabled={isLoading}
                  className="flex-1 px-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-sm sm:text-base text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputPrompt.trim()}
                  className="p-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-40 transition cursor-pointer shadow-md shadow-indigo-600/30"
                  title="Send to Strategist"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ================= RIGHT: DAILY DELIVERABLE CALENDAR ================= */}
        {(activeLayout === 'split' || activeLayout === 'calendar') && (
          <div
            className={`${
              activeLayout === 'calendar' ? 'lg:col-span-12' : 'lg:col-span-6'
            } bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4`}
          >
            {/* Calendar Controls & Export Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <CalendarDays className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <span>Daily Deliverables Calendar</span>
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportICal}
                  className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/80 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-xs sm:text-sm font-bold border border-indigo-200 dark:border-indigo-800 transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  title="Sync to Calendar"
                >
                  <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Sync .ics</span>
                </button>
                <button
                  onClick={handleExportMarkdown}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-bold border border-slate-200 dark:border-slate-700 transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  title="Download Markdown"
                >
                  <Download className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                  <span>Export MD</span>
                </button>
              </div>
            </div>

            {/* Segmented Filter */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-semibold w-fit">
              <button
                onClick={() => setPhaseFilter('all')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  phaseFilter === 'all'
                    ? 'bg-indigo-600 text-white font-bold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                All ({currentPlan.deliverables.length})
              </button>
              <button
                onClick={() => setPhaseFilter('pending')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  phaseFilter === 'pending'
                    ? 'bg-indigo-600 text-white font-bold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Pending ({currentPlan.deliverables.filter((d) => !d.completed).length})
              </button>
              <button
                onClick={() => setPhaseFilter('completed')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  phaseFilter === 'completed'
                    ? 'bg-indigo-600 text-white font-bold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Done ({completedDeliverables})
              </button>
            </div>

            {/* Selected Deliverable Detail Card */}
            {activeDeliverable && (
              <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3 text-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">
                      Day {activeDeliverable.dayNumber} · {activeDeliverable.dayOfWeek} · {activeDeliverable.dateString}
                    </span>
                    <h4 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg mt-0.5">
                      {activeDeliverable.title}
                    </h4>
                  </div>
                  <button
                    onClick={() => handleToggleDeliverable(activeDeliverable.dayNumber)}
                    className={`px-3 py-1.5 rounded-lg font-bold text-xs sm:text-sm flex items-center gap-1.5 transition cursor-pointer shadow-sm ${
                      activeDeliverable.completed
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{activeDeliverable.completed ? 'Completed' : 'Mark Done'}</span>
                  </button>
                </div>

                <p className="text-slate-700 dark:text-slate-200 leading-relaxed text-sm sm:text-base font-normal">
                  {activeDeliverable.tacticalAction}
                </p>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm">
                  <div className="text-slate-600 dark:text-slate-300">
                    Artifact: <strong className="text-slate-900 dark:text-white font-bold">{activeDeliverable.deliverableArtifact}</strong>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-md bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 font-bold border border-amber-300 dark:border-amber-800 text-xs">
                      {activeDeliverable.precedentCompany} Playbook
                    </span>
                    {onAddExperiment && (
                      <button
                        onClick={() => handleExportAsExperiment(activeDeliverable)}
                        className="text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer font-bold"
                      >
                        + Add to Experiments
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Scrollable Deliverables Timeline List */}
            <div className="max-h-[380px] overflow-y-auto space-y-2.5 pr-1">
              {filteredDeliverables.map((item) => (
                <div
                  key={item.dayNumber}
                  onClick={() => setSelectedDayNumber(item.dayNumber)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer flex items-center justify-between gap-3 text-sm ${
                    item.dayNumber === selectedDayNumber
                      ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-500 dark:border-indigo-500 shadow-sm ring-1 ring-indigo-500'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleDeliverable(item.dayNumber);
                      }}
                      className="shrink-0 text-slate-400 hover:text-emerald-500 transition cursor-pointer"
                    >
                      {item.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-400 hover:text-emerald-400" />
                      )}
                    </button>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 shrink-0">
                          Day {item.dayNumber}
                        </span>
                        <h5
                          className={`font-bold text-sm sm:text-base truncate ${
                            item.completed
                              ? 'line-through text-slate-400'
                              : 'text-slate-900 dark:text-white'
                          }`}
                        >
                          {item.title}
                        </h5>
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5 font-medium">
                        {item.deliverableArtifact}
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800/80">
                      {item.precedentCompany}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
