
import React, { useState } from 'react';
import { useAuth } from '../../services/AuthContext';
import { UserRole } from '../../types';
import { X, User, Store, Bike, Shield, Eye, EyeOff, MapPin, Search } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [role, setRole] = useState<UserRole>('customer');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, register, loginWithGoogle } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password, name, role);
      }
      onClose();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    try {
      await loginWithGoogle();
      onClose();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const roles: { id: UserRole; label: string; icon: any }[] = [
    { id: 'customer', label: 'Customer', icon: User },
    { id: 'store', label: 'Store', icon: Store },
    { id: 'driver', label: 'Driver', icon: Bike },
    { id: 'admin', label: 'Admin', icon: Shield },
  ];

  return (
    <div className="fixed inset-0 z-[100] bg-black overflow-y-auto animate-in fade-in duration-500">
      <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-[440px] relative">
          <button 
            onClick={onClose} 
            className="absolute -top-12 right-0 sm:-right-12 p-2 text-stone-500 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white mb-2">
            {isLogin ? 'Welcome Back!' : 'Create an Account'}
          </h2>
          <p className="text-stone-500 text-sm">
            {isLogin ? 'Log in to continue to Mzantsi Bites.' : 'Join Mzantsi Bites to get started.'}
          </p>
        </div>

        {/* Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-white/5 p-1.5 rounded-full flex gap-1 border border-white/10">
            <button
              onClick={() => setIsLogin(true)}
              className={`px-8 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                isLogin ? 'bg-lime text-black' : 'text-white/40 hover:text-white'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`px-8 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                !isLogin ? 'bg-lime text-black' : 'text-white/40 hover:text-white'
              }`}
            >
              Sign up
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 text-red-400 p-4 rounded-2xl mb-8 text-[10px] font-bold uppercase tracking-widest border border-red-500/20 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Role Selection */}
          <div className="space-y-4">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 ml-4">I am a...</label>
            <div className="grid grid-cols-2 gap-4">
              {roles.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRole(r.id)}
                  className={`flex flex-col items-center justify-center p-6 rounded-3xl border transition-all gap-3 group ${
                    role === r.id 
                    ? 'border-lime bg-lime/5 text-white' 
                    : 'border-white/5 bg-white/5 text-white/40 hover:border-white/20'
                  }`}
                >
                  <r.icon className={`w-6 h-6 ${role === r.id ? 'text-lime' : 'group-hover:text-white'}`} />
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${role === r.id ? 'text-white' : ''}`}>{r.label}</span>
                </button>
              ))}
            </div>
          </div>

          {!isLogin && (
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-3 ml-4">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-full px-8 py-5 focus:border-lime outline-none transition-all text-white placeholder:text-white/20 font-bold uppercase tracking-widest text-xs"
                placeholder="JOHN DOE"
              />
            </div>
          )}

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-3 ml-4">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full px-8 py-5 focus:border-lime outline-none transition-all text-white placeholder:text-white/20 font-bold uppercase tracking-widest text-xs"
              placeholder="M@EXAMPLE.COM"
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-3 ml-4">Phone Number</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-full px-8 py-5 focus:border-lime outline-none transition-all text-white placeholder:text-white/20 font-bold uppercase tracking-widest text-xs"
                placeholder="082 123 4567"
              />
            </div>
          )}

          <div>
            <div className="flex justify-between items-center mb-3 ml-4">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Password</label>
              {isLogin && (
                <button type="button" className="text-[10px] font-bold uppercase tracking-widest text-lime hover:underline">
                  Forgot?
                </button>
              )}
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-full px-8 py-5 focus:border-lime outline-none transition-all text-white placeholder:text-white/20 font-bold uppercase tracking-widest text-xs pr-16"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-3 ml-4">Your Address</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-full px-8 py-5 focus:border-lime outline-none transition-all text-white placeholder:text-white/20 font-bold uppercase tracking-widest text-xs pr-16"
                  placeholder="SEARCH FOR AN ADDRESS..."
                />
                <button type="button" className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors">
                  <MapPin className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          <div className="space-y-4 pt-4">
            <button
              type="submit"
              className="w-full bg-lime text-black font-bold py-5 rounded-full hover:bg-lime/90 active:scale-95 transition-all text-sm uppercase tracking-widest"
            >
              {isLogin ? 'Log In' : 'Create Account'}
            </button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/5"></div>
              </div>
              <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-widest">
                <span className="bg-black px-4 text-white/20">Or continue with</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full bg-white/5 border border-white/10 text-white font-bold py-5 rounded-full hover:bg-white/10 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
);
};

export default AuthModal;
