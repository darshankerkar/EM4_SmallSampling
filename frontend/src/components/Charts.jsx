import React from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale,
  BarElement, PointElement, LineElement,
  Tooltip, Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Legend);

const MONO = "'Geist Mono', 'Fira Code', monospace";
const BG   = '#0E1318';
const BORDER = '#1C2128';

const TOOLTIP = {
  backgroundColor: '#080C10',
  borderColor: '#1C2128',
  borderWidth: 1,
  titleColor: '#F0F6FC',
  bodyColor: '#7D8590',
  titleFont: { size: 12, family: MONO, weight: '600' },
  bodyFont:  { size: 12, family: MONO },
  padding: 12,
  cornerRadius: 8,
  displayColors: true,
  boxPadding: 5,
  callbacks: {
    title: (items) => `Student ${items[0].label}`,
  },
};

const LEGEND = {
  labels: {
    color: '#7D8590',
    font: { size: 11, family: MONO },
    usePointStyle: true,
    pointStyleWidth: 10,
    padding: 20,
  },
};

const AXES = {
  x: {
    grid: { display: false },
    border: { display: false },
    ticks: { color: '#7D8590', font: { size: 11, family: MONO }, padding: 8 },
  },
  y: {
    beginAtZero: true,
    grid: { color: '#1C2128', drawBorder: false },
    border: { display: false },
    ticks: { color: '#7D8590', font: { size: 11, family: MONO }, padding: 8 },
  },
};

export const ErrorBarChart = ({ results }) => {
  if (!results?.length) return null;
  return (
    <Bar
      data={{
        labels: results.map(r => `S${String(r.id).padStart(2, '0')}`),
        datasets: [
          {
            label: 'AI Error',
            data: results.map(r => r.AIError),
            backgroundColor: 'rgba(37,99,235,0.75)',
            hoverBackgroundColor: 'rgba(37,99,235,1)',
            borderRadius: 4,
            borderSkipped: false,
          },
          {
            label: 'Human Error',
            data: results.map(r => r.HumanError),
            backgroundColor: 'rgba(239,68,68,0.60)',
            hoverBackgroundColor: 'rgba(239,68,68,1)',
            borderRadius: 4,
            borderSkipped: false,
          },
        ],
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 800, easing: 'easeOutQuart' },
        plugins: { legend: LEGEND, tooltip: TOOLTIP },
        scales: AXES,
      }}
    />
  );
};

export const PredictionsLineChart = ({ results }) => {
  if (!results?.length) return null;

  const ds = (label, data, color, dashed) => ({
    label,
    data,
    borderColor: color,
    backgroundColor: 'transparent',
    pointBackgroundColor: color,
    pointBorderColor: '#080C10',
    pointBorderWidth: 2,
    pointRadius: 5,
    pointHoverRadius: 7,
    tension: 0.4,
    borderWidth: dashed ? 2 : 2.5,
    borderDash: dashed ? [5, 5] : [],
  });

  return (
    <Line
      data={{
        labels: results.map(r => `S${String(r.id).padStart(2, '0')}`),
        datasets: [
          ds('Actual',           results.map(r => r.Actual),    '#F0F6FC', false),
          ds('AI Prediction',    results.map(r => r.AIPred),    '#2563EB', true),
          ds('Human Prediction', results.map(r => r.HumanPred), '#EF4444', true),
        ],
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        animation: { duration: 800, easing: 'easeOutQuart' },
        plugins: { legend: LEGEND, tooltip: TOOLTIP },
        scales: AXES,
      }}
    />
  );
};
