import React from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale,
  BarElement, PointElement, LineElement,
  Tooltip, Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Legend);

const TOOLTIP = {
  backgroundColor: '#1a1a24',
  borderColor: '#374151',
  borderWidth: 1,
  titleColor: '#f1f5f9',
  bodyColor: '#9ca3af',
  padding: 10,
  cornerRadius: 8,
  displayColors: true,
};

const AXES = {
  x: {
    grid: { display: false },
    border: { color: '#1F2937' },
    ticks: { color: '#6b7280', font: { size: 11, family: 'Inter' } },
  },
  y: {
    beginAtZero: true,
    grid: { color: '#1a1a24' },
    border: { color: '#1F2937' },
    ticks: { color: '#6b7280', font: { size: 11, family: 'Inter' } },
  },
};

const LEGEND = {
  labels: {
    color: '#9ca3af',
    font: { size: 12, family: 'Inter' },
    usePointStyle: true,
    pointStyleWidth: 8,
    padding: 20,
  },
};

export const ErrorBarChart = ({ results }) => {
  if (!results?.length) return null;
  return (
    <Bar
      data={{
        labels: results.map((r) => `S${r.id}`),
        datasets: [
          {
            label: 'AI Error',
            data: results.map((r) => r.AIError),
            backgroundColor: 'rgba(59,130,246,0.65)',
            borderColor: '#3b82f6',
            borderWidth: 1,
            borderRadius: 4,
            borderSkipped: false,
          },
          {
            label: 'Human Error',
            data: results.map((r) => r.HumanError),
            backgroundColor: 'rgba(239,68,68,0.55)',
            borderColor: '#ef4444',
            borderWidth: 1,
            borderRadius: 4,
            borderSkipped: false,
          },
        ],
      }}
      options={{
        responsive: true,
        animation: { duration: 700, easing: 'easeInOutCubic' },
        plugins: { legend: LEGEND, tooltip: TOOLTIP },
        scales: AXES,
      }}
    />
  );
};

export const PredictionsLineChart = ({ results }) => {
  if (!results?.length) return null;
  const mk = (label, data, color, dash = false) => ({
    label,
    data,
    borderColor: color,
    backgroundColor: 'transparent',
    pointBackgroundColor: color,
    pointRadius: 4,
    pointHoverRadius: 6,
    tension: 0.35,
    borderWidth: 2,
    ...(dash ? { borderDash: [5, 4] } : {}),
  });
  return (
    <Line
      data={{
        labels: results.map((r) => `S${r.id}`),
        datasets: [
          mk('Actual', results.map((r) => r.Actual), '#ffffff'),
          mk('AI Prediction', results.map((r) => r.AIPred), '#3b82f6', true),
          mk('Human Prediction', results.map((r) => r.HumanPred), '#ef4444', true),
        ],
      }}
      options={{
        responsive: true,
        animation: { duration: 700 },
        plugins: { legend: LEGEND, tooltip: TOOLTIP },
        scales: AXES,
      }}
    />
  );
};
