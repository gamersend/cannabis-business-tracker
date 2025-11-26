'use client';

import { useState, useEffect } from 'react';
import { QuickSaleInput } from './QuickSaleInput';
import { CustomerList } from './CustomerList';
import { ProfitChart } from './ProfitChart';
import { InventoryStatus } from './InventoryStatus';
import { AIBusinessAdvisor } from './AIBusinessAdvisor';
import { AnalyticsDashboard } from './AnalyticsDashboard';

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
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 p-3 sm:p-4 lg:p-6">
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
          🌿 Cannabis Business Tracker 🌿
        </h1>
        <p className="text-green-200 text-sm sm:text-base lg:text-lg">
          <em>Keep track of your green empire, one nug at a time</em> 💚
        </p>

        {/* Mobile Quick Sales Button */}
        <div className="mt-4 sm:hidden">
          <a
            href="/mobile"
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl text-lg transition-all shadow-lg"
          >
            📱 Mobile Quick Sales
          </a>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 lg:p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-200 text-xs sm:text-sm">Total Profit</p>
              <p className="text-lg sm:text-2xl lg:text-3xl font-bold">${stats.totalProfit.toLocaleString()}</p>
            </div>
            <div className="text-2xl sm:text-3xl lg:text-4xl">💰</div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 lg:p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-200 text-xs sm:text-sm">Total Sales</p>
              <p className="text-lg sm:text-2xl lg:text-3xl font-bold">{stats.totalTransactions}</p>
            </div>
            <div className="text-2xl sm:text-3xl lg:text-4xl">📊</div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 lg:p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-200 text-xs sm:text-sm">Top Customer</p>
              <p className="text-sm sm:text-lg lg:text-xl font-bold truncate">{stats.topCustomer || 'Loading...'}</p>
            </div>
            <div className="text-2xl sm:text-3xl lg:text-4xl">👑</div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 lg:p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-200 text-xs sm:text-sm">Today's Profit</p>
              <p className="text-lg sm:text-2xl lg:text-3xl font-bold">${stats.todayProfit.toLocaleString()}</p>
            </div>
            <div className="text-2xl sm:text-3xl lg:text-4xl">🚀</div>
          </div>
        </div>
      </div>

      {/* Quick Sale Input - Hidden on Mobile */}
      <div className="mb-6 sm:mb-8 hidden sm:block">
        <QuickSaleInput onSaleAdded={handleNewSale} />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
        {/* Customer List */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-3 sm:mb-4 flex items-center">
            🏆 Top Customers
          </h2>
          <CustomerList />
        </div>

        {/* Profit Chart */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-3 sm:mb-4 flex items-center">
            📈 Profit Trends
          </h2>
          <ProfitChart />
        </div>
      </div>

      {/* Analytics Dashboard */}
      <div className="mt-6 sm:mt-8">
        <AnalyticsDashboard />
      </div>

      {/* AI Business Advisor */}
      <div className="mt-8">
        <AIBusinessAdvisor />
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
