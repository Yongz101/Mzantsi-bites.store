
import React, { useState } from 'react';
import { X, Plus, Minus, ShoppingBag, Loader2, AlertCircle, ExternalLink, ShieldCheck } from 'lucide-react';
import { CartItem } from '../types';
import { createIkhokhaPaylink } from '../services/paymentService';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose, items, onUpdateQuantity }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const delivery = subtotal > 0 ? 35 : 0;
  const total = subtotal + delivery;

  const handleCheckout = async () => {
    if (items.length === 0) return;
    
    setIsProcessing(true);
    setError(null);
    const orderId = `MB-${Date.now()}`;

    try {
      const response = await createIkhokhaPaylink(total, orderId);
      if (response && response.paylinkUrl) {
        // Redirect to iKhokha secure page
        window.location.href = response.paylinkUrl;
      } else {
        throw new Error("Unable to create a secure payment session.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred. Please try again later.");
      setIsProcessing(false);
      console.error("Checkout process failed:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      />
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col animate-[slideInRight_0.3s_ease-out]">
        <div className="p-6 border-b border-stone-100 flex items-center justify-between">
          <h2 className="text-2xl font-black flex items-center gap-3">
            Your Bag <span className="bg-amber-100 text-amber-700 text-sm px-2.5 py-0.5 rounded-full">{items.length}</span>
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-6 flex flex-col gap-6 no-scrollbar">
          {items.length === 0 ? (
            <div className="flex-grow flex flex-col items-center justify-center text-center opacity-30 py-20">
              <ShoppingBag className="w-24 h-24 mb-6 stroke-1" />
              <p className="text-xl font-bold">Your bag is hungry!</p>
              <p className="text-sm">Add some lekker food to get started.</p>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className="flex gap-4 group animate-fadeIn">
                <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 border border-stone-100 shadow-sm">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-stone-900 text-sm leading-tight">{item.name}</h4>
                    <span className="font-black text-amber-600 text-sm">R {item.price * item.quantity}</span>
                  </div>
                  <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mt-1 mb-3">{item.category}</p>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => onUpdateQuantity(item.id, -1)}
                      className="w-8 h-8 flex items-center justify-center bg-stone-100 rounded-lg hover:bg-stone-200"
                      disabled={isProcessing}
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-black text-sm w-6 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => onUpdateQuantity(item.id, 1)}
                      className="w-8 h-8 flex items-center justify-center bg-stone-100 rounded-lg hover:bg-stone-200"
                      disabled={isProcessing}
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t border-stone-100 bg-stone-50/80 backdrop-blur-sm">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex flex-col gap-2 text-red-600 text-sm shadow-sm animate-shake">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <p className="font-black uppercase tracking-widest text-[10px]">Security Notice</p>
                </div>
                <p className="font-medium leading-relaxed">{error}</p>
              </div>
            )}
            
            <div className="flex flex-col gap-3 mb-6">
              <div className="flex justify-between text-stone-500 text-sm">
                <span>Subtotal</span>
                <span className="font-bold">R {subtotal}</span>
              </div>
              <div className="flex justify-between text-stone-500 text-sm">
                <span>Delivery Charge</span>
                <span className="font-bold">R {delivery}</span>
              </div>
              <div className="flex justify-between text-2xl font-black mt-2 pt-4 border-t border-stone-200 text-stone-900">
                <span>Total</span>
                <span className="text-amber-600">R {total}</span>
              </div>
            </div>
            
            <button 
              onClick={handleCheckout}
              disabled={isProcessing}
              className={`w-full bg-stone-900 text-white font-black py-4 rounded-2xl shadow-xl shadow-stone-900/10 hover:bg-stone-800 transition-all active:scale-[0.98] text-lg flex items-center justify-center gap-3 ${
                isProcessing ? 'opacity-90 cursor-wait' : ''
              }`}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Securely Loading...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5 text-amber-500" />
                  Pay Now with iKhokha
                  <ExternalLink className="w-4 h-4 opacity-50" />
                </>
              )}
            </button>
            <p className="mt-4 text-[10px] text-stone-400 text-center uppercase tracking-widest font-black flex items-center justify-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              256-bit Secure Checkout
            </p>
          </div>
        )}
      </div>
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 3;
        }
      `}</style>
    </>
  );
};

export default CartSidebar;
