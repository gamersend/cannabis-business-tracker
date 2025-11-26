'use client';

import { useState, useEffect } from 'react';

interface Strain {
  id: string;
  name: string;
  type: string;
  cost_per_gram: number;
  cost_per_pound: number;
  current_stock_grams: number;
  reorder_point: number;
  emoji: string;
}

export function InventoryStatus() {
  const [strains, setStrains] = useState<Strain[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStrains();
  }, []);

  const fetchStrains = async () => {
    try {
      const response = await fetch('/api/strains');
      const data = await response.json();
      setStrains(data);
    } catch (error) {
      console.error('Error fetching strains:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-white">Loading inventory... 📦</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {strains.map((strain) => {
        const stockStatus = strain.current_stock_grams <= strain.reorder_point ? 'low' : 'good';
        const stockColor = stockStatus === 'low' ? 'text-red-300' : 'text-green-300';
        
        return (
          <div
            key={strain.id}
            className="bg-white/10 rounded-lg p-4 hover:bg-white/20 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{strain.emoji}</span>
                <span className="text-white font-semibold">{strain.name}</span>
              </div>
              {stockStatus === 'low' && (
                <span className="text-red-400 text-xs bg-red-400/20 px-2 py-1 rounded-full">
                  Low Stock!
                </span>
              )}
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-green-200">Stock:</span>
                <span className={stockColor}>
                  {strain.current_stock_grams}g
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-green-200">Cost/g:</span>
                <span className="text-white">${strain.cost_per_gram}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-green-200">Cost/lb:</span>
                <span className="text-white">${strain.cost_per_pound.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-green-200">Reorder at:</span>
                <span className="text-yellow-300">{strain.reorder_point}g</span>
              </div>
            </div>
            
            {/* Quick calculations */}
            <div className="mt-3 pt-3 border-t border-white/20">
              <div className="text-xs text-green-200 space-y-1">
                <div>1oz (28g): ${(strain.cost_per_gram * 28).toFixed(2)}</div>
                <div>Quarter (7g): ${(strain.cost_per_gram * 7).toFixed(2)}</div>
              </div>
            </div>
          </div>
        );
      })}
      
      {strains.length === 0 && (
        <div className="col-span-full text-center text-green-200 py-8">
          <div className="text-4xl mb-2">🌱</div>
          <p>No strains in inventory - add some products!</p>
        </div>
      )}
    </div>
  );
}
