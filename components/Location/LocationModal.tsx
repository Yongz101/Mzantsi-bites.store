
import React, { useState, useEffect } from 'react';
import { X, Navigation, Target } from 'lucide-react';
import { useLocation } from '../../services/LocationContext';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LocationModal: React.FC<LocationModalProps> = ({ isOpen, onClose }) => {
  const { address: currentAddress, refreshLocation, loading: isLocating } = useLocation();
  const [address, setAddress] = useState(currentAddress);

  useEffect(() => {
    setAddress(currentAddress);
  }, [currentAddress]);

  if (!isOpen) return null;

  const handleUseCurrentLocation = () => {
    refreshLocation();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (address.trim()) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-[320px] bg-[#1A1A1A] rounded-[40px] p-8 shadow-2xl border border-white/5 animate-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-1 text-white/40 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-8">
          <h2 className="text-xl font-bold text-white mb-2 tracking-tight">Set Your Location</h2>
          <p className="text-white/40 text-[11px] leading-relaxed px-2">
            Enter your address to find stores near you, or use your current location.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <div className="flex items-center bg-black rounded-xl p-0.5 border border-white/5">
              <input 
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your address"
                className="flex-grow bg-transparent text-white px-4 py-3 outline-none text-sm font-medium placeholder:text-white/20"
              />
              <div className="p-3 text-white/40">
                <Target className="w-5 h-5" />
              </div>
            </div>
          </div>

          <button 
            type="button"
            onClick={handleUseCurrentLocation}
            disabled={isLocating}
            className="w-full bg-[#D9FF00] text-black font-black py-4 rounded-[24px] flex items-center justify-center gap-3 hover:brightness-110 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {isLocating ? (
              <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
            ) : (
              <Navigation className="w-5 h-5 -rotate-45" />
            )}
            <span className="uppercase tracking-widest text-[10px]">Use My Current Location</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default LocationModal;
