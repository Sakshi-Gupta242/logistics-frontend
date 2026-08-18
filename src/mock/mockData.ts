import {
  Delivery,
  DepotConfig,
  VehicleType,
  OptimizationResult,
  OptimizationSession,
  DashboardMetrics,
  FleetVehicle,
  AnalyticsTrendPoint,
} from '../types';

export const mockDashboardMetrics: DashboardMetrics = {
  totalVehicles: 24,
  activeVehicles: 18,
  totalDeliveries: 420,
  totalDistanceKm: 1845.2,
  estimatedCost: 3260.50,
  fleetUtilizationPct: 86.4,
  onTimeDeliveryRatePct: 98.2,
};

export const mockFleetVehicles: FleetVehicle[] = [
  { id: 'fv-1', vehicle_id: 'TRK-101', vehicle_type: 'Heavy Truck (20T)', capacity: 200, status: 'In Transit', utilization_pct: 92, assigned_deliveries: 14, driver_name: 'Marcus Vance' },
  { id: 'fv-2', vehicle_id: 'VAN-204', vehicle_type: 'Delivery Van (3.5T)', capacity: 60, status: 'In Transit', utilization_pct: 88, assigned_deliveries: 22, driver_name: 'Elena Rostova' },
  { id: 'fv-3', vehicle_id: 'VAN-208', vehicle_type: 'Delivery Van (3.5T)', capacity: 60, status: 'Available', utilization_pct: 0, assigned_deliveries: 0, driver_name: 'David Chen' },
  { id: 'fv-4', vehicle_id: 'TRK-105', vehicle_type: 'Medium Truck (10T)', capacity: 120, status: 'In Transit', utilization_pct: 85, assigned_deliveries: 18, driver_name: 'Sarah Jenkins' },
  { id: 'fv-5', vehicle_id: 'EV-301', vehicle_type: 'Electric Courier Van', capacity: 45, status: 'Loading', utilization_pct: 95, assigned_deliveries: 15, driver_name: 'Alex Rivera' },
  { id: 'fv-6', vehicle_id: 'TRK-109', vehicle_type: 'Heavy Truck (20T)', capacity: 200, status: 'Maintenance', utilization_pct: 0, assigned_deliveries: 0, driver_name: 'Unassigned' },
];

export const mockAnalyticsData: AnalyticsTrendPoint[] = [
  { day: 'Mon', deliveryVolume: 52, transportationCost: 480, vehiclesActive: 14 },
  { day: 'Tue', deliveryVolume: 68, transportationCost: 590, vehiclesActive: 16 },
  { day: 'Wed', deliveryVolume: 75, transportationCost: 640, vehiclesActive: 18 },
  { day: 'Thu', deliveryVolume: 62, transportationCost: 530, vehiclesActive: 15 },
  { day: 'Fri', deliveryVolume: 84, transportationCost: 720, vehiclesActive: 20 },
  { day: 'Sat', deliveryVolume: 45, transportationCost: 410, vehiclesActive: 12 },
  { day: 'Sun', deliveryVolume: 34, transportationCost: 320, vehiclesActive: 8 },
];

export const mockSessions: OptimizationSession[] = [
  { id: 'OPT-9843', name: 'Metro Chicago Morning Dispatch', date: '2026-08-18 09:30 AM', deliveryCount: 42, vehiclesUsed: 6, totalDistanceKm: 184.2, totalCost: 425.80, status: 'COMPLETED' },
  { id: 'OPT-9842', name: 'North Suburbs Express Route', date: '2026-08-18 08:15 AM', deliveryCount: 28, vehiclesUsed: 4, totalDistanceKm: 142.0, totalCost: 310.50, status: 'COMPLETED' },
  { id: 'OPT-9841', name: 'Industrial Hub Heavy Batch', date: '2026-08-17 04:45 PM', deliveryCount: 65, vehiclesUsed: 8, totalDistanceKm: 312.8, totalCost: 780.00, status: 'COMPLETED' },
  { id: 'OPT-9840', name: 'South District Evening Priority', date: '2026-08-17 02:20 PM', deliveryCount: 19, vehiclesUsed: 3, totalDistanceKm: 98.4, totalCost: 215.30, status: 'COMPLETED' },
  { id: 'OPT-9839', name: 'Midwest Regional Cluster', date: '2026-08-16 11:00 AM', deliveryCount: 54, vehiclesUsed: 7, totalDistanceKm: 285.6, totalCost: 640.20, status: 'COMPLETED' },
];

