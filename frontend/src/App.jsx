import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MathPanel from './components/MathPanel';
import { ErrorBarChart, PredictionsLineChart } from './components/Charts';
import { RefreshCw, Calculator, BrainCircuit } from 'lucide-react';

const API_BASE = 'http://localhost:8000';

function App() {
  const [students, setStudents] = useState([]);
  const [humanPredictions, setHumanPredictions] = useState({});
  const [results, setResults] = useState(null);
  const [mathSteps, setMathSteps] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchSample = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/generate-sample?n=10`);
      setStudents(res.data.students);
      // Reset state
      const initialPreds = {};
      res.data.students.forEach(s => {
        initialPreds[s.id] = '';
      });
      setHumanPredictions(initialPreds);
      setResults(null);
      setMathSteps(null);
    } catch (error) {
      console.error("Error fetching sample:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSample();
  }, []);

  const handlePredictionChange = (id, value) => {
    setHumanPredictions(prev => ({ ...prev, [id]: value }));
  };

  const handleRunTest = async () => {
    // Validate all inputs
    const predsArray = students.map(s => {
      const p = parseFloat(humanPredictions[s.id]);
      return isNaN(p) ? 0 : p;
    });

    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/predict-and-test`, {
        students: students,
        human_predictions: predsArray
      });
      setResults(res.data.results);
      setMathSteps(res.data.math_steps);
    } catch (error) {
      console.error("Error running test:", error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 p-6 md:p-10 font-sans">
      <header className="mb-10 text-center max-w-4xl mx-auto">
        <div className="flex justify-center items-center gap-3 mb-4 text-emerald-400">
          <BrainCircuit size={40} />
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">AI vs Human Prediction Accuracy</h1>
        </div>
        <p className="text-slate-400 text-lg">
          Analysis using Small Sample Paired t-Test (Manually Implemented)
        </p>
      </header>

      <main className="max-w-7xl mx-auto space-y-12">
        { /* Top Section: Data & Math */ }
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          { /* Left: Data Table */ }
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-200">Student Dataset (n={students.length})</h2>
              <button 
                onClick={fetchSample} 
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md transition-colors text-sm"
              >
                <RefreshCw size={16} /> Reset Sample
              </button>
            </div>
            
            <div className="overflow-x-auto rounded-lg border border-slate-700">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-800 text-slate-300 uppercase text-xs">
                  <tr>
                    <th className="px-4 py-3 text-center">ID</th>
                    <th className="px-4 py-3">Features (Mid1, Mid2, Int, Att, Stu, Slp)</th>
                    <th className="px-4 py-3 w-1/4">Your Guess (EndSem)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {students.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="px-4 py-3 text-center font-medium">{s.id}</td>
                      <td className="px-4 py-3 text-slate-400 text-xs font-mono">
                        [{s.Mid1}, {s.Mid2}, {s.Internal}, {s.Attendance}, {s.StudyHours}, {s.SleepHours}]
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          className="w-full bg-slate-950 border border-slate-600 rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-mono"
                          placeholder="0-100"
                          value={humanPredictions[s.id] || ''}
                          onChange={(e) => handlePredictionChange(s.id, e.target.value)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button 
              onClick={handleRunTest}
              disabled={loading}
              className="mt-6 w-full flex justify-center items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-6 rounded-lg transition-all shadow-lg shadow-emerald-900/50 disabled:opacity-50"
            >
              <Calculator size={20} />
              {loading ? 'Processing...' : 'Run Paired t-Test Analysis'}
            </button>
          </div>

          { /* Right: Math Panel */ }
          <div>
            {mathSteps ? (
              <MathPanel mathProps={mathSteps} />
            ) : (
              <div className="h-full min-h-[400px] border-2 border-dashed border-slate-800 rounded-xl flex items-center justify-center text-slate-500 p-8 text-center bg-slate-900/30">
                <p>Enter your predictions and run the test to see the step-by-step mathematical derivation here.</p>
              </div>
            )}
          </div>
        </div>

        { /* Results Table */ }
        {results && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl font-bold text-slate-200 mb-6">Comparisons & Errors</h2>
            <div className="overflow-x-auto rounded-lg border border-slate-700">
              <table className="w-full text-sm text-center">
                <thead className="bg-slate-800 text-slate-300 uppercase text-xs">
                  <tr>
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3 text-emerald-400">Actual</th>
                    <th className="px-4 py-3 text-cyan-400">AI Prediction</th>
                    <th className="px-4 py-3 text-rose-400">Human Prediction</th>
                    <th className="px-4 py-3 text-cyan-400 border-l border-slate-700">AI Error</th>
                    <th className="px-4 py-3 text-rose-400">Human Error</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {results.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="px-4 py-3 font-medium text-slate-400">{r.id}</td>
                      <td className="px-4 py-3 font-bold text-emerald-300">{r.Actual}</td>
                      <td className="px-4 py-3 font-mono text-cyan-200">{r.AIPred}</td>
                      <td className="px-4 py-3 font-mono text-rose-200">{r.HumanPred}</td>
                      <td className="px-4 py-3 font-mono text-cyan-300 border-l border-slate-700/50">{r.AIError}</td>
                      <td className="px-4 py-3 font-mono text-rose-300">{r.HumanError}</td>
                    </tr>
                  ))}
                  <tr className="bg-slate-800/50 font-bold">
                    <td colSpan="4" className="px-4 py-3 text-right text-slate-400">Mean Margin of Error:</td>
                    <td className="px-4 py-3 text-cyan-300">
                      {(results.reduce((acc, curr) => acc + curr.AIError, 0) / results.length).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-rose-300">
                      {(results.reduce((acc, curr) => acc + curr.HumanError, 0) / results.length).toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        { /* Charts Section */ }
        {results && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
              <ErrorBarChart results={results} />
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
              <PredictionsLineChart results={results} />
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

export default App;
