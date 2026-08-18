import { create } from 'zustand';
import { Delivery, DepotConfig, FleetConfig, OptimizationResult, OptimizationObjective, SolverSettings } from '../types';
import { mockDeliveries, mockDepot, mockVehicleTypes, mockOptimizationResult } from '../mock/mockData';

interface OptimizationState {
  currentStep: number; // 1: Upload, 2: Configure, 3: Optimize, 4: Results
  deliveries: Delivery[];
  depot: DepotConfig;
  fleet: FleetConfig;
  objective: OptimizationObjective;
  solverSettings: SolverSettings;
  activeJobId: string | null;
  optimizationProgress: number;
  optimizationResult: OptimizationResult | null;
  
  // Actions
  setStep: (step: number) => void;
  setDeliveries: (deliveries: Delivery[]) => void;
  setDepot: (depot: DepotConfig) => void;
  setFleet: (fleet: FleetConfig) => void;
  setObjective: (objective: OptimizationObjective) => void;
  setSolverSettings: (settings: SolverSettings) => void;
  setActiveJobId: (jobId: string | null) => void;
  setOptimizationProgress: (progress: number) => void;
  setOptimizationResult: (result: OptimizationResult | null) => void;
  resetFlow: () => void;
}

export const useOptimizationStore = create<OptimizationState>((set) => ({
  currentStep: 1,
  deliveries: mockDeliveries,
  depot: mockDepot,
  fleet: { vehicles: mockVehicleTypes },
  objective: 'distance',
  solverSettings: {
    timeLimitSeconds: 30,
    maxRouteDurationMinutes: 480,
    allowUnusedVehicles: true,
  },
  activeJobId: null,
  optimizationProgress: 0,
  optimizationResult: mockOptimizationResult,

  setStep: (step) => set({ currentStep: step }),
  setDeliveries: (deliveries) => set({ deliveries }),
  setDepot: (depot) => set({ depot }),
  setFleet: (fleet) => set({ fleet }),
  setObjective: (objective) => set({ objective }),
  setSolverSettings: (solverSettings) => set({ solverSettings }),
  setActiveJobId: (jobId) => set({ activeJobId: jobId }),
  setOptimizationProgress: (progress) => set({ optimizationProgress: progress }),
  setOptimizationResult: (result) => set({ optimizationResult: result }),

  resetFlow: () => set({
    currentStep: 1,
    deliveries: mockDeliveries,
    depot: mockDepot,
    fleet: { vehicles: mockVehicleTypes },
    objective: 'distance',
    solverSettings: {
      timeLimitSeconds: 30,
      maxRouteDurationMinutes: 480,
      allowUnusedVehicles: true,
    },
    activeJobId: null,
    optimizationProgress: 0,
    optimizationResult: null,
  }),
}));

