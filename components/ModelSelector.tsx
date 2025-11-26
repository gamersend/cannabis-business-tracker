'use client';

import { useState } from 'react';
import { AVAILABLE_MODELS } from '@/lib/ai-parser';

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (model: string) => void;
}

export function ModelSelector({ selectedModel, onModelChange }: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedModelData = AVAILABLE_MODELS.find(m => m.id === selectedModel);

  const formatCost = (prompt: number, completion: number) => {
    if (prompt === 0 && completion === 0) return 'FREE';
    return `$${prompt.toFixed(3)}/$${completion.toFixed(3)} per 1M tokens`;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-2 bg-white/20 border border-green-300/30 rounded-lg text-white hover:bg-white/30 transition-colors"
      >
        <div className="flex items-center space-x-2">
          <span className="text-sm">🤖</span>
          <div className="text-left">
            <div className="text-sm font-medium">
              {selectedModelData?.name || 'Select Model'}
            </div>
            <div className="text-xs text-green-200">
              {selectedModelData ? formatCost(selectedModelData.pricing.prompt, selectedModelData.pricing.completion) : ''}
            </div>
          </div>
        </div>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white/10 backdrop-blur-sm border border-green-300/30 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
          {AVAILABLE_MODELS.map((model) => (
            <button
              key={model.id}
              onClick={() => {
                onModelChange(model.id);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-3 text-left hover:bg-white/20 transition-colors border-b border-white/10 last:border-b-0 ${
                selectedModel === model.id ? 'bg-green-600/30' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-medium">{model.name}</span>
                    {model.pricing.prompt === 0 && (
                      <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                        FREE
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-green-200 mt-1">
                    {model.description}
                  </div>
                  <div className="text-xs text-yellow-300 mt-1">
                    {formatCost(model.pricing.prompt, model.pricing.completion)}
                  </div>
                  <div className="text-xs text-gray-300 mt-1">
                    Context: {model.context_length.toLocaleString()} tokens
                  </div>
                </div>
                {selectedModel === model.id && (
                  <div className="text-green-400">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Cost Estimator */}
      {selectedModelData && (
        <div className="mt-2 p-2 bg-white/10 rounded-lg">
          <div className="text-xs text-green-200">
            💡 <strong>Cost Estimate:</strong> Typical sale parsing uses ~200 tokens
            {selectedModelData.pricing.prompt > 0 ? (
              <span> ≈ ${((selectedModelData.pricing.prompt * 200) / 1000000).toFixed(6)} per parse</span>
            ) : (
              <span> = FREE!</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
