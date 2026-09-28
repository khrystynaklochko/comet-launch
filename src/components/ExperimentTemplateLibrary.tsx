import React from 'react';
import {
  Sparkles,
  BookOpen,
  ArrowRight,
  Target,
  CheckCircle2,
  XCircle,
  Clock,
  Layers,
  Zap,
  TrendingUp,
  Users,
  Copy,
  Plus,
} from 'lucide-react';
import { Experiment } from '../types/intelligence';

export interface ExperimentTemplate {
  id: string;
  category: 'outbound' | 'cro' | 'plg' | 'community' | 'pricing' | 'enterprise';
  title: string;
  tagline: string;
  hypothesis: string;
  targetIcp: string;
  channel: string;
  offer: string;
  volume: string;
  duration: string;
  successThreshold: string;
  stopCondition: string;
  industryBenchmark: string;
  archetypeReference: string;
}

export const EXPERIMENT_PLAYBOOK_TEMPLATES: ExperimentTemplate[] = [
  {
    id: 'tmpl-cold-outbound',
    category: 'outbound',
    title: 'Cold Outbound Refresh (Triple-Touch Video Teardown)',
    tagline: 'High-touch video audit to break through executive spam filters',
    hypothesis:
      'If we send hyper-personalized 45-second Loom teardowns highlighting a specific broken workflow to 30 VP of Engineering prospects, we will achieve a >=20% positive reply rate because personalized visual proof bypasses generic automated outbound filters.',
    targetIcp: 'Series A–B VP of Engineering (30 targeted Tier-1 accounts)',
    channel: 'Founder Direct Email + LinkedIn Video DM',
    offer: 'Free 15-minute tailored friction audit & interactive sandbox access',
    volume: '30 accounts',
    duration: '2 weeks',
    successThreshold: '>= 6 demo bookings (20% positive reply-to-meeting rate)',
    stopCondition: '< 2 responses after 20 sends without open engagement',
    industryBenchmark: 'Top-decile B2B outbound achieves 18–25% reply rate vs. 1.8% industry average for text-only automated drip campaigns.',
    archetypeReference: 'Stripe Early Collison Installation Playbook',
  },
  {
    id: 'tmpl-cro-landing-page',
    category: 'cro',
    title: 'Landing Page A/B Test (Pain-Killer Wedge vs. Feature Grid)',
    tagline: 'Replace generic feature messaging with an opinionated single-workflow wedge',
    hypothesis:
      'If we replace our generic platform feature headline with an opinionated single-wedge value proposition ("Cut broken CI triage time by 75% in 3 clicks"), then visitor-to-demo conversion will increase by >=35% because technical buyers respond to acute quantifiable pain over broad horizontal promises.',
    targetIcp: 'Full-stack & DevOps engineers arriving via organic search and developer communities',
    channel: 'Marketing Landing Page (50/50 split traffic)',
    offer: 'Instant interactive browser sandbox without credit card required',
    volume: '500 visitors per variant',
    duration: '10 days',
    successThreshold: '>= 8.5% visitor-to-demo conversion with 95% statistical confidence',
    stopCondition: '< 3.0% conversion rate or bounce rate spikes > 25% on Variant B',
    industryBenchmark: 'High-converting developer tool landing pages average 7–12% visitor-to-signup conversion.',
    archetypeReference: 'Linear & Supabase Homepage Positioning',
  },
  {
    id: 'tmpl-referral-loop',
    category: 'plg',
    title: 'Referral Loop Launch (In-Product Value Milestone Trigger)',
    tagline: 'Trigger viral peer invitations at the exact moment of user accomplishment',
    hypothesis:
      'If we prompt power users who achieve >=3 weekly active workflow completions to invite peer team members in exchange for unlocked enterprise audit logs, we will achieve an organic viral coefficient (K-factor) of >=0.35 because intra-company workflow sharing feels natural rather than promotional.',
    targetIcp: 'Active daily users who have completed >=3 core workflow milestones',
    channel: 'In-app milestone modal trigger + email notification invite link',
    offer: 'Free team collaboration seat + unlocked advanced audit log export',
    volume: '50 active power users',
    duration: '3 weeks',
    successThreshold: '>= 35% of invited teammates activate within 48 hours (K-factor >= 0.35)',
    stopCondition: '< 5 invites generated across the first 30 power users prompted',
    industryBenchmark: 'Top-quartile B2B PLG loops maintain a 0.25–0.40 organic viral referral factor.',
    archetypeReference: 'Figma & Slack Pod Expansion Loop',
  },
  {
    id: 'tmpl-pilot-ultimatum',
    category: 'enterprise',
    title: 'Paid Pilot Conversion Ultimatum & Mutual Action Plan',
    tagline: 'Eliminate endless free trial purgatory with time-bounded conversion criteria',
    hypothesis:
      'If we enforce a strict 30-day time-bounded pilot with predetermined measurable SLA milestones signed by the economic buyer, then pilot-to-annual contract conversion will increase to >=60% by eliminating endless free evaluation limbo.',
    targetIcp: 'Active enterprise beta pilots currently past day 21 of evaluation',
    channel: 'Executive sponsor review meeting & Mutual Action Plan (MAP)',
    offer: '20% founding-partner discount if locked before day 30; otherwise trial sandbox expires',
    volume: '5 active pilot accounts',
    duration: '3 weeks',
    successThreshold: '>= 3 pilots convert to paid annual agreements ($15k+ ACV)',
    stopCondition: 'Zero economic buyer sign-offs on Mutual Action Plan within 7 days of review',
    industryBenchmark: 'Enterprise SaaS pilot conversion benchmark is 50–70% when scoped with signed Mutual Action Plans vs 18% for unstructured pilots.',
    archetypeReference: 'Datadog & Snowflake Enterprise Sales Playbook',
  },
  {
    id: 'tmpl-community-wedge',
    category: 'community',
    title: 'Open Source Architecture Wedge (Show HN & Post-Mortem Teardown)',
    tagline: 'Build organic developer pull through radical technical honesty and benchmarking',
    hypothesis:
      'If we open-source our internal performance benchmarking harness and publish an unvarnished post-mortem teardown on Hacker News, then we will capture >=200 qualified developer signups because technical communities reward radical technical transparency over corporate marketing.',
    targetIcp: 'Senior backend architects and systems engineers',
    channel: 'Hacker News (Show HN) + GitHub Repo + r/programming',
    offer: 'Permissive MIT-licensed benchmark tool + one-command local Docker test harness',
    volume: '1 launch post + 48hr founder active comment replies',
    duration: '3 days',
    successThreshold: '>= 200 GitHub stars and >= 50 cloud/local evaluation instances deployed',
    stopCondition: 'Flagged or dropped off the front page within 2 hours without engagement',
    industryBenchmark: 'Viral developer community launches yield 200–800 initial developer trialists with zero paid ad spend.',
    archetypeReference: 'PostHog & Supabase Launch Week Motion',
  },
  {
    id: 'tmpl-pricing-value-metric',
    category: 'pricing',
    title: 'Value-Metric Pricing Shift (Per-Event vs. Seat-Based Billing)',
    tagline: 'Align pricing with value consumption to eliminate seat-sharing friction',
    hypothesis:
      'If we transition pricing from per-seat billing to a usage-based value metric (per completed workflow event), average initial contract value will increase by >=40% because enterprise buyers do not face procurement seat-sharing friction across cross-functional departments.',
    targetIcp: 'Mid-market companies with 50–250 employees in active commercial discovery',
    channel: '10 new commercial inbound and outbound demo opportunities',
    offer: 'Pilot billing based on monthly completed sync volume with transparent threshold caps',
    volume: '10 sales opportunities',
    duration: '4 weeks',
    successThreshold: '>= 4 deals closed at >= $1,200/mo MRR with zero objections to team access',
    stopCondition: '> 4 prospects cite unpredictability as the single blocker preventing signature',
    industryBenchmark: 'Value-metric SaaS models demonstrate 25–40% higher Net Revenue Retention than pure per-seat tools.',
    archetypeReference: 'Twilio & Segment Usage-Based Billing Evolution',
  },
];

