
import React, { useEffect, useState } from 'react';
import { MapPin, CheckCircle, Clock, Navigation } from 'lucide-react';
import { collection, getDocs, doc, updateDoc, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { Order } from '../../types';
import { useAuth } from '../../services/AuthContext';

const DriverDashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const q = query(collection(db, 'orders'));
    const unsubscribe = onSnapshot(q, 
      (querySnapshot) => {
        const ordersData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Order[];
        setOrders(ordersData);
      },
      (error) => {
        console.error('Driver orders subscription error:', error);
        if (error.code === 'permission-denied') {
          setOrders([]);
        }
      }
    );
    return () => unsubscribe();
  }, []);

  const handleUpdateStatus = async (orderId: string, status: Order['status']) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status, 
          driverId: user?.id 
        })
      });

      if (!response.ok) throw new Error('Failed to update order status');
    } catch (err) {
      console.error('Error updating order status:', err);
      alert('Failed to update order status. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-black pt-24 pb-12 px-4 sm:px-6 lg:px-8 transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-black tracking-tighter text-stone-900 dark:text-white">DRIVER DASHBOARD</h1>
          <p className="text-stone-500 dark:text-stone-400 font-bold uppercase tracking-widest text-xs mt-1">Manage deliveries and track orders</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h2 className="text-xl font-black tracking-tighter text-stone-900 dark:text-white flex items-center gap-2 uppercase">
              <Clock className="w-5 h-5 text-amber-500" /> Available Orders
            </h2>
            {orders.filter(o => o.status === 'pending').map(order => (
              <div key={order.id} className="bg-white dark:bg-black p-8 rounded-3xl border-4 border-stone-950 dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)]">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="text-stone-400 font-black uppercase tracking-widest text-[10px] mb-1">Order ID</p>
                    <p className="text-lg font-black tracking-tighter text-stone-900 dark:text-white">#{order.id.slice(-6).toUpperCase()}</p>
                  </div>
                  <div className="bg-amber-500 text-stone-950 px-4 py-1.5 rounded-xl border-2 border-stone-950 text-[10px] font-black uppercase tracking-widest">
                    Pending
                  </div>
                </div>
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 text-stone-600 dark:text-stone-400">
                    <MapPin className="w-5 h-5 text-stone-400" />
                    <p className="font-black uppercase tracking-widest text-xs">Main Street, Johannesburg</p>
                  </div>
                  <div className="flex items-center gap-3 text-stone-600 dark:text-stone-400">
                    <Navigation className="w-5 h-5 text-stone-400" />
                    <p className="font-black uppercase tracking-widest text-xs">2.4 km away</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleUpdateStatus(order.id, 'preparing')}
                  className="w-full bg-stone-950 dark:bg-amber-500 text-white dark:text-stone-950 font-black py-4 rounded-3xl border-4 border-stone-950 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all uppercase tracking-widest text-xs"
                >
                  Accept Delivery
                </button>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-black tracking-tighter text-stone-900 dark:text-white flex items-center gap-2 uppercase">
              <Navigation className="w-5 h-5 text-emerald-500" /> Active Deliveries
            </h2>
            {orders.filter(o => o.driverId === user?.id && o.status !== 'delivered').map(order => (
              <div key={order.id} className="bg-white dark:bg-black p-8 rounded-3xl border-4 border-stone-950 dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)] ring-4 ring-emerald-500/20">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="text-stone-400 font-black uppercase tracking-widest text-[10px] mb-1">Order ID</p>
                    <p className="text-lg font-black tracking-tighter text-stone-900 dark:text-white">#{order.id.slice(-6).toUpperCase()}</p>
                  </div>
                  <div className="bg-emerald-500 text-stone-950 px-4 py-1.5 rounded-xl border-2 border-stone-950 text-[10px] font-black uppercase tracking-widest">
                    {order.status}
                  </div>
                </div>
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 text-stone-600 dark:text-stone-400">
                    <MapPin className="w-5 h-5 text-stone-400" />
                    <p className="font-black uppercase tracking-widest text-xs">Customer Location</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => handleUpdateStatus(order.id, 'on-the-way')}
                    className="bg-amber-500 text-stone-950 font-black py-4 rounded-2xl border-4 border-stone-950 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all uppercase tracking-widest text-[10px]"
                  >
                    Start Trip
                  </button>
                  <button 
                    onClick={() => handleUpdateStatus(order.id, 'delivered')}
                    className="bg-emerald-500 text-stone-950 font-black py-4 rounded-2xl border-4 border-stone-950 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all uppercase tracking-widest text-[10px]"
                  >
                    Mark Delivered
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;