export const mockDeliveries: Delivery[] = [
  { id: '1', delivery_id: 'DEL-101', address: '100 N State St, Chicago, IL 60602', demand: 15, lat: 41.8837, lng: -87.6281, status: 'geocoded' },
  { id: '2', delivery_id: 'DEL-102', address: '800 N Michigan Ave, Chicago, IL 60611', demand: 25, lat: 41.8970, lng: -87.6244, status: 'geocoded' },
  { id: '3', delivery_id: 'DEL-103', address: '233 S Wacker Dr, Chicago, IL 60606', demand: 10, lat: 41.8789, lng: -87.6359, status: 'geocoded' },
  { id: '4', delivery_id: 'DEL-104', address: '1410 S Museum Campus Dr, Chicago, IL 60605', demand: 30, lat: 41.8663, lng: -87.6170, status: 'geocoded' },
  { id: '5', delivery_id: 'DEL-105', address: '1000 W Fulton Market, Chicago, IL 60607', demand: 20, lat: 41.8867, lng: -87.6528, status: 'geocoded' },
  { id: '6', delivery_id: 'DEL-106', address: '1601 N Clark St, Chicago, IL 60614', demand: 18, lat: 41.9112, lng: -87.6318, status: 'geocoded' },
  { id: '7', delivery_id: 'DEL-107', address: '3333 S Iron St, Chicago, IL 60608', demand: 40, lat: 41.8335, lng: -87.6534, status: 'geocoded' },
  { id: '8', delivery_id: 'DEL-108', address: '2001 N Clark St, Chicago, IL 60614', demand: 12, lat: 41.9182, lng: -87.6366, status: 'geocoded' },
];

export const mockDepot: DepotConfig = {
  address: 'Central Logistics Hub, 500 W Madison St, Chicago, IL 60661',
  lat: 41.8818,
  lng: -87.6405,
};

export const mockVehicleTypes: VehicleType[] = [
  { id: 'v1', name: 'Delivery Van', capacity: 60, count: 3, color: '#3B82F6' },
  { id: 'v2', name: 'Medium Freight Truck', capacity: 150, count: 2, color: '#10B981' },
];

export const mockOptimizationResult: OptimizationResult = {
  job_id: 'OPT-9843',
  status: 'COMPLETED',
  created_at: new Date().toISOString(),
  depot: mockDepot,
  summary: {
    total_distance_km: 48.6,
    total_duration: '1h 42m',
    vehicles_used: 3,
    total_vehicles: 5,
    avg_utilization_pct: 86.4,
    unserved_count: 0,
    total_deliveries: 8,
    estimated_cost: 425.80,
  },
  routes: [
    {
      vehicle_id: 'VAN-01',
      vehicle_type: 'Delivery Van',
      color: '#3B82F6',
      capacity: 60,
      used_capacity: 55,
      utilization_pct: 91.6,
      total_distance_km: 18.2,
      total_duration_minutes: 38,
      stops: [
        { stop_number: 1, delivery_id: 'DEL-101', address: '100 N State St', demand: 15, lat: 41.8837, lng: -87.6281, estimated_arrival: '09:15 AM', cumulative_distance_km: 2.1 },
        { stop_number: 2, delivery_id: 'DEL-102', address: '800 N Michigan Ave', demand: 25, lat: 41.8970, lng: -87.6244, estimated_arrival: '09:35 AM', cumulative_distance_km: 5.4 },
        { stop_number: 3, delivery_id: 'DEL-103', address: '233 S Wacker Dr', demand: 10, lat: 41.8789, lng: -87.6359, estimated_arrival: '09:55 AM', cumulative_distance_km: 9.8 },
      ],
      path_coordinates: [
        [41.8818, -87.6405],
        [41.8837, -87.6281],
        [41.8970, -87.6244],
        [41.8789, -87.6359],
        [41.8818, -87.6405],
      ],
    },
    {
      vehicle_id: 'VAN-02',
      vehicle_type: 'Delivery Van',
      color: '#10B981',
      capacity: 60,
      used_capacity: 50,
      utilization_pct: 83.3,
      total_distance_km: 14.8,
      total_duration_minutes: 32,
      stops: [
        { stop_number: 1, delivery_id: 'DEL-105', address: '1000 W Fulton Market', demand: 20, lat: 41.8867, lng: -87.6528, estimated_arrival: '09:20 AM', cumulative_distance_km: 1.8 },
        { stop_number: 2, delivery_id: 'DEL-106', address: '1601 N Clark St', demand: 18, lat: 41.9112, lng: -87.6318, estimated_arrival: '09:45 AM', cumulative_distance_km: 6.2 },
        { stop_number: 3, delivery_id: 'DEL-108', address: '2001 N Clark St', demand: 12, lat: 41.9182, lng: -87.6366, estimated_arrival: '10:05 AM', cumulative_distance_km: 8.5 },
      ],
      path_coordinates: [
        [41.8818, -87.6405],
        [41.8867, -87.6528],
        [41.9112, -87.6318],
        [41.9182, -87.6366],
        [41.8818, -87.6405],
      ],
    },
    {
      vehicle_id: 'TRUCK-01',
      vehicle_type: 'Medium Freight Truck',
      color: '#F59E0B',
      capacity: 150,
      used_capacity: 70,
      utilization_pct: 46.6,
      total_distance_km: 15.6,
      total_duration_minutes: 32,
      stops: [
        { stop_number: 1, delivery_id: 'DEL-104', address: '1410 S Museum Campus Dr', demand: 30, lat: 41.8663, lng: -87.6170, estimated_arrival: '09:25 AM', cumulative_distance_km: 3.2 },
        { stop_number: 2, delivery_id: 'DEL-107', address: '3333 S Iron St', demand: 40, lat: 41.8335, lng: -87.6534, estimated_arrival: '09:55 AM', cumulative_distance_km: 9.1 },
      ],
      path_coordinates: [
        [41.8818, -87.6405],
        [41.8663, -87.6170],
        [41.8335, -87.6534],
        [41.8818, -87.6405],
      ],
    },
  ],
  unassigned_deliveries: [],
};
