import React, { useState } from 'react';
import { Experiment } from '../types/intelligence';
import {
  FlaskConical,
  Plus,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Clock,
  Target,
  Trash2,
  Edit3,
  BookOpen,
  Sparkles,
  Check,
} from 'lucide-react';
import {
  ExperimentTemplateLibrary,
  EXPERIMENT_PLAYBOOK_TEMPLATES,
  ExperimentTemplate,
} from './ExperimentTemplateLibrary';

interface Props {
  experiments: Experiment[];
  onUpdateExperiment: (id: string, updates: Partial<Experiment>) => void;
  onAddExperiment: (exp: Omit<Experiment, 'id' | 'status'>) => void;
  onDeleteExperiment: (id: string) => void;
}

export const ExperimentBoardView: React.FC<Props> = ({
  experiments,
  onUpdateExperiment,
  onAddExperiment,
  onDeleteExperiment,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [isTemplateLibraryOpen, setIsTemplateLibraryOpen] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [newExp, setNewExp] = useState({
    title: '',
    hypothesis: '',
    targetIcp: '',
    channel: '',
    offer: '',
    volume: '30 accounts',
    duration: '2 weeks',
    successThreshold: '',
    stopCondition: '',
  });

  const columns: Array<{ id: Experiment['status']; title: string; color: string }> = [
    { id: 'backlog', title: 'Experiment Backlog', color: 'border-slate-700 text-slate-300' },
    { id: 'testing', title: 'In-Market Testing', color: 'border-indigo-600 text-indigo-400' },
    { id: 'validated', title: 'Validated (Institutionalize)', color: 'border-emerald-600 text-emerald-400' },
    { id: 'killed', title: 'Killed (Extracted Learning)', color: 'border-red-600 text-red-400' },
  ];

  const handleSelectTemplate = (template: ExperimentTemplate, autoAdd = false) => {
    const populated = {
      title: template.title,
      hypothesis: template.hypothesis,
      targetIcp: template.targetIcp,
      channel: template.channel,
      offer: template.offer,
      volume: template.volume,
      duration: template.duration,
      successThreshold: template.successThreshold,
      stopCondition: template.stopCondition,
    };

    if (autoAdd) {
      onAddExperiment(populated);
      setToastMessage(`✓ Added "${template.title}" to Backlog!`);
      setTimeout(() => setToastMessage(null), 3500);
    } else {
      setNewExp(populated);
      setShowAddModal(true);
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExp.title || !newExp.hypothesis) return;
    onAddExperiment(newExp);
    setShowAddModal(false);
    setToastMessage(`✓ Created experiment "${newExp.title}"`);
    setTimeout(() => setToastMessage(null), 3500);

    setNewExp({
      title: '',
      hypothesis: '',
      targetIcp: '',
      channel: '',
      offer: '',
      volume: '30 accounts',
      duration: '2 weeks',
      successThreshold: '',
      stopCondition: '',
    });
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-white" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-mono font-semibold bg-indigo-950 text-indigo-400 border border-indigo-800/60 mb-1">
            <FlaskConical className="w-3.5 h-3.5" />
            STRATEGY EXECUTION ENGINE
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Strategy Experiment Board
          </h2>
          <p className="text-xs text-slate-400">
            Never bet the company on unvalidated assumptions. Track bounded GTM tests with quantifiable win bars and stop conditions.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => setIsTemplateLibraryOpen(!isTemplateLibraryOpen)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white font-semibold text-xs border border-slate-700 transition"
          >
            <BookOpen className="w-4 h-4 text-indigo-400" />
            <span>{isTemplateLibraryOpen ? 'Hide Templates' : 'Template Library'}</span>
          </button>

          <button
            onClick={() => {
              setNewExp({
                title: '',
                hypothesis: '',
                targetIcp: '',
                channel: '',
                offer: '',
                volume: '30 accounts',
                duration: '2 weeks',
                successThreshold: '',
                stopCondition: '',
              });
              setShowAddModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg transition"
          >
            <Plus className="w-4 h-4" />
            Create Experiment
          </button>
        </div>
      </div>

      {/* Strategy Template Library Section */}
      <ExperimentTemplateLibrary
        isOpen={isTemplateLibraryOpen}
        onToggle={() => setIsTemplateLibraryOpen(!isTemplateLibraryOpen)}
        onSelectTemplate={handleSelectTemplate}
      />

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
        {columns.map((col) => {
          const colExperiments = experiments.filter((e) => e.status === col.id);
          return (
            <div
              key={col.id}
              className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 flex flex-col min-h-[500px]"
            >
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
                <span className={`text-xs font-bold uppercase tracking-wider ${col.color}`}>
                  {col.title}
                </span>
                <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-400 font-mono text-[11px] flex items-center justify-center font-bold">
                  {colExperiments.length}
                </span>
              </div>

              <div className="space-y-3 flex-1">
                {colExperiments.map((exp) => (
                  <div
                    key={exp.id}
                    className="bg-slate-950/90 border border-slate-800 rounded-lg p-3.5 shadow-sm hover:border-slate-700 transition flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-1 mb-1.5">
                        <h4 className="text-xs font-bold text-white leading-tight">{exp.title}</h4>
                        <button
                          onClick={() => onDeleteExperiment(exp.id)}
                          className="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition p-0.5"
                          title="Delete Experiment"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <p className="text-[11px] text-slate-300 leading-relaxed italic mb-2 bg-slate-900/60 p-2 rounded border border-slate-800/60">
                        "{exp.hypothesis}"
                      </p>

                      <div className="space-y-1 text-[11px] text-slate-400 mb-2">
                        <div>
                          <strong className="text-slate-300">Target:</strong> {exp.targetIcp}
                        </div>
                        <div>
                          <strong className="text-slate-300">Channel:</strong> {exp.channel} ({exp.volume})
                        </div>
                      </div>

                      <div className="text-[10px] space-y-1 pt-1.5 border-t border-slate-900 text-slate-400 font-mono">
                        <div className="text-emerald-400 truncate">Win: {exp.successThreshold}</div>
                        <div className="text-red-400 truncate">Stop: {exp.stopCondition}</div>
                      </div>

                      {exp.learnings && (
                        <div className="mt-2 p-2 rounded bg-indigo-950/40 border border-indigo-900/50 text-[11px] text-indigo-200">
                          <strong className="text-indigo-400 block text-[10px] uppercase">Learnings:</strong>
                          {exp.learnings}
                        </div>
                      )}
                    </div>

                    {/* Stage Movement Controls */}
                    <div className="pt-3 mt-3 border-t border-slate-900 flex items-center justify-between text-[10px]">
                      <span className="text-slate-500 font-mono">{exp.duration}</span>

                      <div className="flex items-center gap-1">
                        {col.id !== 'backlog' && (
                          <button
                            onClick={() => onUpdateExperiment(exp.id, { status: 'backlog' })}
                            className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-400"
                            title="Move to Backlog"
                          >
                            Backlog
                          </button>
                        )}
                        {col.id !== 'testing' && (
                          <button
                            onClick={() => onUpdateExperiment(exp.id, { status: 'testing' })}
                            className="px-1.5 py-0.5 rounded bg-indigo-950 hover:bg-indigo-900 text-indigo-300 border border-indigo-800/50"
                            title="Start Testing"
                          >
                            Test
                          </button>
                        )}
                        {col.id !== 'validated' && (
                          <button
                            onClick={() => {
                              const note = prompt('What key learning validated this hypothesis?');
                              onUpdateExperiment(exp.id, {
                                status: 'validated',
                                learnings: note || exp.learnings,
                              });
                            }}
                            className="px-1.5 py-0.5 rounded bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/50"
                            title="Mark Validated"
                          >
                            Win
                          </button>
                        )}
                        {col.id !== 'killed' && (
                          <button
                            onClick={() => {
                              const note = prompt('Why was this killed? (Record insight to avoid repeating)');
                              onUpdateExperiment(exp.id, {
                                status: 'killed',
                                learnings: note || exp.learnings,
                              });
                            }}
                            className="px-1.5 py-0.5 rounded bg-red-950 hover:bg-red-900 text-red-300 border border-red-800/50"
                            title="Kill Experiment"
                          >
                            Kill
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {colExperiments.length === 0 && (
                  <div className="h-32 border border-dashed border-slate-800 rounded-lg flex items-center justify-center text-xs text-slate-600">
                    No experiments in this stage
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Custom Experiment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-lg w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Create Bounded Strategy Experiment</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            {/* Template Quick Loader inside Modal */}
            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Autofill from Playbook Template:</span>
              </div>
              <select
                onChange={(e) => {
                  const tmpl = EXPERIMENT_PLAYBOOK_TEMPLATES.find((t) => t.id === e.target.value);
                  if (tmpl) {
                    setNewExp({
                      title: tmpl.title,
                      hypothesis: tmpl.hypothesis,
                      targetIcp: tmpl.targetIcp,
                      channel: tmpl.channel,
                      offer: tmpl.offer,
                      volume: tmpl.volume,
                      duration: tmpl.duration,
                      successThreshold: tmpl.successThreshold,
                      stopCondition: tmpl.stopCondition,
                    });
                  }
                }}
                defaultValue=""
                className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 max-w-[230px] truncate"
              >
                <option value="" disabled>Choose a template...</option>
                {EXPERIMENT_PLAYBOOK_TEMPLATES.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title}
                  </option>
                ))}
              </select>
            </div>

            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Experiment Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Paid Pilot Conversion Ultimatum"
                  value={newExp.title}
                  onChange={(e) => setNewExp({ ...newExp, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Hypothesis (Cause &amp; Effect)
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="If we [action], then [metric] because [reason]..."
                  value={newExp.hypothesis}
                  onChange={(e) => setNewExp({ ...newExp, hypothesis: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Target ICP</label>
                  <input
                    type="text"
                    placeholder="e.g. 30 Series A CTOs"
                    value={newExp.targetIcp}
                    onChange={(e) => setNewExp({ ...newExp, targetIcp: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Channel &amp; Vol</label>
                  <input
                    type="text"
                    placeholder="e.g. Founder LinkedIn (30 accounts)"
                    value={newExp.channel}
                    onChange={(e) => setNewExp({ ...newExp, channel: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Bounded Offer</label>
                <input
                  type="text"
                  placeholder="e.g. Free 15-minute architecture audit"
                  value={newExp.offer}
                  onChange={(e) => setNewExp({ ...newExp, offer: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-emerald-400 block mb-1">Success Win Threshold</label>
                  <input
                    type="text"
                    placeholder="e.g. >= 5 qualified demos"
                    value={newExp.successThreshold}
                    onChange={(e) => setNewExp({ ...newExp, successThreshold: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-red-400 block mb-1">Stop / Kill Condition</label>
                  <input
                    type="text"
                    placeholder="e.g. < 2 replies after 25 targets"
                    value={newExp.stopCondition}
                    onChange={(e) => setNewExp({ ...newExp, stopCondition: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow"
                >
                  Save to Backlog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

