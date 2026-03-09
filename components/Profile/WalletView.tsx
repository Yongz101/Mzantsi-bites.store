
import React, { useState } from 'react';
import { 
  ArrowUp, 
  ArrowDown, 
  Star, 
  TrendingUp,
  Search
} from 'lucide-react';
import { useAuth } from '../../services/AuthContext';

const WalletView: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('All');
  const [investmentAmount, setInvestmentAmount] = useState('');

  const userName = user?.name || 'Aphelele';

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Header */}
      <div className="px-6 py-8 text-center">
        <p className="text-stone-400 text-sm mb-1">Welcome Back,</p>
        <h1 className="text-3xl font-bold">{userName}</h1>
      </div>

      {/* Main Card */}
      <div className="px-6 mb-8">
        <div className="relative overflow-hidden bg-gradient-to-br from-[#bef264] via-[#a3e635] to-[#65a30d] rounded-[40px] p-8 text-black shadow-2xl shadow-lime-500/20">
          {/* Decorative pattern */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="grid grid-cols-6 gap-4 p-4">
              {Array.from({ length: 24 }).map((_, i) => (
                <div key={i} className="w-2 h-2 rounded-full bg-black" />
              ))}
            </div>
          </div>

          <div className="relative z-10">
            <div className="flex justify-between items-start mb-12">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider opacity-60 mb-1">Total Balance</p>
                <h2 className="text-4xl font-black tracking-tighter">R0.00</h2>
              </div>
              <div className="flex items-center gap-2 bg-black/10 px-3 py-1.5 rounded-full">
                <Star className="w-4 h-4 fill-black" />
                <span className="text-xs font-bold uppercase tracking-tighter">Mzantsi bites</span>
              </div>
            </div>

            <div className="mb-8">
              <p className="text-[10px] font-bold uppercase tracking-wider opacity-60 mb-2">Card Unique ID</p>
              <p className="text-2xl font-mono tracking-[0.2em] font-bold">6534 8213 6176 700</p>
            </div>

            <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider opacity-60 mb-1">Name</p>
                <p className="text-lg font-bold">{userName}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold uppercase tracking-wider opacity-60 mb-1">Exp. Date</p>
                <p className="text-lg font-bold">05/29</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-6 flex gap-4 mb-10">
        <button className="flex-1 bg-[#1c1c1c] hover:bg-[#2a2a2a] py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95">
          <ArrowUp className="w-5 h-5" />
          <span className="font-bold">Withdraw</span>
        </button>
        <button className="flex-1 bg-[#a3e635] hover:bg-[#bef264] text-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95">
          <ArrowDown className="w-5 h-5" />
          <span className="font-bold">Top-up</span>
        </button>
      </div>

      {/* Activity Section */}
      <div className="px-6 mb-10">
        <div className="bg-[#0a0a0a] border border-white/5 rounded-[32px] p-8">
          <h3 className="text-2xl font-bold mb-1">Activity</h3>
          <p className="text-stone-500 text-sm mb-8">Income and expenses for this year.</p>
          
          <div className="h-48 relative">
            {/* Simple Chart Visualization */}
            <div className="absolute inset-0 flex flex-col justify-between text-[10px] text-stone-600 font-mono">
              <div className="border-b border-white/5 pb-1">R0.004k</div>
              <div className="border-b border-white/5 pb-1">R0.003k</div>
              <div className="border-b border-white/5 pb-1">R0.002k</div>
              <div className="border-b border-white/5 pb-1">R0.001k</div>
              <div className="flex justify-between pt-1">
                <span>R0k</span>
                <div className="flex gap-4">
                  <span>Oct</span>
                  <span>Nov</span>
                  <span>Dec</span>
                  <span>Jan</span>
                  <span>Feb</span>
                  <span>Mar</span>
                </div>
              </div>
            </div>
            {/* Red Line as seen in image */}
            <div className="absolute bottom-[22px] left-8 right-0 h-[2px] bg-red-500/50 rounded-full" />
          </div>
        </div>
      </div>

      {/* Investment Section */}
      <div className="px-6 mb-10">
        <h3 className="text-2xl font-bold mb-1">Invest in Mzantsi Bites</h3>
        <p className="text-stone-500 text-sm mb-6">Grow your wallet by investing in the platform.</p>
        
        <div className="bg-[#0a0a0a] border border-white/5 rounded-[32px] p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-stone-500 text-xs mb-1">Your Investment Value</p>
              <p className="text-3xl font-bold">R0.00</p>
            </div>
            <div className="w-12 h-12 bg-lime-500/10 rounded-2xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-lime-500" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Investment Amount (R)</label>
            <input 
              type="text" 
              placeholder="e.g., 100.00"
              value={investmentAmount}
              onChange={(e) => setInvestmentAmount(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-lime-500 transition-colors"
            />
          </div>
          <button className="w-full bg-[#a3e635] hover:bg-[#bef264] text-black font-bold py-4 rounded-2xl transition-all active:scale-95">
            Invest Now
          </button>
        </div>
      </div>

      {/* Transaction History */}
      <div className="px-6">
        <div className="bg-[#0a0a0a] border border-white/5 rounded-[32px] p-8">
          <h3 className="text-2xl font-bold mb-1">Transaction History</h3>
          <p className="text-stone-500 text-sm mb-8">View your recent wallet activity.</p>

          <div className="flex bg-black p-1 rounded-2xl mb-12">
            {['All', 'Money In', 'Money Out'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
                  activeTab === tab ? 'bg-[#a3e635] text-black' : 'text-stone-500'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="py-20 text-center">
            <p className="text-stone-500 text-sm">No transactions in this category.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletView;
