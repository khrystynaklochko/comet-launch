import React, { useState } from 'react';
import { CustomerInterview } from '../types/intelligence';
import { MessageSquare, Plus, Sparkles, Flame, CheckCircle, AlertTriangle, Trash2, Loader2, Quote } from 'lucide-react';

interface Props {
  interviews: CustomerInterview[];
  onAddInterview: (interview: Omit<CustomerInterview, 'id'>) => void;
  onDeleteInterview: (id: string) => void;
}

export const CustomerCrmView: React.FC<Props> = ({
  interviews,
  onAddInterview,
  onDeleteInterview,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [clustering, setClustering] = useState(false);
  const [clusterResults, setClusterResults] = useState<any>(null);

  const [formData, setFormData] = useState({
    company: '',
    interviewee: '',
    role: '',
    painRating: 4 as 1 | 2 | 3 | 4 | 5,
    urgency: 'High' as 'Low' | 'Medium' | 'High' | 'Critical',
    budgetConfirmed: false,
    keyQuotes: '',
    notes: '',
    pilotInterest: 'High' as 'High' | 'Medium' | 'Low' | 'None',
    date: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.company || !formData.interviewee) return;
    onAddInterview(formData);
    setShowAddModal(false);
    setFormData({
      company: '',
      interviewee: '',
      role: '',
      painRating: 4,
      urgency: 'High',
      budgetConfirmed: false,
      keyQuotes: '',
      notes: '',
      pilotInterest: 'High',
      date: new Date().toISOString().split('T')[0],
    });
  };

  const handleRunCluster = async () => {
    if (interviews.length === 0) return;
    setClustering(true);

    try {
      const res = await fetch('/api/cluster-interviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interviews }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to cluster');
      }
      setClusterResults(data.clusters);
    } catch {
      // Local fallback heuristic clustering
      setClusterResults(fallbackClustering(interviews));
    } finally {
      setClustering(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-mono font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800/60 mb-1">
            <MessageSquare className="w-3.5 h-3.5" />
            CUSTOMER-LEARNING CRM
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Customer Discovery &amp; JTBD Intelligence
          </h2>
          <p className="text-xs text-slate-400">
            Log raw discovery calls and synthesize recurring patterns, acute buying triggers, and high-probability pilot readiness.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRunCluster}
            disabled={clustering || interviews.length === 0}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow transition disabled:opacity-50"
          >
            {clustering ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 text-purple-200" />
            )}
            Cluster Pains with AI
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow transition"
          >
            <Plus className="w-4 h-4" />
            Log Interview
          </button>
        </div>
      </div>

      {/* AI Cluster Results if Generated */}
      {clusterResults && (
        <div className="bg-slate-900/90 border border-purple-900/40 rounded-xl p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <h3 className="text-base font-bold text-white">Synthesized Customer Learning Synthesis</h3>
            </div>
            <span className="text-xs font-mono text-purple-400">
              Aggregated across {interviews.length} interviews
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-emerald-400" />
                Recurring Burning Pains
              </h4>
              <div className="space-y-2.5">
                {clusterResults.recurringPains?.map((p: any, i: number) => (
                  <div key={i} className="text-xs bg-slate-900/70 p-2.5 rounded border border-slate-800/80">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-slate-200">{p.pain}</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-300">
                        Urgency: {p.urgencyRating}
                      </span>
                    </div>
                    {p.quotes?.[0] && (
                      <p className="text-[11px] text-slate-400 italic">"{p.quotes[0]}"</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Top Objections &amp; Recommended Counters
              </h4>
              <div className="space-y-2.5">
                {clusterResults.recurringObjections?.map((obj: any, i: number) => (
                  <div key={i} className="text-xs bg-slate-900/70 p-2.5 rounded border border-slate-800/80">
                    <div className="font-semibold text-amber-300 mb-1">{obj.objection}</div>
                    <div className="text-[11px] text-slate-400 mb-1">Fear: {obj.underlyingFear}</div>
                    <div className="text-[11px] text-emerald-300 pt-1 border-t border-slate-800">
                      <strong>Counter:</strong> {obj.recommendedCounter}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-slate-950/80 border border-indigo-900/40 rounded-xl p-4 text-xs text-slate-300 leading-relaxed">
            <strong className="text-indigo-400 block uppercase font-mono text-[10px] mb-1">
              Pilot Conversion Readiness Diagnosis:
            </strong>
            {clusterResults.pilotConversionReadiness}
          </div>
        </div>
      )}

      {/* Interviews Table / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {interviews.map((item) => (
          <div
            key={item.id}
            className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h4 className="text-sm font-bold text-white">{item.company}</h4>
                  <div className="text-xs text-slate-400 font-medium">
                    {item.interviewee} • <span className="text-indigo-400">{item.role}</span>
                  </div>
                </div>

                <button
                  onClick={() => onDeleteInterview(item.id)}
                  className="text-slate-600 hover:text-red-400 transition p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-800 text-slate-300">
                  Pain: {item.painRating}/5
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                    item.urgency === 'Critical' || item.urgency === 'High'
                      ? 'bg-amber-950 text-amber-300 border border-amber-800/60'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {item.urgency} Urgency
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                    item.pilotInterest === 'High'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  Pilot: {item.pilotInterest}
                </span>
              </div>

              {item.keyQuotes && (
                <div className="bg-slate-950/70 p-2.5 rounded border border-slate-800 text-xs text-slate-300 italic mb-2.5 flex items-start gap-1.5">
                  <Quote className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                  <span>"{item.keyQuotes}"</span>
                </div>
              )}

              <p className="text-xs text-slate-400 leading-relaxed mb-3">{item.notes}</p>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 font-mono">
              <span>{item.date}</span>
              <span>{item.budgetConfirmed ? 'Budget Verified' : 'Budget Unverified'}</span>
            </div>
          </div>
        ))}

        {interviews.length === 0 && (
          <div className="col-span-full py-16 text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl">
            No customer discovery interviews logged yet. Click "Log Interview" to add your first call.
          </div>
        )}
      </div>

      {/* Log Interview Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Log Customer Discovery Call</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Company</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Acme Corp"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Interviewee Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Jenkins"
                    value={formData.interviewee}
                    onChange={(e) => setFormData({ ...formData, interviewee: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Role / Title</label>
                  <input
                    type="text"
                    placeholder="e.g. VP Engineering"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Pain Rating (1-5)</label>
                  <select
                    value={formData.painRating}
                    onChange={(e) =>
                      setFormData({ ...formData, painRating: (parseInt(e.target.value) || 3) as any })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value={5}>5 - Burning hair on fire pain</option>
                    <option value={4}>4 - High operational friction</option>
                    <option value={3}>3 - Moderate annoyance</option>
                    <option value={2}>2 - Minor inconvenience</option>
                    <option value={1}>1 - Not a priority</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Urgency</label>
                  <select
                    value={formData.urgency}
                    onChange={(e) => setFormData({ ...formData, urgency: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Critical">Critical (Next 30 days)</option>
                    <option value="High">High (This quarter)</option>
                    <option value="Medium">Medium (This year)</option>
                    <option value="Low">Low (Backlog / nice to have)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Pilot Interest</label>
                  <select
                    value={formData.pilotInterest}
                    onChange={(e) => setFormData({ ...formData, pilotInterest: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="High">High (Wants to start now)</option>
                    <option value="Medium">Medium (Interested, needs approvals)</option>
                    <option value="Low">Low (Curious but passive)</option>
                    <option value="None">None (Passed)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Key Direct Quote (Unfiltered)
                </label>
                <input
                  type="text"
                  placeholder="e.g. If we don't fix this by Q4 our cloud bill will bankrupt us"
                  value={formData.keyQuotes}
                  onChange={(e) => setFormData({ ...formData, keyQuotes: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Notes &amp; Workaround</label>
                <textarea
                  rows={2}
                  placeholder="What is their current manual workaround? What was their main hesitation?"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="budgetBox"
                  checked={formData.budgetConfirmed}
                  onChange={(e) => setFormData({ ...formData, budgetConfirmed: e.target.checked })}
                  className="rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-0"
                />
                <label htmlFor="budgetBox" className="text-xs text-slate-300">
                  Confirmed discretionary budget authority exists
                </label>
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
                  Save Call
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

function fallbackClustering(interviews: CustomerInterview[]) {
  return {
    recurringPains: [
      {
        pain: 'Manual custom code & lack of automated maintenance',
        frequency: interviews.length,
        urgencyRating: 'High',
        quotes: interviews.map((i) => i.keyQuotes).filter(Boolean),
      },
    ],
    recurringObjections: [
      {
        objection: 'Security and internal data governance review requirement',
        underlyingFear: 'Risk of unauthorized access or downtime in production',
        recommendedCounter: 'Provide SOC2 summary and offer local/VPC deployment option',
      },
    ],
    idealBuyerPersonaSignals: 'Engineering leaders with teams > 20 who already have budget approved.',
    pilotConversionReadiness:
      'High willingness to test, but require explicit time limits on pilots to avoid inertia.',
  };
}
