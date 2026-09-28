import React, { useState, useEffect } from 'react';
import { CompanyProfile, MyCompanyState, Experiment, CustomerInterview } from './types/intelligence';
import { SEED_COMPANIES } from './data/seedCompanies';
import { CompanyHeader } from './components/CompanyHeader';
import { FirstCustomersView } from './components/FirstCustomersView';
import { PositioningPricingView } from './components/PositioningPricingView';
import { TimelineView } from './components/TimelineView';
import { StrategyDecompositionView } from './components/StrategyDecompositionView';
import { ComparisonMatrixView } from './components/ComparisonMatrixView';
import { StrategicDecisionCockpit } from './components/StrategicDecisionCockpit';
import { ExperimentBoardView } from './components/ExperimentBoardView';
import { CustomerCrmView } from './components/CustomerCrmView';
import { AnalyzeCompanyModal } from './components/AnalyzeCompanyModal';
import { GrowthChatbotCalendarView } from './components/GrowthChatbotCalendarView';
import {
  Compass,
  Search,
  Sparkles,
  Users,
  GitBranch,
  Layers,
  Scale,
  FlaskConical,
  MessageSquare,
  Download,
  BookOpen,
  ChevronDown,
  Building2,
  Check,
  Sun,
  Moon,
  Bot,
  Calendar,
} from 'lucide-react';

