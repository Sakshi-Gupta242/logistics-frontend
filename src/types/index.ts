export interface Delivery {
  id: string;
  delivery_id: string;
  address: string;
  demand: number;
  lat?: number;
  lng?: number;
  status?: 'pending' | 'geocoded' | 'error';
  errorMessage?: string;
}

export interface VehicleType {
  id: string;
  name: string;
  capacity: number;
  count: number;
  color: string;
  cost_per_km?: number;
}

export interface FleetVehicle {
  id: string;
  vehicle_id: string;
  vehicle_type: string;
  capacity: number;
  status: 'In Transit' | 'Available' | 'Maintenance' | 'Loading';
  utilization_pct: number;
  assigned_deliveries: number;
  driver_name: string;
}

export interface FleetConfig {
  vehicles: VehicleType[];
}

export interface DepotConfig {
  address: string;
  lat: number;
  lng: number;
}

export interface RouteStop {
  stop_number: number;
  delivery_id: string;
  address: string;
  demand: number;
  lat: number;
  lng: number;
  estimated_arrival?: string;
  cumulative_distance_km?: number;
}

export interface VehicleRoute {
  vehicle_id: string;
  vehicle_type: string;
  color: string;
  capacity: number;
  used_capacity: number;
  utilization_pct: number;
  total_distance_km: number;
  total_duration_minutes: number;
  stops: RouteStop[];
  path_coordinates: [number, number][];
}

export interface OptimizationSummary {
  total_distance_km: number;
  total_duration: string;
  vehicles_used: number;
  total_vehicles: number;
  avg_utilization_pct: number;
  unserved_count: number;
  total_deliveries: number;
  estimated_cost: number;
}

export interface OptimizationResult {
  job_id: string;
  status: 'COMPLETED' | 'FAILED' | 'IN_PROGRESS';
  created_at: string;
  depot: DepotConfig;
  summary: OptimizationSummary;
  routes: VehicleRoute[];
  unassigned_deliveries: Delivery[];
}

export interface OptimizationSession {
  id: string;
  name: string;
  date: string;
  deliveryCount: number;
  vehiclesUsed: number;
  totalDistanceKm: number;
  totalCost: number;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'FAILED';
}

export interface AnalyticsTrendPoint {
  day: string;
  deliveryVolume: number;
  transportationCost: number;
  vehiclesActive: number;
}

export interface DashboardMetrics {
  totalVehicles: number;
  activeVehicles: number;
  totalDeliveries: number;
  totalDistanceKm: number;
  estimatedCost: number;
  fleetUtilizationPct: number;
  onTimeDeliveryRatePct: number;
}

export type OptimizationObjective = 'distance' | 'cost' | 'utilization';

export interface SolverSettings {
  timeLimitSeconds: number;
  maxRouteDurationMinutes: number;
  allowUnusedVehicles: boolean;
}

export interface OptimizationJobConfig {
  objective: OptimizationObjective;
  settings: SolverSettings;
  jobId: string;
}
