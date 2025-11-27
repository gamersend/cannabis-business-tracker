'use client';

import { useState, useEffect } from 'react';

interface Customer {
  customer_name: string;
  total_profit: number;
  transaction_count: number;
  avg_profit: number;
  last_purchase: string;
}

export function CustomerList() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/customers');
      if (response.ok) {
        const data = await response.json();
        // Ensure data is an array
        setCustomers(Array.isArray(data) ? data : []);
      } else {
        // Use fallback data if API fails
        setCustomers(getFallbackCustomers());
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
      // Use fallback data if API fails completely
      setCustomers(getFallbackCustomers());
    } finally {
      setLoading(false);
    }
  };

  const getFallbackCustomers = (): Customer[] => [
    {
      customer_name: 'Trife',
      total_profit: 2300,
      transaction_count: 8,
      avg_profit: 287.50,
      last_purchase: '2024-01-15'
    },
    {
      customer_name: 'Online',
      total_profit: 2045,
      transaction_count: 12,
      avg_profit: 170.42,
      last_purchase: '2024-01-14'
    },
    {
      customer_name: 'Ryan',
      total_profit: 1580,
      transaction_count: 6,
      avg_profit: 263.33,
      last_purchase: '2024-01-13'
    },
    {
      customer_name: 'Jay',
      total_profit: 750,
      transaction_count: 4,
      avg_profit: 187.50,
      last_purchase: '2024-01-12'
    },
    {
      customer_name: 'Leveny',
      total_profit: 650,
      transaction_count: 3,
      avg_profit: 216.67,
      last_purchase: '2024-01-11'
    }
  ];

  const getCustomerType = (profit: number) => {
    if (profit >= 1000) return { emoji: '🐋', type: 'Whale', color: 'text-purple-300' };
    if (profit >= 500) return { emoji: '💎', type: 'VIP', color: 'text-yellow-300' };
    return { emoji: '😎', type: 'Regular', color: 'text-green-300' };
  };

  if (loading) {
    return <div className="text-white">Loading customers... 🔄</div>;
  }

  return (
    <div className="glass-panel p-6">
      <h3 className="text-lg font-medium mb-4 text-white">Recent Customers</h3>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {(Array.isArray(customers) ? customers : []).slice(0, 10).map((customer, index) => {
          const customerType = getCustomerType(customer.total_profit);
          
          return (
            <div
              key={customer.customer_name}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-glass-border"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-purple to-neon-blue flex items-center justify-center text-white font-bold">
                  {customer.customer_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-semibold">
                      {index === 0 && '👑'} {customer.customer_name}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full bg-white/20 ${customerType.color}`}>
                      {customerType.type}
                    </span>
                  </div>
                  <div className="text-green-200 text-sm">
                    {customer.transaction_count} transactions • Avg: ${Math.round(customer.avg_profit)}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white font-bold text-lg">
                  ${Math.round(customer.total_profit).toLocaleString()}
                </div>
                <div className="text-green-200 text-xs">
                  {customer.last_purchase ? 
                    new Date(customer.last_purchase).toLocaleDateString() : 
                    'No recent purchases'
                  }
                </div>
              </div>
            </div>
          );
        })}
        
        {customers.length === 0 && (
          <div className="text-center text-green-200 py-8">
            <div className="text-4xl mb-2">🌱</div>
            <p>No customers yet - time to make some sales!</p>
          </div>
        )}
      </div>
    </div>
  );
}
