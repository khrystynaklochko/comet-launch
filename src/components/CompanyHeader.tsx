import React from 'react';
import { CompanyProfile } from '../types/intelligence';
import { Building2, Globe, Calendar, MapPin, Award, ArrowUpRight, Sparkles } from 'lucide-react';

interface Props {
  company: CompanyProfile;
  onAnalyzeSimilar?: () => void;
}

export const CompanyHeader: React.FC<Props> = ({ company, onAnalyzeSimilar }) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm mb-6 space-y-4">
      <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2.5 mb-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 dark:text-white tracking-tight">
              {company.name}
            </h1>
            <span className="px-3 py-1 rounded-lg text-xs sm:text-sm font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
              {company.category}
            </span>
            <span className="px-3 py-1 rounded-lg text-xs sm:text-sm font-bold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              {company.targetSegment} · {company.businessModel}
            </span>
            <span className="px-3 py-1 rounded-lg text-xs sm:text-sm font-bold bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              {company.status}
            </span>
          </div>

          <p className="text-slate-700 dark:text-slate-200 text-sm sm:text-base leading-relaxed max-w-3xl mb-3.5 font-normal">
            {company.summary}
          </p>

          <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-indigo-500" />
              Founded {company.foundingYear}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-500" />
              {company.hq}
            </span>
            <a
              href={`https://${company.domain}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
            >
              <Globe className="w-4 h-4 text-indigo-500" />
              {company.domain}
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
            <span className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-500" />
              Initial Financing: <strong className="text-slate-900 dark:text-white font-bold">{company.originStory.firstFinancing}</strong>
            </span>
          </div>
        </div>

        {onAnalyzeSimilar && (
          <button
            onClick={onAnalyzeSimilar}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-sm font-bold shadow-md shadow-indigo-600/25 transition whitespace-nowrap cursor-pointer shrink-0"
          >
            <Sparkles className="w-4 h-4 text-indigo-100" />
            Analyze Similar Startup
          </button>
        )}
      </div>

      {/* Founders DNA & Wedge in compact cards */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {company.founders.map((f, i) => (
            <div
              key={i}
              className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 text-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="font-bold text-slate-900 dark:text-white text-base">{f.name}</span>
                  <span className="px-2 py-0.5 rounded text-xs font-bold bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {f.archetype}
                  </span>
                </div>
                <div className="text-indigo-600 dark:text-indigo-400 font-mono text-xs mb-1.5 font-semibold">{f.role}</div>
                <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed mb-2.5">{f.background}</p>
              </div>
              <div className="pt-2.5 border-t border-slate-200/80 dark:border-slate-800 text-xs text-indigo-700 dark:text-indigo-300 font-medium">
                <span className="font-bold text-indigo-600 dark:text-indigo-400">Advantage: </span>
                {f.priorAdvantage}
              </div>
            </div>
          ))}

          {/* Initial Wedge */}
          <div className="bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/50 rounded-xl p-3.5 text-sm flex flex-col justify-between">
            <div>
              <div className="font-bold text-indigo-700 dark:text-indigo-300 text-sm mb-1.5">
                The Initial Wedge
              </div>
              <p className="text-slate-800 dark:text-slate-200 text-xs sm:text-sm leading-relaxed mb-2.5 font-medium">
                "{company.originStory.initialWedge}"
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs pt-2.5 border-t border-indigo-200/80 dark:border-indigo-900/40 text-slate-600 dark:text-slate-300 font-mono">
              <div>MVP: <span className="font-bold text-slate-900 dark:text-white">{company.originStory.monthsToMvp} mos</span></div>
              <div>First Customer: <span className="font-bold text-slate-900 dark:text-white">{company.originStory.monthsToFirstCustomer} mos</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
