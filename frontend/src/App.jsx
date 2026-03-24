import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MathPanel from './components/MathPanel';
import { ErrorBarChart, PredictionsLineChart } from './components/Charts';
import { RefreshCw, Play } from 'lucide-react';

const API_BASE = 'http://localhost:8000';

/* ── Tiny reusable pieces ──────────────────────────────── */

const Divider = () => <div style={{ borderTop: '1px solid #1e1e28' }} className="my-8" />;

const SectionLabel = ({ children }) => (
  <p className="text-xs font-medium text-gray-500 uppercase tracking-widest mb-4">{children}</p>
);

const Card = ({ children, className = '' }) => (
  <div
    className={`rounded-lg ${className}`}
    style={{ background: '#111217', border: '1px solid #1e1e28' }}
  >
    {children}
  </div>
);

const StatCard = ({ label, value, sub, highlight }) => (
  <Card className="px-4 py-4">
    <p className="text-gray-500 text-xs mb-2">{label}</p>
    <p
      className="text-2xl font-bold font-mono"
      style={{ color: highlight ?? '#f1f5f9' }}
    >
      {value}
    </p>
    {sub && <p className="text-gray-600 text-xs mt-1">{sub}</p>}
  </Card>
);

/* ── Main ──────────────────────────────────────────────── */
export default function App() {
  const [students, setStudents] = useState([]);
  const [humanPreds, setHumanPreds] = useState({});
  const [results, setResults] = useState(null);
  const [mathSteps, setMathSteps] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchSample = async () => {
    setFetching(true);
    setErrorMsg('');
    setResults(null);
    setMathSteps(null);
    try {
      const { data } = await axios.get(`${API_BASE}/generate-sample?n=10`);
      setStudents(data.students);
      const init = {};
      data.students.forEach((s) => { init[s.id] = ''; });
      setHumanPreds(init);
    } catch {
      setErrorMsg('Cannot reach backend. Ensure uvicorn is running on port 8000.');
    }
    setFetching(false);
  };

  useEffect(() => { fetchSample(); }, []);

  const handleChange = (id, val) =>
    setHumanPreds((p) => ({ ...p, [id]: val }));

  const handleRun = async () => {
    const predsArr = students.map((s) => {
      const v = parseFloat(humanPreds[s.id]);
      return isNaN(v) ? 0 : Math.max(0, Math.min(100, v));
    });
    setLoading(true);
    setErrorMsg('');
    try {
      const { data } = await axios.post(`${API_BASE}/predict-and-test`, {
        students,
        human_predictions: predsArr,
      });
      setResults(data.results);
      setMathSteps(data.math_steps);
    } catch {
      setErrorMsg('Error running analysis. Check the backend.');
    }
    setLoading(false);
  };

  /* derived */
  const meanAI = results
    ? (results.reduce((a, r) => a + r.AIError, 0) / results.length).toFixed(2)
    : null;
  const meanHuman = results
    ? (results.reduce((a, r) => a + r.HumanError, 0) / results.length).toFixed(2)
    : null;
  const aiWins = results ? parseFloat(meanAI) < parseFloat(meanHuman) : null;
  const isSignificant = mathSteps && mathSteps.p_value < 0.05;

  /* ── render ─────────────────────────────────────────── */
  return (
    <div
      className="min-h-screen"
      style={{ background: '#0B0B0F', fontFamily: 'Inter, sans-serif' }}
    >

      {/* ── HEADER ─── */}
      <header
        className="px-8 py-6"
        style={{ borderBottom: '1px solid #1e1e28' }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-white tracking-tight">
              AI vs Human Student Score Prediction
            </h1>
            <p className="text-gray-500 text-sm mt-0.5">
              Small Sample Paired t-Test Analysis
            </p>
          </div>
          <button
            onClick={fetchSample}
            disabled={fetching}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-gray-400 text-sm transition-colors hover:text-white hover:bg-white/5"
          >
            <RefreshCw size={13} className={fetching ? 'animate-spin' : ''} />
            {fetching ? 'Loading…' : 'Reset Sample'}
          </button>
        </div>
      </header>

      {/* ── CONTENT ─── */}
      <main className="max-w-6xl mx-auto px-8 py-8 space-y-8">

        {/* Error */}
        {errorMsg && (
          <p
            className="text-sm px-4 py-3 rounded-md text-red-400"
            style={{ background: '#1a0f0f', border: '1px solid #3f1515' }}
          >
            {errorMsg}
          </p>
        )}

        {/* ── SECTION 1: DATA TABLE + INPUT ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">

          {/* Student table */}
          <Card>
            <div className="px-5 pt-5 pb-4">
              <SectionLabel>Student Data Sample</SectionLabel>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid #1e1e28' }}>
                    {['#', 'Mid-1', 'Mid-2', 'Internal', 'Attendance', 'Study Hrs', 'Sleep Hrs'].map((h) => (
                      <th
                        key={h}
                        className="px-5 py-3 text-left text-xs font-medium text-gray-500 whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {students.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-5 py-10 text-center text-gray-600 text-sm">
                        {fetching ? 'Fetching data…' : '—'}
                      </td>
                    </tr>
                  ) : students.map((s, i) => (
                    <tr
                      key={s.id}
                      className="transition-colors"
                      style={{
                        borderBottom: i < students.length - 1 ? '1px solid #1a1a22' : 'none',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#161620'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <td className="px-5 py-3 text-gray-600 font-mono text-xs">{s.id}</td>
                      <td className="px-5 py-3 text-gray-200 font-mono">{s.Mid1}</td>
                      <td className="px-5 py-3 text-gray-200 font-mono">{s.Mid2}</td>
                      <td className="px-5 py-3 text-gray-200 font-mono">{s.Internal}</td>
                      <td className="px-5 py-3 text-gray-200 font-mono">{s.Attendance}%</td>
                      <td className="px-5 py-3 text-gray-200 font-mono">{s.StudyHours}h</td>
                      <td className="px-5 py-3 text-gray-200 font-mono">{s.SleepHours}h</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Human input */}
          <Card className="p-5 flex flex-col">
            <SectionLabel>Enter Your Predictions</SectionLabel>
            <div className="flex-1 space-y-2 overflow-y-auto">
              {students.map((s) => (
                <div key={s.id} className="flex items-center gap-3">
                  <span className="text-gray-600 text-xs font-mono w-14 flex-shrink-0">
                    S{s.id}
                  </span>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    placeholder="0–100"
                    value={humanPreds[s.id] ?? ''}
                    onChange={(e) => handleChange(s.id, e.target.value)}
                    className="flex-1 rounded-md px-3 py-2 text-sm font-mono text-gray-100 placeholder-gray-700 outline-none transition-colors"
                    style={{
                      background: '#0B0B0F',
                      border: '1px solid #2a2a34',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = '#3b82f6')}
                    onBlur={(e) => (e.target.style.borderColor = '#2a2a34')}
                  />
                </div>
              ))}
            </div>

            <button
              onClick={handleRun}
              disabled={loading || students.length === 0}
              className="mt-5 w-full flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium text-white transition-all disabled:opacity-40"
              style={{ background: loading ? '#1e40af' : '#2563eb' }}
            >
              <Play size={14} />
              {loading ? 'Analysing…' : 'Run Comparison'}
            </button>
          </Card>
        </div>

        {/* ── RESULTS (only after run) ─── */}
        {results && (
          <>
            {/* ── STAT CARDS ─── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 fade-up">
              <StatCard
                label="Mean AI Error"
                value={meanAI}
                sub="Absolute average"
                highlight={aiWins ? '#3b82f6' : undefined}
              />
              <StatCard
                label="Mean Human Error"
                value={meanHuman}
                sub="Absolute average"
                highlight={!aiWins ? '#ef4444' : undefined}
              />
              <StatCard
                label="t-Statistic"
                value={mathSteps?.t_stat.toFixed(3)}
                sub={`df = ${mathSteps?.df}`}
              />
              <StatCard
                label="p-Value (≈)"
                value={mathSteps?.p_value.toFixed(4)}
                sub="α = 0.05"
                highlight={isSignificant ? '#22c55e' : '#ef4444'}
              />
            </div>

            {/* ── VERDICT ─── */}
            <div
              className="flex items-start gap-3 px-4 py-4 rounded-lg text-sm fade-up delay-100"
              style={{
                background: isSignificant ? '#0d1f0d' : '#1a130a',
                border: `1px solid ${isSignificant ? '#14532d' : '#422006'}`,
              }}
            >
              <span className="text-lg leading-none mt-0.5">{isSignificant ? '✓' : '⚠'}</span>
              <div>
                <p
                  className="font-medium"
                  style={{ color: isSignificant ? '#4ade80' : '#fb923c' }}
                >
                  {isSignificant
                    ? `Reject H₀ — Significant difference found (p = ${mathSteps?.p_value.toFixed(4)})`
                    : `Fail to Reject H₀ — No significant difference (p = ${mathSteps?.p_value.toFixed(4)})`}
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  H₀: μ_d = 0 &nbsp;|&nbsp; H₁: μ_d ≠ 0 &nbsp;|&nbsp; Two-tailed test at α = 0.05
                </p>
              </div>
            </div>

            {/* ── RESULTS TABLE ─── */}
            <Card className="fade-up delay-200">
              <div className="px-5 pt-5 pb-3">
                <SectionLabel>Prediction Results</SectionLabel>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr style={{ borderBottom: '1px solid #1e1e28' }}>
                      {['#', 'Actual', 'AI Prediction', 'Human Prediction', 'AI Error', 'Human Error', 'Winner'].map((h) => (
                        <th key={h} className="px-5 py-3 text-xs font-medium text-gray-500 whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((r, i) => {
                      const aiBetter = r.AIError <= r.HumanError;
                      return (
                        <tr
                          key={r.id}
                          style={{ borderBottom: i < results.length - 1 ? '1px solid #1a1a22' : 'none' }}
                          onMouseEnter={(e) => e.currentTarget.style.background = '#161620'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                          className="transition-colors"
                        >
                          <td className="px-5 py-3 text-gray-600 font-mono text-xs">{r.id}</td>
                          <td className="px-5 py-3 text-gray-100 font-mono font-semibold">{r.Actual}</td>
                          <td className="px-5 py-3 text-blue-400 font-mono">{r.AIPred}</td>
                          <td className="px-5 py-3 text-red-400 font-mono">{r.HumanPred}</td>
                          <td className="px-5 py-3 font-mono">
                            <span
                              className="px-2 py-0.5 rounded text-xs"
                              style={{
                                background: aiBetter ? 'rgba(59,130,246,0.1)' : 'rgba(239,68,68,0.1)',
                                color: aiBetter ? '#60a5fa' : '#f87171',
                              }}
                            >
                              {r.AIError}
                            </span>
                          </td>
                          <td className="px-5 py-3 font-mono">
                            <span
                              className="px-2 py-0.5 rounded text-xs"
                              style={{
                                background: !aiBetter ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.04)',
                                color: !aiBetter ? '#4ade80' : '#6b7280',
                              }}
                            >
                              {r.HumanError}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-xs text-gray-400">
                            {aiBetter ? '🤖 AI' : '👤 Human'}
                          </td>
                        </tr>
                      );
                    })}
                    {/* Summary row */}
                    <tr style={{ borderTop: '1px solid #1e1e28', background: '#0f0f18' }}>
                      <td colSpan={4} className="px-5 py-3 text-right text-xs text-gray-600">
                        Mean absolute error →
                      </td>
                      <td className="px-5 py-3 font-mono text-blue-400 text-sm font-semibold">{meanAI}</td>
                      <td className="px-5 py-3 font-mono text-red-400 text-sm font-semibold">{meanHuman}</td>
                      <td className="px-5 py-3 text-xs text-gray-500">
                        {aiWins ? 'AI lower error' : 'Human lower error'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>

            {/* ── CHARTS ─── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 fade-up delay-300">
              <Card className="p-5">
                <SectionLabel>Error Comparison — AI vs Human</SectionLabel>
                <ErrorBarChart results={results} />
              </Card>
              <Card className="p-5">
                <SectionLabel>Actual vs AI vs Human</SectionLabel>
                <PredictionsLineChart results={results} />
              </Card>
            </div>

            {/* ── MATH PANEL ─── */}
            <div className="fade-up delay-300">
              <MathPanel mathProps={mathSteps} />
            </div>
          </>
        )}

        {/* Empty state */}
        {!results && !loading && students.length > 0 && (
          <div className="text-center py-24 text-gray-700 text-sm">
            Enter your predictions above and click <span className="text-gray-400">Run Comparison</span>.
          </div>
        )}

      </main>

      <footer
        className="text-center py-5 text-gray-700 text-xs mt-12"
        style={{ borderTop: '1px solid #1e1e28' }}
      >
        Paired t-Test · Manual Implementation · React + FastAPI
      </footer>
    </div>
  );
}
