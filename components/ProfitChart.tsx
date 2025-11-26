'use client';

import { useState, useEffect } from 'react';

interface DayProfit {
  date: string;
  total_profit: number;
  transaction_count: number;
}

export function ProfitChart() {
  const [data, setData] = useState<DayProfit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfitData();
  }, []);

  const fetchProfitData = async () => {
    try {
      const response = await fetch('/api/profit-chart');
      const chartData = await response.json();
      setData(chartData);
    } catch (error) {
      console.error('Error fetching profit data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-white">Loading chart... 📊</div>;
  }

  const maxProfit = Math.max(...data.map(d => d.total_profit));

  return (
    <div className="space-y-4">
      {/* Simple bar chart */}
      <div className="space-y-2">
        {data.slice(0, 7).map((day, index) => {
          const percentage = maxProfit > 0 ? (day.total_profit / maxProfit) * 100 : 0;
          
          return (
            <div key={day.date} className="flex items-center space-x-3">
              <div className="w-16 text-green-200 text-sm">
                {new Date(day.date).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </div>
              <div className="flex-1 bg-white/10 rounded-full h-6 relative overflow-hidden">
                <div
                  className="bg-gradient-to-r from-green-400 to-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
                <div className="absolute inset-0 flex items-center justify-center text-white text-sm font-medium">
                  ${Math.round(day.total_profit)}
                </div>
              </div>
              <div className="w-12 text-green-200 text-sm text-right">
                {day.transaction_count}
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
        <div className="text-center">
          <div className="text-2xl font-bold text-white">
            ${Math.round(data.reduce((sum, d) => sum + d.total_profit, 0)).toLocaleString()}
          </div>
          <div className="text-green-200 text-sm">Total Profit</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white">
            {data.reduce((sum, d) => sum + d.transaction_count, 0)}
          </div>
          <div className="text-green-200 text-sm">Total Sales</div>
        </div>
      </div>

      {data.length === 0 && (
        <div className="text-center text-green-200 py-8">
          <div className="text-4xl mb-2">📈</div>
          <p>No profit data yet - start making sales!</p>
        </div>
      )}
    </div>
  );
}
