'use client';

import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Api_url } from '../config';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function UserChart({ darkMode }) {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch(`${Api_url}/stats`);
      const data = await response.json();

      // Create array for last 7 days
      const last7Days = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        last7Days.push(date.toISOString().split('T')[0]);
      }

      // Map data to last 7 days
      const counts = last7Days.map(date => {
        const found = data.find(d => d.date === date);
        return found ? found.count : 0;
      });

      setChartData({
        labels: last7Days.map(date => new Date(date).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        })),
        datasets: [
          {
            label: 'Users Created',
            data: counts,
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: darkMode ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)',
            fill: true,
            tension: 0.4,
            pointRadius: 5,
            pointHoverRadius: 7,
            pointBackgroundColor: 'rgb(59, 130, 246)',
            pointBorderColor: darkMode ? '#1f2937' : '#fff',
            pointBorderWidth: 2,
            pointHoverBackgroundColor: 'rgb(37, 99, 235)',
            pointHoverBorderColor: darkMode ? '#1f2937' : '#fff',
            pointHoverBorderWidth: 3,
          },
        ],
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setLoading(false);
    }
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: darkMode ? 'rgba(31, 41, 55, 0.95)' : 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
          weight: 'bold',
        },
        bodyFont: {
          size: 13,
        },
        borderColor: 'rgba(59, 130, 246, 0.5)',
        borderWidth: 1,
        displayColors: false,
        callbacks: {
          label: function(context) {
            return `${context.parsed.y} user${context.parsed.y !== 1 ? 's' : ''} created`;
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          font: {
            size: 12,
          },
          color: darkMode ? '#9CA3AF' : '#6B7280',
        },
        grid: {
          color: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
          drawBorder: false,
        },
      },
      x: {
        ticks: {
          font: {
            size: 12,
          },
          color: darkMode ? '#9CA3AF' : '#6B7280',
        },
        grid: {
          display: false,
          drawBorder: false,
        },
      },
    },
  };

  if (loading) {
    return (
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-lg p-6 border`}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Loading chart data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!chartData) {
    return (
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-lg p-6 border`}>
        <div className="text-center py-12">
          <svg className={`w-16 h-16 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>No chart data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-lg p-6 border`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>User Growth</h3>
          <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Users created over the last 7 days</p>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${darkMode ? 'bg-blue-900/30' : 'bg-blue-50'}`}>
          <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
          <span className={`text-sm font-medium ${darkMode ? 'text-blue-400' : 'text-blue-900'}`}>Daily Registrations</span>
        </div>
      </div>
      <div className="h-64">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}