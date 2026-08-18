import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3,
  Map as MapIcon,
  ListOrdered,
  Download,
  RefreshCw,
  Truck,
  CheckCircle2,
  Navigation,
  LayoutDashboard,
  Building2,
  AlertTriangle,
  Search,
  Filter,
} from 'lucide-react';
import { useOptimizationStore } from '../../store/useOptimizationStore';
import { RouteMapViewer } from '../../components/map/RouteMapViewer';

export const ResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const { optimizationResult, resetFlow } = useOptimizationStore();

  const [activeTab, setActiveTab] = useState<'map' | 'routes' | 'table' | 'kpis'>('map');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [tableSearchQuery, setTableSearchQuery] = useState('');
  const [tableVehicleFilter, setTableVehicleFilter] = useState('ALL');

  // Handle Empty State if no result is available in Zustand
  if (!optimizationResult || !optimizationResult.routes || optimizationResult.routes.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-6">
        <div className="w-20 h-20 bg-slate-900 border border-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-500 shadow-xl">
          <AlertTriangle className="w-10 h-10 text-amber-400" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-white tracking-tight">No Optimization Results Available</h1>
          <p className="text-slate-400 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
            There are currently no generated vehicle routes stored in session memory. Please upload a delivery CSV and configure your depot and fleet to run the optimization engine.
          </p>
        </div>
        <div className="flex justify-center gap-3 pt-2">
          <button
            onClick={() => navigate('/upload')}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-5 py-2.5 rounded-xl border border-slate-700 transition-all"
          >
            <UploadIcon className="w-4 h-4 text-blue-400" />
            <span>Upload Delivery CSV</span>
          </button>
          <button
            onClick={() => navigate('/configure')}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-blue-500/20 transition-all hover:scale-105"
          >
            <Navigation className="w-4 h-4" />
            <span>Configure Parameters</span>
          </button>
        </div>
      </div>
    );
  }

  const result = optimizationResult;

  // Frontend-only CSV Export Function
  const handleExportCSV = () => {
    const csvRows: string[] = [];

    // Header Metadata
    csvRows.push(`LOGISTICS ROUTE OPTIMIZATION MANIFEST`);
    csvRows.push(`Job ID,${result.job_id}`);
    csvRows.push(`Generated At,${result.created_at}`);
    csvRows.push(`Depot Address,"${result.depot.address.replace(/"/g, '""')}"`);
    csvRows.push(`Total Distance (km),${result.summary.total_distance_km}`);
    csvRows.push(`Total Duration,${result.summary.total_duration}`);
    csvRows.push(`Vehicles Active,${result.summary.vehicles_used}/${result.summary.total_vehicles}`);
    csvRows.push(`Fleet Utilization (%),${result.summary.avg_utilization_pct}`);
    csvRows.push(`Estimated Cost ($),${result.summary.estimated_cost}`);
    csvRows.push(``);

    // Delivery Manifest Columns
    csvRows.push(
      `Vehicle ID,Vehicle Type,Stop Sequence,Delivery ID,Address,Cargo Demand (Units),Cumulative Distance (km),Estimated Arrival (ETA)`
    );

    // Rows
    result.routes.forEach((route) => {
      route.stops.forEach((stop) => {
        csvRows.push(
          `"${route.vehicle_id}","${route.vehicle_type}",${stop.stop_number},"${stop.delivery_id}","${stop.address.replace(/"/g, '""')}",${stop.demand},${stop.cumulative_distance_km || 0},"${stop.estimated_arrival || 'N/A'}"`
        );
      });
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvRows.join('\n'));
    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute('download', `optimization-manifest-${result.job_id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleNewOptimization = () => {
    resetFlow();
    navigate('/upload');
  };

  // Filter deliveries for the table
  const allStops = result.routes.flatMap((r) =>
    r.stops.map((s) => ({
      ...s,
      vehicleId: r.vehicle_id,
      vehicleType: r.vehicle_type,
      color: r.color,
    }))
  );

  const filteredStops = allStops.filter((s) => {
    const matchesVehicle =
      tableVehicleFilter === 'ALL' || s.vehicleId === tableVehicleFilter;
    const matchesSearch =
      s.delivery_id.toLowerCase().includes(tableSearchQuery.toLowerCase()) ||
      s.address.toLowerCase().includes(tableSearchQuery.toLowerCase()) ||
      s.vehicleId.toLowerCase().includes(tableSearchQuery.toLowerCase());
    return matchesVehicle && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Action Header Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Optimization Completed
            </span>
            <span className="text-xs text-slate-500 font-mono">Job ID: {result.job_id}</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Route Optimization Results</h1>
          <p className="text-xs text-slate-400">
            Depot: <strong className="text-slate-200">{result.depot.address}</strong>
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1.5 bg-slate-950 hover:bg-slate-800 text-slate-300 text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-slate-800 transition-colors"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>
          <button
            onClick={handleNewOptimization}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-slate-700 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>New Optimization</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-blue-500/20 transition-all hover:scale-105"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV Manifest</span>
          </button>
        </div>
      </div>

      {/* 1. SUMMARY KPI CARDS GRID (7 Key Operational Metrics) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
            Total Distance
          </span>
          <p className="text-xl font-bold text-white font-mono">{result.summary.total_distance_km} <span className="text-xs text-slate-500 font-normal">km</span></p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
            Est. Fleet Cost
          </span>
          <p className="text-xl font-bold text-emerald-400 font-mono">
            ${result.summary.estimated_cost}
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
            Vehicles Active
          </span>
          <p className="text-xl font-bold text-blue-400 font-mono">
            {result.summary.vehicles_used} <span className="text-xs text-slate-500 font-normal">/ {result.summary.total_vehicles}</span>
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
            Fleet Utilization
          </span>
          <p className="text-xl font-bold text-purple-400 font-mono">
            {result.summary.avg_utilization_pct}%
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
            Total Deliveries
          </span>
          <p className="text-xl font-bold text-slate-200 font-mono">
            {result.summary.total_deliveries} <span className="text-xs text-slate-500 font-normal">stops</span>
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
            Est. Total Duration
          </span>
          <p className="text-xl font-bold text-indigo-400 font-mono">
            {result.summary.total_duration}
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-1 col-span-2 sm:col-span-1">
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
            Unserved Deliveries
          </span>
          <p className={`text-xl font-bold font-mono ${result.summary.unserved_count === 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {result.summary.unserved_count}
          </p>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex border-b border-slate-800 gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('map')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all shrink-0 ${
            activeTab === 'map'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <MapIcon className="w-4 h-4" />
          <span>Interactive Route Map</span>
        </button>
        <button
          onClick={() => setActiveTab('routes')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all shrink-0 ${
            activeTab === 'routes'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Vehicle Route Cards ({result.routes.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('table')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all shrink-0 ${
            activeTab === 'table'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <ListOrdered className="w-4 h-4" />
          <span>Delivery Sequence Table</span>
        </button>
        <button
          onClick={() => setActiveTab('kpis')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all shrink-0 ${
            activeTab === 'kpis'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Analytics & Operational KPIs</span>
        </button>
      </div>

      {/* TAB CONTENT DISPLAY AREA */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl min-h-[480px]">
        {/* TAB 1: INTERACTIVE ROUTE MAP */}
        {activeTab === 'map' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <Navigation className="w-4 h-4 text-blue-400" />
                <span>Select a vehicle to isolate its route on the interactive Leaflet map:</span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  onClick={() => setSelectedVehicleId(null)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    selectedVehicleId === null
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  Show All ({result.routes.length})
                </button>
                {result.routes.map((r) => (
                  <button
                    key={r.vehicle_id}
                    onClick={() => setSelectedVehicleId(r.vehicle_id)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      selectedVehicleId === r.vehicle_id
                        ? 'bg-slate-800 border border-slate-700 text-white font-bold'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: r.color }}></span>
                    <span>{r.vehicle_id}</span>
                  </button>
                ))}
              </div>
            </div>

            <RouteMapViewer
              result={result}
              selectedVehicleId={selectedVehicleId}
              onSelectVehicle={(vId) => setSelectedVehicleId(vId)}
            />
          </div>
        )}

        {/* TAB 2: VEHICLE ROUTE CARDS & DELIVERY SEQUENCE VISUALIZER */}
        {activeTab === 'routes' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {result.routes.map((route) => {
                const isSelected = selectedVehicleId === route.vehicle_id;
                const estimatedOperatingCost = (route.total_distance_km * 1.8 + 45).toFixed(2);

                return (
                  <div
                    key={route.vehicle_id}
                    className={`bg-slate-950 border rounded-2xl p-5 space-y-4 transition-all ${
                      isSelected
                        ? 'border-blue-500 shadow-lg shadow-blue-500/10'
                        : 'border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {/* Card Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="w-3.5 h-3.5 rounded-full shadow-md" style={{ backgroundColor: route.color }}></span>
                        <div>
                          <h3 className="font-bold text-slate-100 text-base">{route.vehicle_id}</h3>
                          <span className="text-[11px] text-slate-400 block">{route.vehicle_type}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedVehicleId(route.vehicle_id);
                          setActiveTab('map');
                        }}
                        className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-500/20"
                      >
                        View on Map
                      </button>
                    </div>

                    {/* Vehicle Metrics Grid */}
                    <div className="grid grid-cols-3 gap-2 bg-slate-900/80 p-3 rounded-xl text-center border border-slate-800 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-500 block uppercase font-semibold">Distance</span>
                        <span className="font-bold text-white font-mono">{route.total_distance_km} km</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block uppercase font-semibold">Duration</span>
                        <span className="font-bold text-indigo-400 font-mono">{route.total_duration_minutes}m</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block uppercase font-semibold">Op. Cost</span>
                        <span className="font-bold text-emerald-400 font-mono">${estimatedOperatingCost}</span>
                      </div>
                    </div>

                    {/* Utilization Bar */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs text-slate-400 font-medium">
                        <span>Capacity Utilization</span>
                        <span className="font-bold text-emerald-400">
                          {route.utilization_pct}% ({route.used_capacity}/{route.capacity} units)
                        </span>
                      </div>
                      <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800 p-0.5">
                        <div
                          className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                          style={{ width: `${route.utilization_pct}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Delivery Sequence Flow Diagram */}
                    <div className="space-y-2 pt-2 border-t border-slate-800/80">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Ordered Delivery Sequence ({route.stops.length} stops):
                      </span>

                      <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                        {/* Start Depot Node */}
                        <div className="flex items-center gap-2 text-xs bg-slate-900/60 p-2 rounded-lg border border-slate-800/60 text-slate-300">
                          <Building2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                          <span className="font-semibold text-slate-200 text-[11px]">Depot Origin</span>
                          <span className="text-[10px] text-slate-500 font-mono ml-auto">08:00 AM</span>
                        </div>

                        {/* Route Stops */}
                        {route.stops.map((stop) => (
                          <div
                            key={stop.stop_number}
                            className="flex items-start gap-2.5 text-xs bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors"
                          >
                            <div
                              className="w-5 h-5 rounded-full text-[10px] font-mono font-bold text-white flex items-center justify-center shrink-0 mt-0.5"
                              style={{ backgroundColor: route.color }}
                            >
                              {stop.stop_number}
                            </div>
                            <div className="space-y-0.5 flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-blue-400 font-mono">{stop.delivery_id}</span>
                                <span className="text-[10px] text-emerald-400 font-mono font-semibold">
                                  {stop.estimated_arrival}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-300 truncate">{stop.address}</p>
                              <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5">
                                <span>Demand: <strong>{stop.demand} units</strong></span>
                                <span>Dist: <strong>{stop.cumulative_distance_km || 0} km</strong></span>
                              </div>
                            </div>
                          </div>
                        ))}

                        {/* End Return to Depot Node */}
                        <div className="flex items-center gap-2 text-xs bg-slate-900/60 p-2 rounded-lg border border-slate-800/60 text-slate-300">
                          <Building2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                          <span className="font-semibold text-slate-200 text-[11px]">Return to Depot</span>
                          <span className="text-[10px] text-slate-500 font-mono ml-auto">Complete</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: DELIVERY SEQUENCE TABLE */}
        {activeTab === 'table' && (
          <div className="space-y-4">
            {/* Table Filters Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search delivery ID, address..."
                  value={tableSearchQuery}
                  onChange={(e) => setTableSearchQuery(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter className="w-4 h-4 text-slate-400" />
                <span className="text-slate-400 text-xs">Filter Vehicle:</span>
                <select
                  value={tableVehicleFilter}
                  onChange={(e) => setTableVehicleFilter(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="ALL">All Vehicles ({result.routes.length})</option>
                  {result.routes.map((r) => (
                    <option key={r.vehicle_id} value={r.vehicle_id}>
                      {r.vehicle_id} ({r.vehicle_type})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Delivery Sequence Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase font-mono border-b border-slate-800 text-[11px]">
                  <tr>
                    <th className="p-3.5">Stop #</th>
                    <th className="p-3.5">Assigned Vehicle</th>
                    <th className="p-3.5">Delivery ID</th>
                    <th className="p-3.5">Destination Address</th>
                    <th className="p-3.5 text-right">Cargo Demand</th>
                    <th className="p-3.5 text-right">Cumulative Dist</th>
                    <th className="p-3.5 text-right">Est. Arrival (ETA)</th>
                    <th className="p-3.5 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-300 bg-slate-900/60">
                  {filteredStops.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-slate-500 italic">
                        No deliveries matched your search filter.
                      </td>
                    </tr>
                  ) : (
                    filteredStops.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/50 transition-colors">
                        <td className="p-3.5 font-mono text-slate-400 font-bold">
                          Stop #{row.stop_number}
                        </td>
                        <td className="p-3.5">
                          <div className="flex items-center gap-2 font-semibold text-white">
                            <span
                              className="w-2.5 h-2.5 rounded-full shrink-0"
                              style={{ backgroundColor: row.color }}
                            ></span>
                            <span className="font-mono">{row.vehicleId}</span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              ({row.vehicleType})
                            </span>
                          </div>
                        </td>
                        <td className="p-3.5 font-mono font-bold text-blue-400">
                          {row.delivery_id}
                        </td>
                        <td className="p-3.5 text-slate-200 max-w-xs truncate">
                          {row.address}
                        </td>
                        <td className="p-3.5 text-right font-mono text-white font-semibold">
                          {row.demand} units
                        </td>
                        <td className="p-3.5 text-right font-mono text-slate-400">
                          {row.cumulative_distance_km || 0} km
                        </td>
                        <td className="p-3.5 text-right font-mono font-bold text-emerald-400">
                          {row.estimated_arrival || '09:00 AM'}
                        </td>
                        <td className="p-3.5 text-center">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <CheckCircle2 className="w-3 h-3" /> Scheduled
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: ANALYTICS & OPERATIONAL KPIS */}
        {activeTab === 'kpis' && (
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-400" />
              <span>Fleet Efficiency & Operational Analytics</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Distance Breakdown Card */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                <h4 className="text-xs font-semibold text-slate-300">Distance per Vehicle Route</h4>
                <div className="space-y-3 pt-1">
                  {result.routes.map((r) => (
                    <div key={r.vehicle_id} className="space-y-1 text-xs">
                      <div className="flex justify-between text-slate-200 font-mono">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: r.color }}></span>
                          {r.vehicle_id}
                        </span>
                        <span>{r.total_distance_km} km</span>
                      </div>
                      <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                        <div
                          className="h-full rounded-full"
                          style={{
                            backgroundColor: r.color,
                            width: `${Math.min(100, (r.total_distance_km / 30) * 100)}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payload Utilization Breakdown Card */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                <h4 className="text-xs font-semibold text-slate-300">Cargo Payload Utilization</h4>
                <div className="space-y-3 pt-1">
                  {result.routes.map((r) => (
                    <div key={r.vehicle_id} className="space-y-1 text-xs">
                      <div className="flex justify-between text-slate-200 font-mono">
                        <span>{r.vehicle_id}</span>
                        <span className="text-emerald-400 font-bold">{r.utilization_pct}% ({r.used_capacity}/{r.capacity} u)</span>
                      </div>
                      <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                        <div
                          className="bg-emerald-500 h-full rounded-full"
                          style={{ width: `${r.utilization_pct}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Efficiency & Cost Highlights Card */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 col-span-1 md:col-span-2 lg:col-span-1">
                <h4 className="text-xs font-semibold text-slate-300">Operational Key Indicators</h4>
                <div className="space-y-3 text-xs">
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 block uppercase font-semibold">Delivery Density</span>
                    <p className="text-xl font-bold text-blue-400 font-mono mt-0.5">
                      {(result.summary.total_deliveries / (result.summary.total_distance_km || 1)).toFixed(2)}{' '}
                      <span className="text-xs text-slate-500 font-normal">stops / km</span>
                    </p>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 block uppercase font-semibold">Average Cost Per Stop</span>
                    <p className="text-xl font-bold text-emerald-400 font-mono mt-0.5">
                      ${(result.summary.estimated_cost / (result.summary.total_deliveries || 1)).toFixed(2)}{' '}
                      <span className="text-xs text-slate-500 font-normal">/ delivery</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper Upload icon component for empty state
const UploadIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
    <path d="M12 12v9" />
    <path d="m16 16-4-4-4 4" />
  </svg>
);
