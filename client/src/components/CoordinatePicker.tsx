import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { MapPin, Navigation } from 'lucide-react';
import { Area } from '../types';

interface CoordinatePickerProps {
  latitude: number;
  longitude: number;
  onChange: (lat: number, lng: number) => void;
  areas: Area[];
}

export const CoordinatePicker: React.FC<CoordinatePickerProps> = ({
  latitude,
  longitude,
  onChange,
  areas,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const initialLat = latitude || 22.7196;
    const initialLng = longitude || 75.8577;

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 15,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap',
    }).addTo(map);

    const pinIcon = L.divIcon({
      html: `
        <div style="transform: translate(-50%, -100%);">
          <svg viewBox="0 0 36 36" width="36" height="36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 34C18 34 30 22.5 30 14C30 7.37258 24.6274 2 18 2C11.3726 2 6 7.37258 6 14C6 22.5 18 34 18 34Z" fill="#9d3e1c" stroke="#ffffff" stroke-width="2.5" />
            <circle cx="18" cy="14" r="5" fill="#ffffff" />
          </svg>
        </div>
      `,
      className: '',
      iconSize: [36, 36],
      iconAnchor: [18, 36],
    });

    const marker = L.marker([initialLat, initialLng], {
      icon: pinIcon,
      draggable: true,
    }).addTo(map);

    marker.on('dragend', () => {
      const pos = marker.getLatLng();
      onChange(parseFloat(pos.lat.toFixed(6)), parseFloat(pos.lng.toFixed(6)));
    });

    map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      marker.setLatLng([lat, lng]);
      onChange(parseFloat(lat.toFixed(6)), parseFloat(lng.toFixed(6)));
    });

    mapRef.current = map;
    markerRef.current = marker;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update marker position when props change
  useEffect(() => {
    if (markerRef.current && latitude && longitude) {
      const currentPos = markerRef.current.getLatLng();
      if (
        Math.abs(currentPos.lat - latitude) > 0.000001 ||
        Math.abs(currentPos.lng - longitude) > 0.000001
      ) {
        markerRef.current.setLatLng([latitude, longitude]);
        mapRef.current?.flyTo([latitude, longitude], mapRef.current.getZoom());
      }
    }
  }, [latitude, longitude]);

  const jumpToArea = (area: Area) => {
    if (mapRef.current && markerRef.current) {
      markerRef.current.setLatLng([area.latitude, area.longitude]);
      mapRef.current.flyTo([area.latitude, area.longitude], 16);
      onChange(area.latitude, area.longitude);
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex items-center justify-between text-xs font-semibold text-on-surface">
        <span className="flex items-center gap-1.5 text-primary">
          <MapPin className="w-3.5 h-3.5" />
          <span>Interactive Pin Coordinate Picker</span>
        </span>
        <span className="text-[11px] text-on-surface-variant font-mono">
          {latitude.toFixed(6)}, {longitude.toFixed(6)}
        </span>
      </div>

      {/* Locality Quick Jump Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        <span className="text-[10px] uppercase font-bold text-on-surface-variant mr-1">
          Jump to:
        </span>
        {areas.slice(0, 6).map((area) => (
          <button
            type="button"
            key={area.id}
            onClick={() => jumpToArea(area)}
            className="px-2.5 py-1 bg-surface-container hover:bg-surface-container-high rounded-lg text-[11px] font-semibold text-on-surface transition-colors whitespace-nowrap border border-surface-container-high cursor-pointer"
          >
            {area.name}
          </button>
        ))}
      </div>

      {/* Map Canvas */}
      <div className="relative w-full h-56 rounded-xl overflow-hidden border border-surface-container-high shadow-inner">
        <div ref={mapContainerRef} id="admin-coord-picker" data-testid="admin-coord-picker" className="w-full h-full" />
        <div className="absolute bottom-2 left-2 z-20 bg-surface-container-lowest/90 backdrop-blur-xs px-2.5 py-1 rounded-md text-[10px] font-semibold text-on-surface shadow-xs">
          Click map or drag pin to position stall
        </div>
      </div>

      {/* Bidirectional Coordinate Input Fields */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        <div>
          <label className="block text-[11px] font-bold text-on-surface mb-1">
            Latitude (°N) *
          </label>
          <input
            id="input-latitude"
            data-testid="input-latitude"
            type="number"
            step="0.000001"
            value={typeof latitude === 'number' && !isNaN(latitude) ? latitude.toFixed(6) : ''}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              if (!isNaN(val)) {
                onChange(val, longitude);
              }
            }}
            className="w-full px-3 py-1.5 rounded-lg border border-surface-container-high bg-surface-container text-xs font-mono text-on-surface outline-none focus:border-primary"
            placeholder="22.719600"
          />
        </div>
        <div>
          <label className="block text-[11px] font-bold text-on-surface mb-1">
            Longitude (°E) *
          </label>
          <input
            id="input-longitude"
            data-testid="input-longitude"
            type="number"
            step="0.000001"
            value={typeof longitude === 'number' && !isNaN(longitude) ? longitude.toFixed(6) : ''}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              if (!isNaN(val)) {
                onChange(latitude, val);
              }
            }}
            className="w-full px-3 py-1.5 rounded-lg border border-surface-container-high bg-surface-container text-xs font-mono text-on-surface outline-none focus:border-primary"
            placeholder="75.857700"
          />
        </div>
      </div>
    </div>
  );
};
