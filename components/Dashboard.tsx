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
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        // If API fails, use fallback data from historic profits
        console.warn('API failed, using fallback data');
        setStats({
          totalProfit: 15500,
          totalTransactions: 45,
          topCustomer: 'Trife',
          todayProfit: 0
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Use fallback data if API fails completely
      setStats({
        totalProfit: 15500,
        totalTransactions: 45,
        topCustomer: 'Trife',
        todayProfit: 0
      });
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
    <div className="glass-panel p-6 w-full max-w-7xl">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <QuickSaleInput onSaleAdded={handleNewSale} />
          <AnalyticsDashboard />
          <ProfitChart />
        </div>
        <div className="space-y-6">
          <InventoryStatus />
          <CustomerList />
          <AIBusinessAdvisor />
        </div>
      </div>
      
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
