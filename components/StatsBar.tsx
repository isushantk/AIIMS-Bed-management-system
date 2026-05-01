"use client";

import { Bed } from "@/lib/types";
import { BedDouble, Users, CheckCircle2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsBarProps {
  beds: Bed[];
}

export function StatsBar({ beds }: StatsBarProps) {
  const total = beds.length;
  const occupied = beds.filter((b) => b.status === "occupied").length;
  const available = beds.filter((b) => b.status === "available").length;
  const cleaning = beds.filter((b) => b.status === "cleaning").length;
  const occupancyRate = Math.round((occupied / total) * 100);

  const stats = [
    {
      label: "Total Beds",
      value: total,
      icon: BedDouble,
      colorClass: "text-slate-700",
      bgClass: "bg-slate-100 border-slate-200",
      iconBg: "bg-slate-200",
    },
    {
      label: "Occupied",
      value: occupied,
      icon: Users,
      colorClass: "text-rose-700",
      bgClass: "bg-rose-50 border-rose-200",
      iconBg: "bg-rose-100",
    },
    {
      label: "Available",
      value: available,
      icon: CheckCircle2,
      colorClass: "text-emerald-700",
      bgClass: "bg-emerald-50 border-emerald-200",
      iconBg: "bg-emerald-100",
    },
    {
      label: "Cleaning",
      value: cleaning,
      icon: Sparkles,
      colorClass: "text-amber-700",
      bgClass: "bg-amber-50 border-amber-200",
      iconBg: "bg-amber-100",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className={cn(
              "flex items-center gap-3 p-4 rounded-xl border",
              stat.bgClass
            )}
          >
            <div className={cn("p-2 rounded-lg", stat.iconBg)}>
              <Icon className={cn("w-4 h-4", stat.colorClass)} />
            </div>
            <div>
              <p className={cn("text-2xl font-bold leading-none", stat.colorClass)}>
                {stat.value}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
            </div>
          </div>
        );
      })}

      {/* Occupancy Rate Bar */}
      <div className="col-span-2 sm:col-span-4 bg-white border border-slate-200 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-600">
            Occupancy Rate
          </span>
          <span className="text-xs font-bold text-slate-800">
            {occupancyRate}%
          </span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2.5">
          <div
            className="bg-gradient-to-r from-rose-400 to-rose-600 h-2.5 rounded-full transition-all duration-700"
            style={{ width: `${occupancyRate}%` }}
          />
        </div>
        <p className="text-xs text-slate-400 mt-1.5">
          {occupied} of {total} beds currently in use · General Ward
        </p>
      </div>
    </div>
  );
}
