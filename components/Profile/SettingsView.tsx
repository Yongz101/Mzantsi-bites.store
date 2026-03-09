
import React from 'react';
import { Settings, Bell, Shield, Moon, Sun, Globe, LogOut, ChevronRight, Check, Palette, Type } from 'lucide-react';
import { useAuth } from '../../services/AuthContext';
import { useTheme } from '../../services/ThemeContext';

const ACCENT_COLORS = [
  '#ef4444', '#f97316', '#facc15', '#d9ff00', '#22c55e', '#10b981',
  '#06b6d4', '#3b82f6', '#2563eb', '#6366f1', '#8b5cf6', '#a855f7',
  '#d946ef', '#ec4899', '#f43f5e', '#fb7185', '#fb923c', '#4ade80',
  '#3b82f6', '#f43f5e', '#facc15', '#10b981', '#6366f1', '#f97316',
  '#65a30d', '#dc2626', '#1d4ed8', '#f97316', '#06b6d4', '#9333ea'
];

const SettingsView: React.FC = () => {
  const { logout } = useAuth();
  const { theme, setTheme, accentColor, setAccentColor, buttonTextColor, setButtonTextColor } = useTheme();

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-lime text-black flex items-center justify-center rounded-2xl shadow-lg shadow-lime/20">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-3xl font-serif font-bold uppercase tracking-tighter text-white">Appearance</h2>
            <p className="text-white/40 font-bold uppercase tracking-widest text-[10px]">Manage your app appearance.</p>
          </div>
        </div>

        {/* Appearance Section */}
        <div className="space-y-4">
          {/* Theme Toggle */}
          <div className="bg-white/5 p-6 rounded-[32px] border border-white/10">
            <div className="flex justify-between items-center mb-2">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-tight">Theme</h3>
                <p className="text-[10px] text-white/40 font-medium">Toggle between light and dark themes.</p>
              </div>
              <div className="flex items-center gap-2 bg-black p-1.5 rounded-full border border-white/10">
                <button 
                  onClick={() => setTheme('light')}
                  className={`p-2 rounded-full transition-all ${theme === 'light' ? 'bg-lime text-black' : 'text-white/20'}`}
                >
                  <Sun className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setTheme('dark')}
                  className={`p-2 rounded-full transition-all ${theme === 'dark' ? 'bg-lime text-black' : 'text-white/20'}`}
                >
                  <Moon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Button Text Color Toggle */}
          <div className="bg-white/5 p-6 rounded-[32px] border border-white/10">
            <div className="flex justify-between items-center mb-2">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-tight">Button Text Color</h3>
                <p className="text-[10px] text-white/40 font-medium">Toggle between light and dark button text.</p>
              </div>
              <div className="flex items-center gap-2 bg-black p-1.5 rounded-full border border-white/10">
                <button 
                  onClick={() => setButtonTextColor('light')}
                  className={`p-2 rounded-full transition-all ${buttonTextColor === 'light' ? 'bg-lime text-black' : 'text-white/20'}`}
                >
                  <Palette className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setButtonTextColor('dark')}
                  className={`p-2 rounded-full transition-all ${buttonTextColor === 'dark' ? 'bg-lime text-black' : 'text-white/20'}`}
                >
                  <div className="w-4 h-4 rounded-full bg-black border border-white/20" />
                </button>
              </div>
            </div>
          </div>

          {/* Accent Color Grid */}
          <div className="bg-white/5 p-6 rounded-[32px] border border-white/10">
            <div className="mb-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-tight">Accent Color</h3>
              <p className="text-[10px] text-white/40 font-medium">Choose a primary color for the application.</p>
            </div>
            <div className="grid grid-cols-6 gap-4">
              {ACCENT_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => setAccentColor(color)}
                  className="relative aspect-square rounded-full flex items-center justify-center transition-transform active:scale-90 hover:scale-110"
                  style={{ backgroundColor: color }}
                >
                  {accentColor === color && (
                    <Check className={`w-4 h-4 ${color === '#ffffff' ? 'text-black' : 'text-black'}`} />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Other Settings */}
        <div className="space-y-4 pt-4">
          <button className="w-full flex items-center justify-between p-5 bg-white/5 border border-white/10 hover:bg-white/10 transition-all rounded-[24px] group">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-black rounded-xl border border-white/10">
                <Bell className="w-5 h-5 text-white/40" />
              </div>
              <div className="text-left">
                <p className="font-bold text-white uppercase tracking-widest text-[10px]">Push Notifications</p>
                <p className="text-[9px] text-white/20 font-bold uppercase tracking-widest">Enabled</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-white transition-colors" />
          </button>

          <button className="w-full flex items-center justify-between p-5 bg-white/5 border border-white/10 hover:bg-white/10 transition-all rounded-[24px] group">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-black rounded-xl border border-white/10">
                <Shield className="w-5 h-5 text-white/40" />
              </div>
              <div className="text-left">
                <p className="font-bold text-white uppercase tracking-widest text-[10px]">Security & Privacy</p>
                <p className="text-[9px] text-white/20 font-bold uppercase tracking-widest">Manage your account</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-white transition-colors" />
          </button>
        </div>

        {/* Logout */}
        <div className="pt-8">
          <button 
            onClick={logout}
            className="w-full bg-red-500/10 text-red-500 font-bold py-5 rounded-[24px] border border-red-500/20 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
          >
            <LogOut className="w-5 h-5" /> Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
