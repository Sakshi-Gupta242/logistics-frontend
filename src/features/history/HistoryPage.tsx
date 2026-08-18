import React from 'react';
import { useNavigate } from 'react-router-dom';
import { History, Calendar, ArrowRight, CheckCircle2 } from 'lucide-react';
import { mockSessions } from '../../mock/mockData';

export const HistoryPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider">
          Optimization History
        </div>
        <h1 className="text-2xl font-bold text-white">Saved Sessions Archive</h1>
        <p className="text-slate-400 text-sm">
          Review, analyze, or export past route optimization runs.
        </p>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-semibold text-white">Past Runs ({mockSessions.length})</h2>
          </div>
        </div>

        <div className="divide-y divide-slate-800">
          {mockSessions.map((session) => (
            <div key={session.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-800/40 px-4 rounded-xl transition-colors">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-slate-200">{session.name}</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    {session.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {session.date}
                  </span>
                  <span>ID: {session.id}</span>
                </div>
              </div>

              <div className="flex items-center gap-6 text-xs text-slate-300">
                <div className="text-right">
                  <span className="block text-[11px] text-slate-500">Deliveries</span>
                  <span className="font-semibold">{session.deliveryCount} stops</span>
                </div>
                <div className="text-right">
                  <span className="block text-[11px] text-slate-500">Vehicles</span>
                  <span className="font-semibold">{session.vehiclesUsed} used</span>
                </div>
                <div className="text-right">
                  <span className="block text-[11px] text-slate-500">Distance</span>
                  <span className="font-semibold text-blue-400">{session.totalDistanceKm} km</span>
                </div>
                <button
                  onClick={() => navigate('/results')}
                  className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-all shadow-md shadow-blue-500/20"
                >
                  <span>Open</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
