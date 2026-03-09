
import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { Navigation, Loader2, List } from 'lucide-react';
import { useLocation } from '../../services/LocationContext';

const containerStyle = {
  width: '100%',
  height: '100%'
};

const MapView: React.FC = () => {
  const { location: userLocation, loading: locationLoading } = useLocation();
  const [center, setCenter] = useState({ lat: -29.9744, lng: 30.9448 });
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ""
  });

  useEffect(() => {
    if (userLocation) {
      setCenter(userLocation);
    }
  }, [userLocation]);

  const onLoad = useCallback(function callback(map: google.maps.Map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map: google.maps.Map) {
    setMap(null);
  }, []);

  const handleRecenter = () => {
    if (userLocation && map) {
      map.panTo(userLocation);
      map.setZoom(15);
    } else if (map) {
      map.panTo(center);
      map.setZoom(15);
    }
  };

  if (!isLoaded) {
    return (
      <div className="w-full h-[calc(100vh-120px)] flex flex-col items-center justify-center bg-black">
        <Loader2 className="w-8 h-8 text-lime animate-spin mb-4" />
        <p className="text-white/40 font-bold uppercase tracking-widest text-xs">Loading Map...</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={13}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          disableDefaultUI: true,
          zoomControl: false,
          clickableIcons: true,
        }}
      >
        {userLocation && (
          <Marker 
            position={userLocation}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: "#A3E635",
              fillOpacity: 1,
              strokeWeight: 3,
              strokeColor: "#FFFFFF",
            }}
          />
        )}
        
        {/* Example Store Marker near Isipingo */}
        <Marker 
          position={{ lat: -29.9850, lng: 30.9400 }}
          title="Mzantsi Bites Isipingo"
        />
      </GoogleMap>

      {/* Floating Controls from Screenshot */}
      <div className="absolute bottom-6 left-0 right-0 flex flex-col items-center gap-4 px-6 pointer-events-none">
        <div className="w-full flex justify-center pointer-events-auto">
          <button className="bg-[#D9FF00] text-black px-8 py-3.5 rounded-full font-bold flex items-center gap-3 shadow-2xl shadow-lime/30 active:scale-95 transition-transform">
            <List className="w-5 h-5" />
            <span>List View</span>
          </button>
        </div>
        
        <div className="w-full flex justify-end pointer-events-auto">
          <button 
            onClick={handleRecenter}
            className="bg-white text-black p-4 rounded-2xl shadow-xl hover:bg-gray-100 transition-colors active:scale-95"
          >
            <Navigation className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapView;
