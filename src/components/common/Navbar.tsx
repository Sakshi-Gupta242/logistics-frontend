import React from 'react';
import { NavLink } from 'react-router-dom';
import { Truck, LayoutDashboard, UploadCloud, Sliders, PlayCircle, BarChart3, History } from 'lucide-react';

export const Navbar: React.FC = () => {
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/upload', label: '1. Upload CSV', icon: UploadCloud },
    { path: '/configure', label: '2. Configure', icon: Sliders },
    { path: '/optimize', label: '3. Optimize', icon: PlayCircle },
    { path: '/results', label: '4. Results', icon: BarChart3 },
    { path: '/history', label: 'History', icon: History },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur border-b border-slate-800 text-slate-100 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <NavLink to="/dashboard" className="flex items-center gap-3 group">
          <div className="p-2 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-lg shadow-md group-hover:shadow-blue-500/20 transition-all">
            <Truck className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">
              LogiOptima
            </span>
            <span className="block text-[10px] text-slate-400 font-medium tracking-wider uppercase">
              Multi-Vehicle VRP Platform
            </span>
          </div>
        </NavLink>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600/90 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Mode Badge */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Mock API Mode
          </span>
        </div>
      </div>
    </header>
  );
};
