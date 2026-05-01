"use client";

import { Bed } from "@/lib/types";
import { StatusBadge } from "./StatusBadge";
import { cn } from "@/lib/utils";
import {
  BedDouble,
  UserRound,
  Calendar,
  Stethoscope,
  Sparkles,
  Clock,
} from "lucide-react";

interface BedCardProps {
  bed: Bed;
  onClick: (bed: Bed) => void;
}

const borderColors = {
  available: "border-l-emerald-500",
  occupied: "border-l-rose-500",
  cleaning: "border-l-amber-500",
};

const hoverColors = {
  available: "hover:border-emerald-300 hover:shadow-emerald-100",
  occupied: "hover:border-rose-300 hover:shadow-rose-100",
  cleaning: "hover:border-amber-300 hover:shadow-amber-100",
};

const bgColors = {
  available: "bg-white",
  occupied: "bg-white",
  cleaning: "bg-amber-50/50",
};

export function BedCard({ bed, onClick }: BedCardProps) {
  return (
    <button
      id={`bed-card-${bed.number}`}
      onClick={() => onClick(bed)}
      className={cn(
        "relative w-full text-left rounded-xl border-2 border-l-[5px] p-4 min-h-[130px]",
        "transition-all duration-200 cursor-pointer group",
        "focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2",
        "hover:shadow-lg hover:-translate-y-0.5",
        borderColors[bed.status],
        hoverColors[bed.status],
        bgColors[bed.status],
        bed.status === "available"
          ? "border-slate-200"
          : bed.status === "occupied"
          ? "border-slate-200"
          : "border-amber-200"
      )}
      aria-label={`Bed ${bed.number} - ${bed.status}${bed.patient ? `, Patient: ${bed.patient.name}` : ""}`}
    >
      {/* Bed Number */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold",
              bed.status === "occupied"
                ? "bg-rose-100 text-rose-700"
                : bed.status === "available"
                ? "bg-emerald-100 text-emerald-700"
                : "bg-amber-100 text-amber-700"
            )}
          >
            {bed.number}
          </div>
          <span className="text-xs text-slate-400 font-medium">
            {bed.ward}
          </span>
        </div>
        <StatusBadge status={bed.status} />
      </div>

      {/* Content by status */}
      {bed.status === "occupied" && bed.patient ? (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5">
            <UserRound className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-sm font-semibold text-slate-800 truncate">
              {bed.patient.name}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Stethoscope className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-xs text-slate-500 truncate">
              {bed.patient.age}y · {bed.patient.gender}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-xs text-slate-400">
              Admitted{" "}
              {new Date(bed.patient.admissionDate).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
              })}
            </span>
          </div>
          {bed.patient.treatments.length > 0 && (
            <div className="pt-1 border-t border-slate-100">
              <span className="text-xs text-rose-600 font-medium">
                {bed.patient.treatments.length} active treatment
                {bed.patient.treatments.length !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>
      ) : bed.status === "cleaning" ? (
        <div className="flex flex-col items-center justify-center py-3 gap-2">
          <Sparkles className="w-6 h-6 text-amber-400" />
          <span className="text-xs text-amber-700 font-medium text-center">
            Being sanitized
          </span>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-3 gap-2">
          <BedDouble className="w-6 h-6 text-emerald-400" />
          <span className="text-xs text-emerald-700 font-medium text-center">
            Ready for patient
          </span>
        </div>
      )}

      {/* Scheduled Patient Indicator */}
      {bed.scheduledPatient && (
        <div className="mt-3 pt-2 border-t border-slate-100/60 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
          <span className="text-xs font-medium text-indigo-700 truncate">
            Next: {bed.scheduledPatient.name}
          </span>
        </div>
      )}

      {/* Click Hint */}
      <div className="absolute bottom-2.5 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-[10px] text-slate-400">Click to manage →</span>
      </div>
    </button>
  );
}