interface TemplateLibraryProps {
  onSelectTemplate: (template: ExperimentTemplate, autoAdd?: boolean) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const ExperimentTemplateLibrary: React.FC<TemplateLibraryProps> = ({
  onSelectTemplate,
  isOpen,
  onToggle,
}) => {
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Playbooks' },
    { id: 'outbound', label: 'Direct Outbound' },
    { id: 'cro', label: 'Landing Page & CRO' },
    { id: 'plg', label: 'PLG & Loops' },
    { id: 'enterprise', label: 'Enterprise Pilots' },
    { id: 'community', label: 'Developer & Community' },
    { id: 'pricing', label: 'Pricing & Packaging' },
  ];

  const filteredTemplates = EXPERIMENT_PLAYBOOK_TEMPLATES.filter((t) =>
    selectedCategory === 'all' ? true : t.category === selectedCategory
  );

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-xl transition-all">
      {/* Header bar */}
      <div
        onClick={onToggle}
        className="px-5 py-4 flex items-center justify-between cursor-pointer hover:bg-slate-850 transition select-none bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border-b border-slate-800"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-tight">
                Pre-Built Strategy Playbook Library
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-950 text-indigo-400 border border-indigo-800/60">
                {EXPERIMENT_PLAYBOOK_TEMPLATES.length} INDUSTRY PLAYBOOKS
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Battle-tested experiment templates with pre-configured hypotheses, target ICPs, and quantifiable win/stop criteria.
            </p>
          </div>
        </div>

