import { Delivery, DepotConfig, FleetConfig, OptimizationResult, OptimizationSession } from '../types';
import { mockDeliveries, mockOptimizationResult, mockSessions } from '../mock/mockData';

// API Client Layer
// Easy to switch from mock mode to real FastAPI REST endpoints when backend is live

const USE_MOCK_DATA = true;
const BASE_URL = 'http://localhost:8000/api/v1';

export const apiService = {
  // Validate and parse CSV upload
  async uploadCsv(_file: File): Promise<{ success: boolean; deliveries: Delivery[]; errors: string[] }> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network latency
      return {
        success: true,
        deliveries: mockDeliveries,
        errors: [],
      };
    }
    const formData = new FormData();
    formData.append('file', _file);
    const res = await fetch(`${BASE_URL}/upload`, { method: 'POST', body: formData });
    return res.json();
  },

  // Save Depot & Fleet configuration
  async saveConfiguration(_depot: DepotConfig, _fleet: FleetConfig): Promise<{ success: boolean }> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 400));
      return { success: true };
    }
    const res = await fetch(`${BASE_URL}/configure`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ depot: _depot, fleet: _fleet }),
    });
    return res.json();
  },

  // Trigger optimization job
  async startOptimization(_data: {
    deliveries: Delivery[];
    depot: DepotConfig;
    fleet: FleetConfig;
    objective?: string;
    settings?: Record<string, any>;
  }): Promise<{ job_id: string }> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { job_id: `job-mock-${Math.floor(10000 + Math.random() * 90000)}` };
    }
    const res = await fetch(`${BASE_URL}/optimize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(_data),
    });
    return res.json();
  },

  // Poll optimization status
  async checkOptimizationStatus(_jobId: string): Promise<{ status: string; progress: number; result?: OptimizationResult }> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 600));
      return {
        status: 'COMPLETED',
        progress: 100,
        result: mockOptimizationResult,
      };
    }
    const res = await fetch(`${BASE_URL}/optimize/${_jobId}/status`);
    return res.json();
  },

  // Fetch session history
  async getSessions(): Promise<OptimizationSession[]> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockSessions;
    }
    const res = await fetch(`${BASE_URL}/sessions`);
    return res.json();
  },
};
