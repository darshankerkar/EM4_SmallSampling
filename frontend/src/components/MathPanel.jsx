import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const mono = { fontFamily: 'var(--font-mono)' };

const StepLabel = ({ n, title }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
    <div style={{
      width: 22, height: 22, borderRadius: '50%',
      background: '#2563EB',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      <span style={{ ...mono, fontSize: 11, fontWeight: 700, color: '#fff' }}>{n}</span>
    </div>
    <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#7D8590' }}>
      {title}
    </span>
  </div>
);

const CodeBlock = ({ children }) => (
  <div style={{
    background: '#080C10',
    border: '1px solid #1C2128',
    borderRadius: 8,
    padding: '14px 16px',
    ...mono,
    fontSize: 13,
    color: '#CDD9E5',
    lineHeight: 1.8,
  }}>
    {children}
  </div>
);

const Hi = ({ children }) => (
  <span style={{ color: '#3B82F6', fontWeight: 600 }}>{children}</span>
);

const MathPanel = ({ mathProps }) => {
  const [open, setOpen] = useState(false);

  if (!mathProps) return null;

  const f = (v, d) => (v === null || v === undefined) ? '—' : Number(v).toFixed(d);

  try {
    const { differences, mean_diff, std_dev_diff, t_stat, df, cohens_d, ci_lower, ci_upper } = mathProps;
    const n = differences?.length || 0;
    const diffSum = differences?.reduce((a, b) => a + Number(b), 0) || 0;

    return (
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>

        {/* Toggle */}
        <button
          onClick={() => setOpen(o => !o)}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ ...mono, fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)' }}>
              Mathematical Derivation
            </span>
            <span style={{ ...mono, fontSize: 11, color: '#2563EB' }}>Paired t-Test · Manual</span>
          </div>
          <ChevronDown
            size={15}
            color="#7D8590"
            style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}
          />
        </button>

        {/* Accordion */}
        <div className={`panel ${open ? 'panel-open' : 'panel-closed'}`}>
          <div>
            <div style={{ borderTop: '1px solid var(--border)', padding: '24px 24px 32px' }}>

              {/* Grid of steps */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

                {/* Step 1 */}
                <div>
                  <StepLabel n={1} title="Compute Differences (d = AI Error − Human Error)" />
                  <CodeBlock>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {differences?.map((d, i) => {
                        const pos = d > 0, neg = d < 0;
                        return (
                          <div key={i} style={{
                            padding: '4px 10px',
                            borderRadius: 6,
                            border: '1px solid',
                            background: neg ? 'rgba(37,99,235,0.08)' : pos ? 'rgba(239,68,68,0.08)' : 'rgba(255,255,255,0.03)',
                            borderColor: neg ? 'rgba(37,99,235,0.2)' : pos ? 'rgba(239,68,68,0.2)' : '#1C2128',
                            color: neg ? '#60A5FA' : pos ? '#F87171' : '#7D8590',
                            fontSize: 12,
                          }}>
                            d{i+1} = {d > 0 ? '+' : ''}{f(d, 1)}
                          </div>
                        );
                      })}
                    </div>
                    <div style={{ marginTop: 12, color: '#7D8590', fontSize: 12 }}>
                      n = <Hi>{n}</Hi> &nbsp;·&nbsp; df = n−1 = <Hi>{df}</Hi>
                    </div>
                  </CodeBlock>
                </div>

                {/* Step 2 */}
                <div>
                  <StepLabel n={2} title="Mean of Differences (d̄)" />
                  <CodeBlock>
                    d̄ = Σd / n<br />
                    d̄ = {f(diffSum, 4)} / {n}<br />
                    d̄ = <Hi>{f(mean_diff, 4)}</Hi>
                  </CodeBlock>
                </div>

                {/* Step 3 */}
                <div>
                  <StepLabel n={3} title="Sample Std. Deviation (Sd)" />
                  <CodeBlock>
                    Sd = √[ Σ(d − d̄)² / (n−1) ]<br />
                    Sd = <Hi>{f(std_dev_diff, 4)}</Hi>
                  </CodeBlock>
                </div>

                {/* Step 4 */}
                <div>
                  <StepLabel n={4} title="t-Statistic Formula" />
                  <CodeBlock>
                    t = d̄ / (Sd / √n)<br />
                    t = {f(mean_diff, 4)} / ({f(std_dev_diff, 4)} / √{n})<br />
                    t = <Hi>{f(t_stat, 4)}</Hi>
                  </CodeBlock>
                </div>
              </div>

              {/* Final t value wide card */}
              <div style={{
                marginTop: 24,
                background: '#080C10',
                border: '1px solid #1C2128',
                borderRadius: 10,
                padding: '28px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: 6,
              }}>
                <span style={{ ...mono, fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#7D8590' }}>
                  Final t-Statistic
                </span>
                <span style={{ ...mono, fontSize: 52, fontWeight: 700, color: '#3B82F6', lineHeight: 1, letterSpacing: '-0.02em' }}>
                  {f(t_stat, 4)}
                </span>
              </div>

              {/* Cohen's d + CI */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 24 }}>
                <div style={{ background: '#080C10', border: '1px solid #1C2128', borderRadius: 8, padding: 16 }}>
                  <p style={{ ...mono, fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#7D8590', marginBottom: 8 }}>
                    Cohen's d — Effect Size
                  </p>
                  <p style={{ ...mono, fontSize: 28, fontWeight: 700, color: '#F0F6FC', marginBottom: 6 }}>{f(cohens_d, 3)}</p>
                  <span className={`pill ${Math.abs(cohens_d) >= 0.8 ? 'pill-blue' : 'pill-muted'}`}>
                    {Math.abs(cohens_d) < 0.2 ? 'Negligible' : Math.abs(cohens_d) < 0.5 ? 'Small' : Math.abs(cohens_d) < 0.8 ? 'Medium' : 'Large'} effect
                  </span>
                </div>
                <div style={{ background: '#080C10', border: '1px solid #1C2128', borderRadius: 8, padding: 16 }}>
                  <p style={{ ...mono, fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#7D8590', marginBottom: 8 }}>
                    95% Confidence Interval
                  </p>
                  <p style={{ ...mono, fontSize: 28, fontWeight: 700, color: '#F0F6FC', marginBottom: 6 }}>
                    [{f(ci_lower, 2)}, {f(ci_upper, 2)}]
                  </p>
                  <span style={{ ...mono, fontSize: 11, color: '#7D8590' }}>Of true mean difference</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="card" style={{ borderLeft: '3px solid var(--red)', borderRadius: '0 12px 12px 0' }}>
        <p style={{ ...mono, fontSize: 12, color: 'var(--red)' }}>Render error: {error.message}</p>
      </div>
    );
  }
};

export default MathPanel;
