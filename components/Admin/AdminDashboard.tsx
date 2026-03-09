
import React, { useEffect, useState } from 'react';
import { Users, ShoppingBag, Shield, Activity } from 'lucide-react';
import { collection, getDocs, query, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { User, Order } from '../../types';

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const unsubscribeUsers = onSnapshot(collection(db, 'users'), 
      (snapshot) => {
        const usersData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as User[];
        setUsers(usersData);
      },
      (error) => {
        console.error('Admin users subscription error:', error);
        if (error.code === 'permission-denied') {
          setUsers([]);
        }
      }
    );

    const unsubscribeOrders = onSnapshot(collection(db, 'orders'), 
      (snapshot) => {
        const ordersData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Order[];
        setOrders(ordersData);
      },
      (error) => {
        console.error('Admin orders subscription error:', error);
        if (error.code === 'permission-denied') {
          setOrders([]);
        }
      }
    );

    return () => {
      unsubscribeUsers();
      unsubscribeOrders();
    };
  }, []);

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-black pt-24 pb-12 px-4 sm:px-6 lg:px-8 transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-black tracking-tighter text-stone-900 dark:text-white">ADMINISTRATION</h1>
          <p className="text-stone-500 dark:text-stone-400 font-bold uppercase tracking-widest text-xs mt-1">Platform overview and user management</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Total Users', value: users.length, icon: Users, color: 'bg-indigo-500' },
            { label: 'Total Orders', value: orders.length, icon: ShoppingBag, color: 'bg-amber-500' },
            { label: 'Active Drivers', value: users.filter(u => u.role === 'driver').length, icon: Activity, color: 'bg-emerald-500' },
            { label: 'System Status', value: 'Healthy', icon: Shield, color: 'bg-stone-900 dark:bg-stone-800' },
          ].map((stat, i) => (
            <div key={i} className="bg-white dark:bg-black p-6 rounded-3xl border-4 border-stone-950 dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)]">
              <div className={`${stat.color} w-10 h-10 rounded-xl border-2 border-stone-950 flex items-center justify-center mb-4`}>
                <stat.icon className="text-white w-5 h-5" />
              </div>
              <p className="text-stone-400 font-black uppercase tracking-widest text-[10px] mb-1">{stat.label}</p>
              <p className="text-2xl font-black tracking-tighter text-stone-900 dark:text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-black rounded-3xl border-4 border-stone-950 dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)] overflow-hidden">
            <div className="p-8 border-b-4 border-stone-950 dark:border-white">
              <h2 className="text-xl font-black tracking-tighter text-stone-900 dark:text-white uppercase">User Directory</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-stone-100 dark:bg-stone-900 border-b-2 border-stone-950 dark:border-white">
                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-stone-400">Name</th>
                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-stone-400">Role</th>
                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-stone-400">Email</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-stone-950 dark:divide-white">
                  {users.map(user => (
                    <tr key={user.id} className="hover:bg-amber-50 dark:hover:bg-amber-900/10 transition-colors">
                      <td className="px-8 py-4 font-black uppercase tracking-widest text-xs text-stone-900 dark:text-white">{user.name}</td>
                      <td className="px-8 py-4">
                        <span className={`px-3 py-1 rounded-xl border-2 border-stone-950 text-[10px] font-black uppercase tracking-widest ${
                          user.role === 'admin' ? 'bg-stone-950 text-white' :
                          user.role === 'store' ? 'bg-amber-500 text-stone-950' :
                          user.role === 'driver' ? 'bg-emerald-500 text-stone-950' :
                          'bg-stone-100 text-stone-600'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-8 py-4 text-xs text-stone-500 dark:text-stone-400 font-black uppercase tracking-widest">{user.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white dark:bg-black rounded-3xl border-4 border-stone-950 dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)] overflow-hidden">
            <div className="p-8 border-b-4 border-stone-950 dark:border-white">
              <h2 className="text-xl font-black tracking-tighter text-stone-900 dark:text-white uppercase">Recent Activity</h2>
            </div>
            <div className="p-8 space-y-6">
              {orders.slice(0, 5).map(order => (
                <div key={order.id} className="flex items-center justify-between border-b-2 border-stone-100 dark:border-white/5 pb-4 last:border-0">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-stone-100 dark:bg-stone-900 rounded-xl border-2 border-stone-950 dark:border-white flex items-center justify-center">
                      <ShoppingBag className="w-5 h-5 text-stone-400" />
                    </div>
                    <div>
                      <p className="font-black uppercase tracking-widest text-xs text-stone-900 dark:text-white">Order #{order.id.slice(-6).toUpperCase()}</p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className="text-sm font-black text-stone-900 dark:text-white">R {order.total}</span>
                </div>
              ))}
              {orders.length === 0 && (
                <p className="text-center py-12 text-stone-400 font-black uppercase tracking-widest text-xs">No recent orders</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
