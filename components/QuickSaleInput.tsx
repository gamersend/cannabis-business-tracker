'use client';

import { useState } from 'react';
import { ModelSelector } from './ModelSelector';
import { VoiceInterface } from './VoiceInterface';
import { aiAdvisor } from '@/lib/ai-advisor';

interface QuickSaleInputProps {
  onSaleAdded: () => void;
}

export function QuickSaleInput({ onSaleAdded }: QuickSaleInputProps) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [parsedData, setParsedData] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedModel, setSelectedModel] = useState('openai/gpt-4o-mini');
  const [showVoice, setShowVoice] = useState(false);
  const [celebrationMessage, setCelebrationMessage] = useState('');

  const handleQuickParse = async () => {
    if (!input.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/parse-sale', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: input.trim(), model: selectedModel })
      });
      
      const result = await response.json();
      setParsedData(result);
      setSuggestions(result.suggestions || []);
      
      if (result.confidence > 0.7) {
        // High confidence - show confirmation
        setShowForm(true);
      } else {
        // Low confidence - show form for manual input
        setShowForm(true);
      }
    } catch (error) {
      console.error('Error parsing sale:', error);
      setSuggestions(['Error parsing input - please try again']);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitSale = async (saleData: any) => {
    setLoading(true);
    try {
      const response = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(saleData)
      });

      if (response.ok) {
        // Generate AI celebration message
        const celebration = await aiAdvisor.generateSalesCelebration(saleData);
        setCelebrationMessage(celebration);

        // Play TTS celebration
        playSaleCelebration(saleData, celebration);

        setInput('');
        setParsedData(null);
        setSuggestions([]);
        setShowForm(false);
        onSaleAdded();
      }
    } catch (error) {
      console.error('Error adding sale:', error);
    } finally {
      setLoading(false);
    }
  };

  const playSaleCelebration = async (saleData: any, message: string) => {
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: message,
          type: 'sale_confirmation',
          data: saleData
        })
      });

      if (response.ok) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.play();
      }
    } catch (error) {
      console.error('Error playing celebration:', error);
    }
  };

  const handleVoiceInput = (text: string) => {
    setInput(text);
    handleQuickParse();
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-white flex items-center">
          🤖 AI Quick Sale Entry
        </h2>
        <button
          onClick={() => setShowVoice(!showVoice)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            showVoice ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
          } text-white`}
        >
          {showVoice ? '🔇 Hide Voice' : '🎤 Voice Mode'}
        </button>
      </div>

      {/* Model Selector */}
      <div className="mb-4">
        <label className="block text-green-200 text-sm font-medium mb-2">
          AI Model Selection 🧠
        </label>
        <ModelSelector
          selectedModel={selectedModel}
          onModelChange={setSelectedModel}
        />
      </div>

      {/* Voice Interface */}
      {showVoice && (
        <div className="mb-6">
          <VoiceInterface onSpeechResult={handleVoiceInput} />
        </div>
      )}

      {/* Celebration Message */}
      {celebrationMessage && (
        <div className="mb-4 p-4 bg-green-500/20 border border-green-400 rounded-lg">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🎉</span>
            <p className="text-green-200">{celebrationMessage}</p>
          </div>
        </div>
      )}

      {/* Natural Language Input */}
      <div className="mb-4">
        <label className="block text-green-200 text-sm font-medium mb-2">
          Just type naturally! 💬
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleQuickParse()}
            placeholder="e.g., 'Sold 1 oz cookies to Leveny for $325' or 'Karlo 690'"
            className="flex-1 px-4 py-3 bg-white/20 border border-green-300/30 rounded-lg text-white placeholder-green-200/70 focus:outline-none focus:ring-2 focus:ring-green-400"
            disabled={loading}
          />
          <button
            onClick={handleQuickParse}
            disabled={loading || !input.trim()}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg font-medium transition-colors"
          >
            {loading ? '🤖' : '✨ Parse'}
          </button>
        </div>
      </div>

      {/* Examples */}
      <div className="mb-4">
        <p className="text-green-200 text-sm mb-2">💡 Try these formats:</p>
        <div className="flex flex-wrap gap-2">
          {[
            'Jay 325',
            'Sold 1 oz Purple Chem to Ryan for $400',
            'Karlo bought quarter cookies $180 cash',
            'Leveny 1oz stardust 325'
          ].map((example, i) => (
            <button
              key={i}
              onClick={() => setInput(example)}
              className="px-3 py-1 bg-green-600/30 hover:bg-green-600/50 text-green-200 rounded-full text-sm transition-colors"
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="mb-4">
          <p className="text-yellow-300 text-sm font-medium mb-2">🔍 AI Suggestions:</p>
          <ul className="space-y-1">
            {suggestions.map((suggestion, i) => (
              <li key={i} className="text-yellow-200 text-sm">• {suggestion}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Parsed Data Form */}
      {showForm && parsedData && (
        <SaleForm
          initialData={parsedData}
          onSubmit={handleSubmitSale}
          onCancel={() => {
            setShowForm(false);
            setParsedData(null);
            setSuggestions([]);
          }}
          loading={loading}
        />
      )}
    </div>
  );
}

interface SaleFormProps {
  initialData: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  loading: boolean;
}

function SaleForm({ initialData, onSubmit, onCancel, loading }: SaleFormProps) {
  const [formData, setFormData] = useState({
    customer_name: initialData.customer_name || '',
    strain_name: initialData.strain_name || '',
    quantity_grams: initialData.quantity_grams || '',
    sale_price: initialData.sale_price || '',
    payment_method: initialData.payment_method || 'cash',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Calculate cost and profit (simplified)
    const cost_price = parseFloat(formData.quantity_grams) * 6.0; // Average cost per gram
    const profit = parseFloat(formData.sale_price) - cost_price;
    
    onSubmit({
      ...formData,
      quantity_grams: parseFloat(formData.quantity_grams),
      sale_price: parseFloat(formData.sale_price),
      cost_price,
      profit
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white/10 rounded-lg p-4 mt-4">
      <h3 className="text-lg font-semibold text-white mb-3">
        {initialData.confidence > 0.7 ? '✅ Confirm Sale Details' : '📝 Complete Sale Details'}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-green-200 text-sm mb-1">Customer Name</label>
          <input
            type="text"
            value={formData.customer_name}
            onChange={(e) => setFormData({...formData, customer_name: e.target.value})}
            className="w-full px-3 py-2 bg-white/20 border border-green-300/30 rounded text-white"
            required
          />
        </div>
        
        <div>
          <label className="block text-green-200 text-sm mb-1">Strain</label>
          <select
            value={formData.strain_name}
            onChange={(e) => setFormData({...formData, strain_name: e.target.value})}
            className="w-full px-3 py-2 bg-white/20 border border-green-300/30 rounded text-white"
            required
          >
            <option value="">Select strain...</option>
            <option value="Purple Chem">💜 Purple Chem</option>
            <option value="Girl Scout Cookies">🍪 Girl Scout Cookies</option>
            <option value="Stardust">✨ Stardust</option>
            <option value="Candyland">🍭 Candyland</option>
          </select>
        </div>
        
        <div>
          <label className="block text-green-200 text-sm mb-1">Quantity (grams)</label>
          <input
            type="number"
            step="0.1"
            value={formData.quantity_grams}
            onChange={(e) => setFormData({...formData, quantity_grams: e.target.value})}
            className="w-full px-3 py-2 bg-white/20 border border-green-300/30 rounded text-white"
            required
          />
        </div>
        
        <div>
          <label className="block text-green-200 text-sm mb-1">Sale Price ($)</label>
          <input
            type="number"
            step="0.01"
            value={formData.sale_price}
            onChange={(e) => setFormData({...formData, sale_price: e.target.value})}
            className="w-full px-3 py-2 bg-white/20 border border-green-300/30 rounded text-white"
            required
          />
        </div>
      </div>
      
      <div className="flex gap-2 mt-4">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded font-medium"
        >
          {loading ? '💾 Saving...' : '💾 Save Sale'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded font-medium"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
