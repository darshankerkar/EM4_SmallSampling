import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { RefreshCw, Play, CheckCircle2, AlertTriangle, Bot, User } from 'lucide-react';
import MathPanel from './components/MathPanel';
import { ErrorBarChart, PredictionsLineChart } from './components/Charts';

const API = 'http://localhost:8000';

/* ── tiny helpers ─────────────────────────────────── */
const mono = { fontFamily: 'var(--font-mono)' };
const Label = ({ children }) => <p className="label">{children}</p>;

/* ── stat card ────────────────────────────────────── */
const MetricCard = ({ label, value, sub, valueColor = 'var(--white)', badge }) => (
  <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
      <span style={{ ...mono, fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)' }}>
        {label}
      </span>
      {badge && <span className={`pill pill-${badge.color}`}>{badge.text}</span>}
    </div>
    <p style={{ ...mono, fontSize: 36, fontWeight: 700, lineHeight: 1, color: valueColor, letterSpacing: '-0.02em' }}>
      {value ?? '—'}
    </p>
    {sub && <p style={{ ...mono, fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>{sub}</p>}
  </div>
);

/* ── App ──────────────────────────────────────────── */
export default function App() {
  const [students, setStudents] = useState([]);
  const [preds,    setPreds]    = useState({});
  const [results,  setResults]  = useState(null);
  const [math,     setMath]     = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [fetching, setFetching] = useState(false);
  const [err,      setErr]      = useState('');

  const load = async () => {
    setFetching(true); setErr(''); setResults(null); setMath(null);
    try {
      const { data } = await axios.get(`${API}/generate-sample?n=10`);
      setStudents(data.students);
      const blank = {};
      data.students.forEach(s => { blank[s.id] = ''; });
      setPreds(blank);
    } catch { setErr('Cannot reach backend. Is uvicorn running on port 8000?'); }
    setFetching(false);
  };

  useEffect(() => { load(); }, []);

  const change = (id, v) => setPreds(p => ({ ...p, [id]: v }));

  const run = async () => {
    const human = students.map(s => {
      const v = parseFloat(preds[s.id]);
      return isNaN(v) ? 0 : Math.max(0, Math.min(100, v));
    });
    setLoading(true); setErr('');
    try {
      const { data } = await axios.post(`${API}/predict-and-test`, { students, human_predictions: human });
      setResults(data.results);
      setMath(data.math_steps);
    } catch { setErr('Analysis failed. Check backend.'); }
    setLoading(false);
  };

  /* derived values */
  const meanAI    = results ? (results.reduce((a, r) => a + r.AIError, 0) / results.length).toFixed(2) : null;
  const meanHuman = results ? (results.reduce((a, r) => a + r.HumanError, 0) / results.length).toFixed(2) : null;
  const aiWins    = results ? +meanAI <= +meanHuman : null;
  const sigDiff   = math   && math.p_value < 0.05;

  /* ── layout ──────────────────────────────────────── */
  const page = {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '0 48px',
    paddingTop: 48,
    paddingBottom: 80,
  };
  const sectionGap = { marginBottom: 24 };

  return (
    <div style={{ minHeight: '100vh', background: '#080C10' }}>

      {/* ── HEADER ──────────────────────────────────── */}
      <div style={{ borderBottom: '1px solid var(--border)', marginBottom: 40 }}>
        <div style={{ ...page, paddingTop: 0, paddingBottom: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 20, paddingBottom: 20 }}>
            <div>
              <h1 style={{ fontSize: 28, fontWeight: 600, color: 'var(--white)', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                AI vs Human — Paired t-Test
              </h1>
              <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>
                Small-sample statistical comparison · Manual implementation · No scipy
              </p>
            </div>
            <button className="btn-ghost" onClick={load} disabled={fetching}>
              <RefreshCw size={13} style={fetching ? { animation: 'spin 1s linear infinite' } : {}} />
              {fetching ? 'Loading…' : 'New Sample'}
            </button>
          </div>
        </div>
      </div>

      <div style={page}>

        {/* ── ERROR ────────────────────────────────── */}
        {err && (
          <div style={{ ...sectionGap, borderLeft: '3px solid var(--red)', background: 'rgba(239,68,68,0.06)', borderRadius: '0 8px 8px 0', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <AlertTriangle size={14} color="var(--red)" />
            <span style={{ fontSize: 13, color: 'var(--red)', ...mono }}>{err}</span>
          </div>
        )}

        {/* ── SECTION 1: Dataset + Inputs ─────────── */}
        <div style={{ ...sectionGap, display: 'grid', gridTemplateColumns: '1fr 380px', gap: 16, alignItems: 'start' }}>

          {/* Student table */}
          <div className="card">
            <Label>Student Dataset Sample</Label>
            <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 16 }}>
              10 randomly generated students — EndSem hidden until comparison runs
            </p>
            <table className="data-table">
              <thead>
                <tr>
                  {['#', 'Mid-1', 'Mid-2', 'Internal', 'Attend.', 'Study h', 'Sleep h'].map(h => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {students.length === 0
                  ? <tr><td colSpan={7} style={{ textAlign: 'center', padding: '32px 0', color: 'var(--muted)' }}>{fetching ? 'Fetching…' : 'No data'}</td></tr>
                  : students.map(s => (
                    <tr key={s.id}>
                      <td style={{ color: 'var(--muted)' }}>S{String(s.id).padStart(2, '0')}</td>
                      <td>{s.Mid1}</td>
                      <td>{s.Mid2}</td>
                      <td>{s.Internal}</td>
                      <td>{s.Attendance}</td>
                      <td>{s.StudyHours}</td>
                      <td>{s.SleepHours}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Prediction form */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            <Label>Enter Predictions</Label>
            <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 18 }}>
              Enter your estimated EndSem score (0–100) for each student.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 12px', flex: 1 }}>
              {students.map(s => (
                <div key={s.id}>
                  <div style={{ ...mono, fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 5 }}>
                    S{String(s.id).padStart(2, '0')}
                  </div>
                  <input
                    type="number"
                    className="input"
                    placeholder="—"
                    min={0} max={100}
                    value={preds[s.id] ?? ''}
                    onChange={e => change(s.id, e.target.value)}
                  />
                </div>
              ))}
            </div>

            <button
              className="btn-primary"
              onClick={run}
              disabled={loading || students.length === 0}
              style={{ width: '100%', justifyContent: 'center', marginTop: 20 }}
            >
              <Play size={12} fill="currentColor" />
              {loading ? 'Running analysis…' : 'Execute Analysis Protocol'}
            </button>
          </div>
        </div>

        {/* ── SECTION 2-N: Results ─────────────────── */}
        {results && (
          <div className="fade-up">

            {/* Metric cards */}
            <div style={{ ...sectionGap, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              <MetricCard
                label="Mean AI Error"
                value={meanAI}
                sub={aiWins ? 'AI model wins' : 'AI underperformed'}
                valueColor={aiWins ? 'var(--green)' : 'var(--white)'}
              />
              <MetricCard
                label="Mean Human Error"
                value={meanHuman}
                sub={!aiWins ? 'Human wins' : 'Human underperformed'}
                valueColor="#EF4444"
              />
              <MetricCard
                label="t-Statistic"
                value={math?.t_stat?.toFixed(3)}
                sub={`df = ${math?.df}`}
                valueColor="var(--white)"
              />
              <MetricCard
                label="p-Value"
                value={math?.p_value?.toFixed(4)}
                sub="α = 0.05 threshold"
                valueColor="#3B82F6"
                badge={sigDiff ? { color: 'green', text: 'Significant' } : { color: 'muted', text: 'Not sig.' }}
              />
            </div>

            {/* Significance verdict */}
            <div style={{
              ...sectionGap,
              borderLeft: `3px solid ${sigDiff ? 'var(--green)' : '#F97316'}`,
              background: sigDiff ? 'rgba(34,197,94,0.05)' : 'rgba(249,115,22,0.05)',
              borderRadius: '0 8px 8px 0',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 14,
            }}>
              {sigDiff
                ? <CheckCircle2 size={16} color="var(--green)" style={{ flexShrink: 0, marginTop: 2 }} />
                : <AlertTriangle size={16} color="#F97316" style={{ flexShrink: 0, marginTop: 2 }} />}
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: sigDiff ? 'var(--green)' : '#F97316', marginBottom: 4 }}>
                  {sigDiff ? 'Reject H₀ — Statistically significant difference detected' : 'Fail to Reject H₀ — No significant difference found'}
                </p>
                <p style={{ ...mono, fontSize: 11, color: 'var(--muted)' }}>
                  H₀: μ_d = 0 &nbsp;·&nbsp; H₁: μ_d ≠ 0 &nbsp;·&nbsp; Two-tailed &nbsp;·&nbsp; p = {math?.p_value?.toFixed(4)}
                </p>
              </div>
            </div>

            {/* Results table */}
            <div className="card" style={{ ...sectionGap, padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
                <Label>Prediction Comparison Matrix</Label>
              </div>
              <table className="data-table">
                <thead>
                  <tr>
                    {['Student', 'Actual', 'AI Prediction', 'Human Prediction', 'AI Error', 'Human Error', 'Superior'].map((h, i) => (
                      <th key={i} style={{ paddingLeft: i === 0 ? 20 : 14 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.map(r => {
                    const aiBetter = r.AIError < r.HumanError;
                    const tie      = r.AIError === r.HumanError;
                    return (
                      <tr key={r.id}>
                        <td style={{ color: 'var(--muted)', paddingLeft: 20 }}>S{String(r.id).padStart(2, '0')}</td>
                        <td style={{ color: 'var(--white)', fontWeight: 600 }}>{r.Actual}</td>
                        <td style={{ color: '#60A5FA' }}>{r.AIPred}</td>
                        <td style={{ color: '#F87171' }}>{r.HumanPred}</td>
                        <td style={{ color: '#3B82F6' }}>{r.AIError}</td>
                        <td style={{ color: !aiBetter && !tie ? 'var(--red)' : 'var(--muted)' }}>{r.HumanError}</td>
                        <td>
                          {tie
                            ? <span className="pill pill-muted">Tie</span>
                            : aiBetter
                              ? <span className="pill pill-blue"><Bot size={10}/> AI</span>
                              : <span className="pill pill-muted"><User size={10}/> Human</span>
                          }
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr style={{ borderTop: '1px solid var(--border)', background: 'rgba(255,255,255,0.01)' }}>
                    <td colSpan={4} style={{ paddingLeft: 20, color: 'var(--muted)', fontSize: 11, textAlign: 'right' }}>Mean errors →</td>
                    <td style={{ color: '#3B82F6', fontWeight: 700 }}>{meanAI}</td>
                    <td style={{ color: 'var(--red)', fontWeight: 700 }}>{meanHuman}</td>
                    <td />
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Charts */}
            <div style={{ ...sectionGap, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="card" style={{ height: 360 }}>
                <Label>Error Magnitude Comparison</Label>
                <div style={{ height: 'calc(100% - 30px)', position: 'relative' }}>
                  <ErrorBarChart results={results} />
                </div>
              </div>
              <div className="card" style={{ height: 360 }}>
                <Label>Prediction vs Actual Scores</Label>
                <div style={{ height: 'calc(100% - 30px)', position: 'relative' }}>
                  <PredictionsLineChart results={results} />
                </div>
              </div>
            </div>

            {/* Math proof */}
            <div style={sectionGap}>
              <MathPanel mathProps={math} />
            </div>

          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