export default function App() {
  // Companies list (seed + user analyzed)
  const [companies, setCompanies] = useState<CompanyProfile[]>(() => {
    const saved = localStorage.getItem('strat_companies');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Failed to parse saved companies', e);
      }
    }
    return SEED_COMPANIES;
  });

  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(() => {
    return SEED_COMPANIES[0].id;
  });

  // Active navigation tab
  type TabType =
    | 'first_customers'
    | 'strategy_decomposition'
    | 'positioning_pricing'
    | 'timeline'
    | 'comparison'
    | 'decision_cockpit'
    | 'growth_planner'
    | 'experiment_board'
    | 'customer_crm';

  const [activeTab, setActiveTab] = useState<TabType>('growth_planner');

  // UI Theme state (defaults to 'light' for a clean, lighter modern UI)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('strat_theme') as 'light' | 'dark') || 'light';
  });

  useEffect(() => {
    localStorage.setItem('strat_theme', theme);
    if (theme === 'light') {
      document.documentElement.classList.add('light-theme');
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.classList.remove('light-theme');
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Search input
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Modal for analyzing new companies with Gemini
  const [showAnalyzeModal, setShowAnalyzeModal] = useState(false);

  // User's own company profile & strategic execution state
  const [myCompany, setMyCompany] = useState<MyCompanyState>(() => {
    const saved = localStorage.getItem('strat_my_company');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      name: 'AgentFlow Labs',
      stage: '0-5 Pilots (< $20k ARR)',
      pilots: 4,
      payingCustomers: 1,
      description: 'Autonomous code refactoring & modernization pipeline for legacy enterprise Java systems.',
      bottleneck: 'Free pilots are dragging on past 60 days without converting to paid production contracts.',
      currentMotion: 'Founder-led cold outbound to engineering VPs on LinkedIn.',
      targetIcp: 'VPs of Engineering at 50-300 person B2B software companies with >5-year-old codebases.',
      monthsActive: 7,
      financials: {
        cashBalance: 450000,
        monthlyRevenue: 8500,
        operatingExpenses: 38000,
      },
      experiments: [
        {
          id: 'exp-1',
          title: '14-Day Pilot Mutual Action Plan (MAP)',
          hypothesis: 'Requiring an upfront signed pilot agreement with a pre-agreed success metric and credit card on file will double pilot-to-paid conversion.',
          targetIcp: 'Next 3 inbound or outbound pilot requests',
          channel: 'Direct founder onboarding Zoom call',
          offer: '14-day capped modernization pilot of 1 single microservice',
          volume: '3 accounts',
          duration: '14 days',
          successThreshold: '>= 2 signed conversions to annual contract',
          stopCondition: 'If 3 prospects refuse credit card upfront, recalibrate trust collateral',
          status: 'testing',
          createdAt: '2026-09-20',
        },
        {
          id: 'exp-2',
          title: 'Founder-Assisted Onboarding Live Sprint',
          hypothesis: 'Sitting with the lead developer to run the first migration command removes 90% of technical hesitation.',
          targetIcp: 'Active pilot champions',
          channel: 'Scheduled 30-minute pairing session',
          offer: 'Founder pairs live to guarantee successful execution',
          volume: '4 active accounts',
          duration: '7 days',
          successThreshold: '100% of pilots complete first command within 48 hours',
          stopCondition: '< 2 developers show up to pairing session',
          status: 'validated',
          learnings: 'Engineers loved the live pairing. Conversion inertia was entirely friction in their local bash terminal, not product capability.',
          createdAt: '2026-09-18',
        },
      ],
      interviews: [
        {
          id: 'int-1',
          company: 'FintechScale Inc',
          interviewee: 'Alex Chen',
          role: 'VP of Platform Engineering',
          painRating: 5,
          urgency: 'Critical',
          budgetConfirmed: true,
          keyQuotes: 'Our legacy monolithic Java 8 service is holding back all our new microservice releases. We spend 30% of engineering bandwidth babysitting dependencies.',
          notes: 'High urgency. Has $40k discretionary budget. Terrified of security audit downtime.',
          pilotInterest: 'High',
          date: '2026-09-22',
        },
        {
          id: 'int-2',
          company: 'HealthOps Health',
          interviewee: 'Rachel Gomez',
          role: 'Chief Technology Officer',
          painRating: 4,
          urgency: 'High',
          budgetConfirmed: false,
          keyQuotes: 'We want to modernize, but HIPAA compliance and code review approvals take weeks. A vendor cannot access our production database.',
          notes: 'Must support local air-gapped or VPC execution. Does not want cloud data sharing.',
          pilotInterest: 'Medium',
          date: '2026-09-24',
        },
      ],
    };
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('strat_companies', JSON.stringify(companies));
  }, [companies]);

  useEffect(() => {
    localStorage.setItem('strat_my_company', JSON.stringify(myCompany));
  }, [myCompany]);

  const activeCompany = companies.find((c) => c.id === selectedCompanyId) || companies[0];

  const handleCompanyAnalyzed = (newCompany: CompanyProfile) => {
    setCompanies((prev) => [newCompany, ...prev.filter((c) => c.id !== newCompany.id)]);
    setSelectedCompanyId(newCompany.id);
  };

  const handleUpdateMyCompany = (updated: Partial<MyCompanyState>) => {
    setMyCompany((prev) => ({ ...prev, ...updated }));
  };

  const handleAddExperiment = (exp: Omit<Experiment, 'id' | 'status'>) => {
    const created: Experiment = {
      ...exp,
      id: `exp-${Date.now()}`,
      status: 'backlog',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setMyCompany((prev) => ({
      ...prev,
      experiments: [created, ...prev.experiments],
    }));
    setActiveTab('experiment_board');
  };

  const handleUpdateExperiment = (id: string, updates: Partial<Experiment>) => {
    setMyCompany((prev) => ({
      ...prev,
      experiments: prev.experiments.map((e) => (e.id === id ? { ...e, ...updates } : e)),
    }));
  };

  const handleDeleteExperiment = (id: string) => {
    setMyCompany((prev) => ({
      ...prev,
      experiments: prev.experiments.filter((e) => e.id !== id),
    }));
  };

  const handleAddInterview = (interview: Omit<CustomerInterview, 'id'>) => {
    const created: CustomerInterview = {
      ...interview,
      id: `int-${Date.now()}`,
    };
    setMyCompany((prev) => ({
      ...prev,
      interviews: [created, ...prev.interviews],
    }));
  };

  const handleDeleteInterview = (id: string) => {
    setMyCompany((prev) => ({
      ...prev,
      interviews: prev.interviews.filter((i) => i.id !== id),
    }));
  };

  const filteredCompanies = companies.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.businessModel.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExportBrief = () => {
    const markdown = `# STRATEGIC DOSSIER: ${activeCompany.name.toUpperCase()}
Category: ${activeCompany.category}
Founding Year: ${activeCompany.foundingYear} | HQ: ${activeCompany.hq}
Initial Financing: ${activeCompany.originStory.firstFinancing}

## 1. THE INITIAL WEDGE & ORIGIN
- Original Problem: ${activeCompany.originStory.originalProblem}
- Initial Wedge: ${activeCompany.originStory.initialWedge}
- Velocity: ${activeCompany.originStory.monthsToMvp} mos to MVP, ${activeCompany.originStory.monthsToFirstCustomer} mos to First Customer

## 2. HOW THEY GOT THEIR FIRST 10 CUSTOMERS
${activeCompany.firstCustomers
  .map(
    (c) =>
      `### Customer #${c.number}: ${c.nameOrType} (${c.date})
- Acquisition Channel: ${c.channel}
- Buyer Persona: ${c.buyerPersona}
- Acute Pain: ${c.initialPain}
- Terms & ACV: ${c.contractType} (${c.estimatedAcv})
- Founder Labor: ${c.founderInvolvement}
- Evidence: [${c.confidence}] ${c.evidence}`
  )
  .join('\n\n')}

## 3. STRATEGY DECOMPOSITION
- Wedge: ${activeCompany.strategyDecomposition.wedge}
- Target ICP: ${activeCompany.strategyDecomposition.icp}
- Distribution Engine: ${activeCompany.strategyDecomposition.distribution}
- Sales Motion: ${activeCompany.strategyDecomposition.salesMotion}
- Retention Mechanism: ${activeCompany.strategyDecomposition.retentionMechanism}
- Moat: ${activeCompany.strategyDecomposition.moat}
- Pitfalls Avoided: ${activeCompany.strategyDecomposition.failurePointsAvoided}

## 4. POSITIONING EVOLUTION
${activeCompany.positioningEvolution
  .map(
    (p) =>
      `### Era ${p.year}: "${p.headline}"
Subhead: "${p.subheadline}"
CTA: ${p.cta} | ICP: ${p.targetIcp}`
  )
  .join('\n\n')}
`;

    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeCompany.id}-strategic-dossier.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`min-h-screen ${theme === 'light' ? 'light-theme bg-slate-50 text-slate-900' : 'bg-slate-950 text-slate-100'} flex flex-col font-sans selection:bg-indigo-500 selection:text-white transition-colors duration-150`}>
      {/* Top Navigation Bar adhering to Top Bar Contract */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-950/90 border-b border-slate-200 dark:border-slate-800/80 backdrop-blur-md px-4 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Zone 1: Single text element wordmark with icon */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/25">
              <Compass className="w-5 h-5" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-slate-900 dark:text-white">
              StratEngine
            </span>
          </div>

          {/* Zone 2: Navigation Links (Single-line controls) */}
          <nav className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-sm font-medium overflow-x-auto no-scrollbar max-w-full">
            <button
              onClick={() => setActiveTab('growth_planner')}
              className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap text-sm ${
                activeTab === 'growth_planner'
                  ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                  : 'text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white/60 dark:hover:bg-slate-800/60'
              }`}
            >
              <Bot className="w-4 h-4 text-indigo-200" />
              <span>Growth Planner</span>
            </button>

            <button
              onClick={() => setActiveTab('decision_cockpit')}
              className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap text-sm ${
                activeTab === 'decision_cockpit'
                  ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                  : 'text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-white/60 dark:hover:bg-slate-800/60'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Cockpit</span>
            </button>

            <button
              onClick={() => setActiveTab('first_customers')}
              className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap text-sm ${
                ['first_customers', 'strategy_decomposition', 'timeline', 'positioning_pricing', 'comparison'].includes(activeTab)
                  ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                  : 'text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white/60 dark:hover:bg-slate-800/60'
              }`}
            >
              <Users className="w-4 h-4 text-emerald-400" />
              <span>Playbooks</span>
            </button>

            <button
              onClick={() => setActiveTab('experiment_board')}
              className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap text-sm ${
                activeTab === 'experiment_board'
                  ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                  : 'text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white/60 dark:hover:bg-slate-800/60'
              }`}
            >
              <FlaskConical className="w-4 h-4 text-cyan-400" />
              <span>Experiments</span>
              <span className="font-mono text-xs text-indigo-200">({myCompany.experiments.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('customer_crm')}
              className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap text-sm ${
                activeTab === 'customer_crm'
                  ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                  : 'text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white/60 dark:hover:bg-slate-800/60'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-pink-400" />
              <span>CRM</span>
            </button>
          </nav>

          {/* Zone 3: Primary Actions */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Company Dropdown / Switcher */}
            <div className="relative">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 text-sm font-medium text-slate-800 dark:text-slate-200 transition min-w-[150px] justify-between cursor-pointer shadow-xs"
              >
                <div className="flex items-center gap-2 truncate">
                  <Building2 className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span className="truncate font-semibold">{activeCompany.name}</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </button>

              {isSearchOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 p-2 space-y-1">
                  <div className="relative mb-2">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      placeholder="Search archetype..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="max-h-60 overflow-y-auto space-y-0.5">
                    {filteredCompanies.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => {
                          setSelectedCompanyId(c.id);
                          setIsSearchOpen(false);
                          setSearchQuery('');
                        }}
                        className={`w-full text-left px-2.5 py-2 rounded-lg text-xs flex items-center justify-between transition cursor-pointer ${
                          c.id === selectedCompanyId
                            ? 'bg-indigo-600 text-white font-medium'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <div className="truncate">
                          <div>{c.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{c.category}</div>
                        </div>
                        {c.id === selectedCompanyId && <Check className="w-3.5 h-3.5 text-white" />}
                      </button>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 mt-1">
                    <button
                      onClick={() => {
                        setIsSearchOpen(false);
                        setShowAnalyzeModal(true);
                      }}
                      className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/80 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-xs font-medium border border-indigo-200 dark:border-indigo-800/60 cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                      Analyze New Company with AI
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Analyze Startup Button */}
            <button
              onClick={() => setShowAnalyzeModal(true)}
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-semibold shadow-md shadow-indigo-500/25 transition cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-indigo-100" />
              <span>Analyze Startup</span>
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition cursor-pointer shadow-xs"
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4 text-indigo-600" />
              ) : (
                <Sun className="w-4 h-4 text-amber-400" />
              )}
            </button>
          </div>
        </div>

        {/* Sub-Navigation for Playbooks only when active */}
        {['first_customers', 'strategy_decomposition', 'timeline', 'positioning_pricing', 'comparison'].includes(activeTab) && (
          <div className="max-w-7xl mx-auto mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1.5 text-sm">
              <button
                onClick={() => setActiveTab('first_customers')}
                className={`px-3.5 py-1.5 rounded-lg transition cursor-pointer font-medium ${
                  activeTab === 'first_customers'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                First 10 Customers
              </button>
              <button
                onClick={() => setActiveTab('strategy_decomposition')}
                className={`px-3.5 py-1.5 rounded-lg transition cursor-pointer font-medium ${
                  activeTab === 'strategy_decomposition'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Strategy &amp; Tactics
              </button>
              <button
                onClick={() => setActiveTab('timeline')}
                className={`px-3.5 py-1.5 rounded-lg transition cursor-pointer font-medium ${
                  activeTab === 'timeline'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Timeline &amp; Stress
              </button>
              <button
                onClick={() => setActiveTab('positioning_pricing')}
                className={`px-3.5 py-1.5 rounded-lg transition cursor-pointer font-medium ${
                  activeTab === 'positioning_pricing'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Pricing Evolution
              </button>
              <button
                onClick={() => setActiveTab('comparison')}
                className={`px-3.5 py-1.5 rounded-lg transition cursor-pointer font-medium ${
                  activeTab === 'comparison'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Comparison Matrix
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-6 flex-1 w-full">
        {/* If in company-view modes, show the canonical profile card */}
        {['first_customers', 'strategy_decomposition', 'positioning_pricing', 'timeline'].includes(activeTab) && (
          <CompanyHeader
            company={activeCompany}
            onAnalyzeSimilar={() => setShowAnalyzeModal(true)}
          />
        )}

        {/* Tab 1: How They Got Their First Customers */}
        {activeTab === 'first_customers' && <FirstCustomersView company={activeCompany} />}

        {/* Tab 2: Strategy Decomposition & Tactics */}
        {activeTab === 'strategy_decomposition' && (
          <StrategyDecompositionView
            company={activeCompany}
            allCompanies={companies}
            onAddExperimentToBoard={handleAddExperiment}
            onNavigateToCockpit={() => setActiveTab('decision_cockpit')}
          />
        )}

        {/* Tab 3: Timeline & Stress Signals */}
        {activeTab === 'timeline' && <TimelineView company={activeCompany} />}

        {/* Tab 4: Positioning & Pricing Evolution */}
        {activeTab === 'positioning_pricing' && (
          <PositioningPricingView company={activeCompany} />
        )}

        {/* Tab 5: Multi-Company Comparison Matrix */}
        {activeTab === 'comparison' && <ComparisonMatrixView allCompanies={companies} />}

        {/* Tab 6: Strategic Decision Cockpit ("What Should I Do?") */}
        {activeTab === 'decision_cockpit' && (
          <StrategicDecisionCockpit
            myCompany={myCompany}
            onUpdateMyCompany={handleUpdateMyCompany}
            onAddExperiment={handleAddExperiment}
            allCompanies={companies}
            onNavigateToGrowthPlanner={() => setActiveTab('growth_planner')}
          />
        )}

        {/* Tab: AI Growth Strategist & Daily Deliverables Calendar */}
        {activeTab === 'growth_planner' && (
          <GrowthChatbotCalendarView
            myCompany={myCompany}
            onUpdateMyCompany={handleUpdateMyCompany}
            onAddExperiment={handleAddExperiment}
            allCompanies={companies}
          />
        )}

        {/* Tab 7: Strategy Experiment Board */}
        {activeTab === 'experiment_board' && (
          <ExperimentBoardView
            experiments={myCompany.experiments}
            onUpdateExperiment={handleUpdateExperiment}
            onAddExperiment={handleAddExperiment}
            onDeleteExperiment={handleDeleteExperiment}
          />
        )}

        {/* Tab 8: Customer-Learning CRM */}
        {activeTab === 'customer_crm' && (
          <CustomerCrmView
            interviews={myCompany.interviews}
            onAddInterview={handleAddInterview}
            onDeleteInterview={handleDeleteInterview}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
          <span>StratEngine — Startup Reverse-Engineering &amp; Strategy Decision Operating System</span>
          <span className="font-mono text-[11px] text-slate-400">
            Powered by verifiable historical evidence &amp; Gemini 3.8 Flash
          </span>
        </div>
      </footer>

      {/* AI Reverse-Engineering Modal */}
      <AnalyzeCompanyModal
        isOpen={showAnalyzeModal}
        onClose={() => setShowAnalyzeModal(false)}
        onCompanyAnalyzed={handleCompanyAnalyzed}
      />
    </div>
  );
}
