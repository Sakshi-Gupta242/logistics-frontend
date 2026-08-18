import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Truck,
  Plus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Building2,
  AlertTriangle,
  Layers,
} from 'lucide-react';
import { useOptimizationStore } from '../../store/useOptimizationStore';
import { VehicleType, DepotConfig } from '../../types';
import { DepotMapPicker } from '../../components/map/DepotMapPicker';
import { Badge } from '../../components/common/Badge';

export const ConfigurePage: React.FC = () => {
  const navigate = useNavigate();
  const { deliveries, depot, fleet, setDepot, setFleet, setStep } = useOptimizationStore();

  // Local editable state initialized from global Zustand store
  const [localDepot, setLocalDepot] = useState<DepotConfig>(depot);
  const [vehicles, setVehicles] = useState<VehicleType[]>(fleet.vehicles);

  // Calculate totals
  const totalDeliveryCount = deliveries.length;
  const totalDemand = deliveries.reduce((sum, d) => sum + (Number(d.demand) || 0), 0);

  const totalVehiclesCount = vehicles.reduce((sum, v) => sum + (Number(v.count) || 0), 0);
  const totalFleetCapacity = vehicles.reduce(
    (sum, v) => sum + (Number(v.capacity) || 0) * (Number(v.count) || 0),
    0
  );

  const utilizationPct =
    totalFleetCapacity > 0
      ? Math.min(100, parseFloat(((totalDemand / totalFleetCapacity) * 100).toFixed(1)))
      : 0;

  const isFeasible = totalFleetCapacity >= totalDemand && totalFleetCapacity > 0;
  const hasValidVehicles =
    vehicles.length > 0 &&
    vehicles.every((v) => v.name.trim() !== '' && Number(v.capacity) > 0 && Number(v.count) > 0);

  const isFormValid =
    isFeasible &&
    hasValidVehicles &&
    localDepot.address.trim() !== '' &&
    totalDeliveryCount > 0;

  // Handlers
  const handleDepotMove = (lat: number, lng: number) => {
    setLocalDepot((prev) => ({ ...prev, lat, lng }));
  };

  const handleAddVehicleType = () => {
    const newId = `v-${Date.now()}`;
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4'];
    const assignedColor = colors[vehicles.length % colors.length];

    setVehicles((prev) => [
      ...prev,
      {
        id: newId,
        name: `Vehicle Group #${prev.length + 1}`,
        capacity: 50,
        count: 1,
        color: assignedColor,
        cost_per_km: 1.5,
      },
    ]);
  };

  const handleRemoveVehicleType = (id: string) => {
    setVehicles((prev) => prev.filter((v) => v.id !== id));
  };

  const handleUpdateVehicle = (
    id: string,
    field: keyof VehicleType,
    val: string | number
  ) => {
    setVehicles((prev) =>
      prev.map((v) => (v.id === id ? { ...v, [field]: val } : v))
    );
  };

  const handleContinue = () => {
    if (isFormValid) {
      setDepot(localDepot);
      setFleet({ vehicles });
      setStep(3);
      navigate('/optimize');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider">
          Step 2 of 4 — Route Constraints
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Depot & Fleet Configuration</h1>
        <p className="text-slate-400 text-xs sm:text-sm max-w-2xl leading-relaxed">
          Set your central warehouse depot origin and define vehicle types, capacities, and available counts.
        </p>
      </div>

      {/* Main 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Leaflet Depot Map (6 Cols) */}
        <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-400" />
              <h2 className="text-base font-bold text-white tracking-tight">Depot Warehouse Location</h2>
            </div>
            <span className="text-xs text-slate-500 font-mono">Origin Index: 0</span>
          </div>

          {/* Address & Lat/Lng Inputs */}
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Depot Address</label>
              <input
                type="text"
                value={localDepot.address}
                onChange={(e) => setLocalDepot({ ...localDepot, address: e.target.value })}
                placeholder="Enter warehouse address..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-400">Latitude</label>
                <input
                  type="number"
                  step="0.000001"
                  value={localDepot.lat}
                  onChange={(e) => setLocalDepot({ ...localDepot, lat: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-slate-400">Longitude</label>
                <input
                  type="number"
                  step="0.000001"
                  value={localDepot.lng}
                  onChange={(e) => setLocalDepot({ ...localDepot, lng: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Interactive Leaflet Depot Map */}
          <DepotMapPicker
            depotLat={localDepot.lat}
            depotLng={localDepot.lng}
            depotAddress={localDepot.address}
            onDepotMove={handleDepotMove}
            deliveries={deliveries}
          />
        </div>

        {/* Right Column: Fleet Management & Feasibility Summary (6 Cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Delivery & Fleet Feasibility Summary Banner */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" />
                <span>Capacity Feasibility Summary</span>
              </h3>
              <Badge
                status={isFeasible ? 'Feasible' : 'Insufficient Fleet Capacity'}
                variant={isFeasible ? 'emerald' : 'rose'}
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">Deliveries</span>
                <span className="text-base font-bold text-white">{totalDeliveryCount} stops</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">Total Demand</span>
                <span className="text-base font-bold text-blue-400">{totalDemand} units</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">Total Vehicles</span>
                <span className="text-base font-bold text-purple-400">{totalVehiclesCount} units</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">Fleet Capacity</span>
                <span className={`text-base font-bold ${isFeasible ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {totalFleetCapacity} units
                </span>
              </div>
            </div>

            {/* Utilization Bar */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-400">Cargo Load Utilization</span>
                <span className={isFeasible ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                  {utilizationPct}% Full
                </span>
              </div>
              <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800 p-0.5">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isFeasible ? 'bg-emerald-500' : 'bg-rose-500'
                  }`}
                  style={{ width: `${Math.min(100, (totalDemand / (totalFleetCapacity || 1)) * 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Insufficient Capacity Warning Banner */}
            {!isFeasible && (
              <div className="bg-rose-500/10 border border-rose-500/20 p-3.5 rounded-xl flex items-start gap-3 text-rose-300 text-xs">
                <AlertTriangle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
                <div>
                  <h4 className="font-bold text-rose-200">Insufficient Fleet Capacity</h4>
                  <p className="mt-0.5 text-[11px] text-rose-300/90 leading-relaxed">
                    Total fleet capacity ({totalFleetCapacity} units) is less than total cargo demand ({totalDemand} units). Please add more vehicles or increase capacity limits to proceed.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Fleet Vehicles Configurator Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-indigo-400" />
                <h2 className="text-base font-bold text-white tracking-tight">Fleet Vehicle Types</h2>
              </div>

              <button
                onClick={handleAddVehicleType}
                className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 px-3 py-1.5 rounded-xl border border-blue-500/20 font-semibold transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Vehicle Type</span>
              </button>
            </div>

            {/* Vehicle Cards Stack */}
            <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1">
              {vehicles.map((v) => (
                <div
                  key={v.id}
                  className="bg-slate-950 border border-slate-800/80 p-4 rounded-xl space-y-3 hover:border-slate-700 transition-all"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: v.color }}></span>
                      <input
                        type="text"
                        value={v.name}
                        onChange={(e) => handleUpdateVehicle(v.id, 'name', e.target.value)}
                        className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs font-semibold text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <button
                      onClick={() => handleRemoveVehicleType(v.id)}
                      disabled={vehicles.length <= 1}
                      className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-slate-900 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Delete vehicle type"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <div className="space-y-1">
                      <label className="text-[11px] text-slate-400">Capacity (Units)</label>
                      <input
                        type="number"
                        min="1"
                        value={v.capacity}
                        onChange={(e) =>
                          handleUpdateVehicle(
                            v.id,
                            'capacity',
                            e.target.value === '' ? '' : Math.max(0, Number(e.target.value))
                          )
                        }
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] text-slate-400">Vehicle Count</label>
                      <input
                        type="number"
                        min="1"
                        value={v.count}
                        onChange={(e) =>
                          handleUpdateVehicle(
                            v.id,
                            'count',
                            e.target.value === '' ? '' : Math.max(0, Number(e.target.value))
                          )
                        }
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] text-slate-400">Cost ($/km)</label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        value={v.cost_per_km ?? 1.5}
                        onChange={(e) =>
                          handleUpdateVehicle(
                            v.id,
                            'cost_per_km',
                            e.target.value === '' ? '' : Math.max(0, Number(e.target.value))
                          )
                        }
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
        <button
          onClick={() => navigate('/upload')}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-200 font-medium text-xs sm:text-sm px-4 py-2.5 rounded-xl hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Upload</span>
        </button>

        <button
          onClick={handleContinue}
          disabled={!isFormValid}
          className={`flex items-center gap-2 font-semibold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-lg transition-all ${
            isFormValid
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-500/25 hover:scale-105 cursor-pointer'
              : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-60'
          }`}
        >
          <span>Continue to Optimization</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
