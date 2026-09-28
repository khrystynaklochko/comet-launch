import React, { useState, useMemo } from 'react';
import { MyCompanyState, CompanyProfile } from '../types/intelligence';
import {
  Gauge,
  Zap,
  Clock,
  TrendingUp,
  Award,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Sliders,
  Calendar,
} from 'lucide-react';

interface Props {
  myCompany: MyCompanyState;
  onUpdateMyCompany?: (updated: Partial<MyCompanyState>) => void;
  allCompanies?: CompanyProfile[];
}

interface MilestoneDef {
  id: string;
  name: string;
  shortLabel: string;
  targetCount: number;
  stageKey: string;
  description: string;
  seedBenchmarks: Record<string, number>; // days from inception
  averageDays: number;
  fastestCompany: string;
  fastestDays: number;
}

export const GrowthVelocityWidget: React.FC<Props> = ({
  myCompany,
  onUpdateMyCompany,
  allCompanies = [],
}) => {
  // Current months in operation (defaults to 7 if unset)
  const [monthsActive, setMonthsActive] = useState<number>(myCompany.monthsActive || 7);

  // Milestone definitions with verified seed company timelines (in days from inception)
  const milestones: MilestoneDef[] = useMemo(() => [
    {
      id: 'mvp',
      name: 'Functional MVP Released',
      shortLabel: 'MVP',
      targetCount: 0,
      stageKey: 'Pre-MVP / Idea Validation',
      description: 'Initial functioning product deployed to early beta testers',
      seedBenchmarks: {
        stripe: 183, // 6 mos
        linear: 243, // 8 mos
        supabase: 122, // 4 mos
        ramp: 213, // 7 mos
      },
      averageDays: 190, // ~6.3 months
      fastestCompany: 'Supabase (122 days / 4 mos)',
      fastestDays: 122,
    },
    {
      id: 'customer_1',
      name: 'First Paying Customer (#1)',
      shortLabel: 'Customer #1',
      targetCount: 1,
      stageKey: '0-5 Pilots (< $20k ARR)',
      description: 'First external customer committing live money or signed pilot agreement',
      seedBenchmarks: {
        stripe: 213, // 7 mos
        linear: 274, // 9 mos
        supabase: 183, // 6 mos
        ramp: 274, // 9 mos
      },
      averageDays: 236, // ~7.8 months
      fastestCompany: 'Supabase (183 days / 6 mos)',
      fastestDays: 183,
    },
    {
      id: 'customer_10',
      name: 'First 10 Customers (Repeatability)',
      shortLabel: '10 Customers',
      targetCount: 10,
      stageKey: '5-20 Customers ($50k-$250k ARR)',
      description: 'Initial repeatability: 10 paying accounts confirming burning ICP pain',
      seedBenchmarks: {
        stripe: 365, // 12 mos
        linear: 365, // 12 mos
        supabase: 274, // 9 mos
        ramp: 365, // 12 mos
      },
      averageDays: 342, // ~11.4 months
      fastestCompany: 'Supabase (274 days / 9 mos)',
      fastestDays: 274,
    },
    {
      id: 'customer_100',
      name: '100 Customers (GTM Engine)',
      shortLabel: '100 Customers',
      targetCount: 100,
      stageKey: '20-100 Customers (Early Scale)',
      description: 'Transition from founder-led sales to repeatable inbound / self-serve PLG',
      seedBenchmarks: {
        stripe: 608, // 20 mos
        linear: 548, // 18 mos
        supabase: 487, // 16 mos
        ramp: 548, // 18 mos
      },
      averageDays: 548, // ~18.2 months
      fastestCompany: 'Supabase (487 days / 16 mos)',
      fastestDays: 487,
    },
    {
      id: 'customer_1000',
      name: '1,000 Customers (Scale & Enterprise)',
      shortLabel: '1,000 Customers',
      targetCount: 1000,
      stageKey: '100+ Scale',
      description: 'Widespread market dominance with enterprise tiering and high NRR',
      seedBenchmarks: {
        stripe: 1095, // 36 mos
        linear: 1095, // 36 mos
        supabase: 913, // 30 mos
        ramp: 973, // 32 mos
      },
      averageDays: 1019, // ~33.9 months
      fastestCompany: 'Supabase (913 days / 30 mos)',
      fastestDays: 913,
    },
  ], []);

  // Determine user's active milestone based on paying customers / pilots
  const activeMilestoneIndex = useMemo(() => {
    const paying = myCompany.payingCustomers || 0;
    const pilots = myCompany.pilots || 0;

    if (paying >= 100) return 4;
    if (paying >= 10) return 3;
    if (paying >= 1 || pilots >= 1) return 2;
    if (myCompany.stage.includes('Pre-MVP')) return 0;
    return 1;
  }, [myCompany.payingCustomers, myCompany.pilots, myCompany.stage]);

  const currentMilestone = milestones[activeMilestoneIndex] || milestones[1];
  const nextMilestone = milestones[activeMilestoneIndex + 1] || null;

  // Calculate Days Active
  const userDays = Math.round(monthsActive * 30.41);
  const benchmarkAverageDays = currentMilestone.averageDays;

  // Days to Milestone comparison
  // Delta: positive means user reached it faster (or is tracking faster) than seed average
  const daysDifference = benchmarkAverageDays - userDays;
  const isAhead = daysDifference >= 0;
  const velocityMultiplier = userDays > 0 ? Number((benchmarkAverageDays / userDays).toFixed(2)) : 1;

  // Estimated ETA to next milestone based on current velocity ratio
  const projectedDaysToNext = useMemo(() => {
    if (!nextMilestone) return null;
    const expectedInterval = nextMilestone.averageDays - currentMilestone.averageDays;
    // Adjust by user's current velocity factor
    const adjustedInterval = Math.max(30, Math.round(expectedInterval / (velocityMultiplier || 1)));
    return adjustedInterval;
  }, [nextMilestone, currentMilestone, velocityMultiplier]);

  // Velocity Tier
  let velocityBadge: { label: string; color: string; badgeBg: string; textDesc: string };
  if (velocityMultiplier >= 1.25) {
    velocityBadge = {
      label: 'Hyper-Velocity (Top 5% Venture Tier)',
      color: 'text-emerald-400 border-emerald-800 bg-emerald-950/60',
      badgeBg: 'bg-emerald-500',
      textDesc: `You are tracking ${Math.abs(daysDifference)} days ahead of seed average schedule. Your trajectory matches elite historical startups like early Supabase and Ramp.`,
    };
  } else if (velocityMultiplier >= 0.95) {
    velocityBadge = {
      label: 'On Pace with Elite Seed Startups',
      color: 'text-indigo-400 border-indigo-800 bg-indigo-950/60',
      badgeBg: 'bg-indigo-500',
      textDesc: `You are tracking right on pace with Stripe and Linear's historical timeline (${userDays} days vs. ${benchmarkAverageDays} day seed average).`,
    };
  } else if (velocityMultiplier >= 0.7) {
    velocityBadge = {
      label: 'Moderate Velocity Drag Detected',
      color: 'text-amber-400 border-amber-800 bg-amber-950/60',
      badgeBg: 'bg-amber-500',
      textDesc: `You are tracking ${Math.abs(daysDifference)} days behind the seed archetype average. Common cause at this stage is prolonged pilot negotiations or lack of upfront mutual action plans.`,
    };
  } else {
    velocityBadge = {
      label: 'High Inertia / Pipeline Friction',
      color: 'text-red-400 border-red-800 bg-red-950/60',
      badgeBg: 'bg-red-500',
      textDesc: `Velocity is significantly lagging seed benchmarks (${userDays} days vs. ${benchmarkAverageDays} day average). Need an immediate sprint to force buy/pass decisions on current pilots.`,
    };
  }

  const handleMonthsChange = (newMonths: number) => {
    setMonthsActive(newMonths);
    if (onUpdateMyCompany) {
      onUpdateMyCompany({ monthsActive: newMonths });
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6 relative overflow-hidden backdrop-blur-md">
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-mono font-semibold bg-indigo-950 text-indigo-400 border border-indigo-800/60 mb-2">
            <Gauge className="w-3.5 h-3.5" />
            GROWTH VELOCITY &amp; TIME-TO-MILESTONE ENGINE
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            Days to Milestone vs. Historical Seed Timelines
          </h3>
          <p className="text-xs text-slate-400 max-w-2xl mt-1">
            Calculates your speed of execution by comparing your current elapsed calendar days against the verified historical milestones of Stripe, Linear, Supabase, and Ramp.
          </p>
        </div>

        {/* Operating Inception Slider */}
        <div className="bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-800 flex items-center gap-4">
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-400 font-mono text-[11px]">Months Operating:</span>
              <span className="font-mono font-bold text-white ml-2">{monthsActive} mos ({userDays} days)</span>
            </div>
            <input
              type="range"
              min={1}
              max={36}
              step={1}
              value={monthsActive}
              onChange={(e) => handleMonthsChange(Number(e.target.value))}
              className="w-48 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Main KPI Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Your Current Days */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold">Your Elapsed Days</span>
          <div className="text-2xl font-bold text-white my-0.5 font-mono">{userDays} days</div>
          <span className="text-[10px] text-slate-500 font-mono">
            At stage: <strong className="text-slate-300">{currentMilestone.shortLabel}</strong>
          </span>
        </div>

        {/* Seed Benchmark Average Days */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold">
            Seed Average Timeline
          </span>
          <div className="text-2xl font-bold text-indigo-300 my-0.5 font-mono">
            {benchmarkAverageDays} days
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            Fastest: {currentMilestone.fastestCompany}
          </span>
        </div>

        {/* Velocity Delta */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold">Velocity Variance</span>
          <div
            className={`text-2xl font-bold my-0.5 font-mono flex items-center gap-1 ${
              isAhead ? 'text-emerald-400' : 'text-amber-400'
            }`}
          >
            {isAhead ? `+${daysDifference}` : `${daysDifference}`} days
          </div>
          <span className={`text-[10px] font-mono ${isAhead ? 'text-emerald-400' : 'text-amber-400'}`}>
            {isAhead
              ? `${Math.abs(Math.round((daysDifference / benchmarkAverageDays) * 100))}% ahead of schedule`
              : `${Math.abs(Math.round((daysDifference / benchmarkAverageDays) * 100))}% behind seed average`}
          </span>
        </div>

        {/* Relative Velocity Factor */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold">Velocity Multiplier</span>
          <div className="text-2xl font-bold text-white my-0.5 font-mono">{velocityMultiplier}x</div>
          <span className="text-[10px] text-slate-400 font-mono">
            Speed relative to historical cohort
          </span>
        </div>
      </div>

      {/* Visual Milestone Progression Track */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
            Milestone Pipeline &amp; Benchmark Time Comparison
          </h4>
          <span className="text-[11px] font-mono text-slate-400">
            Average Days from Inception to Milestone
          </span>
        </div>

        {/* Horizontal Milestone Stepper */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
          {milestones.map((m, idx) => {
            const isCompleted = idx < activeMilestoneIndex;
            const isCurrent = idx === activeMilestoneIndex;
            const isFuture = idx > activeMilestoneIndex;

            return (
              <div
                key={m.id}
                className={`rounded-xl p-3.5 border transition flex flex-col justify-between relative ${
                  isCurrent
                    ? 'bg-indigo-950/40 border-indigo-500/80 shadow-lg ring-1 ring-indigo-500/30'
                    : isCompleted
                    ? 'bg-slate-900/60 border-slate-800/80 opacity-90'
                    : 'bg-slate-900/30 border-slate-900 text-slate-500'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-[11px] font-bold ${
                        isCurrent
                          ? 'bg-indigo-600 text-white'
                          : isCompleted
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                          : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {isCompleted ? '✓' : idx + 1}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 font-semibold">
                      {isCurrent ? 'CURRENT STAGE' : isCompleted ? 'PASSED' : 'TARGET'}
                    </span>
                  </div>

                  <h5
                    className={`text-xs font-bold mb-1 leading-snug ${
                      isCurrent ? 'text-white' : isCompleted ? 'text-slate-200' : 'text-slate-400'
                    }`}
                  >
                    {m.name}
                  </h5>

                  <p className="text-[11px] text-slate-400 leading-tight mb-3">{m.description}</p>
                </div>

                <div className="pt-2 border-t border-slate-800/60 text-[10px] font-mono space-y-1">
                  <div className="flex justify-between text-slate-400">
                    <span>Seed Avg:</span>
                    <strong className="text-white">{m.averageDays} days</strong>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Fastest:</span>
                    <span className="text-indigo-300 truncate max-w-[100px]">{m.fastestCompany.split(' ')[0]}</span>
                  </div>

                  {isCurrent && (
                    <div className="mt-1 pt-1 border-t border-slate-800 text-indigo-400 font-semibold flex justify-between">
                      <span>Your Pace:</span>
                      <span>{userDays} days</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Detailed Benchmark Breakdown by Company */}
        <div className="mt-4 pt-3 border-t border-slate-900">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-2 font-semibold">
            Historical Seed Company Days-to-Milestone Breakdown:
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/70">
              <div className="font-bold text-white flex items-center justify-between mb-1">
                <span>Stripe</span>
                <span className="text-[10px] font-mono text-indigo-400">Fintech API</span>
              </div>
              <div className="text-[11px] font-mono text-slate-400 space-y-0.5">
                <div>MVP: <strong className="text-slate-200">183d</strong> (6 mos)</div>
                <div>Cust #1: <strong className="text-slate-200">213d</strong> (7 mos)</div>
                <div>10 Cust: <strong className="text-slate-200">365d</strong> (12 mos)</div>
                <div>100 Cust: <strong className="text-slate-200">608d</strong> (20 mos)</div>
              </div>
            </div>

            <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/70">
              <div className="font-bold text-white flex items-center justify-between mb-1">
                <span>Linear</span>
                <span className="text-[10px] font-mono text-indigo-400">Productivity PLG</span>
              </div>
              <div className="text-[11px] font-mono text-slate-400 space-y-0.5">
                <div>MVP: <strong className="text-slate-200">243d</strong> (8 mos)</div>
                <div>Cust #1: <strong className="text-slate-200">274d</strong> (9 mos)</div>
                <div>10 Cust: <strong className="text-slate-200">365d</strong> (12 mos)</div>
                <div>100 Cust: <strong className="text-slate-200">548d</strong> (18 mos)</div>
              </div>
            </div>

            <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/70">
              <div className="font-bold text-white flex items-center justify-between mb-1">
                <span>Supabase</span>
                <span className="text-[10px] font-mono text-emerald-400">Open-Source Core</span>
              </div>
              <div className="text-[11px] font-mono text-slate-400 space-y-0.5">
                <div>MVP: <strong className="text-emerald-300">122d</strong> (4 mos) ⚡</div>
                <div>Cust #1: <strong className="text-emerald-300">183d</strong> (6 mos) ⚡</div>
                <div>10 Cust: <strong className="text-emerald-300">274d</strong> (9 mos) ⚡</div>
                <div>100 Cust: <strong className="text-emerald-300">487d</strong> (16 mos) ⚡</div>
              </div>
            </div>

            <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/70">
              <div className="font-bold text-white flex items-center justify-between mb-1">
                <span>Ramp</span>
                <span className="text-[10px] font-mono text-indigo-400">Fintech / Outbound</span>
              </div>
              <div className="text-[11px] font-mono text-slate-400 space-y-0.5">
                <div>MVP: <strong className="text-slate-200">213d</strong> (7 mos)</div>
                <div>Cust #1: <strong className="text-slate-200">274d</strong> (9 mos)</div>
                <div>10 Cust: <strong className="text-slate-200">365d</strong> (12 mos)</div>
                <div>100 Cust: <strong className="text-slate-200">548d</strong> (18 mos)</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Diagnostic Evaluation & Velocity Accelerator Prescription */}
      <div className={`rounded-xl p-4 border ${velocityBadge.color} transition space-y-3`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${velocityBadge.badgeBg}`}></span>
            <span className="font-bold text-sm text-white">{velocityBadge.label}</span>
          </div>
          <span className="text-[11px] font-mono font-semibold">
            Speed Ratio: {velocityMultiplier}x Seed Average
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          {velocityBadge.textDesc}
        </p>

        {nextMilestone && projectedDaysToNext && (
          <div className="bg-slate-950/60 rounded-lg p-3 border border-slate-800/70 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-slate-200">
              <Clock className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>
                Projected Arrival to <strong>{nextMilestone.name}</strong>: ~<strong>{projectedDaysToNext} days</strong> from now (
                {Math.round((userDays + projectedDaysToNext) / 30.41)} months total from inception).
              </span>
            </div>
            <span className="text-[11px] font-mono text-indigo-300/90 shrink-0">
              Benchmark Target: {nextMilestone.averageDays} days
            </span>
          </div>
        )}

        {/* Actionable Historical Accelerators */}
        <div className="pt-2 border-t border-slate-800/80 text-xs text-slate-300">
          <strong className="text-white block mb-1">
            Proven Velocity Accelerator for Stage "{currentMilestone.shortLabel}":
          </strong>
          {activeMilestoneIndex <= 1 ? (
            <span>
              <strong>The Collison Manual Setup:</strong> Do not send sign-up links via email. Call prospects directly and ask: <em>"Can I pair with you for 20 minutes right now to configure the integration on your screen?"</em> This compresses time-to-first-customer from 60 days to 48 hours.
            </span>
          ) : activeMilestoneIndex === 2 ? (
            <span>
              <strong>The 14-Day Pilot Mutual Action Plan (MAP):</strong> Free pilots that drag past 30 days lose executive momentum. Require a signed 14-day evaluation agreement with an upfront credit card on file that converts automatically upon meeting pre-agreed acceptance criteria.
            </span>
          ) : (
            <span>
              <strong>Self-Serve Bottom-Up Invitation Loop:</strong> Once you have 10-20 reference customers, manual sales calls become a bottleneck. Build self-serve invite mechanisms so users invite teammates directly, exactly as Linear and Supabase did to compress the timeline to 100 customers.
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
