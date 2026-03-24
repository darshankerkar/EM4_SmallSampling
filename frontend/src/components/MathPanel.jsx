import React from 'react';

const MathPanel = ({ mathProps }) => {
  if (!mathProps) return null;

  const { differences, mean_diff, std_dev_diff, t_stat, p_value, df, cohens_d, ci_lower, ci_upper } = mathProps;

  // Render difference array logic step
  const differencesString = differences.map(d => d.toFixed(2)).join(', ');

  const isSignificant = p_value < 0.05;

  return (
    <div className="bg-slate-800 rounded-lg shadow-lg p-6 border border-slate-700">
      <h3 className="text-xl font-bold mb-4 text-emerald-400">Mathematical Steps</h3>
      
      <div className="space-y-4 text-slate-300 font-mono text-sm leading-relaxed overflow-x-auto">
        
        {/* Step 1 */}
        <div className="bg-slate-900 p-3 rounded">
          <p className="text-slate-400 font-sans font-semibold mb-1">Step 1: Calculate Differences (d = AI_Error - Human_Error)</p>
          <p>d = [{differencesString}]</p>
          <p>n = {differences.length}</p>
          <p>Degrees of Freedom (df) = n - 1 = {df}</p>
        </div>

        {/* Step 2 */}
        <div className="bg-slate-900 p-3 rounded">
          <p className="text-slate-400 font-sans font-semibold mb-1">Step 2: Descriptive Statistics</p>
          <p>Mean Difference (d̄) = Σd / n</p>
          <p className="text-emerald-300">d̄ = {mean_diff.toFixed(4)}</p>
          <div className="my-2"></div>
          <p>Sample Standard Deviation (S_d) = √[ Σ(d - d̄)² / (n - 1) ]</p>
          <p className="text-blue-300">S_d = {std_dev_diff.toFixed(4)}</p>
        </div>

        {/* Step 3 */}
        <div className="bg-slate-900 p-3 rounded">
          <p className="text-slate-400 font-sans font-semibold mb-1">Step 3: Calculate paired t-statistic</p>
          <p>t = d̄ / (S_d / √n)</p>
          <p>t = {mean_diff.toFixed(4)} / ({std_dev_diff.toFixed(4)} / √{differences.length})</p>
          <p className="font-bold text-rose-400 text-lg mt-1">t = {t_stat.toFixed(4)}</p>
        </div>

        {/* Step 4 */}
        <div className="bg-slate-900 p-3 rounded">
          <p className="text-slate-400 font-sans font-semibold mb-1">Step 4: Hypothesis Testing & p-value</p>
          <p className="mb-2">H0: μ_d = 0 (No significant difference)</p>
          <p className="mb-2">H1: μ_d ≠ 0 (Significant difference)</p>
          <p>Approximate P-Value (two-tailed) = <span className="text-amber-300">{p_value.toFixed(5)}</span></p>
          <div className="w-full h-px bg-slate-700 my-3"></div>
          
          <p className="font-sans font-bold text-base">
            Conclusion (α = 0.05):
          </p>
          <p className={`font-sans font-semibold mt-1 p-2 rounded ${isSignificant ? 'bg-emerald-900/50 text-emerald-200' : 'bg-rose-900/50 text-rose-200'}`}>
            {isSignificant 
              ? `Since p-value (${p_value.toFixed(4)}) < 0.05, we Reject H0. There is a significant difference between AI and Human prediction accuracy.` 
              : `Since p-value (${p_value.toFixed(4)}) > 0.05, we Fail to Reject H0. There is no significant difference between AI and Human prediction accuracy.`}
          </p>
        </div>

        {/* Extras */}
        <div className="bg-slate-900 p-3 rounded font-sans text-xs flex justify-between">
          <div>
            <p className="text-slate-400 font-semibold mb-1">Extra: Cohen's d (Effect Size)</p>
            <p>d = d̄ / S_d</p>
            <p className="text-slate-200">{cohens_d.toFixed(3)}</p>
          </div>
          <div className="text-right">
            <p className="text-slate-400 font-semibold mb-1">Extra: 95% Confidence Interval</p>
            <p>[ {ci_lower.toFixed(3)} , {ci_upper.toFixed(3)} ]</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MathPanel;
