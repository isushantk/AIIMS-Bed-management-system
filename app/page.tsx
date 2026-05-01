"use client";

import { useState, useEffect } from "react";
import { Bed, CheckInFormData, AddTreatmentFormData, Treatment, SchedulePatientFormData } from "@/lib/types";
import { initialBeds } from "@/lib/data";
import { Navbar } from "@/components/Navbar";
import { StatsBar } from "@/components/StatsBar";
import { BedGrid } from "@/components/BedGrid";
import { QuickViewModal } from "@/components/QuickViewModal";

export default function Dashboard() {
  const [beds, setBeds] = useState<Bed[]>(initialBeds);
  const [selectedBedId, setSelectedBedId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem("aiims-beds-data");
    if (saved) {
      try {
        setBeds(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load saved beds data");
      }
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("aiims-beds-data", JSON.stringify(beds));
    }
  }, [beds, isMounted]);

  const selectedBed = beds.find((b) => b.id === selectedBedId) || null;

  const handleBedClick = (bed: Bed) => {
    setSelectedBedId(bed.id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedBedId(null), 200); // Wait for closing animation
  };

  const handleCheckIn = (bedId: string, data: CheckInFormData) => {
    setBeds((prev) =>
      prev.map((bed) => {
        if (bed.id !== bedId) return bed;
        return {
          ...bed,
          status: "occupied",
          patient: {
            id: `p-${Date.now()}`,
            ...data,
            treatments: [],
          },
        };
      })
    );
  };

  const handleCheckOut = (bedId: string) => {
    setBeds((prev) =>
      prev.map((bed) => {
        if (bed.id !== bedId) return bed;
        return {
          ...bed,
          status: "cleaning",
          patient: undefined,
        };
      })
    );
  };

  const handleAddTreatment = (bedId: string, data: AddTreatmentFormData) => {
    setBeds((prev) =>
      prev.map((bed) => {
        if (bed.id !== bedId || !bed.patient) return bed;
        const newTreatment: Treatment = {
          id: `t-${Date.now()}`,
          ...data,
        };
        return {
          ...bed,
          patient: {
            ...bed.patient,
            treatments: [newTreatment, ...bed.patient.treatments],
          },
        };
      })
    );
  };

  const handleRemoveTreatment = (bedId: string, treatmentId: string) => {
    setBeds((prev) =>
      prev.map((bed) => {
        if (bed.id !== bedId || !bed.patient) return bed;
        return {
          ...bed,
          patient: {
            ...bed.patient,
            treatments: bed.patient.treatments.filter((t) => t.id !== treatmentId),
          },
        };
      })
    );
  };

  const handleMarkAvailable = (bedId: string) => {
    setBeds((prev) =>
      prev.map((bed) => {
        if (bed.id !== bedId) return bed;
        return {
          ...bed,
          status: "available",
        };
      })
    );
  };

  const handleSchedulePatient = (bedId: string, data: SchedulePatientFormData) => {
    setBeds((prev) =>
      prev.map((bed) => {
        if (bed.id !== bedId) return bed;
        return {
          ...bed,
          scheduledPatient: {
            id: `sp-${Date.now()}`,
            ...data,
          },
        };
      })
    );
  };

  const handleCancelSchedule = (bedId: string) => {
    setBeds((prev) =>
      prev.map((bed) => {
        if (bed.id !== bedId) return bed;
        return {
          ...bed,
          scheduledPatient: undefined,
        };
      })
    );
  };

  const handleAdmitScheduled = (bedId: string) => {
    setBeds((prev) =>
      prev.map((bed) => {
        if (bed.id !== bedId || !bed.scheduledPatient) return bed;
        const { id, plannedDate, ...patientData } = bed.scheduledPatient;
        return {
          ...bed,
          status: "occupied",
          patient: {
            id: `p-${Date.now()}`,
            ...patientData,
            admissionDate: new Date().toISOString().split("T")[0], // today
            treatments: [],
          },
          scheduledPatient: undefined, // Clear schedule after admission
        };
      })
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
            Bed Overview
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Real-time tracking for General Ward capacity and patient status.
          </p>
        </div>

        <StatsBar beds={beds} />

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6 mt-6">
          <BedGrid beds={beds} onBedClick={handleBedClick} />
        </div>
      </main>

      <QuickViewModal
        bed={selectedBed}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onCheckIn={handleCheckIn}
        onCheckOut={handleCheckOut}
        onAddTreatment={handleAddTreatment}
        onRemoveTreatment={handleRemoveTreatment}
        onMarkAvailable={handleMarkAvailable}
        onSchedulePatient={handleSchedulePatient}
        onCancelSchedule={handleCancelSchedule}
        onAdmitScheduled={handleAdmitScheduled}
      />
    </div>
  );
}
