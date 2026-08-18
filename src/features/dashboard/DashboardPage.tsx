import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Truck,
  MapPin,
  DollarSign,
  BarChart3,
  Clock,
  PlusCircle,
  ArrowRight,
  Activity,
  Layers,
} from 'lucide-react';
import { StatCard } from '../../components/common/StatCard';
import { Badge } from '../../components/common/Badge';
import { DeliveryAnalyticsChart } from '../../components/charts/DeliveryAnalyticsChart';
import { mockDashboardMetrics, mockFleetVehicles, mockSessions } from '../../mock/mockData';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const metrics = mockDashboardMetrics;

  return (
    <div className="space-y-8">
      {/* Top Welcome / Quick Action Banner */}
      <div className="bg-gradient-to-r from-blue-950/80 via-slate-900 to-indigo-950/60 border border-blue-500/20 rounded-2xl p-6 lg:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" /> Operations Control Center
            </span>
            <span className="text-xs text-slate-400">Hub: Chicago Central</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
            Logistics & Fleet Optimization Dashboard
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm max-w-2xl leading-relaxed">
            Real-time fleet utilization analytics, automated multi-vehicle route optimization, and operational cost monitoring.
          </p>
        </div>

        <button
          onClick={() => navigate('/upload')}
          className="flex items-center gap-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-lg shadow-blue-500/25 transition-all hover:scale-105 shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Optimization Session</span>
        </button>
      </div>

      {/* 7 Core Key Performance Indicators (KPI Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3">
        <StatCard
          title="Total Vehicles"
          value={metrics.totalVehicles}
          subtitle="Registered Fleet"
          icon={Truck}
          badgeText="Active Fleet"
          iconColor="text-blue-400 bg-blue-500/10 border-blue-500/20"
        />
        <StatCard
          title="Active Vehicles"
          value={metrics.activeVehicles}
          subtitle="Currently Dispatched"
          icon={Activity}
          trend={{ value: '75% Active', isPositive: true }}
          iconColor="text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
        />
        <StatCard
          title="Total Deliveries"
          value={metrics.totalDeliveries}
          subtitle="Completed Stops"
          icon={MapPin}
          trend={{ value: '+12% vs last week', isPositive: true }}
          iconColor="text-indigo-400 bg-indigo-500/10 border-indigo-500/20"
        />
        <StatCard
          title="Total Distance"
          value={`${metrics.totalDistanceKm.toLocaleString()} km`}
          subtitle="Road Network Distance"
          icon={Layers}
          trend={{ value: '-24% fuel cost', isPositive: true }}
          iconColor="text-cyan-400 bg-cyan-500/10 border-cyan-500/20"
        />
        <StatCard
          title="Trans. Cost"
          value={`$${metrics.estimatedCost.toLocaleString()}`}
          subtitle="Est. Fleet Expenses"
          icon={DollarSign}
          badgeText="Est. Today"
          iconColor="text-amber-400 bg-amber-500/10 border-amber-500/20"
        />
        <StatCard
          title="Fleet Utilization"
          value={`${metrics.fleetUtilizationPct}%`}
          subtitle="Avg Capacity Used"
          icon={BarChart3}
          trend={{ value: 'Optimal', isPositive: true }}
          iconColor="text-purple-400 bg-purple-500/10 border-purple-500/20"
        />
        <StatCard
          title="On-Time Rate"
          value={`${metrics.onTimeDeliveryRatePct}%`}
          subtitle="ETA Accuracy"
          icon={Clock}
          trend={{ value: '+1.4% SLA', isPositive: true }}
          iconColor="text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
        />
      </div>

      {/* Analytics Chart Section */}
      <DeliveryAnalyticsChart />

      {/* Grid Layout: Recent Optimizations & Fleet Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Optimizations (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <span>Recent Optimization Runs</span>
                <span className="text-xs font-normal text-slate-400">({mockSessions.length} sessions)</span>
              </h2>
              <p className="text-xs text-slate-400">Automated CVRP solver outputs and delivery assignments</p>
            </div>
            <button
              onClick={() => navigate('/history')}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 hover:underline"
            >
              <span>View History</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase font-mono border-b border-slate-800">
                <tr>
                  <th className="p-3">Optimization ID</th>
                  <th className="p-3">Date / Time</th>
                  <th className="p-3 text-center">Vehicles</th>
                  <th className="p-3 text-center">Deliveries</th>
                  <th className="p-3 text-right">Total Cost</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                {mockSessions.map((session) => (
                  <tr key={session.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3 font-mono font-semibold text-blue-400">
                      {session.id}
                    </td>
                    <td className="p-3 text-slate-400 text-[11px] whitespace-nowrap">
                      {session.date}
                    </td>
                    <td className="p-3 text-center font-mono font-medium">
                      {session.vehiclesUsed}
                    </td>
                    <td className="p-3 text-center font-mono font-medium text-slate-200">
                      {session.deliveryCount}
                    </td>
                    <td className="p-3 text-right font-mono font-semibold text-emerald-400">
                      ${session.totalCost.toFixed(2)}
                    </td>
                    <td className="p-3 text-center">
                      <Badge status={session.status} />
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => navigate('/results')}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md font-medium text-[11px] transition-colors border border-slate-700"
                      >
                        View Results
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Fleet Overview (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <span>Fleet Live Status</span>
                <span className="text-xs font-normal text-slate-400">({mockFleetVehicles.length} units)</span>
              </h2>
              <p className="text-xs text-slate-400">Active truck load capacities & deployment status</p>
            </div>
            <button
              onClick={() => navigate('/configure')}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold hover:underline"
            >
              Configure Fleet
            </button>
          </div>

          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            {mockFleetVehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="bg-slate-950 border border-slate-800/80 p-3.5 rounded-xl space-y-2 hover:border-slate-700 transition-all"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-200">{vehicle.vehicle_id}</span>
                    <span className="text-[11px] text-slate-400">({vehicle.vehicle_type})</span>
                  </div>
                  <Badge status={vehicle.status} />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Capacity Utilization</span>
                    <span className="font-mono font-semibold text-slate-200">
                      {vehicle.utilization_pct}% ({Math.round((vehicle.capacity * vehicle.utilization_pct) / 100)}/{vehicle.capacity} units)
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        vehicle.utilization_pct > 90
                          ? 'bg-amber-500'
                          : vehicle.utilization_pct > 0
                          ? 'bg-blue-500'
                          : 'bg-slate-700'
                      }`}
                      style={{ width: `${vehicle.utilization_pct}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                  <span>Driver: <strong className="text-slate-400 font-normal">{vehicle.driver_name}</strong></span>
                  <span>Assigned: <strong className="text-slate-400 font-normal">{vehicle.assigned_deliveries} stops</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
