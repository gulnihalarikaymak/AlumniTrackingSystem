import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet@4.2.1';
import { Alumni } from '../types/alumni';
import L from 'leaflet@1.9.4';
import { MapPin, ZoomIn, ZoomOut, Calendar } from 'lucide-react';
import { motion } from 'motion/react';

const LEAFLET_CSS_URL = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';

const createCustomIcon = (avatarUrl: string, name: string, isSelected: boolean) => {
  // Colors based on selection state
  const borderColor = isSelected ? 'border-blue-500' : 'border-slate-900';
  const arrowColor = isSelected ? 'border-t-blue-500' : 'border-t-slate-900';
  const rippleColor = isSelected ? 'border-blue-500' : 'border-gray-400';
  
  return L.divIcon({
    className: 'custom-icon',
    html: `
      <div class="relative group flex flex-col items-center justify-center w-full h-full overflow-visible">
        
        <!-- Hover Name Tooltip -->
        <div class="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
          <div class="bg-slate-900 text-white text-sm font-bold px-3 py-1.5 rounded shadow-lg border border-slate-700">
            ${name}
          </div>
          <div class="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-slate-900 mx-auto"></div>
        </div>

        <!-- Marker Container -->
        <div class="relative w-12 h-12 flex items-center justify-center">
          
          <!-- Water Ripple Effect (Wave 1) -->
          <div class="absolute inset-0 rounded-full border-[2px] ${rippleColor} opacity-0"
               style="animation: ripple 3s infinite cubic-bezier(0, 0, 0.2, 1);"></div>
               
          <!-- Water Ripple Effect (Wave 2 - Delayed) -->
          <div class="absolute inset-0 rounded-full border-[2px] ${rippleColor} opacity-0"
               style="animation: ripple 3s infinite cubic-bezier(0, 0, 0.2, 1); animation-delay: 1s;"></div>

          <!-- Water Ripple Effect (Wave 3 - Delayed) -->
          <div class="absolute inset-0 rounded-full border-[2px] ${rippleColor} opacity-0"
               style="animation: ripple 3s infinite cubic-bezier(0, 0, 0.2, 1); animation-delay: 2s;"></div>
          
          <!-- Arrow Pointer -->
          <div class="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[10px] ${arrowColor} z-20"></div>
          
          <!-- Profile Image Container -->
          <div class="relative z-10 w-12 h-12 rounded-full border-[3px] ${borderColor} ${isSelected ? 'scale-110' : ''} overflow-hidden bg-slate-900 shadow-2xl transition-transform duration-300 box-border p-0.5 flex items-center justify-center">
            <img src="${avatarUrl}" class="w-full h-full object-cover block rounded-full" alt="${name}" />
          </div>
        </div>
      </div>
    `,
    iconSize: [64, 64],
    iconAnchor: [32, 54],
    popupAnchor: [0, -60],
  });
};

interface AlumniMapProps {
  alumni: Alumni[];
  selectedAlumni: Alumni | null;
  onSelect: (alumni: Alumni) => void;
}

function getConnectionDuration(dateString?: string) {
  if (!dateString) return null;
  const start = new Date(dateString);
  const now = new Date();
  
  let years = now.getFullYear() - start.getFullYear();
  let months = now.getMonth() - start.getMonth();
  let days = now.getDate() - start.getDate();

  // Gün negatifse, bir önceki aydan gün al
  if (days < 0) {
    months--;
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += prevMonth.getDate();
  }

  // Ay negatifse, bir önceki yıldan ay al
  if (months < 0) {
    years--;
    months += 12;
  }
  
  const parts = [];
  if (years > 0) parts.push(`${years} yıl`);
  if (months > 0) parts.push(`${months} ay`);
  if (years === 0 && days > 0) parts.push(`${days} gün`);
  
  if (parts.length === 0) return "Bugün katıldı";
  
  return `${parts.join(' ')} süredir bağlantıda`;
}

function MapController({ selectedAlumni }: { selectedAlumni: Alumni | null }) {
  const map = useMap();

  useEffect(() => {
    if (selectedAlumni) {
      map.flyTo([selectedAlumni.lat, selectedAlumni.lng], 10, {
        duration: 2,
        easeLinearity: 0.25
      });
    }
  }, [selectedAlumni, map]);

  return null;
}

// Custom Zoom Control Component
function CustomZoomControl() {
  const map = useMap();

  const handleZoomIn = () => {
    map.zoomIn();
  };

  const handleZoomOut = () => {
    map.zoomOut();
  };

  return (
    <div className="absolute bottom-8 right-8 z-[1000] flex flex-col gap-2">
      <motion.button
        whileTap={{ scale: 0.85 }}
        onClick={handleZoomIn}
        className="p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-white/20 shadow-lg transition-colors"
        aria-label="Zoom In"
      >
        <ZoomIn size={24} />
      </motion.button>
      
      <motion.button
        whileTap={{ scale: 0.85 }}
        onClick={handleZoomOut}
        className="p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-white/20 shadow-lg transition-colors"
        aria-label="Zoom Out"
      >
        <ZoomOut size={24} />
      </motion.button>
    </div>
  );
}

export function AlumniMap({ alumni, selectedAlumni, onSelect }: AlumniMapProps) {
  useEffect(() => {
    const existingLink = document.querySelector(`link[href="${LEAFLET_CSS_URL}"]`);
    if (!existingLink) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = LEAFLET_CSS_URL;
      link.crossOrigin = '';
      document.head.appendChild(link);
    }
  }, []);

  const worldBounds = L.latLngBounds(
    L.latLng(-85, -180),
    L.latLng(85, 180)
  );

  return (
    <div className="h-full w-full relative z-0 bg-[#0B1026]">
      {/* Global Styles for Keyframes */}
      <style>
        {`
          @keyframes ripple {
            0% {
              transform: scale(1);
              opacity: 0.8;
            }
            100% {
              transform: scale(2);
              opacity: 0;
            }
          }
        `}
      </style>

      <MapContainer
        center={[20, 0]}
        zoom={3}
        minZoom={2}
        maxBounds={worldBounds}
        maxBoundsViscosity={1.0}
        scrollWheelZoom={true}
        zoomControl={false}
        className="h-full w-full"
        style={{ background: '#0B1026' }}
      >
        <TileLayer
          attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          noWrap={true}
        />
        
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png"
          noWrap={true}
        />
        
        <MapController selectedAlumni={selectedAlumni} />
        <CustomZoomControl />

        {alumni.map((person) => (
          <Marker
            key={person.id}
            position={[person.lat, person.lng]}
            icon={createCustomIcon(person.avatar, person.name, selectedAlumni?.id === person.id)}
            eventHandlers={{
              click: () => onSelect(person),
            }}
          >
            <Popup className="custom-popup">
              <div className="p-2 min-w-[200px] text-center">
                <div className="w-16 h-16 mx-auto rounded-full overflow-hidden mb-3 border-2 border-slate-100 shadow-sm">
                  <img src={person.avatar} alt={person.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="font-bold text-2xl text-slate-900 mb-1">{person.name}</h3>
                <p className="text-blue-600 font-medium text-sm mb-1">{person.role}</p>
                <p className="text-slate-500 text-xs mb-2">@{person.company}</p>
                
                <div className="flex flex-col gap-2 items-center">
                  <div className="inline-flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-full text-xs text-slate-600">
                    <MapPin size={12} />
                    {person.city}, {person.country}
                  </div>
                  
                  {person.connectionDate && (
                    <div className="inline-flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-full text-xs text-blue-600 border border-blue-100">
                      <Calendar size={12} />
                      {getConnectionDuration(person.connectionDate)}
                    </div>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}