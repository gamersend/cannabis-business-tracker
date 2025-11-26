'use client';

import { useState, useEffect } from 'react';
import { BusinessInsight, CustomerAnalysis } from '@/lib/ai-advisor';

export function AIBusinessAdvisor() {
  const [insights, setInsights] = useState<BusinessInsight[]>([]);
  const [customerAnalysis, setCustomerAnalysis] = useState<CustomerAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'insights' | 'customers'>('insights');

  useEffect(() => {
    fetchInsights();
    fetchCustomerAnalysis();
  }, []);

  const fetchInsights = async () => {
    try {
      const response = await fetch('/api/ai-insights');
      const data = await response.json();
      setInsights(data);
    } catch (error) {
      console.error('Error fetching insights:', error);
    }
  };

  const fetchCustomerAnalysis = async () => {
    try {
      const response = await fetch('/api/customer-analysis');
      const data = await response.json();
      setCustomerAnalysis(data);
    } catch (error) {
      console.error('Error fetching customer analysis:', error);
    } finally {
      setLoading(false);
    }
  };

  const speakInsight = async (text: string) => {
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, type: 'business_insight' })
      });

      if (response.ok) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.play();
      }
    } catch (error) {
      console.error('Error playing insight:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-400 bg-red-400/20';
      case 'medium': return 'border-yellow-400 bg-yellow-400/20';
      default: return 'border-green-400 bg-green-400/20';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'warning': return 'text-red-300';
      case 'opportunity': return 'text-yellow-300';
      case 'celebration': return 'text-green-300';
      default: return 'text-blue-300';
    }
  };

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
        <div className="text-white text-center">
          <div className="text-2xl mb-2">🤖</div>
          <p>AI is analyzing your business...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center">
          🧠 AI Business Advisor
        </h2>
        <button
          onClick={() => {
            setLoading(true);
            fetchInsights();
            fetchCustomerAnalysis();
          }}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-colors"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('insights')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'insights'
              ? 'bg-green-600 text-white'
              : 'bg-white/20 text-green-200 hover:bg-white/30'
          }`}
        >
          💡 Business Insights
        </button>
        <button
          onClick={() => setActiveTab('customers')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'customers'
              ? 'bg-green-600 text-white'
              : 'bg-white/20 text-green-200 hover:bg-white/30'
          }`}
        >
          👥 Customer Analysis
        </button>
      </div>

      {/* Business Insights Tab */}
      {activeTab === 'insights' && (
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <div
              key={index}
              className={`border-l-4 rounded-lg p-4 ${getPriorityColor(insight.priority)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-2xl">{insight.emoji}</span>
                    <h3 className={`font-semibold ${getTypeColor(insight.type)}`}>
                      {insight.title}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      insight.priority === 'high' ? 'bg-red-500/30 text-red-200' :
                      insight.priority === 'medium' ? 'bg-yellow-500/30 text-yellow-200' :
                      'bg-green-500/30 text-green-200'
                    }`}>
                      {insight.priority}
                    </span>
                  </div>
                  <p className="text-white mb-2">{insight.message}</p>
                  {insight.action && (
                    <p className="text-green-300 text-sm">
                      <strong>Action:</strong> {insight.action}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => speakInsight(`${insight.title}. ${insight.message}. ${insight.action || ''}`)}
                  className="ml-4 p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                  title="Listen to insight"
                >
                  🔊
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Customer Analysis Tab */}
      {activeTab === 'customers' && (
        <div className="space-y-3">
          {customerAnalysis.slice(0, 10).map((customer, index) => (
            <div
              key={index}
              className="bg-white/10 rounded-lg p-4 hover:bg-white/20 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">
                    {customer.status === 'whale' ? '🐋' :
                     customer.status === 'vip' ? '💎' :
                     customer.status === 'at_risk' ? '⚠️' :
                     customer.status === 'new_opportunity' ? '🌟' : '😎'}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-semibold">{customer.customer_name}</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        customer.status === 'whale' ? 'bg-purple-500/30 text-purple-200' :
                        customer.status === 'vip' ? 'bg-yellow-500/30 text-yellow-200' :
                        customer.status === 'at_risk' ? 'bg-red-500/30 text-red-200' :
                        customer.status === 'new_opportunity' ? 'bg-blue-500/30 text-blue-200' :
                        'bg-green-500/30 text-green-200'
                      }`}>
                        {customer.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="text-green-200 text-sm">
                      ${customer.total_profit} profit • Priority: {customer.priority}/10
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white text-sm">{customer.recommendation}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
