import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import { OptimizationResult } from '../../types';
import { Building2, Clock } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

interface RouteMapViewerProps {
  result: OptimizationResult;
  selectedVehicleId?: string | null;
  onSelectVehicle?: (vehicleId: string | null) => void;
}

// Custom Depot Icon
const depotIcon = L.divIcon({
  className: 'custom-depot-marker',
  html: `<div style="background-color: #2563eb; width: 34px; height: 34px; border-radius: 50%; border: 3px solid #ffffff; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.5);">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
        </div>`,
  iconSize: [34, 34],
  iconAnchor: [17, 34],
  popupAnchor: [0, -34],
});

// Helper function to create sequence marker icons colored by vehicle
const createSequenceIcon = (sequenceNum: number, color: string, isHighlighted: boolean) => {
  const size = isHighlighted ? 30 : 24;
  return L.divIcon({
    className: 'custom-sequence-marker',
    html: `<div style="background-color: ${color}; width: ${size}px; height: ${size}px; border-radius: 50%; border: 2px solid #ffffff; display: flex; align-items: center; justify-content: center; color: #ffffff; font-weight: bold; font-size: ${isHighlighted ? '12px' : '10px'}; font-family: monospace; box-shadow: 0 2px 8px rgba(0,0,0,0.4); transform: ${isHighlighted ? 'scale(1.15)' : 'scale(1)'}; transition: transform 0.2s;">
            ${sequenceNum}
          </div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
};

// Map recenter component
const MapFitBounds: React.FC<{ coords: [number, number][] }> = ({ coords }) => {
  const map = useMap();
  useEffect(() => {
    if (coords.length > 0) {
      const bounds = L.latLngBounds(coords);
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [coords, map]);
  return null;
};

export const RouteMapViewer: React.FC<RouteMapViewerProps> = ({
  result,
  selectedVehicleId = null,
  onSelectVehicle,
}) => {
  const depot = result.depot;

  // Filter routes based on vehicle selection
  const visibleRoutes = selectedVehicleId
    ? result.routes.filter((r) => r.vehicle_id === selectedVehicleId)
    : result.routes;

  // Collect all coordinates for auto bounds fitting
  const allCoordinates: [number, number][] = [
    [depot.lat, depot.lng],
    ...result.routes.flatMap((r) => r.stops.map((s) => [s.lat, s.lng] as [number, number])),
  ];

  return (
    <div className="relative w-full h-[520px] rounded-xl overflow-hidden border border-slate-800 shadow-xl bg-slate-950">
      <MapContainer
        center={[depot.lat, depot.lng]}
        zoom={12}
        scrollWheelZoom={true}
        className="w-full h-full z-10"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapFitBounds coords={allCoordinates} />

        {/* Central Warehouse Depot Marker */}
        <Marker position={[depot.lat, depot.lng]} icon={depotIcon}>
          <Popup>
            <div className="text-xs p-1 space-y-1">
              <strong className="text-blue-600 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5" /> Central Warehouse Origin
              </strong>
              <p className="text-slate-700">{depot.address}</p>
              <p className="font-mono text-[10px] text-slate-500">
                Lat: {depot.lat}, Lng: {depot.lng}
              </p>
            </div>
          </Popup>
        </Marker>

        {/* Vehicle Routes Polylines & Stop Markers */}
        {visibleRoutes.map((route) => {
          const isSelected = selectedVehicleId === route.vehicle_id;
          
          // Build path line coordinates starting from depot -> stops -> depot
          const pathPoints: [number, number][] = [
            [depot.lat, depot.lng],
            ...route.stops.map((s) => [s.lat, s.lng] as [number, number]),
            [depot.lat, depot.lng],
          ];

          return (
            <React.Fragment key={route.vehicle_id}>
              {/* Route Polyline */}
              <Polyline
                positions={pathPoints}
                pathOptions={{
                  color: route.color,
                  weight: isSelected ? 5 : 3.5,
                  opacity: selectedVehicleId && !isSelected ? 0.25 : 0.85,
                  dashArray: isSelected ? undefined : '6, 6',
                }}
                eventHandlers={{
                  click: () => onSelectVehicle && onSelectVehicle(route.vehicle_id),
                }}
              >
                <Tooltip sticky>
                  <div className="text-xs font-sans">
                    <strong style={{ color: route.color }}>{route.vehicle_id}</strong> ({route.vehicle_type})
                    <br />
                    <span>Distance: {route.total_distance_km} km | Stops: {route.stops.length}</span>
                  </div>
                </Tooltip>
              </Polyline>

              {/* Delivery Sequence Markers */}
              {route.stops.map((stop) => (
                <Marker
                  key={stop.delivery_id}
                  position={[stop.lat, stop.lng]}
                  icon={createSequenceIcon(stop.stop_number, route.color, isSelected)}
                  eventHandlers={{
                    click: () => onSelectVehicle && onSelectVehicle(route.vehicle_id),
                  }}
                >
                  <Popup>
                    <div className="text-xs p-1 space-y-1.5 font-sans">
                      <div className="flex items-center justify-between gap-2 border-b pb-1">
                        <strong className="text-slate-900 font-mono">{stop.delivery_id}</strong>
                        <span
                          className="px-1.5 py-0.5 rounded text-[10px] text-white font-bold"
                          style={{ backgroundColor: route.color }}
                        >
                          Stop #{stop.stop_number} ({route.vehicle_id})
                        </span>
                      </div>
                      <p className="text-slate-600 text-[11px]">{stop.address}</p>
                      <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5">
                        <span>Demand: <strong>{stop.demand} units</strong></span>
                        <span className="text-emerald-600 font-mono font-bold flex items-center gap-0.5">
                          <Clock className="w-3 h-3" /> {stop.estimated_arrival}
                        </span>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </React.Fragment>
          );
        })}
      </MapContainer>

      {/* Map Floating Legend */}
      <div className="absolute top-3 right-3 z-[400] bg-slate-900/90 backdrop-blur border border-slate-800 p-3 rounded-xl shadow-xl space-y-2 text-xs max-w-xs">
        <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
          <span className="font-bold text-white text-[11px] uppercase tracking-wider">
            Vehicle Routes ({visibleRoutes.length})
          </span>
          {selectedVehicleId && (
            <button
              onClick={() => onSelectVehicle && onSelectVehicle(null)}
              className="text-[10px] text-blue-400 hover:underline font-semibold"
            >
              Show All
            </button>
          )}
        </div>

        <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
          {result.routes.map((r) => {
            const isSelected = selectedVehicleId === r.vehicle_id;
            return (
              <button
                key={r.vehicle_id}
                onClick={() => onSelectVehicle && onSelectVehicle(isSelected ? null : r.vehicle_id)}
                className={`w-full text-left flex items-center justify-between px-2 py-1 rounded transition-colors ${
                  isSelected ? 'bg-slate-800 border border-slate-700 text-white font-bold' : 'hover:bg-slate-800/50 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: r.color }}></span>
                  <span className="font-mono text-xs">{r.vehicle_id}</span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">{r.stops.length} stops</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
