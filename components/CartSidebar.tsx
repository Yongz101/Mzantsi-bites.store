
import React, { useState, useEffect, useRef } from 'react';
import { X, Plus, Minus, ShoppingBag, AlertCircle, CreditCard, ShieldCheck } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../services/AuthContext';
import { CartItem } from '../types';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onOpenAuth: () => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose, items, onUpdateQuantity, onOpenAuth }) => {
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'ikhokha' | 'paypal'>('ikhokha');
  const checkoutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (checkoutRef.current) {
      checkoutRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, []);

  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const delivery = subtotal > 0 ? 35 : 0;
  const total = subtotal + delivery;

  const handleCheckout = async () => {
    if (!user) {
      onOpenAuth();
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const orderData = {
        customerId: user.id,
        customerName: user.name,
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        total,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      // Create order via backend API
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        const errorMessage = errorData.details || errorData.error || 'Failed to create order';
        console.error('Backend error details:', errorData);
        throw new Error(errorMessage);
      }
      const order = await orderResponse.json();
      
      // Initiate payment via backend
      const response = await fetch('/api/payments/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id,
          amount: total,
          items: orderData.items,
          paymentMethod
        })
      });
      
      if (!response.ok) throw new Error('Payment initiation failed');
      
      const data = await response.json();
      
      if (data.redirectUrl) {
        // In a production app, this would redirect to the real gateway
        // For this demo, we'll use the simulated redirect
        window.location.href = data.redirectUrl;
      } else {
        alert("Order placed successfully!");
        onClose();
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError('Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      />
      <div className="fixed bottom-0 right-0 h-[92dvh] sm:h-full w-full sm:max-w-md bg-black z-50 border-l border-white/10 flex flex-col rounded-t-3xl sm:rounded-l-3xl animate-[slideUp_0.3s_ease-out] sm:animate-[slideInRight_0.3s_ease-out] transition-colors duration-500">
        {/* Mobile Handle */}
        <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mt-3 mb-1 sm:hidden shrink-0" />
        
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-3 text-white uppercase tracking-tighter">
            Your Bag <span className="bg-lime text-black text-xs px-2.5 py-0.5 rounded-full font-bold">{items.length}</span>
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto">
          <div className="p-5 space-y-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center opacity-20 py-16 text-white">
                <ShoppingBag className="w-20 h-20 mb-4 stroke-1" />
                <p className="text-lg font-bold uppercase tracking-widest">Your bag is empty</p>
                <p className="text-[10px] font-medium mt-1">Add some delicious items to get started.</p>
              </div>
            ) : (
              items.map(item => (
                <div key={item.id} className="flex gap-3 p-3 bg-white/5 rounded-[24px] border border-white/5 group animate-fadeIn">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-grow flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-white text-sm uppercase tracking-tight line-clamp-1">{item.name}</h4>
                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{item.category}</p>
                      </div>
                      <span className="font-bold text-lime text-sm">R {item.price * item.quantity}</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-4 bg-black/40 rounded-full px-3 py-1 border border-white/10">
                        <button 
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="text-white/60 hover:text-white transition-colors p-1"
                          disabled={isProcessing}
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-bold text-xs w-4 text-center text-white">{item.quantity}</span>
                        <button 
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="text-white/60 hover:text-white transition-colors p-1"
                          disabled={isProcessing}
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {items.length > 0 && (
            <div ref={checkoutRef} className="p-6 border-t border-white/10 bg-black">
              <div className="flex flex-col gap-3 mb-6">
                <div className="flex justify-between text-white/40 text-[10px] font-bold uppercase tracking-widest">
                  <span>Subtotal</span>
                  <span className="text-white">R {subtotal}</span>
                </div>
                <div className="flex justify-between text-white/40 text-[10px] font-bold uppercase tracking-widest">
                  <span>Delivery</span>
                  <span className="text-white">R {delivery}</span>
                </div>
                <div className="flex justify-between text-2xl font-bold mt-1 pt-4 border-t border-white/10 text-white uppercase tracking-tighter">
                  <span>Total</span>
                  <span className="text-lime">R {total}</span>
                </div>
              </div>

              <div className="space-y-4">
                {!user && (
                  <div className="bg-lime/10 border border-lime/20 p-4 rounded-2xl mb-4">
                    <p className="text-[10px] font-bold text-lime uppercase tracking-widest text-center mb-3">Log in to complete your order</p>
                    <button 
                      onClick={onOpenAuth}
                      className="w-full bg-white text-black font-bold py-3 rounded-full hover:bg-lime transition-all text-[10px] uppercase tracking-widest"
                    >
                      Login / Register
                    </button>
                  </div>
                )}

                <div className="bg-white/5 p-4 rounded-2xl border border-white/10 mb-4">
                  <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-3">Select Payment Method</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setPaymentMethod('ikhokha')}
                      className={`py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border ${
                        paymentMethod === 'ikhokha' 
                          ? 'bg-lime text-black border-lime' 
                          : 'bg-transparent text-white border-white/10 hover:border-white/30'
                      }`}
                    >
                      iKhokha
                    </button>
                    <button
                      onClick={() => setPaymentMethod('paypal')}
                      className={`py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border ${
                        paymentMethod === 'paypal' 
                          ? 'bg-[#0070ba] text-white border-[#0070ba]' 
                          : 'bg-transparent text-white border-white/10 hover:border-white/30'
                      }`}
                    >
                      PayPal
                    </button>
                  </div>
                </div>

                <button 
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className={`w-full font-black py-5 rounded-full transition-all active:scale-95 text-lg uppercase tracking-tighter flex items-center justify-center gap-3 shadow-xl disabled:opacity-50 ${
                    paymentMethod === 'ikhokha' 
                      ? 'bg-lime text-black hover:bg-lime/90 shadow-lime/20' 
                      : 'bg-[#0070ba] text-white hover:bg-[#005ea6] shadow-blue-500/20'
                  }`}
                >
                  {isProcessing ? (
                    <div className="w-6 h-6 border-4 border-black/20 border-t-black rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Pay with {paymentMethod === 'ikhokha' ? 'iKhokha' : 'PayPal'}</span>
                      <CreditCard className="w-5 h-5" />
                    </>
                  )}
                </button>
                
                <div className="pt-2">
                  <div className="flex items-center justify-center gap-2 text-white/30">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Secure {paymentMethod === 'ikhokha' ? 'South African' : 'Global'} Payment</span>
                  </div>
                  <div className="mt-4 flex justify-center gap-4 opacity-30 grayscale hover:grayscale-0 transition-all">
                    <span className="text-[10px] font-black italic tracking-widest uppercase">Powered by {paymentMethod === 'ikhokha' ? 'iKhokha' : 'PayPal'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
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
