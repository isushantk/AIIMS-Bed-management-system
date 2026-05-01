"use client";

import { useState, useEffect } from "react";
import { Bed, CheckInFormData, AddTreatmentFormData, Treatment, SchedulePatientFormData } from "@/lib/types";
import { initialBeds } from "@/lib/data";
import { supabase } from "@/lib/supabaseClient";
import { Navbar } from "@/components/Navbar";
import { StatsBar } from "@/components/StatsBar";
import { BedGrid } from "@/components/BedGrid";
import { QuickViewModal } from "@/components/QuickViewModal";
import { LoginScreen } from "@/components/LoginScreen";

export default function Dashboard() {
  const [beds, setBeds] = useState<Bed[]>(initialBeds);
  const [selectedBedId, setSelectedBedId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsMounted(true);
    
    // Check auth
    if (localStorage.getItem("aiims-auth-token")) {
      setIsAuthenticated(true);
    }

    const fetchBeds = async () => {
      try {
        const { data, error } = await supabase
          .from("dashboard_state")
          .select("data")
          .eq("id", 1)
          .single();
        
        if (data && data.data) {
          setBeds(data.data);
        } else if (!error || error.code === 'PGRST116') {
          // If no row exists, we insert the initial beds
          await supabase.from("dashboard_state").insert({ id: 1, data: initialBeds });
        }
      } catch (e) {
        console.error("Failed to load beds from Supabase", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBeds();
  }, []);

  useEffect(() => {
    if (isMounted && !isLoading) {
      supabase
        .from("dashboard_state")
        .upsert({ id: 1, data: beds })
        .then(({ error }) => {
          if (error) console.error("Failed to sync with Supabase", error);
        });
    }
  }, [beds, isMounted, isLoading]);

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

  const handleLogin = (token: string) => {
    localStorage.setItem("aiims-auth-token", token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("aiims-auth-token");
    setIsAuthenticated(false);
  };

  if (!isMounted) return null;

  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
        <Navbar onLogout={handleLogout} />
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
          <p className="text-slate-500 font-medium">Syncing with cloud database...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Navbar onLogout={handleLogout} />

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
