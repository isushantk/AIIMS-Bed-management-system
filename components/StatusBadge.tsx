"use client";

import { BedStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: BedStatus;
  className?: string;
}

const statusConfig = {
  available: {
    label: "Available",
    className:
      "bg-emerald-100 text-emerald-800 border border-emerald-200 ring-1 ring-emerald-300/40",
    dotColor: "bg-emerald-500",
  },
  occupied: {
    label: "Occupied",
    className:
      "bg-rose-100 text-rose-800 border border-rose-200 ring-1 ring-rose-300/40",
    dotColor: "bg-rose-500",
  },
  cleaning: {
    label: "Cleaning",
    className:
      "bg-amber-100 text-amber-800 border border-amber-200 ring-1 ring-amber-300/40",
    dotColor: "bg-amber-500",
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold",
        config.className,
        className
      )}
    >
      <span
        className={cn(
          "w-1.5 h-1.5 rounded-full",
          config.dotColor,
          status === "occupied" && "animate-pulse"
        )}
      />
      {config.label}
    </span>
  );
}
