import React from 'react';
import { CompanyProfile, Experiment } from '../types/intelligence';
import { Compass, BookOpen, FlaskConical, Plus, CheckCircle, ArrowRight, ShieldAlert } from 'lucide-react';
import { RoiEstimatorTool } from './RoiEstimatorTool';

interface Props {
  company: CompanyProfile;
  allCompanies?: CompanyProfile[];
  onAddExperimentToBoard?: (experiment: Omit<Experiment, 'id' | 'status'>) => void;
  onNavigateToCockpit?: () => void;
}

export const StrategyDecompositionView: React.FC<Props> = ({
  company,
  allCompanies = [],
  onAddExperimentToBoard,
  onNavigateToCockpit,
}) => {
  const decomp = company.strategyDecomposition;

  return (
    <div className="space-y-8">
      {/* 10-Point Strategy Decomposition Matrix */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 shadow-xl">
        <div className="mb-5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-mono font-semibold bg-indigo-950 text-indigo-400 border border-indigo-800/60 mb-2">
            <Compass className="w-3.5 h-3.5" />
            ANATOMY OF A BREAKOUT
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            10-Pillar Strategic Decomposition
          </h2>
          <p className="text-xs text-slate-400">
            Every high-growth startup has an internal logic where the initial wedge, distribution loop, and moat reinforce each other.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4">
            <div className="text-[11px] font-mono text-indigo-400 uppercase tracking-wider mb-1 font-semibold">
              1. The Wedge
            </div>
            <div className="text-sm font-semibold text-white mb-1">What got them in the door?</div>
            <p className="text-xs text-slate-300 leading-relaxed">{decomp.wedge}</p>
          </div>

          <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4">
            <div className="text-[11px] font-mono text-indigo-400 uppercase tracking-wider mb-1 font-semibold">
              2. Initial ICP
            </div>
            <div className="text-sm font-semibold text-white mb-1">Who first cared deeply?</div>
            <p className="text-xs text-slate-300 leading-relaxed">{decomp.icp}</p>
          </div>

          <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4">
            <div className="text-[11px] font-mono text-indigo-400 uppercase tracking-wider mb-1 font-semibold">
              3. Acute Pain Point
            </div>
            <div className="text-sm font-semibold text-white mb-1">What burning issue triggered action?</div>
            <p className="text-xs text-slate-300 leading-relaxed">{decomp.pain}</p>
          </div>

          <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4">
            <div className="text-[11px] font-mono text-indigo-400 uppercase tracking-wider mb-1 font-semibold">
              4. The Offer
            </div>
            <div className="text-sm font-semibold text-white mb-1">What did early customers actually buy?</div>
            <p className="text-xs text-slate-300 leading-relaxed">{decomp.offer}</p>
          </div>

          <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4">
            <div className="text-[11px] font-mono text-indigo-400 uppercase tracking-wider mb-1 font-semibold">
              5. Distribution Engine
            </div>
            <div className="text-sm font-semibold text-white mb-1">How did buyers discover them?</div>
            <p className="text-xs text-slate-300 leading-relaxed">{decomp.distribution}</p>
          </div>

          <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4">
            <div className="text-[11px] font-mono text-indigo-400 uppercase tracking-wider mb-1 font-semibold">
              6. Sales Motion
            </div>
            <div className="text-sm font-semibold text-white mb-1">How were contracts closed?</div>
            <p className="text-xs text-slate-300 leading-relaxed">{decomp.salesMotion}</p>
          </div>

          <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4">
            <div className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider mb-1 font-semibold">
              7. Retention Mechanism
            </div>
            <div className="text-sm font-semibold text-white mb-1">Why did churn stay near zero?</div>
            <p className="text-xs text-slate-300 leading-relaxed">{decomp.retentionMechanism}</p>
          </div>

          <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4">
            <div className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider mb-1 font-semibold">
              8. Account Expansion
            </div>
            <div className="text-sm font-semibold text-white mb-1">How did ACV multiply over time?</div>
            <p className="text-xs text-slate-300 leading-relaxed">{decomp.expansionMechanism}</p>
          </div>

          <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4">
            <div className="text-[11px] font-mono text-amber-400 uppercase tracking-wider mb-1 font-semibold">
              9. Defensible Moat
            </div>
            <div className="text-sm font-semibold text-white mb-1">What became impossible to copy?</div>
            <p className="text-xs text-slate-300 leading-relaxed">{decomp.moat}</p>
          </div>
        </div>

        <div className="mt-4 bg-amber-950/15 border border-amber-900/40 rounded-xl p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-300 uppercase tracking-wider mb-1">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            10. Fatal Pitfalls Avoided
          </div>
          <p className="text-xs text-slate-200 leading-relaxed">{decomp.failurePointsAvoided}</p>
        </div>
      </div>

      {/* ROI & Unit Economics Estimator Tool (Customer Acquisition Cost vs LTV Benchmarks) */}
      <RoiEstimatorTool
        company={company}
        allCompanies={allCompanies}
        onNavigateToCockpit={onNavigateToCockpit}
      />

      {/* Extracted Playbook Tactics */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 shadow-xl">
        <div className="mb-5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-mono font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800/60 mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            REUSABLE TACTICAL BLUEPRINTS
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Extracted Strategic Playbooks
          </h2>
          <p className="text-xs text-slate-400">
            Proven tactics from {company.name} that can be executed by early-stage founders facing similar distribution hurdles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {company.playbookTactics.map((tactic, idx) => (
            <div
              key={idx}
              className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 flex flex-col justify-between hover:border-slate-700 transition"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-950 text-indigo-300 border border-indigo-800/60">
                    Stage: {tactic.targetStage}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">Playbook #{idx + 1}</span>
                </div>

                <h3 className="text-base font-bold text-white my-1">{tactic.name}</h3>

                <div className="space-y-2 text-xs my-3">
                  <div>
                    <span className="text-slate-500 font-semibold block text-[10px] uppercase">Best For</span>
                    <span className="text-slate-300">{tactic.bestFor}</span>
                  </div>
                  <div>
                    <span className="text-amber-500 font-semibold block text-[10px] uppercase">Known Downside / Risk</span>
                    <span className="text-slate-300">{tactic.risk}</span>
                  </div>
                </div>

                <div className="bg-slate-900/90 rounded-lg p-3 border border-slate-800/80 text-xs text-slate-200">
                  <div className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider mb-1 font-semibold">
                    How to replicate:
                  </div>
                  <p className="leading-relaxed">{tactic.actionableStep}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Experiments to Run */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 shadow-xl">
        <div className="mb-5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-mono font-semibold bg-purple-950 text-purple-400 border border-purple-800/60 mb-2">
            <FlaskConical className="w-3.5 h-3.5" />
            OPERATIONAL EXPERIMENT LAYER
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Grounded Experiments Ready to Test
          </h2>
          <p className="text-xs text-slate-400">
            Never copy advice blindly. Turn historical patterns into bounded, low-risk experiments with strict kill conditions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {company.recommendedExperiments.map((exp, idx) => (
            <div
              key={idx}
              className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 flex flex-col justify-between hover:border-slate-700 transition"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-base font-bold text-white">{exp.title}</h3>
                  <span className="text-[11px] font-mono text-purple-400 bg-purple-950/50 px-2 py-0.5 rounded border border-purple-900/40">
                    Duration: {exp.duration}
                  </span>
                </div>

                <div className="bg-slate-900/80 rounded-lg p-3 border border-slate-800/80 text-xs text-slate-200 mb-3">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-0.5">
                    HYPOTHESIS
                  </span>
                  "{exp.hypothesis}"
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                  <div className="bg-slate-900/50 p-2.5 rounded border border-slate-800/50">
                    <span className="text-slate-500 block text-[10px] uppercase font-semibold">Target ICP</span>
                    <span className="text-slate-300 text-[11px]">{exp.targetIcp}</span>
                  </div>
                  <div className="bg-slate-900/50 p-2.5 rounded border border-slate-800/50">
                    <span className="text-slate-500 block text-[10px] uppercase font-semibold">Channel &amp; Vol</span>
                    <span className="text-slate-300 text-[11px]">{exp.channel} ({exp.volume})</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs bg-slate-900/40 p-3 rounded border border-slate-800/50 mb-3">
                  <div>
                    <span className="text-emerald-400 font-semibold block text-[10px] uppercase">Success Threshold</span>
                    <span className="text-slate-200">{exp.successThreshold}</span>
                  </div>
                  <div className="pt-1.5 border-t border-slate-800/80">
                    <span className="text-red-400 font-semibold block text-[10px] uppercase">Kill / Stop Condition</span>
                    <span className="text-slate-300 italic">{exp.stopCondition}</span>
                  </div>
                </div>
              </div>

              {onAddExperimentToBoard && (
                <button
                  onClick={() =>
                    onAddExperimentToBoard({
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
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-indigo-600/90 hover:bg-indigo-600 text-white text-xs font-semibold shadow transition mt-2"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add to My Experiment Board
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
