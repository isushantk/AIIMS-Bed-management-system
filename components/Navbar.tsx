"use client";

import { Hospital, Clock, Activity } from "lucide-react";

export function Navbar() {
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-IN", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const timeStr = now.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/90 backdrop-blur-sm shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 shadow-md">
              <Hospital className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-800 leading-tight">
                AIIMS Rishikesh
              </h1>
              <p className="text-xs text-slate-500 leading-tight">
                Bed Management System
              </p>
            </div>
          </div>

          {/* Status Indicator */}
          <div className="hidden sm:flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
              <Activity className="w-3.5 h-3.5 animate-pulse" />
              <span className="font-medium">Live</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <Clock className="w-3.5 h-3.5" />
              <span>
                {dateStr} · {timeStr}
              </span>
            </div>
          </div>

          {/* Mobile date */}
          <div className="sm:hidden flex items-center gap-1.5 text-xs text-slate-500">
            <Clock className="w-3.5 h-3.5" />
            <span>{timeStr}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
