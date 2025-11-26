'use client';

import { useState, useEffect } from 'react';
import { QuickSaleInput } from './QuickSaleInput';
import { CustomerList } from './CustomerList';
import { ProfitChart } from './ProfitChart';
import { InventoryStatus } from './InventoryStatus';

interface DashboardStats {
  totalProfit: number;
  totalTransactions: number;
  topCustomer: string;
  todayProfit: number;
}

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProfit: 0,
    totalTransactions: 0,
    topCustomer: '',
    todayProfit: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/dashboard-stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewSale = () => {
    // Refresh stats when a new sale is added
    fetchDashboardStats();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 flex items-center justify-center">
        <div className="text-white text-2xl">🌿 Loading your empire... 💚</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 p-4">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          🌿 Cannabis Business Tracker 🌿
        </h1>
        <p className="text-green-200 text-lg">
          <em>Keep track of your green empire, one nug at a time</em> 💚
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-200 text-sm">Total Profit</p>
              <p className="text-3xl font-bold">${stats.totalProfit.toLocaleString()}</p>
            </div>
            <div className="text-4xl">💰</div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-200 text-sm">Total Sales</p>
              <p className="text-3xl font-bold">{stats.totalTransactions}</p>
            </div>
            <div className="text-4xl">📊</div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-200 text-sm">Top Customer</p>
              <p className="text-xl font-bold truncate">{stats.topCustomer || 'Loading...'}</p>
            </div>
            <div className="text-4xl">👑</div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-200 text-sm">Today's Profit</p>
              <p className="text-3xl font-bold">${stats.todayProfit.toLocaleString()}</p>
            </div>
            <div className="text-4xl">🚀</div>
          </div>
        </div>
      </div>

      {/* Quick Sale Input */}
      <div className="mb-8">
        <QuickSaleInput onSaleAdded={handleNewSale} />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Customer List */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
            🏆 Top Customers
          </h2>
          <CustomerList />
        </div>

        {/* Profit Chart */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
            📈 Profit Trends
          </h2>
          <ProfitChart />
        </div>
      </div>

      {/* Inventory Status */}
      <div className="mt-8">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
            📦 Stash Status
          </h2>
          <InventoryStatus />
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-12 text-green-200">
        <p className="text-sm">
          💭 <em>"Remember: happy customers = repeat customers"</em>
        </p>
        <p className="text-sm mt-2">
          🌿 <em>"Quality over quantity, always"</em>
        </p>
        <p className="text-sm mt-2">
          ✨ <em>"Keep the good vibes flowing"</em>
        </p>
      </div>
    </div>
  );
}
