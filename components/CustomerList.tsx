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
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCustomerType = (profit: number) => {
    if (profit >= 1000) return { emoji: '🐋', type: 'Whale', color: 'text-purple-300' };
    if (profit >= 500) return { emoji: '💎', type: 'VIP', color: 'text-yellow-300' };
    return { emoji: '😎', type: 'Regular', color: 'text-green-300' };
  };

  if (loading) {
    return <div className="text-white">Loading customers... 🔄</div>;
  }

  return (
    <div className="space-y-3 max-h-96 overflow-y-auto">
      {customers.slice(0, 10).map((customer, index) => {
        const customerType = getCustomerType(customer.total_profit);
        
        return (
          <div
            key={customer.customer_name}
            className="bg-white/10 rounded-lg p-4 hover:bg-white/20 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{customerType.emoji}</div>
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
  );
}
