import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Play,
  Truck,
  Building2,
  PackageCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RefreshCw,
  Sliders,
  Terminal,
  ArrowLeft,
  Zap,
  Check,
  PauseCircle,
  PlayCircle,
  RotateCcw,
  Gauge,
  CircleDot,
} from 'lucide-react';
import { useOptimizationStore } from '../../store/useOptimizationStore';
import { OptimizationResult, VehicleRoute } from '../../types';
import { Badge } from '../../components/common/Badge';

interface LogMessage {
  id: string;
  timestamp: string;
  text: string;
  type: 'info' | 'success' | 'warn' | 'system';
}

export const OptimizePage: React.FC = () => {
  const navigate = useNavigate();
  const {
    deliveries,
    depot,
    fleet,
    objective,
    solverSettings,
    setObjective,
    setSolverSettings,
    setOptimizationResult,
    setOptimizationProgress,
    setActiveJobId,
    setStep,
  } = useOptimizationStore();

  // Mode state: 'config' (Pre-flight) or 'solving' (Live simulation)
  const [isSolving, setIsSolving] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const [jobId, setJobId] = useState<string>('');
  
  // Real-time telemetry during solving
  const [bestDistance, setBestDistance] = useState<number>(0);
  const [bestCost, setBestCost] = useState<number>(0);
  const [vehiclesUsed, setVehiclesUsed] = useState<number>(0);
  const [iterationsCompleted, setIterationsCompleted] = useState<number>(0);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  // Terminal log state
  const [logs, setLogs] = useState<LogMessage[]>([]);
  const [autoScroll, setAutoScroll] = useState(true);
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Calculations for Pre-Flight Readiness Summary
  const totalDeliveries = deliveries.length;
  const totalDemand = deliveries.reduce((sum, d) => sum + (Number(d.demand) || 0), 0);
  const totalVehiclesCount = fleet.vehicles.reduce((sum, v) => sum + (Number(v.count) || 0), 0);
  const totalFleetCapacity = fleet.vehicles.reduce(
    (sum, v) => sum + (Number(v.capacity) || 0) * (Number(v.count) || 0),
    0
  );
  const isFeasible = totalFleetCapacity >= totalDemand && totalFleetCapacity > 0 && totalDeliveries > 0;

  // Pipeline stages definition
  const stages = [
    {
      id: 1,
      name: 'Data Validation & Geocode Check',
      description: 'Verifying delivery nodes, address coordinates & warehouse origin',
    },
    {
      id: 2,
      name: 'Distance & Time Matrix Generation',
      description: 'Computing N×N distance & travel duration matrices',
    },
    {
      id: 3,
      name: 'CVRP Metaheuristic Engine',
      description: 'Running Guided Local Search & capacity constraints optimization',
    },
    {
      id: 4,
      name: 'Manifest Finalization',
      description: 'Constructing stop sequences, ETAs & route payload manifests',
    },
  ];

  // Auto scroll terminal log console
  useEffect(() => {
    if (autoScroll && logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);

  // Helper to append log entries
  const addLog = (text: string, type: 'info' | 'success' | 'warn' | 'system' = 'info') => {
    const time = new Date().toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    setLogs((prev) => [
      ...prev,
      { id: Math.random().toString(36).substr(2, 9), timestamp: time, text, type },
    ]);
  };

  // Start Optimization Solver Execution
  const handleStartOptimization = () => {
    const newJobId = `OPT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setJobId(newJobId);
    setActiveJobId(newJobId);
    setStep(3);
    setIsSolving(true);
    setProgress(0);
    setActiveStageIndex(0);
    setLogs([]);
    setBestDistance(parseFloat((totalDemand * 0.35 + 25).toFixed(1)));
    setBestCost(parseFloat((totalDemand * 2.8 + 150).toFixed(2)));
    setVehiclesUsed(Math.min(totalVehiclesCount, Math.ceil(totalDemand / 60) || 1));
    setIterationsCompleted(0);
    setElapsedSeconds(0);

    addLog(`[SYSTEM] Optimization job initialized with ID: ${newJobId}`, 'system');
    addLog(`[CONFIG] Solver Objective: ${objective.toUpperCase()} | Time Limit: ${solverSettings.timeLimitSeconds}s`, 'info');
    addLog(`[CONFIG] Target Nodes: ${totalDeliveries} deliveries | Demand: ${totalDemand} units | Fleet: ${totalVehiclesCount} vehicles`, 'info');
  };

  // Live simulation timer & stage progress driver
  useEffect(() => {
    if (!isSolving) return;

    // Elapsed clock interval
    const clockTimer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    // Iteration incrementer
    const iterTimer = setInterval(() => {
      setIterationsCompleted((prev) => prev + Math.floor(Math.random() * 8 + 4));
      setBestDistance((prev) => Math.max(28.4, parseFloat((prev - Math.random() * 0.4).toFixed(1))));
      setBestCost((prev) => Math.max(210.0, parseFloat((prev - Math.random() * 1.5).toFixed(2))));
    }, 400);

    // Simulated progress pipeline driver
    const progressTimer = setInterval(() => {
      setProgress((prevProgress) => {
        const next = prevProgress + 5;
        setOptimizationProgress(next);

        // Stage transitions & log emissions
        if (next === 10) {
          setActiveStageIndex(0);
          addLog(`[STAGE 1/4] Validating coordinates for ${totalDeliveries} delivery points...`, 'info');
          addLog(`[STAGE 1/4] Warehouse origin verified at: ${depot.address || 'Central Depot'}`, 'success');
        } else if (next === 30) {
          setActiveStageIndex(1);
          addLog(`[STAGE 2/4] Generating ${totalDeliveries + 1}x${totalDeliveries + 1} distance-time cost matrix...`, 'info');
          addLog(`[STAGE 2/4] Computing OSRM routing metric overlays & highway speed profiles...`, 'info');
          addLog(`[STAGE 2/4] Distance matrix computed successfully (Symmetry error: 0.00%)`, 'success');
        } else if (next === 55) {
          setActiveStageIndex(2);
          addLog(`[STAGE 3/4] Initializing CVRP metaheuristic solver engine...`, 'info');
          addLog(`[STAGE 3/4] Constructive heuristic solution generated. Initial cost: ${(totalDemand * 3.5).toFixed(1)} km`, 'warn');
          addLog(`[STAGE 3/4] Applying Guided Local Search & 2-Opt edge swaps...`, 'info');
        } else if (next === 80) {
          setActiveStageIndex(3);
          addLog(`[STAGE 3/4] Local search converged at iteration 142. Optimal bounds achieved.`, 'success');
          addLog(`[STAGE 4/4] Constructing individual vehicle manifests & stop arrival ETAs...`, 'info');
          addLog(`[STAGE 4/4] Allocating cargo loads to ${vehiclesUsed} active fleet vehicles...`, 'info');
        } else if (next >= 100) {
          clearInterval(progressTimer);
          clearInterval(clockTimer);
          clearInterval(iterTimer);

          addLog(`[SYSTEM] Optimization successfully completed! Finalizing result object...`, 'system');

          // Generate dynamic OptimizationResult and save to store
          setTimeout(() => {
            const result = generateMockResult();
            setOptimizationResult(result);
            setStep(4);
            navigate('/results');
          }, 800);

          return 100;
        }

        return next;
      });
    }, 450);

    return () => {
      clearInterval(clockTimer);
      clearInterval(iterTimer);
      clearInterval(progressTimer);
    };
  }, [isSolving, totalDeliveries, totalDemand, totalVehiclesCount, depot.address, objective, solverSettings, navigate, setOptimizationProgress, setOptimizationResult, setStep]);

  // Generate realistic OptimizationResult using store state
  const generateMockResult = (): OptimizationResult => {
    const activeVehicles = fleet.vehicles.filter((v) => (Number(v.count) || 0) > 0);
    const assignedRoutes: VehicleRoute[] = [];
    
    let currentDeliveryIdx = 0;
    let totalDist = 0;

    activeVehicles.forEach((vType, vTypeIdx) => {
      const vCount = Math.min(vType.count, Math.ceil((deliveries.length - currentDeliveryIdx) / 3) || 1);
      
      for (let i = 0; i < vCount && currentDeliveryIdx < deliveries.length; i++) {
        const vehicleId = `${vType.name.split(' ')[0].toUpperCase()}-${101 + vTypeIdx * 10 + i}`;
        const stopsCount = Math.min(4, deliveries.length - currentDeliveryIdx);
        const assignedDeliveries = deliveries.slice(currentDeliveryIdx, currentDeliveryIdx + stopsCount);
        
        const usedCap = assignedDeliveries.reduce((sum, d) => sum + (Number(d.demand) || 0), 0);
        const routeDist = parseFloat((12 + Math.random() * 18).toFixed(1));
        totalDist += routeDist;

        const routeStops = assignedDeliveries.map((d, stopIdx) => ({
          stop_number: stopIdx + 1,
          delivery_id: d.delivery_id,
          address: d.address,
          demand: d.demand,
          lat: d.lat || depot.lat + (Math.random() - 0.5) * 0.05,
          lng: d.lng || depot.lng + (Math.random() - 0.5) * 0.05,
          estimated_arrival: `09:${(15 + stopIdx * 25).toString().padStart(2, '0')} AM`,
          cumulative_distance_km: parseFloat(((stopIdx + 1) * 3.8).toFixed(1)),
        }));

        // Path coordinates starting and ending at depot
        const pathCoords: [number, number][] = [
          [depot.lat, depot.lng],
          ...routeStops.map((s) => [s.lat, s.lng] as [number, number]),
          [depot.lat, depot.lng],
        ];

        assignedRoutes.push({
          vehicle_id: vehicleId,
          vehicle_type: vType.name,
          color: vType.color || '#3B82F6',
          capacity: vType.capacity,
          used_capacity: usedCap,
          utilization_pct: parseFloat(Math.min(100, (usedCap / vType.capacity) * 100).toFixed(1)),
          total_distance_km: routeDist,
          total_duration_minutes: Math.round(routeDist * 2.2 + stopsCount * 8),
          stops: routeStops,
          path_coordinates: pathCoords,
        });

        currentDeliveryIdx += stopsCount;
      }
    });

    const finalVehiclesUsed = assignedRoutes.length;
    const finalDist = parseFloat(totalDist.toFixed(1));
    const avgUtil = assignedRoutes.length > 0
      ? parseFloat((assignedRoutes.reduce((s, r) => s + r.utilization_pct, 0) / assignedRoutes.length).toFixed(1))
      : 85;

    return {
      job_id: jobId || `OPT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'COMPLETED',
      created_at: new Date().toISOString(),
      depot: {
        address: depot.address || 'Central Logistics Hub, 500 W Madison St, Chicago, IL 60661',
        lat: depot.lat || 41.8818,
        lng: depot.lng || -87.6405,
      },
      summary: {
        total_distance_km: finalDist > 0 ? finalDist : 48.6,
        total_duration: `${Math.floor((finalDist * 2.2) / 60)}h ${Math.round((finalDist * 2.2) % 60)}m`,
        vehicles_used: finalVehiclesUsed > 0 ? finalVehiclesUsed : 3,
        total_vehicles: totalVehiclesCount > 0 ? totalVehiclesCount : 5,
        avg_utilization_pct: avgUtil,
        unserved_count: Math.max(0, deliveries.length - currentDeliveryIdx),
        total_deliveries: deliveries.length,
        estimated_cost: parseFloat((finalDist * 3.2 + finalVehiclesUsed * 45).toFixed(2)),
      },
      routes: assignedRoutes.length > 0 ? assignedRoutes : [],
      unassigned_deliveries: [],
    };
  };

  const handleCancel = () => {
    setIsSolving(false);
    setProgress(0);
    setActiveStageIndex(0);
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider">
          Step 3 of 4 — Optimization Execution
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Route Optimization Engine
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm max-w-3xl leading-relaxed">
          Configure solver objectives, time limits, and vehicle constraints, then run the multi-vehicle route optimization engine.
        </p>
      </div>

      {!isSolving ? (
        /* ========================================================================= */
        /* PHASE A: PRE-FLIGHT SOLVER CONFIGURATION PANEL                             */
        /* ========================================================================= */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Objective & Parameters Setup (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Optimization Objective Selection Card */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-xl">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                <h2 className="text-base font-bold text-white tracking-tight">
                  1. Select Optimization Objective
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Distance Objective */}
                <button
                  type="button"
                  onClick={() => setObjective('distance')}
                  className={`p-4 rounded-xl border text-left transition-all relative flex flex-col justify-between space-y-3 ${
                    objective === 'distance'
                      ? 'bg-blue-600/15 border-blue-500 text-white shadow-lg shadow-blue-500/10'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xl">🎯</span>
                    {objective === 'distance' && (
                      <Check className="w-4 h-4 text-blue-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white">Minimize Distance</h3>
                    <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                      Reduces overall transit mileage & fuel usage across all routes.
                    </p>
                  </div>
                </button>

                {/* Cost Objective */}
                <button
                  type="button"
                  onClick={() => setObjective('cost')}
                  className={`p-4 rounded-xl border text-left transition-all relative flex flex-col justify-between space-y-3 ${
                    objective === 'cost'
                      ? 'bg-emerald-600/15 border-emerald-500 text-white shadow-lg shadow-emerald-500/10'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xl">💰</span>
                    {objective === 'cost' && (
                      <Check className="w-4 h-4 text-emerald-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white">Minimize Operational Cost</h3>
                    <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                      Balances driver fixed dispatch fees with variable per-km costs.
                    </p>
                  </div>
                </button>

                {/* Utilization Objective */}
                <button
                  type="button"
                  onClick={() => setObjective('utilization')}
                  className={`p-4 rounded-xl border text-left transition-all relative flex flex-col justify-between space-y-3 ${
                    objective === 'utilization'
                      ? 'bg-purple-600/15 border-purple-500 text-white shadow-lg shadow-purple-500/10'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xl">🚚</span>
                    {objective === 'utilization' && (
                      <Check className="w-4 h-4 text-purple-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white">Maximize Capacity</h3>
                    <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                      Packs individual vehicle volume to minimize active vehicles required.
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* 2. Solver Parameters & Constraints Settings Card */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-indigo-400" />
                  <h2 className="text-base font-bold text-white tracking-tight">
                    2. Solver Parameters & Route Constraints
                  </h2>
                </div>
                <span className="text-xs text-slate-500 font-mono">CVRP Metaheuristic</span>
              </div>

              <div className="space-y-4">
                {/* Time Limit Setting */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <label className="font-semibold text-slate-200 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-blue-400" />
                      <span>Solver Time Limit</span>
                    </label>
                    <span className="text-blue-400 font-mono font-bold bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                      {solverSettings.timeLimitSeconds} seconds
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="120"
                    step="5"
                    value={solverSettings.timeLimitSeconds}
                    onChange={(e) =>
                      setSolverSettings({
                        ...solverSettings,
                        timeLimitSeconds: Number(e.target.value),
                      })
                    }
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>10s (Fast heuristic)</span>
                    <span>60s (Balanced)</span>
                    <span>120s (Deep search)</span>
                  </div>
                </div>

                {/* Max Route Duration Setting */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                    <label className="text-xs font-semibold text-slate-200 block">
                      Max Route Duration (Mins)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="60"
                        max="720"
                        step="30"
                        value={solverSettings.maxRouteDurationMinutes}
                        onChange={(e) =>
                          setSolverSettings({
                            ...solverSettings,
                            maxRouteDurationMinutes: Math.max(60, Number(e.target.value)),
                          })
                        }
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-blue-500"
                      />
                      <span className="text-xs text-slate-500">mins</span>
                    </div>
                    <span className="text-[10px] text-slate-500 block">
                      Max shift time: {Math.floor(solverSettings.maxRouteDurationMinutes / 60)}h{' '}
                      {solverSettings.maxRouteDurationMinutes % 60}m
                    </span>
                  </div>

                  {/* Allow Unused Vehicles Toggle */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="text-xs font-semibold text-slate-200 block">
                        Allow Unused Vehicles
                      </span>
                      <span className="text-[10px] text-slate-500 block leading-tight">
                        Leave surplus fleet parked if demand is met
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setSolverSettings({
                          ...solverSettings,
                          allowUnusedVehicles: !solverSettings.allowUnusedVehicles,
                        })
                      }
                      className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                        solverSettings.allowUnusedVehicles ? 'bg-blue-600' : 'bg-slate-800'
                      }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                          solverSettings.allowUnusedVehicles ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      ></div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Pre-Flight Readiness Summary & Trigger (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                  <PackageCheck className="w-5 h-5 text-emerald-400" />
                  <span>Pre-Flight Readiness Summary</span>
                </h2>
                <Badge
                  status={isFeasible ? 'Ready to Optimize' : 'Incomplete Constraints'}
                  variant={isFeasible ? 'emerald' : 'rose'}
                />
              </div>

              {/* Readiness Checks List */}
              <div className="space-y-3">
                {/* 1. Deliveries Ready */}
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                      <PackageCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-200">Delivery Nodes</h4>
                      <p className="text-[11px] text-slate-400">
                        {totalDeliveries} stops loaded ({totalDemand} cargo units)
                      </p>
                    </div>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                </div>

                {/* 2. Depot Location Ready */}
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-200">Central Warehouse Depot</h4>
                      <p className="text-[11px] text-slate-400 truncate max-w-[180px]">
                        {depot.address || 'Central Depot Origin'}
                      </p>
                    </div>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                </div>

                {/* 3. Fleet Configuration Ready */}
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
                      <Truck className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-200">Available Fleet Capacity</h4>
                      <p className="text-[11px] text-slate-400">
                        {totalVehiclesCount} vehicles ({totalFleetCapacity} max capacity)
                      </p>
                    </div>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                </div>
              </div>

              {/* Feasibility Warning Banner if not ready */}
              {!isFeasible && (
                <div className="bg-rose-500/10 border border-rose-500/20 p-3.5 rounded-xl flex items-start gap-2.5 text-rose-300 text-xs">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                  <p className="text-[11px] text-rose-300">
                    Fleet capacity is insufficient for current demand or no deliveries are loaded. Please return to step 2 to adjust parameters.
                  </p>
                </div>
              )}

              {/* CTA Action Button */}
              <div className="pt-2">
                <button
                  onClick={handleStartOptimization}
                  disabled={!isFeasible}
                  className={`w-full py-4 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-xl transition-all ${
                    isFeasible
                      ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-blue-500/25 hover:scale-[1.02] cursor-pointer'
                      : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-60'
                  }`}
                >
                  <Play className="w-5 h-5 fill-current" />
                  <span>Optimize Multi-Vehicle Routes</span>
                </button>
              </div>

              <div className="flex items-center justify-between text-xs pt-2">
                <button
                  onClick={() => navigate('/configure')}
                  className="text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Configure</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* PHASE B: SIMULATED LIVE SOLVER EXECUTION WORKSPACE                        */
        /* ========================================================================= */
        <div className="space-y-6">
          {/* Top Progress & Telemetry Header Card */}
          <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400 relative">
                  <Truck className="w-6 h-6 animate-pulse" />
                  <RefreshCw className="w-4 h-4 animate-spin absolute -top-1 -right-1 text-indigo-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-white">Solver Engine Running...</h2>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      ID: {jobId}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Objective: <strong className="text-slate-200 uppercase">{objective}</strong> | Elapsed: <strong className="text-emerald-400 font-mono">{elapsedSeconds}s</strong>
                  </p>
                </div>
              </div>

              <button
                onClick={handleCancel}
                className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 px-3 py-2 rounded-xl border border-rose-500/20 font-semibold transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Cancel Optimization</span>
              </button>
            </div>

            {/* Master Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <CircleDot className="w-3.5 h-3.5 text-blue-400 animate-ping" />
                  <span>{stages[activeStageIndex]?.name}</span>
                </span>
                <span className="text-emerald-400 font-bold text-sm">{progress}%</span>
              </div>
              <div className="w-full bg-slate-950 h-3.5 rounded-full overflow-hidden p-0.5 border border-slate-800 shadow-inner">
                <div
                  className="bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 h-full rounded-full transition-all duration-500 shadow-lg"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            {/* Live Solver Telemetry Counters Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">
                  Best Distance
                </span>
                <p className="text-lg font-bold text-white font-mono flex items-baseline gap-1">
                  <span>{bestDistance}</span>
                  <span className="text-xs text-slate-500 font-normal">km</span>
                </p>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">
                  Est. Route Cost
                </span>
                <p className="text-lg font-bold text-emerald-400 font-mono">
                  ${bestCost}
                </p>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">
                  Active Vehicles
                </span>
                <p className="text-lg font-bold text-purple-400 font-mono">
                  {vehiclesUsed} <span className="text-xs text-slate-500 font-normal">/ {totalVehiclesCount}</span>
                </p>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">
                  Iterations
                </span>
                <p className="text-lg font-bold text-blue-400 font-mono">
                  {iterationsCompleted}
                </p>
              </div>
            </div>
          </div>

          {/* 2-Column Section: 4-Stage Pipeline + Live Monospace Log Terminal */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: 4-Stage Pipeline Cards (5 Cols) */}
            <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Gauge className="w-4 h-4 text-blue-400" />
                <span>Execution Pipeline Stages</span>
              </h3>

              <div className="space-y-3">
                {stages.map((stg, idx) => {
                  const isDone = activeStageIndex > idx || progress === 100;
                  const isCurrent = activeStageIndex === idx && progress < 100;

                  return (
                    <div
                      key={stg.id}
                      className={`p-3.5 rounded-xl border transition-all flex items-start gap-3 ${
                        isDone
                          ? 'bg-slate-950 border-emerald-500/30 text-slate-200'
                          : isCurrent
                          ? 'bg-blue-600/10 border-blue-500/50 text-white shadow-lg shadow-blue-500/10'
                          : 'bg-slate-950/50 border-slate-800/60 text-slate-500'
                      }`}
                    >
                      <div className="mt-0.5">
                        {isDone ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                        ) : isCurrent ? (
                          <RefreshCw className="w-5 h-5 text-blue-400 animate-spin shrink-0" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border border-slate-700 flex items-center justify-center text-[10px] font-mono text-slate-500">
                            {stg.id}
                          </div>
                        )}
                      </div>
                      <div className="space-y-0.5">
                        <h4
                          className={`text-xs font-semibold ${
                            isCurrent ? 'text-blue-400 font-bold' : isDone ? 'text-slate-200' : 'text-slate-500'
                          }`}
                        >
                          {stg.name}
                        </h4>
                        <p className="text-[11px] text-slate-400 leading-snug">
                          {stg.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Monospace Live Solver Log Console (7 Cols) */}
            <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-3 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    Live Solver Execution Logs
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setAutoScroll(!autoScroll)}
                    className={`text-[10px] font-mono px-2 py-1 rounded border transition-colors flex items-center gap-1 ${
                      autoScroll
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {autoScroll ? <PauseCircle className="w-3 h-3" /> : <PlayCircle className="w-3 h-3" />}
                    <span>{autoScroll ? 'Autoscroll ON' : 'Autoscroll OFF'}</span>
                  </button>
                </div>
              </div>

              {/* Log Window */}
              <div
                ref={logContainerRef}
                className="bg-slate-950 border border-slate-800 rounded-xl p-4 h-64 overflow-y-auto font-mono text-[11px] space-y-1.5 text-slate-300 leading-relaxed scrollbar-thin scrollbar-thumb-slate-800"
              >
                {logs.length === 0 ? (
                  <div className="text-slate-600 italic">Initializing execution stream...</div>
                ) : (
                  logs.map((log) => (
                    <div key={log.id} className="flex items-start gap-2">
                      <span className="text-slate-600 shrink-0 text-[10px] font-mono">[{log.timestamp}]</span>
                      <span
                        className={
                          log.type === 'system'
                            ? 'text-purple-400 font-bold'
                            : log.type === 'success'
                            ? 'text-emerald-400'
                            : log.type === 'warn'
                            ? 'text-amber-400'
                            : 'text-slate-300'
                        }
                      >
                        {log.text}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
