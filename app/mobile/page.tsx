'use client';

import { useState, useEffect } from 'react';

interface Customer {
  customer_name: string;
  total_profit: number;
  transaction_count: number;
}

interface WeightOption {
  grams: number;
  display: string;
  prices: number[];
}

const WEIGHT_OPTIONS: WeightOption[] = [
  { grams: 3.5, display: '3.5g (Eighth)', prices: [60, 70] },
  { grams: 7, display: '7g (Quarter)', prices: [110, 120, 130, 140] },
  { grams: 14, display: '14g (Half)', prices: [200, 210, 220, 230] },
  { grams: 28, display: '28g (Ounce)', prices: [300, 310, 320, 330, 340, 350] }
];

export default function MobileSales() {
  const [step, setStep] = useState<'customer' | 'weight' | 'price' | 'confirm'>('customer');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [selectedWeight, setSelectedWeight] = useState<WeightOption | null>(null);
  const [selectedPrice, setSelectedPrice] = useState<number>(0);
  const [customPrice, setCustomPrice] = useState<string>('');
  const [newCustomerName, setNewCustomerName] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/customers');
      const data = await response.json();
      setCustomers(data.slice(0, 12)); // Top 12 customers for mobile
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const handleCustomerSelect = (customerName: string) => {
    setSelectedCustomer(customerName);
    setStep('weight');
  };

  const handleWeightSelect = (weight: WeightOption) => {
    setSelectedWeight(weight);
    setStep('price');
  };

  const handlePriceSelect = (price: number) => {
    setSelectedPrice(price);
    setCustomPrice('');
    setStep('confirm');
  };

  const handleCustomPrice = () => {
    const price = parseFloat(customPrice);
    if (price > 0) {
      setSelectedPrice(price);
      setStep('confirm');
    }
  };

  const handleConfirmSale = async () => {
    setLoading(true);
    try {
      const saleData = {
        customer_name: selectedCustomer,
        quantity_grams: selectedWeight?.grams,
        sale_price: selectedPrice,
        strain_name: 'Mixed', // Default for mobile quick sales
        payment_method: 'cash'
      };

      const response = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(saleData)
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          resetForm();
        }, 2000);
      }
    } catch (error) {
      console.error('Error adding sale:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep('customer');
    setSelectedCustomer('');
    setSelectedWeight(null);
    setSelectedPrice(0);
    setCustomPrice('');
    setNewCustomerName('');
    setSuccess(false);
  };

  const goBack = () => {
    if (step === 'weight') setStep('customer');
    else if (step === 'price') setStep('weight');
    else if (step === 'confirm') setStep('price');
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-8xl mb-4">🎉</div>
          <h1 className="text-3xl font-bold text-white mb-2">Sale Added!</h1>
          <p className="text-green-200 text-lg mb-4">
            {selectedCustomer} • {selectedWeight?.display} • ${selectedPrice}
          </p>
          <div className="text-6xl">🌿💚</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-emerald-900">
      {/* Header */}
      <div className="bg-black/20 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {step !== 'customer' && (
            <button
              onClick={goBack}
              className="text-white text-2xl p-2 hover:bg-white/20 rounded-lg"
            >
              ←
            </button>
          )}
          <h1 className="text-xl font-bold text-white">
            🌿 Quick Sales
          </h1>
        </div>
        <a
          href="/"
          className="text-white text-sm bg-white/20 px-3 py-2 rounded-lg hover:bg-white/30"
        >
          Dashboard
        </a>
      </div>

      {/* Progress Indicator */}
      <div className="p-4">
        <div className="flex justify-center space-x-2 mb-6">
          {['customer', 'weight', 'price', 'confirm'].map((s, i) => (
            <div
              key={s}
              className={`w-3 h-3 rounded-full ${
                step === s ? 'bg-green-400' : 
                ['customer', 'weight', 'price', 'confirm'].indexOf(step) > i ? 'bg-green-600' : 'bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="p-4">
        {/* Step 1: Customer Selection */}
        {step === 'customer' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white text-center mb-6">
              👥 Select Customer
            </h2>
            
            {/* Recent Customers */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {customers.map((customer) => (
                <button
                  key={customer.customer_name}
                  onClick={() => handleCustomerSelect(customer.customer_name)}
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl p-4 text-left transition-all"
                >
                  <div className="text-white font-semibold text-lg">
                    {customer.customer_name}
                  </div>
                  <div className="text-green-200 text-sm">
                    ${customer.total_profit} • {customer.transaction_count} sales
                  </div>
                </button>
              ))}
            </div>

            {/* No Name Option */}
            <button
              onClick={() => handleCustomerSelect('Anonymous')}
              className="w-full bg-gray-600/50 hover:bg-gray-600/70 backdrop-blur-sm rounded-xl p-4 text-white font-semibold text-lg transition-all"
            >
              🕶️ No Name / Anonymous
            </button>

            {/* New Customer */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <input
                type="text"
                placeholder="New customer name..."
                value={newCustomerName}
                onChange={(e) => setNewCustomerName(e.target.value)}
                className="w-full bg-white/20 text-white placeholder-white/60 rounded-lg px-4 py-3 text-lg mb-3"
              />
              <button
                onClick={() => newCustomerName && handleCustomerSelect(newCustomerName)}
                disabled={!newCustomerName}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-semibold py-3 rounded-lg text-lg transition-all"
              >
                ➕ Add New Customer
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Weight Selection */}
        {step === 'weight' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white text-center mb-2">
              ⚖️ Select Weight
            </h2>
            <p className="text-green-200 text-center mb-6">
              Customer: <span className="font-semibold">{selectedCustomer}</span>
            </p>

            <div className="grid grid-cols-1 gap-4">
              {WEIGHT_OPTIONS.map((weight) => (
                <button
                  key={weight.grams}
                  onClick={() => handleWeightSelect(weight)}
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl p-6 text-center transition-all"
                >
                  <div className="text-white font-bold text-2xl mb-2">
                    {weight.display}
                  </div>
                  <div className="text-green-200">
                    Common: ${weight.prices.join(', $')}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Price Selection */}
        {step === 'price' && selectedWeight && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white text-center mb-2">
              💰 Select Price
            </h2>
            <p className="text-green-200 text-center mb-6">
              {selectedCustomer} • {selectedWeight.display}
            </p>

            {/* Common Prices */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {selectedWeight.prices.map((price) => (
                <button
                  key={price}
                  onClick={() => handlePriceSelect(price)}
                  className="bg-green-600/50 hover:bg-green-600/70 backdrop-blur-sm rounded-xl p-4 text-white font-bold text-xl transition-all"
                >
                  ${price}
                </button>
              ))}
            </div>

            {/* Custom Price */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <input
                type="number"
                placeholder="Custom price..."
                value={customPrice}
                onChange={(e) => setCustomPrice(e.target.value)}
                className="w-full bg-white/20 text-white placeholder-white/60 rounded-lg px-4 py-3 text-lg mb-3"
              />
              <button
                onClick={handleCustomPrice}
                disabled={!customPrice || parseFloat(customPrice) <= 0}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-semibold py-3 rounded-lg text-lg transition-all"
              >
                💵 Use Custom Price
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Confirmation */}
        {step === 'confirm' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white text-center mb-6">
              ✅ Confirm Sale
            </h2>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-green-200">Customer:</span>
                <span className="text-white font-semibold text-lg">{selectedCustomer}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-green-200">Weight:</span>
                <span className="text-white font-semibold text-lg">{selectedWeight?.display}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-green-200">Price:</span>
                <span className="text-white font-semibold text-xl">${selectedPrice}</span>
              </div>
              <div className="border-t border-white/20 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-green-200">Estimated Profit:</span>
                  <span className="text-green-400 font-bold text-xl">
                    ${Math.max(0, selectedPrice - (selectedWeight?.grams || 0) * 8).toFixed(0)}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleConfirmSale}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-bold py-4 rounded-xl text-xl transition-all"
            >
              {loading ? '⏳ Adding Sale...' : '🚀 Confirm Sale'}
            </button>

            <button
              onClick={resetForm}
              className="w-full bg-white/20 hover:bg-white/30 text-white font-semibold py-3 rounded-xl transition-all"
            >
              🔄 Start Over
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