        <button className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
          <span>{isOpen ? 'Collapse Library' : 'Browse Templates'}</span>
          <ArrowRight className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
        </button>
      </div>

      {/* Expanded Library Body */}
      {isOpen && (
        <div className="p-5 space-y-4">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 pb-2 border-b border-slate-800/80 text-xs">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3 py-1 rounded-lg font-medium transition ${
                  selectedCategory === c.id
                    ? 'bg-indigo-600 text-white font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Template Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map((tmpl) => (
              <div
                key={tmpl.id}
                className="bg-slate-950/80 border border-slate-800 hover:border-indigo-500/60 rounded-xl p-4 flex flex-col justify-between space-y-3 transition-all group shadow-sm hover:shadow-indigo-500/5"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-slate-900 text-slate-300 border border-slate-800">
                      {tmpl.category.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      Ref: {tmpl.archetypeReference.split(' ')[0]}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-white group-hover:text-indigo-300 transition leading-snug">
                    {tmpl.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    {tmpl.tagline}
                  </p>

                  {/* Pre-populated Hypothesis Preview */}
                  <div className="mt-2.5 p-2.5 rounded-lg bg-slate-900/90 border border-slate-800/80 text-[11px] text-slate-300 leading-relaxed italic">
                    "{tmpl.hypothesis.length > 130 ? tmpl.hypothesis.substring(0, 130) + '...' : tmpl.hypothesis}"
                  </div>

                  {/* Bounded Criteria Preview */}
                  <div className="mt-2.5 space-y-1 text-[10px] font-mono">
                    <div className="flex items-center gap-1.5 text-emerald-400">
                      <CheckCircle2 className="w-3 h-3 shrink-0" />
                      <span className="truncate">Win: {tmpl.successThreshold}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-red-400">
                      <XCircle className="w-3 h-3 shrink-0" />
                      <span className="truncate">Stop: {tmpl.stopCondition}</span>
                    </div>
                  </div>

                  {/* Industry Standard Benchmark */}
                  <div className="mt-2 text-[10px] text-slate-400 bg-indigo-950/30 p-2 rounded border border-indigo-900/40">
                    <strong className="text-indigo-300 block font-semibold mb-0.5">Industry Standard:</strong>
                    {tmpl.industryBenchmark}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onSelectTemplate(tmpl, false)}
                    className="flex-1 py-1.5 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition text-center"
                    title="Customize details in editor before creating"
                  >
                    Customize &amp; Launch
                  </button>

                  <button
                    onClick={() => onSelectTemplate(tmpl, true)}
                    className="flex items-center gap-1 py-1.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition shadow"
                    title="1-Click add to Backlog"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Quick Add</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
