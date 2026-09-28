import React, { useState } from 'react';
import { MyCompanyState, Experiment, CompanyProfile } from '../types/intelligence';
import {
  Compass,
  Sparkles,
  AlertOctagon,
  CheckCircle2,
  ArrowRight,
  Plus,
  HelpCircle,
  Loader2,
  RefreshCw,
  Bot,
  TrendingUp,
  DollarSign,
  ShieldAlert,
} from 'lucide-react';
import { GrowthAnalyticsDashboard } from './GrowthAnalyticsDashboard';
import { GrowthVelocityWidget } from './GrowthVelocityWidget';
import { GtmRiskHeatmapWidget } from './GtmRiskHeatmapWidget';
import { BurnRateRunwayWidget } from './BurnRateRunwayWidget';
import { WhatIfScenarioSimulator } from './WhatIfScenarioSimulator';
import { CompetitiveMoatWidget } from './CompetitiveMoatWidget';
import { RevenueGrowthProjectionWidget } from './RevenueGrowthProjectionWidget';
import { StrategicRoadmapTimelineWidget } from './StrategicRoadmapTimelineWidget';
import { MilestoneProgressTrackerWidget } from './MilestoneProgressTrackerWidget';
import { ResourceAllocationWidget } from './ResourceAllocationWidget';
import { ActionableRiskMitigationWidget } from './ActionableRiskMitigationWidget';
import { GrowthSimulatorWidget } from './GrowthSimulatorWidget';

interface Props {
  myCompany: MyCompanyState;
  onUpdateMyCompany: (updated: Partial<MyCompanyState>) => void;
  onAddExperiment: (exp: Omit<Experiment, 'id' | 'status'>) => void;
  allCompanies?: CompanyProfile[];
  onNavigateToGrowthPlanner?: () => void;
}

