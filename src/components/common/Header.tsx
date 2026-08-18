import React from 'react';
import { Menu, Search, Bell, ShieldCheck, User } from 'lucide-react';

interface HeaderProps {
  onMobileMenuToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMobileMenuToggle }) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur border-b border-slate-800 px-4 lg:px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* Mobile Sidebar Hamburger Toggle */}
        <button
          onClick={onMobileMenuToggle}
          className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          aria-label="Toggle navigation drawer"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Header Title / Search bar */}
        <div>
          <h1 className="text-lg lg:text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Dynamic Logistics Optimization</span>
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <ShieldCheck className="w-3 h-3" /> Enterprise VRP
            </span>
          </h1>
          <p className="text-xs text-slate-400 hidden md:block">
            Multi-Vehicle Fleet Routing & Capacity Dispatch Engine
          </p>
        </div>
      </div>

      {/* Header Right Actions */}
      <div className="flex items-center gap-3">
        {/* Quick Search */}
        <div className="relative hidden md:block">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search routes, vehicles, orders..."
            className="bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500 w-60"
          />
        </div>

        {/* Notifications Icon */}
        <button className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 relative transition-colors">
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-blue-500 absolute top-1.5 right-1.5"></span>
        </button>

        {/* User Profile Badge */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
            <User className="w-4 h-4" />
          </div>
          <div className="hidden sm:block text-left">
            <span className="block text-xs font-semibold text-slate-200">Dispatcher Ops</span>
            <span className="block text-[10px] text-slate-500">Central Hub</span>
          </div>
        </div>
      </div>
    </header>
  );
};
