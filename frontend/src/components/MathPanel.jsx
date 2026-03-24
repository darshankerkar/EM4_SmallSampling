import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

const MathPanel = ({ mathProps }) => {
  const [open, setOpen] = useState(false);
  if (!mathProps) return null;

  const { differences, mean_diff, std_dev_diff, t_stat, p_value, df, cohens_d, ci_lower, ci_upper } = mathProps;
  const n = differences.length;
  const diffSum = differences.reduce((a, b) => a + b, 0);

  return (
    <div className="bg-[#111217] border border-gray-800 rounded-2xl overflow-hidden">
      {/* Toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-sm text-gray-400 hover:text-gray-200 hover:bg-white/[0.02] transition-colors"
      >
        <span className="flex items-center gap-2 font-medium">
          {open ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
          Show Mathematical Steps
        </span>
        <span className="text-xs text-gray-600 font-mono">Paired t-Test Derivation</span>
      </button>

      {/* Content */}
      <div className={`panel ${open ? 'panel-open' : 'panel-closed'}`}>
        <div className="border-t border-gray-800 px-6 py-6 space-y-7">

          {/* Step 1 */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">
              Step 1 — Differences &nbsp; d = AI Error − Human Error
            </p>
            <div className="flex flex-wrap gap-2">
              {differences.map((d, i) => (
                <span
                  key={i}
                  className="font-mono text-xs px-2.5 py-1 rounded border"
                  style={{
                    background: d < 0 ? 'rgba(59,130,246,0.08)' : d > 0 ? 'rgba(239,68,68,0.08)' : 'rgba(255,255,255,0.03)',
                    borderColor: d < 0 ? '#1e3a5f' : d > 0 ? '#3f1515' : '#2a2a34',
                    color: d < 0 ? '#60a5fa' : d > 0 ? '#f87171' : '#9ca3af',
                  }}
                >
                  d{i + 1} = {d >= 0 ? '+' : ''}{d.toFixed(2)}
                </span>
              ))}
            </div>
            <p className="text-xs text-gray-600 mt-2">n = {n} &nbsp;·&nbsp; df = n − 1 = {df}</p>
          </div>

          {/* Step 2 */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">
              Step 2 — Mean Difference
            </p>
            <p className="font-mono text-sm text-gray-400">d̄ = Σd / n</p>
            <p className="font-mono text-sm text-gray-400">
              d̄ = {diffSum.toFixed(4)} / {n}
            </p>
            <p className="font-mono text-sm font-semibold text-blue-400">d̄ = {mean_diff.toFixed(4)}</p>
          </div>

          {/* Step 3 */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">
              Step 3 — Sample Standard Deviation
            </p>
            <p className="font-mono text-sm text-gray-400">Sd = √[ Σ(d − d̄)² / (n − 1) ]</p>
            <p className="font-mono text-sm font-semibold text-blue-400">Sd = {std_dev_diff.toFixed(4)}</p>
          </div>

          {/* Step 4 */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">
              Step 4 — t-Statistic
            </p>
            <p className="font-mono text-sm text-gray-400">t = d̄ / (Sd / √n)</p>
            <p className="font-mono text-sm text-gray-400">
              t = {mean_diff.toFixed(4)} / ({std_dev_diff.toFixed(4)} / √{n})
            </p>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-gray-500 text-sm">t =</span>
              <span className="text-white text-3xl font-bold font-mono">{t_stat.toFixed(4)}</span>
            </div>
          </div>

          {/* Extras */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="bg-[#0B0B0F] border border-gray-800 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-2">Cohen's d (Effect Size)</p>
              <p className="font-mono text-base text-gray-200 font-semibold">{cohens_d.toFixed(3)}</p>
              <p className="text-xs text-gray-600 mt-1">
                {Math.abs(cohens_d) < 0.2 ? 'Negligible' : Math.abs(cohens_d) < 0.5 ? 'Small' : Math.abs(cohens_d) < 0.8 ? 'Medium' : 'Large'} effect
              </p>
            </div>
            <div className="bg-[#0B0B0F] border border-gray-800 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-2">95% Confidence Interval</p>
              <p className="font-mono text-base text-gray-200 font-semibold">[ {ci_lower.toFixed(3)}, {ci_upper.toFixed(3)} ]</p>
              <p className="text-xs text-gray-600 mt-1">of mean difference</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default MathPanel;
