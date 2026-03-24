import React from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const ErrorBarChart = ({ results }) => {
  if (!results || results.length === 0) return null;

  const data = {
    labels: results.map((r) => `Student ${r.id}`),
    datasets: [
      {
        label: 'AI Error',
        data: results.map((r) => r.AIError),
        backgroundColor: 'rgba(56, 189, 248, 0.8)', // Tailwind cyan-400
      },
      {
        label: 'Human Error',
        data: results.map((r) => r.HumanError),
        backgroundColor: 'rgba(244, 63, 94, 0.8)', // Tailwind rose-500
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        labels: { color: '#f8fafc' }, // slate-50
      },
      title: {
        display: true,
        text: 'AI Error vs Human Error',
        color: '#f8fafc',
      },
    },
    scales: {
      y: { ticks: { color: '#cbd5e1' }, grid: { color: '#334155' } },
      x: { ticks: { color: '#cbd5e1' }, grid: { color: '#334155' } },
    },
  };

  return <Bar data={data} options={options} />;
};

export const PredictionsLineChart = ({ results }) => {
  if (!results || results.length === 0) return null;

  const data = {
    labels: results.map((r) => `Student ${r.id}`),
    datasets: [
      {
        label: 'Actual EndSem',
        data: results.map((r) => r.Actual),
        borderColor: 'rgba(167, 243, 208, 1)', // emerald-200
        backgroundColor: 'rgba(52, 211, 153, 0.5)', 
        tension: 0.3,
      },
      {
        label: 'AI Prediction',
        data: results.map((r) => r.AIPred),
        borderColor: 'rgba(56, 189, 248, 1)',
        backgroundColor: 'rgba(14, 165, 233, 0.5)',
        tension: 0.3,
      },
      {
        label: 'Human Prediction',
        data: results.map((r) => r.HumanPred),
        borderColor: 'rgba(244, 63, 94, 1)',
        backgroundColor: 'rgba(225, 29, 72, 0.5)',
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        labels: { color: '#f8fafc' },
      },
      title: {
        display: true,
        text: 'Actual vs AI vs Human Prediction',
        color: '#f8fafc',
      },
    },
    scales: {
      y: { ticks: { color: '#cbd5e1' }, grid: { color: '#334155' } },
      x: { ticks: { color: '#cbd5e1' }, grid: { color: '#334155' } },
    },
  };

  return <Line data={data} options={options} />;
};
