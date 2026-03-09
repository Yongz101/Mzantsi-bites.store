
import React, { useEffect } from 'react';
import { CheckCircle, ShoppingBag, ArrowRight, Home } from 'lucide-react';

interface PaymentSuccessProps {
  onGoHome: () => void;
  onViewOrders: () => void;
}

const PaymentSuccess: React.FC<PaymentSuccessProps> = ({ onGoHome, onViewOrders }) => {
  const params = new URLSearchParams(window.location.search);
  const orderId = params.get('orderId');

  useEffect(() => {
    // Clear cart if needed (handled by App state usually)
  }, []);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
      <div className="w-24 h-24 bg-lime/20 rounded-full flex items-center justify-center mb-8 animate-bounce">
        <CheckCircle className="w-12 h-12 text-lime" strokeWidth={3} />
      </div>
      
      <h1 className="text-4xl font-black text-white uppercase tracking-tighter mb-4">
        Payment Successful!
      </h1>
      
      <p className="text-white/60 font-bold uppercase tracking-widest text-xs mb-8 max-w-xs mx-auto">
        Your order {orderId ? `#${orderId.slice(-6).toUpperCase()}` : ''} has been placed and is being prepared.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
        <button 
          onClick={onViewOrders}
          className="bg-white/5 border border-white/10 text-white font-bold py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-white/10 transition-all"
        >
          <ShoppingBag className="w-5 h-5" />
          <span>View Orders</span>
        </button>
        
        <button 
          onClick={onGoHome}
          className="bg-lime text-black font-black py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-lime/90 transition-all active:scale-95"
        >
          <Home className="w-5 h-5" />
          <span>Back to Menu</span>
        </button>
      </div>

      <div className="mt-12 pt-12 border-t border-white/5 w-full max-w-md">
        <div className="flex items-center justify-center gap-2 text-white/20">
          <span className="text-[10px] font-bold uppercase tracking-widest">Transaction ID: {params.get('session') || 'TXN_SIMULATED'}</span>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
