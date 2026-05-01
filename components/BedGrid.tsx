"use client";

import { Bed } from "@/lib/types";
import { BedCard } from "./BedCard";

interface BedGridProps {
  beds: Bed[];
  onBedClick: (bed: Bed) => void;
}

export function BedGrid({ beds, onBedClick }: BedGridProps) {
  return (
    <div
      id="bed-grid"
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4"
    >
      {beds.map((bed) => (
        <BedCard key={bed.id} bed={bed} onClick={onBedClick} />
      ))}
    </div>
  );
}
