'use client';

import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface AnalyticsData {
  profitTrends: any[];
  strainPerformance: any[];
  customerDistribution: any[];
  hourlySales: any[];
  profitMargins: any[];
  growthMetrics: {
    currentProfit: number;
    previousProfit: number;
    growthRate: number;
  };
}

export function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('daily');
  const [days, setDays] = useState(30);

  useEffect(() => {
    fetchAnalytics();
  }, [period, days]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/analytics?period=${period}&days=${days}`);
      const analyticsData = await response.json();
      setData(analyticsData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
        <div className="text-white text-center">
          <div className="text-2xl mb-2">📊</div>
          <p>Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  // Chart configurations
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: 'white'
        }
      }
    },
    scales: {
      x: {
        ticks: { color: 'white' },
        grid: { color: 'rgba(255,255,255,0.1)' }
      },
      y: {
        ticks: { color: 'white' },
        grid: { color: 'rgba(255,255,255,0.1)' }
      }
    }
  };

  const profitTrendData = {
    labels: data.profitTrends.slice().reverse().map(d => d.period),
    datasets: [
      {
        label: 'Daily Profit ($)',
        data: data.profitTrends.slice().reverse().map(d => d.totalProfit),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Transactions',
        data: data.profitTrends.slice().reverse().map(d => d.transactionCount),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        yAxisID: 'y1',
      }
    ]
  };

  const strainPerformanceData = {
    labels: data.strainPerformance.map(s => s.strainName),
    datasets: [
      {
        label: 'Total Profit ($)',
        data: data.strainPerformance.map(s => s.totalProfit),
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(245, 158, 11, 0.8)',
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(59, 130, 246)',
          'rgb(168, 85, 247)',
          'rgb(245, 158, 11)',
        ],
        borderWidth: 2
      }
    ]
  };

  const customerDistributionData = {
    labels: data.customerDistribution.map(c => c.tier),
    datasets: [
      {
        data: data.customerDistribution.map(c => c.customerCount),
        backgroundColor: [
          'rgba(168, 85, 247, 0.8)', // Purple for Whales
          'rgba(245, 158, 11, 0.8)',  // Yellow for VIP
          'rgba(34, 197, 94, 0.8)',   // Green for Regular
          'rgba(156, 163, 175, 0.8)'  // Gray for New
        ],
        borderColor: [
          'rgb(168, 85, 247)',
          'rgb(245, 158, 11)',
          'rgb(34, 197, 94)',
          'rgb(156, 163, 175)'
        ],
        borderWidth: 2
      }
    ]
  };

  return (
    <div className="space-y-8">
      {/* Controls */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white flex items-center">
            📊 Business Analytics
          </h2>
          <div className="flex space-x-4">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="bg-white/20 text-white rounded-lg px-3 py-2 border border-white/30"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
            <select
              value={days}
              onChange={(e) => setDays(parseInt(e.target.value))}
              className="bg-white/20 text-white rounded-lg px-3 py-2 border border-white/30"
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
              <option value={365}>Last year</option>
            </select>
          </div>
        </div>

        {/* Growth Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-green-500/20 rounded-lg p-4 border border-green-400">
            <div className="text-green-200 text-sm">Current Period</div>
            <div className="text-2xl font-bold text-white">
              ${data.growthMetrics.currentProfit.toLocaleString()}
            </div>
          </div>
          <div className="bg-blue-500/20 rounded-lg p-4 border border-blue-400">
            <div className="text-blue-200 text-sm">Previous Period</div>
            <div className="text-2xl font-bold text-white">
              ${data.growthMetrics.previousProfit.toLocaleString()}
            </div>
          </div>
          <div className={`rounded-lg p-4 border ${
            data.growthMetrics.growthRate >= 0 
              ? 'bg-green-500/20 border-green-400' 
              : 'bg-red-500/20 border-red-400'
          }`}>
            <div className={`text-sm ${
              data.growthMetrics.growthRate >= 0 ? 'text-green-200' : 'text-red-200'
            }`}>
              Growth Rate
            </div>
            <div className="text-2xl font-bold text-white flex items-center">
              {data.growthMetrics.growthRate >= 0 ? '📈' : '📉'} 
              {Math.abs(data.growthMetrics.growthRate).toFixed(1)}%
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profit Trends */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            📈 Profit Trends
          </h3>
          <div className="h-80">
            <Line
              data={profitTrendData}
              options={{
                ...chartOptions,
                scales: {
                  ...chartOptions.scales,
                  y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    ticks: { color: 'white' },
                    grid: { drawOnChartArea: false }
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Strain Performance */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            🌿 Strain Performance
          </h3>
          <div className="h-80">
            <Bar data={strainPerformanceData} options={chartOptions} />
          </div>
        </div>

        {/* Customer Distribution */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            👥 Customer Tiers
          </h3>
          <div className="h-80 flex items-center justify-center">
            <div className="w-64 h-64">
              <Doughnut
                data={customerDistributionData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: { color: 'white' }
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Profit Margins */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            💰 Profit Margins by Strain
          </h3>
          <div className="space-y-3">
            {data.profitMargins.map((strain, index) => (
              <div key={index} className="bg-white/10 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-semibold">{strain.strainName}</div>
                    <div className="text-green-200 text-sm">
                      Cost: ${strain.costPerGram.toFixed(2)}/g •
                      Avg Price: ${strain.avgPricePerGram.toFixed(2)}/g
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${
                      strain.avgProfitMargin >= 50 ? 'text-green-300' :
                      strain.avgProfitMargin >= 30 ? 'text-yellow-300' : 'text-red-300'
                    }`}>
                      {strain.avgProfitMargin.toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-300">margin</div>
                  </div>
                </div>
                <div className="mt-2 bg-white/20 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      strain.avgProfitMargin >= 50 ? 'bg-green-500' :
                      strain.avgProfitMargin >= 30 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(strain.avgProfitMargin, 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hourly Sales Pattern (only for daily view) */}
      {period === 'daily' && data.hourlySales.length > 0 && (
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            🕐 Hourly Sales Pattern (Last 7 Days)
          </h3>
          <div className="h-64">
            <Bar
              data={{
                labels: Array.from({length: 24}, (_, i) => `${i}:00`),
                datasets: [
                  {
                    label: 'Profit by Hour ($)',
                    data: Array.from({length: 24}, (_, hour) => {
                      const hourData = data.hourlySales.find(h => h.hour === hour);
                      return hourData ? hourData.totalProfit : 0;
                    }),
                    backgroundColor: 'rgba(34, 197, 94, 0.6)',
                    borderColor: 'rgb(34, 197, 94)',
                    borderWidth: 1
                  }
                ]
              }}
              options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  tooltip: {
                    callbacks: {
                      afterLabel: (context) => {
                        const hour = context.dataIndex;
                        const hourData = data.hourlySales.find(h => h.hour === hour);
                        return hourData ? `Transactions: ${hourData.transactionCount}` : '';
                      }
                    }
                  }
                }
              }}
            />
          </div>
          <div className="mt-4 text-center text-green-200 text-sm">
            💡 Peak hours help optimize your availability and inventory planning
          </div>
        </div>
      )}
    </div>
  );
}
