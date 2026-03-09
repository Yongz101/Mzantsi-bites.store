
import React, { useState, useEffect } from 'react';
import { 
  Plus, Package, DollarSign, ShoppingCart, Trash2, 
  LayoutGrid, ShoppingBag, Bike, MessageSquare, 
  Activity, Bell, ChevronDown, UploadCloud, X,
  Clock, CheckCircle2, AlertCircle, Tag, MapPin,
  User, Phone, Navigation
} from 'lucide-react';
import { doc, collection, addDoc, getDocs, deleteDoc, query, where, onSnapshot, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { FoodCategory, FoodItem, Variation, VariationGroup } from '../../types';
import { useLocation } from '../../services/LocationContext';

type StoreTab = 'overview' | 'products' | 'orders' | 'delivery';

interface Order {
  id: string;
  customerName: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  status: 'new' | 'pending' | 'completed' | 'cancelled';
  timestamp: string;
}

interface DeliveryJob {
  id: string;
  orderId: string;
  pickupLocation: string;
  dropoffLocation: string;
  status: 'available' | 'accepted' | 'picked_up' | 'delivered';
  fee: number;
}

const StoreDashboard: React.FC = () => {
  const { address: currentAddress } = useLocation();
  const [activeTab, setActiveTab] = useState<StoreTab>('overview');
  const [isAdding, setIsAdding] = useState(false);
  const [products, setProducts] = useState<FoodItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [deliveries, setDeliveries] = useState<DeliveryJob[]>([]);
  
  // Form State
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [category, setCategory] = useState<FoodCategory | ''>('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [availableFrom, setAvailableFrom] = useState('');
  const [availableUntil, setAvailableUntil] = useState('');
  const [isDineInOnly, setIsDineInOnly] = useState(false);
  const [variationGroups, setVariationGroups] = useState<VariationGroup[]>([]);

  useEffect(() => {
    fetchProducts();
    
    // Real-time orders
    const qOrders = query(collection(db, 'orders'));
    const unsubscribeOrders = onSnapshot(qOrders, 
      (snapshot) => {
        const ordersData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as any[];
        setOrders(ordersData);
      },
      (error) => {
        console.error('Orders subscription error:', error);
        if (error.code === 'permission-denied') {
          // Silent fail or show empty state
          setOrders([]);
        }
      }
    );

    // Real-time deliveries
    const qDeliveries = query(collection(db, 'deliveries'));
    const unsubscribeDeliveries = onSnapshot(qDeliveries, 
      (snapshot) => {
        const deliveriesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as DeliveryJob[];
        setDeliveries(deliveriesData);
      },
      (error) => {
        console.error('Deliveries subscription error:', error);
        if (error.code === 'permission-denied') {
          setDeliveries([]);
        }
      }
    );

    return () => {
      unsubscribeOrders();
      unsubscribeDeliveries();
    };
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      const productsData = await response.json();
      setProducts(productsData);
    } catch (err: any) {
      console.error('Error fetching products:', err);
      setProducts([]);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImage(base64String);
        setImagePreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddVariationGroup = () => {
    const newGroup: VariationGroup = {
      id: Math.random().toString(36).substring(2, 9),
      name: '',
      variations: [{ name: '', price: 0 }]
    };
    setVariationGroups([...variationGroups, newGroup]);
  };

  const handleUpdateVariationGroup = (id: string, field: 'name', value: string) => {
    setVariationGroups(variationGroups.map(g => g.id === id ? { ...g, [field]: value } : g));
  };

  const handleAddVariation = (groupId: string) => {
    setVariationGroups(variationGroups.map(g => 
      g.id === groupId ? { ...g, variations: [...g.variations, { name: '', price: 0 }] } : g
    ));
  };

  const handleUpdateVariation = (groupId: string, index: number, field: keyof Variation, value: string | number) => {
    setVariationGroups(variationGroups.map(g => 
      g.id === groupId ? {
        ...g,
        variations: g.variations.map((v, i) => i === index ? { ...v, [field]: value } : v)
      } : g
    ));
  };

  const handleRemoveVariationGroup = (id: string) => {
    setVariationGroups(variationGroups.filter(g => g.id !== id));
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const productData = {
        name,
        price: parseFloat(price),
        originalPrice: salePrice ? parseFloat(price) : undefined,
        price_actual: salePrice ? parseFloat(salePrice) : parseFloat(price),
        category: category || 'Main',
        description,
        image: image || `https://picsum.photos/seed/${name}/400/300`,
        availableFrom,
        availableUntil,
        isDineInOnly,
        variations: variationGroups,
        createdAt: new Date().toISOString()
      };
      
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });

      if (!response.ok) throw new Error('Failed to add product');
      
      setIsAdding(false);
      resetForm();
      fetchProducts();
    } catch (err) {
      console.error('Error adding product:', err);
      alert('Failed to add product');
    }
  };

  const resetForm = () => {
    setName('');
    setPrice('');
    setSalePrice('');
    setCategory('');
    setDescription('');
    setImage('');
    setImagePreview(null);
    setAvailableFrom('');
    setAvailableUntil('');
    setIsDineInOnly(false);
    setVariationGroups([]);
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`/api/products/${id}`, {
          method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete product');
        fetchProducts();
      } catch (err) {
        console.error('Error deleting product:', err);
        alert('Failed to delete product');
      }
    }
  };

  const handleAcceptOrder = async (orderId: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'preparing' })
      });

      if (!response.ok) throw new Error('Failed to accept order');

      // Also create a delivery job
      const order = orders.find(o => o.id === orderId);
      if (order) {
        await fetch('/api/deliveries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId,
            pickupLocation: '138 Phila Ndwandwe Rd',
            dropoffLocation: 'Customer Address',
            status: 'available',
            fee: 45
          })
        });
      }
    } catch (err) {
      console.error('Error accepting order:', err);
    }
  };

  const handleRejectOrder = async (orderId: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' })
      });
      if (!response.ok) throw new Error('Failed to reject order');
    } catch (err) {
      console.error('Error rejecting order:', err);
    }
  };

  const renderOverview = () => (
    <div className="space-y-4">
      {[
        { label: 'Total Revenue', value: `R${orders.reduce((acc, o) => acc + o.total, 0).toFixed(2)}`, sub: `${orders.length} lifetime orders`, icon: DollarSign, color: 'text-lime' },
        { label: 'Total Orders', value: orders.length.toString(), sub: 'All completed and pending orders', icon: ShoppingBag, color: 'text-lime' },
        { label: 'Active Orders', value: orders.filter(o => o.status === 'new' || o.status === 'pending').length.toString(), sub: 'Currently pending pickup', icon: Activity, color: 'text-lime' },
        { label: 'Customer Chats', value: '1', sub: 'Active conversations', icon: MessageSquare, color: 'text-lime' },
      ].map((stat, i) => (
        <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 flex justify-between items-start">
          <div>
            <p className="text-xs font-medium text-white/60 mb-2">{stat.label}</p>
            <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
            <p className="text-[10px] text-white/30 font-medium uppercase tracking-widest">{stat.sub}</p>
          </div>
          <stat.icon className={`w-5 h-5 ${stat.color}`} />
        </div>
      ))}
    </div>
  );

  const renderProducts = () => (
    <div className="space-y-6">
      <div className="flex flex-col gap-3">
        <h1 className="text-2xl font-bold text-white">My Products</h1>
        <p className="text-xs text-white/40 font-medium">Manage your store's menu items. Changes require admin approval.</p>
      </div>

      <div className="flex flex-col gap-3">
        <button 
          onClick={() => alert('Category request sent to admin!')}
          className="w-full bg-white/5 border border-white/10 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-white/10 transition-all"
        >
          <Tag className="w-4 h-4 rotate-90" /> Request Category
        </button>
        <button 
          onClick={() => setIsAdding(true)}
          className="w-full bg-lime text-black font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-lime/90 transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" /> Add Product
        </button>
      </div>

      <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
        {[`All (${products.length})`, `Live (${products.length})`, 'Pending (0)', 'Rejected (0)'].map((tab, i) => (
          <button key={i} className={`flex-grow py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${i === 0 ? 'bg-lime text-black' : 'text-white/40'}`}>
            {tab}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {products.map(product => (
          <div key={product.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex gap-4 group relative">
            <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border border-white/10">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col justify-center flex-grow">
              <h3 className="font-bold text-white text-lg">{product.name}</h3>
              <p className="text-white/60 font-medium">R{product.price.toFixed(2)}</p>
              <div className="mt-2">
                <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full text-[10px] font-bold border border-emerald-500/20">
                  <CheckCircle2 className="w-3 h-3" /> Approved
                </span>
              </div>
            </div>
            <button 
              onClick={() => handleDeleteProduct(product.id)}
              className="absolute top-4 right-4 text-white/20 hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        {products.length === 0 && (
          <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-2xl">
            <Package className="w-12 h-12 text-white/10 mx-auto mb-4" />
            <p className="text-white/40 font-bold uppercase tracking-widest text-[10px]">No products found</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-white">Manage Your Orders</h1>
        <p className="text-xs text-white/40 font-medium">Accept new orders and track their progress.</p>
      </div>

      <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
        {[`New (${orders.filter(o => o.status === 'new').length})`, `Pending (${orders.filter(o => o.status === 'pending').length})`, `History (${orders.filter(o => o.status === 'completed').length})`].map((tab, i) => (
          <button key={i} className={`flex-grow py-3 rounded-xl text-xs font-bold transition-all ${i === 0 ? 'bg-lime text-black' : 'text-white/40'}`}>
            {tab}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {orders.map(order => (
          <div key={order.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white/40" />
                </div>
                <div>
                  <h3 className="font-bold text-white">{order.customerName}</h3>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest">{order.id}</p>
                </div>
              </div>
              <span className="bg-lime/10 text-lime px-3 py-1 rounded-full text-[10px] font-bold border border-lime/20 uppercase">
                {order.status}
              </span>
            </div>

            <div className="space-y-2">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-white/60">{item.quantity}x {item.name}</span>
                  <span className="text-white font-medium">R{item.price.toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-white/5 flex justify-between items-center">
              <div>
                <p className="text-[10px] text-white/40 uppercase tracking-widest">Total Amount</p>
                <p className="text-lg font-bold text-white">R{order.total.toFixed(2)}</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleRejectOrder(order.id)}
                  className="bg-white/5 text-white text-xs font-bold px-4 py-2 rounded-xl border border-white/10"
                >
                  Reject
                </button>
                <button 
                  onClick={() => handleAcceptOrder(order.id)}
                  className="bg-lime text-black text-xs font-bold px-4 py-2 rounded-xl"
                >
                  Accept Order
                </button>
              </div>
            </div>
          </div>
        ))}

        {orders.length === 0 && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-12 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
              <Bell className="w-10 h-10 text-white/20" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No New Orders</h3>
            <p className="text-sm text-white/40 max-w-[200px]">New orders from customers will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderDelivery = () => (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-white">Delivery Hub</h1>
        <p className="text-xs text-white/40 font-medium">Manage your delivery jobs.</p>
      </div>

      <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
        {[`My Deliveries (${deliveries.filter(d => d.status !== 'available').length})`, `Available (${deliveries.filter(d => d.status === 'available').length})`, `History (0)`].map((tab, i) => (
          <button key={i} className={`flex-grow py-3 rounded-xl text-xs font-bold transition-all ${i === 1 ? 'bg-lime text-black' : 'text-white/40'}`}>
            {tab}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {deliveries.map(job => (
          <div key={job.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center">
                  <Package className="w-5 h-5 text-white/40" />
                </div>
                <div>
                  <h3 className="font-bold text-white">Delivery Job</h3>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest">{job.id}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-white/40 uppercase tracking-widest">Delivery Fee</p>
                <p className="text-lg font-bold text-lime">R{job.fee.toFixed(2)}</p>
              </div>
            </div>

            <div className="space-y-4 relative">
              <div className="absolute left-2 top-3 bottom-3 w-0.5 bg-white/10" />
              <div className="flex gap-4 relative">
                <div className="w-4 h-4 rounded-full bg-lime border-4 border-black flex-shrink-0 z-10" />
                <div>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest">Pickup</p>
                  <p className="text-sm text-white font-medium">{job.pickupLocation}</p>
                </div>
              </div>
              <div className="flex gap-4 relative">
                <div className="w-4 h-4 rounded-full bg-white/20 border-4 border-black flex-shrink-0 z-10" />
                <div>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest">Dropoff</p>
                  <p className="text-sm text-white font-medium">{job.dropoffLocation}</p>
                </div>
              </div>
            </div>

            <button className="w-full bg-lime text-black font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-lime/90 transition-all">
              Accept Delivery Job
            </button>
          </div>
        ))}

        {deliveries.length === 0 && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-12 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
              <Package className="w-10 h-10 text-white/20" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No Active Deliveries</h3>
            <p className="text-sm text-white/40 max-w-[200px]">Your accepted jobs will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black pt-20 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto">
        {/* Header with Location Style */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2 text-lime">
            <MapPin className="w-4 h-4" />
            <span className="text-xs font-bold truncate max-w-[200px]">{currentAddress}</span>
            <ChevronDown className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-4">
            <Bell className="w-5 h-5 text-white/40" />
            <div className="w-6 h-1 bg-white/20 rounded-full" />
            <div className="w-6 h-1 bg-white/20 rounded-full" />
          </div>
        </div>

        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'products' && renderProducts()}
        {activeTab === 'orders' && renderOrders()}
        {activeTab === 'delivery' && renderDelivery()}

        {/* Bottom Nav for Store */}
        <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-white/5 z-50 safe-bottom">
          <div className="flex justify-around items-center h-16 max-w-xl mx-auto">
            {[
              { id: 'overview', icon: LayoutGrid },
              { id: 'products', icon: Package },
              { id: 'orders', icon: ShoppingBag },
              { id: 'delivery', icon: Bike },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as StoreTab)}
                className={`flex flex-col items-center justify-center w-full transition-all ${
                  activeTab === tab.id ? 'text-lime scale-110' : 'text-white/40'
                }`}
              >
                <tab.icon className="w-6 h-6" />
              </button>
            ))}
          </div>
        </div>

        {/* Add Product Modal */}
        {isAdding && (
          <div className="fixed inset-0 z-[100] bg-black overflow-y-auto">
            <div className="min-h-screen p-6 flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <div className="w-8" />
                <h2 className="text-lg font-bold text-white">Add New Product</h2>
                <button onClick={() => setIsAdding(false)} className="text-white/40 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <p className="text-center text-xs text-white/40 mb-8 px-8">Fill in the details for your product. Click save when you're done.</p>

              <form onSubmit={handleAddProduct} className="space-y-8 flex-grow">
                {/* Image Upload Area */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-white">Product Image</label>
                  <div className="relative aspect-video bg-white/5 border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center gap-4 group cursor-pointer overflow-hidden">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <>
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center">
                          <UploadCloud className="w-8 h-8 text-white/20" />
                        </div>
                        <span className="text-xs font-bold text-white/40 uppercase tracking-widest">Click to upload image</span>
                      </>
                    )}
                    <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                  </div>
                </div>

                {/* Product Name */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-white">Product Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g., Margherita Pizza"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm font-medium text-white placeholder:text-white/20 focus:border-lime transition-colors"
                  />
                </div>

                {/* Description */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-white">Description</label>
                  <textarea 
                    placeholder="e.g., Classic cheese and tomato sauce on a thin crust."
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm font-medium text-white placeholder:text-white/20 focus:border-lime transition-colors h-32 resize-none"
                  />
                </div>

                {/* Category */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-white">Category</label>
                  <div className="relative">
                    <select 
                      value={category}
                      onChange={e => setCategory(e.target.value as FoodCategory)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm font-medium text-white appearance-none focus:border-lime transition-colors"
                    >
                      <option value="" disabled>Select a category</option>
                      <option value="Braai">Braai</option>
                      <option value="Bunny Chow">Bunny Chow</option>
                      <option value="Main">Main</option>
                      <option value="Sides">Sides</option>
                      <option value="Dessert">Dessert</option>
                      <option value="Beverages">Beverages</option>
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 pointer-events-none" />
                  </div>
                  <p className="text-[10px] text-white/40 font-medium">Don't see a category you need? You can request one from the product list page.</p>
                </div>

                {/* Prices */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-white">Default Price (R)</label>
                    <input 
                      type="number" 
                      value={price}
                      onChange={e => setPrice(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm font-medium text-white focus:border-lime transition-colors"
                    />
                    <p className="text-[10px] text-white/40 font-medium">Base price if no variations are selected.</p>
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-white">Sale Price (R)</label>
                    <input 
                      type="number" 
                      placeholder="9.99"
                      value={salePrice}
                      onChange={e => setSalePrice(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm font-medium text-white focus:border-lime transition-colors"
                    />
                    <p className="text-[10px] text-white/40 font-medium">Optional sale price.</p>
                  </div>
                </div>

                {/* Availability */}
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-white">Time-based Availability</h3>
                    <p className="text-[10px] text-white/40 font-medium">Set specific times when this product can be ordered. Leave blank if always available.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-white/60">Available From</label>
                      <div className="relative">
                        <select 
                          value={availableFrom}
                          onChange={e => setAvailableFrom(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-medium text-white appearance-none"
                        >
                          <option value="">Select time</option>
                          {Array.from({ length: 24 }).map((_, i) => (
                            <option key={i} value={`${i}:00`}>{`${i}:00`}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 pointer-events-none" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-white/60">Available Until</label>
                      <div className="relative">
                        <select 
                          value={availableUntil}
                          onChange={e => setAvailableUntil(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-medium text-white appearance-none"
                        >
                          <option value="">Select time</option>
                          {Array.from({ length: 24 }).map((_, i) => (
                            <option key={i} value={`${i}:00`}>{`${i}:00`}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Variations */}
                <div className="space-y-6">
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-white">Product Variations</h3>
                    <p className="text-[10px] text-white/40 font-medium">Add options like size or toppings. Each option will have its own price.</p>
                  </div>
                  
                  <div className="space-y-4">
                    {variationGroups.map(group => (
                      <div key={group.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-4">
                        <div className="flex justify-between items-center">
                          <input 
                            type="text"
                            placeholder="Group Name (e.g., Size)"
                            value={group.name}
                            onChange={e => handleUpdateVariationGroup(group.id, 'name', e.target.value)}
                            className="bg-transparent border-none text-sm font-bold text-white focus:ring-0 p-0 placeholder:text-white/20"
                          />
                          <button type="button" onClick={() => handleRemoveVariationGroup(group.id)} className="text-red-500/40 hover:text-red-500">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="space-y-3">
                          {group.variations.map((variation, vIndex) => (
                            <div key={vIndex} className="flex gap-3">
                              <input 
                                type="text"
                                placeholder="Option (e.g., Large)"
                                value={variation.name}
                                onChange={e => handleUpdateVariation(group.id, vIndex, 'name', e.target.value)}
                                className="flex-grow bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white"
                              />
                              <input 
                                type="number"
                                placeholder="Price"
                                value={variation.price}
                                onChange={e => handleUpdateVariation(group.id, vIndex, 'price', parseFloat(e.target.value))}
                                className="w-24 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white"
                              />
                            </div>
                          ))}
                          <button 
                            type="button" 
                            onClick={() => handleAddVariation(group.id)}
                            className="text-[10px] font-bold text-lime uppercase tracking-widest flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" /> Add Option
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button 
                    type="button" 
                    onClick={handleAddVariationGroup}
                    className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-xs font-bold text-white hover:bg-white/10 transition-all"
                  >
                    <Plus className="w-4 h-4" /> Add Variation Group
                  </button>
                </div>

                {/* Dine-in Only */}
                <div 
                  onClick={() => setIsDineInOnly(!isDineInOnly)}
                  className={`p-6 rounded-3xl border-2 transition-all cursor-pointer flex items-center justify-between gap-4 ${
                    isDineInOnly ? 'bg-lime/5 border-lime' : 'bg-white/5 border-white/10'
                  }`}
                >
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-white">Dine-in Only</h3>
                    <p className="text-[10px] text-white/40 font-medium max-w-[200px]">This item is only for customers dining in. It won't be available for delivery.</p>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    isDineInOnly ? 'border-lime bg-lime' : 'border-white/20'
                  }`}>
                    {isDineInOnly && <CheckCircle2 className="w-4 h-4 text-black" />}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-8 pb-12">
                  <button 
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="flex-grow bg-white/5 text-white font-bold py-5 rounded-2xl hover:bg-white/10 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-grow bg-lime text-black font-bold py-5 rounded-2xl hover:bg-lime/90 transition-all"
                  >
                    Save Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Export component
export default StoreDashboard;
