
import React, { createContext, useContext, useState, useEffect } from 'react';

interface LocationContextType {
  location: { lat: number; lng: number } | null;
  address: string;
  loading: boolean;
  error: string | null;
  refreshLocation: () => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [address, setAddress] = useState('Detecting location...');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      // Using a free reverse geocoding service or Google Maps if available
      // For now, let's use a simple fetch to a free API or just format the coordinates
      // In a real app, you'd use Google Maps Geocoding API
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`, {
        headers: {
          'Accept-Language': 'en'
        }
      });
      const data = await response.json();
      if (data.display_name) {
        // Extract a shorter version of the address
        const parts = data.display_name.split(',');
        const shortAddress = parts.slice(0, 2).join(', ');
        setAddress(shortAddress);
      } else {
        setAddress(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
      }
    } catch (err) {
      console.error('Reverse geocoding failed:', err);
      setAddress(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    }
  };

  const refreshLocation = () => {
    setLoading(true);
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      setAddress('Location unavailable');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLoc = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setLocation(newLoc);
        reverseGeocode(newLoc.lat, newLoc.lng);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
        setAddress('Isipingo, ZA'); // Fallback
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  useEffect(() => {
    refreshLocation();
  }, []);

  return (
    <LocationContext.Provider value={{ location, address, loading, error, refreshLocation }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
