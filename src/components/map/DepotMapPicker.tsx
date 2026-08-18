import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Navigation } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default marker icon issue in Vite
const depotIcon = L.divIcon({
  className: 'custom-depot-icon',
  html: `<div style="background-color: #2563eb; width: 32px; height: 32px; border-radius: 50%; border: 3px solid #ffffff; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.5);">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
        </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const deliveryIcon = L.divIcon({
  className: 'custom-delivery-icon',
  html: `<div style="background-color: #10b981; width: 12px; height: 12px; border-radius: 50%; border: 2px solid #ffffff; box-shadow: 0 2px 5px rgba(0,0,0,0.4);"></div>`,
  iconSize: [12, 12],
  iconAnchor: [6, 6],
});

interface DepotMapPickerProps {
  depotLat: number;
  depotLng: number;
  depotAddress: string;
  onDepotMove: (lat: number, lng: number) => void;
  deliveries?: { lat?: number; lng?: number; delivery_id: string; address: string }[];
}

// Helper to center map view when depot changes
const MapRecenter: React.FC<{ lat: number; lng: number }> = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], map.getZoom());
  }, [lat, lng, map]);
  return null;
};

// Component to handle map clicks for re-positioning depot
const MapClickHandler: React.FC<{ onMapClick: (lat: number, lng: number) => void }> = ({ onMapClick }) => {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

export const DepotMapPicker: React.FC<DepotMapPickerProps> = ({
  depotLat,
  depotLng,
  depotAddress,
  onDepotMove,
  deliveries = [],
}) => {
  return (
    <div className="relative w-full h-[480px] rounded-xl overflow-hidden border border-slate-800 shadow-md">
      <MapContainer
        center={[depotLat, depotLng]}
        zoom={13}
        scrollWheelZoom={true}
        className="w-full h-full z-10"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapRecenter lat={depotLat} lng={depotLng} />
        <MapClickHandler onMapClick={(lat, lng) => onDepotMove(Number(lat.toFixed(6)), Number(lng.toFixed(6)))} />

        {/* Draggable Depot Marker */}
        <Marker
          position={[depotLat, depotLng]}
          icon={depotIcon}
          draggable={true}
          eventHandlers={{
            dragend(e) {
              const marker = e.target;
              const position = marker.getLatLng();
              onDepotMove(Number(position.lat.toFixed(6)), Number(position.lng.toFixed(6)));
            },
          }}
        >
          <Popup>
            <div className="text-xs p-1 space-y-1">
              <strong className="text-blue-600 flex items-center gap-1">
                <Navigation className="w-3 h-3" /> Central Depot Warehouse
              </strong>
              <p className="text-slate-700">{depotAddress}</p>
              <p className="font-mono text-[10px] text-slate-500">
                Lat: {depotLat}, Lng: {depotLng}
              </p>
              <p className="text-[10px] text-blue-500 italic">Drag pin or click map to move</p>
            </div>
          </Popup>
        </Marker>

        {/* Optional delivery location markers */}
        {deliveries.map(
          (d, idx) =>
            d.lat &&
            d.lng && (
              <Marker key={idx} position={[d.lat, d.lng]} icon={deliveryIcon}>
                <Popup>
                  <div className="text-xs font-sans">
                    <strong className="text-slate-900">{d.delivery_id}</strong>
                    <p className="text-slate-600 text-[11px]">{d.address}</p>
                  </div>
                </Popup>
              </Marker>
            )
        )}
      </MapContainer>

      {/* Map Control Badge Overlay */}
      <div className="absolute top-3 right-3 z-[400] bg-slate-900/90 backdrop-blur border border-slate-800 px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-2 text-xs text-slate-300">
        <MapPin className="w-4 h-4 text-blue-400 animate-pulse" />
        <span>Click map or drag pin to position Depot</span>
      </div>
    </div>
  );
};