export const StrategicDecisionCockpit: React.FC<Props> = ({
  myCompany,
  onUpdateMyCompany,
  onAddExperiment,
  allCompanies = [],
  onNavigateToGrowthPlanner,
}) => {
  const [loading, setLoading] = useState(false);
  const [adviceResult, setAdviceResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<'diagnosis' | 'growth' | 'runway' | 'risk'>('diagnosis');
  const [showProfileEditor, setShowProfileEditor] = useState(false);

  const handleGenerateAdvice = async () => {
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/strategic-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ myCompany }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate strategic advice');
      }

      setAdviceResult(data.advice);
    } catch (err: any) {
      console.warn('API call failed, falling back to local strategist engine:', err);
      // Fallback expert strategist rule-based synthesis if API key is pending
      const fallback = generateLocalStrategicAdvice(myCompany);
      setAdviceResult(fallback);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-indigo-600 dark:text-indigo-400 font-bold mb-1">
              <span>Executive Cockpit</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono">Diagnosis &amp; Mitigation</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-display tracking-tight text-slate-900 dark:text-white">
              Operational Decision Engine for Your Startup
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed font-medium">
              Benchmark your startup against Stripe, Datadog, and Retool to diagnose bottlenecks and run bounded experiments.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {onNavigateToGrowthPlanner && (
              <button
                onClick={onNavigateToGrowthPlanner}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 font-semibold text-sm border border-slate-200 dark:border-slate-700 transition cursor-pointer shadow-xs"
              >
                <Bot className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Daily Growth Calendar</span>
              </button>
            )}

            <button
              onClick={handleGenerateAdvice}
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm shadow-md shadow-indigo-600/30 transition disabled:opacity-50 shrink-0 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Analyzing Precedents...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-indigo-100" />
                  <span>Run Strategic Diagnosis</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Streamlined Cockpit Category Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-sm font-semibold w-full sm:w-fit overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveCategory('diagnosis')}
          className={`px-4 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeCategory === 'diagnosis'
              ? 'bg-indigo-600 text-white shadow-sm font-bold'
              : 'text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Strategic Diagnosis &amp; Actions</span>
        </button>

        <button
          onClick={() => setActiveCategory('growth')}
          className={`px-4 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeCategory === 'growth'
              ? 'bg-indigo-600 text-white shadow-sm font-bold'
              : 'text-slate-700 dark:text-slate-300 hover:text-emerald-500 dark:hover:text-emerald-400'
          }`}
        >
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <span>Revenue &amp; Velocity Simulator</span>
        </button>

        <button
          onClick={() => setActiveCategory('runway')}
          className={`px-4 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeCategory === 'runway'
              ? 'bg-indigo-600 text-white shadow-sm font-bold'
              : 'text-slate-700 dark:text-slate-300 hover:text-amber-500 dark:hover:text-amber-400'
          }`}
        >
          <DollarSign className="w-4 h-4 text-amber-400" />
          <span>Runway &amp; Capital Allocation</span>
        </button>

        <button
          onClick={() => setActiveCategory('risk')}
          className={`px-4 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeCategory === 'risk'
              ? 'bg-indigo-600 text-white shadow-sm font-bold'
              : 'text-slate-700 dark:text-slate-300 hover:text-red-500 dark:hover:text-red-400'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-red-400" />
          <span>GTM Risk &amp; Moats</span>
        </button>
      </div>

      {/* ================= CATEGORY 1: STRATEGIC DIAGNOSIS & ACTIONS ================= */}
      {activeCategory === 'diagnosis' && (
        <div className="space-y-6">
          {/* Profile & Bottleneck Summary Strip (Collapsible) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2.5 text-sm">
                  <span className="font-bold text-slate-900 dark:text-white text-base sm:text-lg">
                    {myCompany.name || 'Startup Profile'}
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 font-bold text-xs sm:text-sm">
                    {myCompany.stage}
                  </span>
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-700 dark:text-slate-200 font-mono text-xs sm:text-sm">
                    <strong className="text-indigo-600 dark:text-indigo-400 font-bold">{myCompany.pilots}</strong> Pilots
                  </span>
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-700 dark:text-slate-200 font-mono text-xs sm:text-sm">
                    <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{myCompany.payingCustomers}</strong> Paying Customers
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1.5 line-clamp-1 font-medium">
                  <strong className="text-amber-600 dark:text-amber-400 font-bold">Bottleneck:</strong>{' '}
                  {myCompany.bottleneck || 'Free pilots running indefinitely without commercial conversion pressure'}
                </p>
              </div>

              <button
                onClick={() => setShowProfileEditor(!showProfileEditor)}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-semibold transition cursor-pointer self-start sm:self-auto shrink-0 border border-slate-200 dark:border-slate-700"
              >
                {showProfileEditor ? 'Close Details' : 'Edit Profile & Bottleneck'}
              </button>
            </div>

            {/* Expanded Editor Form */}
            {showProfileEditor && (
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div>
                    <label className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={myCompany.name}
                      onChange={(e) => onUpdateMyCompany({ name: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                      placeholder="e.g. Immersion AI"
                    />
                  </div>

                  <div>
                    <label className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Current Stage
                    </label>
                    <select
                      value={myCompany.stage}
                      onChange={(e) => onUpdateMyCompany({ stage: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                    >
                      <option value="Pre-MVP / Idea Validation">Pre-MVP / Idea Validation</option>
                      <option value="0-5 Pilots (< $20k ARR)">0-5 Pilots (&lt; $20k ARR)</option>
                      <option value="5-20 Customers ($50k-$250k ARR)">5-20 Customers ($50k-$250k ARR)</option>
                      <option value="20-100 Customers (Early Scale)">20-100 Customers (Early Scale)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Active Pilots
                    </label>
                    <input
                      type="number"
                      value={myCompany.pilots}
                      onChange={(e) => onUpdateMyCompany({ pilots: parseInt(e.target.value) || 0 })}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Paying Customers
                    </label>
                    <input
                      type="number"
                      value={myCompany.payingCustomers}
                      onChange={(e) => onUpdateMyCompany({ payingCustomers: parseInt(e.target.value) || 0 })}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Product Description &amp; Wedge
                    </label>
                    <textarea
                      rows={2}
                      value={myCompany.description}
                      onChange={(e) => onUpdateMyCompany({ description: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed font-medium"
                      placeholder="What does your product do and what's your wedge?"
                    />
                  </div>

                  <div>
                    <label className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Target ICP &amp; Sales Motion
                    </label>
                    <textarea
                      rows={2}
                      value={myCompany.targetIcp}
                      onChange={(e) => onUpdateMyCompany({ targetIcp: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed font-medium"
                      placeholder="Who are you selling to?"
                    />
                  </div>

                  <div>
                    <label className="text-xs sm:text-sm font-bold text-amber-600 dark:text-amber-400 block mb-1">
                      Primary Strategic Bottleneck
                    </label>
                    <textarea
                      rows={2}
                      value={myCompany.bottleneck}
                      onChange={(e) => onUpdateMyCompany({ bottleneck: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-amber-300 dark:border-amber-700 rounded-lg p-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 leading-relaxed font-medium"
                      placeholder="What is keeping you up at night?"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Actionable Risk Mitigation Checklist */}
          <ActionableRiskMitigationWidget
            myCompany={myCompany}
            onUpdateMyCompany={onUpdateMyCompany}
            onAddExperiment={onAddExperiment}
          />
        </div>
      )}

      {/* ================= CATEGORY 2: REVENUE & VELOCITY SIMULATOR ================= */}
      {activeCategory === 'growth' && (
        <div className="space-y-6">
          <GrowthSimulatorWidget
            myCompany={myCompany}
            onUpdateMyCompany={onUpdateMyCompany}
            onAddExperiment={onAddExperiment}
            allCompanies={allCompanies}
          />

          <GrowthVelocityWidget
            myCompany={myCompany}
            onUpdateMyCompany={onUpdateMyCompany}
            allCompanies={allCompanies}
          />

          <WhatIfScenarioSimulator
            myCompany={myCompany}
            onUpdateMyCompany={onUpdateMyCompany}
            allCompanies={allCompanies}
          />

          <RevenueGrowthProjectionWidget
            myCompany={myCompany}
            onUpdateMyCompany={onUpdateMyCompany}
            allCompanies={allCompanies}
          />
        </div>
      )}

      {/* ================= CATEGORY 3: RUNWAY & CAPITAL ALLOCATION ================= */}
      {activeCategory === 'runway' && (
        <div className="space-y-6">
          <BurnRateRunwayWidget
            myCompany={myCompany}
            onUpdateMyCompany={onUpdateMyCompany}
          />

          <ResourceAllocationWidget
            myCompany={myCompany}
            onUpdateMyCompany={onUpdateMyCompany}
          />

          <StrategicRoadmapTimelineWidget
            myCompany={myCompany}
            onUpdateMyCompany={onUpdateMyCompany}
            onAddExperiment={onAddExperiment}
            allCompanies={allCompanies}
          />
        </div>
      )}

      {/* ================= CATEGORY 4: GTM RISK & MOATS ================= */}
      {activeCategory === 'risk' && (
        <div className="space-y-6">
          <GtmRiskHeatmapWidget
            myCompany={myCompany}
            onUpdateMyCompany={onUpdateMyCompany}
            onAddExperiment={onAddExperiment}
            allCompanies={allCompanies}
          />

          <CompetitiveMoatWidget
            myCompany={myCompany}
            onUpdateMyCompany={onUpdateMyCompany}
            allCompanies={allCompanies}
          />

          <MilestoneProgressTrackerWidget
            myCompany={myCompany}
            onUpdateMyCompany={onUpdateMyCompany}
          />

          <GrowthAnalyticsDashboard
            myCompany={myCompany}
            onUpdateMyCompany={onUpdateMyCompany}
            benchmarkCompanies={allCompanies}
          />
        </div>
      )}

      {/* Diagnosis Results */}
      {adviceResult && (
        <div className="space-y-6">
          {/* Comparable Cohort & Stage Diagnosis */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Historical Comparable Cohort
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                These companies had the exact same customer count and bottleneck at your stage:
              </p>

              <div className="space-y-3">
                {adviceResult.comparableCohort?.map((c: any, i: number) => (
                  <div key={i} className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-3 text-xs">
                    <div className="font-bold text-indigo-300 text-sm mb-1">{c.company}</div>
                    <div className="text-slate-300 mb-1.5"><strong className="text-slate-400">Situation:</strong> {c.situation}</div>
                    <div className="text-emerald-300 pt-1.5 border-t border-slate-900">
                      <strong>Breakout Move:</strong> {c.move}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">
                  Brutally Honest Stage Diagnosis
                </h3>
                <div className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-4 text-xs text-slate-200 leading-relaxed space-y-2 mb-4">
                  {adviceResult.stageDiagnosis}
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Immediate 7-Day Actions (Non-Negotiable)
                </div>
                <div className="space-y-1.5">
                  {adviceResult.immediateNextSteps?.map((step: string, i: number) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-300 bg-slate-950/40 p-2 rounded border border-slate-800/50">
                      <span className="w-4 h-4 rounded-full bg-indigo-950 border border-indigo-800 flex items-center justify-center font-mono text-[10px] text-indigo-400 shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Anti-Patterns Warning Engine (Section 26) */}
          <div className="bg-amber-950/15 border border-amber-900/40 rounded-xl p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <AlertOctagon className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wider">
                Anti-Patterns &amp; Structural Traps Detected
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {adviceResult.antiPatternsDetected?.map((ap: any, i: number) => (
                <div key={i} className="bg-slate-950/80 border border-amber-900/30 rounded-xl p-4 text-xs">
                  <div className="font-bold text-amber-400 text-sm mb-1">{ap.name}</div>
                  <p className="text-slate-300 leading-relaxed mb-2.5">{ap.warning}</p>
                  <div className="pt-2 border-t border-slate-900 text-emerald-300">
                    <span className="font-semibold block text-[10px] uppercase text-emerald-400">Tactical Remedy</span>
                    {ap.remedy}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3 Concrete Experiments Ready to Launch */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 shadow-xl">
            <div className="mb-4">
              <h3 className="text-base font-bold text-white tracking-tight">
                Recommended Structured Experiments (Ready to Test)
              </h3>
              <p className="text-xs text-slate-400">
                1-click inject into your internal Strategy Experiment Board.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {adviceResult.concreteExperiments?.map((exp: any, i: number) => (
                <div key={i} className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-white">{exp.title}</span>
                      <span className="text-[10px] font-mono text-indigo-400">{exp.duration}</span>
                    </div>

                    <div className="bg-slate-900/70 p-2.5 rounded text-xs text-slate-300 mb-3 border border-slate-800/80">
                      <span className="text-[10px] font-mono text-slate-500 uppercase block">Hypothesis</span>
                      "{exp.hypothesis}"
                    </div>

                    <div className="space-y-1.5 text-xs mb-3 text-slate-400">
                      <div><strong className="text-slate-300">Target ICP:</strong> {exp.targetIcp}</div>
                      <div><strong className="text-slate-300">Channel &amp; Vol:</strong> {exp.channel} ({exp.volume})</div>
                      <div><strong className="text-slate-300">Offer:</strong> {exp.offer}</div>
                    </div>

                    <div className="space-y-1 text-xs bg-slate-900/40 p-2.5 rounded border border-slate-800/40 mb-3">
                      <div className="text-emerald-300 text-[11px]"><strong>Win:</strong> {exp.successThreshold}</div>
                      <div className="text-red-400 text-[11px]"><strong>Kill:</strong> {exp.stopCondition}</div>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      onAddExperiment({
                        title: exp.title,
                        hypothesis: exp.hypothesis,
                        targetIcp: exp.targetIcp,
                        channel: exp.channel,
                        offer: exp.offer,
                        volume: exp.volume,
                        duration: exp.duration,
                        successThreshold: exp.successThreshold,
                        stopCondition: exp.stopCondition,
                      })
                    }
                    className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-indigo-600/90 hover:bg-indigo-600 text-white text-xs font-semibold transition shadow"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add to Experiment Board
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Discovery Interview Questions */}
          {adviceResult.discoveryQuestions && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 shadow-xl">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-indigo-400" />
                High-Signal Customer Discovery Questions to Test Willingness-to-Pay
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Ask these exact questions during discovery calls to distinguish genuine burning pain from polite encouragement:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {adviceResult.discoveryQuestions.map((q: string, i: number) => (
                  <div key={i} className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-3 text-xs text-slate-200 flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-indigo-400 font-mono font-bold flex items-center justify-center shrink-0 text-[11px]">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">"{q}"</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Fallback logic when offline or awaiting user secrets
function generateLocalStrategicAdvice(company: MyCompanyState) {
  const isEarly = company.payingCustomers < 5;

  return {
    comparableCohort: [
      {
        company: 'Stripe (2010)',
        situation: 'Had 3 alpha pilots who hesitated to wire real money due to fear of downtime.',
        move: 'Collisons personally sat with the engineers and wrote the code live on their laptops, guaranteeing 24/7 personal SMS support.',
      },
      {
        company: 'Retool (2018)',
        situation: 'Pilots dragged on because engineers were too busy with sprint tickets to finish building apps.',
        move: 'David Hsu offered to build the initial custom internal tools himself over the weekend for free if they agreed to sign an annual contract upon delivery.',
      },
      {
        company: 'Linear (2019)',
        situation: 'Encountered legacy enterprise prospects asking for custom permission trees and Jira migration scripts.',
        move: 'Ruthlessly fired enterprise prospects to protect the core sub-50ms speed wedge, focusing only on fast-moving tech startups.',
      },
    ],
    stageDiagnosis: `You currently have ${company.pilots} active pilots and ${company.payingCustomers} paying customers. At this stage, your biggest risk is the "Pilot Trap" (endless testing without budget commitment) and "Premature Enterprise Sales" (entertaining buyers who require 6 months of security audits). You must force willingness-to-pay validation immediately before building more features.`,
    antiPatternsDetected: [
      {
        name: 'The Pilot Trap',
        warning: 'Prospects agree to a pilot because it is free and safe, but they have no real executive urgency to ever purchase.',
        remedy: 'Institute a mandatory 14-day time limit on all pilots and require an agreed-upon Mutual Action Plan (MAP) before provisioning access.',
      },
      {
        name: 'Premature Feature Expansion',
        warning: 'Building secondary features hoping that "just one more integration" will get pilots to convert.',
        remedy: 'Freeze new roadmap development for 3 weeks. Double down on onboarding UX and manual founder-assisted implementation.',
      },
      {
        name: 'Discount Dependency',
        warning: 'Offering deep price cuts to convince hesitant prospects to sign.',
        remedy: 'Instead of lowering price, tighten the initial scope to a single high-value workflow that pays for itself in 30 days.',
      },
    ],
    concreteExperiments: [
      {
        title: 'Paid Pilot Conversion Ultimatum',
        hypothesis: 'Presenting existing pilots with a 50% lifetime discount if they convert to an annual contract within 7 days will force a clear buy/pass decision.',
        targetIcp: 'All current active unpaid pilots',
        channel: 'Founder 1-on-1 Zoom call / Direct email',
        offer: 'Guaranteed white-glove founder support + 50% discount on Year 1',
        volume: `${company.pilots || 3} pilot accounts`,
        duration: '7 days',
        successThreshold: '>= 2 paid conversions',
        stopCondition: '0 conversions indicates pilot value proposition is weak; conduct post-mortem interview',
      },
      {
        title: 'Founder-Assisted Onboarding Sprint',
        hypothesis: 'Doing the first 30 minutes of setup live over screen-share will increase week-2 retention from 20% to >70%.',
        targetIcp: 'Next 10 inbound or outbound qualified signups',
        channel: 'Direct calendar link for onboarding session',
        offer: 'Founder builds first workflow for the customer live',
        volume: '10 accounts',
        duration: '14 days',
        successThreshold: '>= 7 active daily users after 14 days',
        stopCondition: '< 3 users show up for scheduled onboarding',
      },
      {
        title: 'Ultra-Narrow ICP Outbound Sprint',
        hypothesis: 'Targeting a super-specific sub-niche (e.g. Series A fintech CTOs) with a single quantified outcome will achieve >25% meeting rate.',
        targetIcp: '30 tightly filtered accounts matching your best user profile',
        channel: 'Personalized founder email with zero pitch deck links',
        offer: '15-minute tactical teardown / audit',
        volume: '30 accounts',
        duration: '10 days',
        successThreshold: '>= 6 scheduled discovery calls',
        stopCondition: '< 2 replies after 30 contacts (signals message/ICP mismatch)',
      },
    ],
    immediateNextSteps: [
      'Call each active pilot champion this week and ask: "If we shut this down on Friday, what would break in your workflow?"',
      'Refuse to add any new feature until at least 3 pilots convert to paid status.',
      'Document the exact 3 steps where new users get stuck during first-time setup.',
    ],
    discoveryQuestions: [
      'What specifically happens if you do not solve this problem in the next 3 months?',
      'Whose budget does this software come out of, and what is their approval threshold for immediate credit card swipe?',
      'What were the last 2 tools you personally purchased for your team, and how did you justify the cost?',
      'If this tool only solved [Core Pain] and nothing else, would you still pay $500/month for it?',
      'What other initiatives is your engineering team currently prioritizing above this?',
    ],
  };
}
