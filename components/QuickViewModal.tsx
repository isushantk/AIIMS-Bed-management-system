"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as Tabs from "@radix-ui/react-tabs";
import { Bed, CheckInFormData, AddTreatmentFormData } from "@/lib/types";
import { StatusBadge } from "./StatusBadge";
import { CheckInForm } from "./CheckInForm";
import { CheckOutDialog } from "./CheckOutDialog";
import { TreatmentList } from "./TreatmentList";
import { cn } from "@/lib/utils";
import {
  X,
  BedDouble,
  UserRound,
  Calendar,
  Stethoscope,
  Activity,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

interface QuickViewModalProps {
  bed: Bed | null;
  isOpen: boolean;
  onClose: () => void;
  onCheckIn: (bedId: string, data: CheckInFormData) => void;
  onCheckOut: (bedId: string) => void;
  onAddTreatment: (bedId: string, data: AddTreatmentFormData) => void;
  onRemoveTreatment: (bedId: string, treatmentId: string) => void;
  onMarkAvailable: (bedId: string) => void;
}

export function QuickViewModal({
  bed,
  isOpen,
  onClose,
  onCheckIn,
  onCheckOut,
  onAddTreatment,
  onRemoveTreatment,
  onMarkAvailable,
}: QuickViewModalProps) {
  const [showCheckOut, setShowCheckOut] = useState(false);
  const [activeTab, setActiveTab] = useState<"info" | "treatments">("info");

  if (!bed) return null;

  const handleCheckIn = (data: CheckInFormData) => {
    onCheckIn(bed.id, data);
    onClose();
  };

  const handleCheckOut = () => {
    onCheckOut(bed.id);
    setShowCheckOut(false);
    onClose();
  };

  const handleAddTreatment = (data: AddTreatmentFormData) => {
    onAddTreatment(bed.id, data);
  };

  const handleRemoveTreatment = (treatmentId: string) => {
    onRemoveTreatment(bed.id, treatmentId);
  };

  const handleMarkAvailable = () => {
    onMarkAvailable(bed.id);
    onClose();
  };

  const admissionDate = bed.patient?.admissionDate
    ? new Date(bed.patient.admissionDate)
    : null;
  const today = new Date();
  const daysStay = admissionDate
    ? Math.max(
        0,
        Math.floor(
          (today.getTime() - admissionDate.getTime()) / (1000 * 60 * 60 * 24)
        )
      )
    : 0;

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        {/* Overlay */}
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0" />

        {/* Modal Content */}
        <Dialog.Content
          id="quick-view-modal"
          className={cn(
            "fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2",
            "w-[95vw] max-w-2xl max-h-[90vh] overflow-hidden",
            "bg-white rounded-2xl shadow-2xl border border-slate-200",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
            "data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95",
            "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]"
          )}
        >
          {/* Header */}
          <div
            className={cn(
              "flex items-center justify-between px-6 py-4 border-b border-slate-100",
              bed.status === "occupied"
                ? "bg-gradient-to-r from-rose-50 to-white"
                : bed.status === "available"
                ? "bg-gradient-to-r from-emerald-50 to-white"
                : "bg-gradient-to-r from-amber-50 to-white"
            )}
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-xl font-bold text-base",
                  bed.status === "occupied"
                    ? "bg-rose-100 text-rose-700"
                    : bed.status === "available"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-amber-100 text-amber-700"
                )}
              >
                {bed.number}
              </div>
              <div>
                <Dialog.Title className="text-base font-bold text-slate-800">
                  Bed #{bed.number} — {bed.ward} Ward
                </Dialog.Title>
                <div className="flex items-center gap-2 mt-0.5">
                  <StatusBadge status={bed.status} />
                  {bed.patient && (
                    <span className="text-xs text-slate-500">
                      {daysStay} day stay
                    </span>
                  )}
                </div>
              </div>
            </div>
            <Dialog.Close
              id="modal-close"
              className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </Dialog.Close>
          </div>

          {/* Scrollable Body */}
          <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
            <div className="p-6">
              {/* === AVAILABLE BED === */}
              {bed.status === "available" && !showCheckOut && (
                <CheckInForm
                  bedNumber={bed.number}
                  onSubmit={handleCheckIn}
                  onCancel={onClose}
                />
              )}

              {/* === CLEANING BED === */}
              {bed.status === "cleaning" && (
                <div className="space-y-5">
                  <div className="flex flex-col items-center justify-center py-8 gap-4 text-center">
                    <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center">
                      <Sparkles className="w-8 h-8 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-base font-bold text-slate-800">
                        Bed #{bed.number} — Cleaning in Progress
                      </p>
                      <p className="text-sm text-slate-500 mt-1 max-w-sm">
                        This bed is currently being sanitized after a patient discharge.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={onClose}
                      className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                    >
                      Close
                    </button>
                    <button
                      id="mark-available-btn"
                      onClick={handleMarkAvailable}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-lg hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-sm"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Mark as Available
                    </button>
                  </div>
                </div>
              )}

              {/* === OCCUPIED BED === */}
              {bed.status === "occupied" && bed.patient && !showCheckOut && (
                <Tabs.Root
                  value={activeTab}
                  onValueChange={(v) =>
                    setActiveTab(v as "info" | "treatments")
                  }
                >
                  {/* Tab List */}
                  <Tabs.List className="flex bg-slate-100 rounded-xl p-1 mb-5 gap-1">
                    <Tabs.Trigger
                      id="tab-patient-info"
                      value="info"
                      className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all",
                        "data-[state=active]:bg-white data-[state=active]:text-slate-800 data-[state=active]:shadow-sm",
                        "data-[state=inactive]:text-slate-500 data-[state=inactive]:hover:text-slate-700"
                      )}
                    >
                      <UserRound className="w-4 h-4" />
                      Patient Info
                    </Tabs.Trigger>
                    <Tabs.Trigger
                      id="tab-treatments"
                      value="treatments"
                      className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all",
                        "data-[state=active]:bg-white data-[state=active]:text-slate-800 data-[state=active]:shadow-sm",
                        "data-[state=inactive]:text-slate-500 data-[state=inactive]:hover:text-slate-700"
                      )}
                    >
                      <Activity className="w-4 h-4" />
                      Treatments
                      {bed.patient.treatments.length > 0 && (
                        <span className="text-xs bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded-full">
                          {bed.patient.treatments.length}
                        </span>
                      )}
                    </Tabs.Trigger>
                  </Tabs.List>

                  {/* Patient Info Tab */}
                  <Tabs.Content value="info" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        {
                          label: "Full Name",
                          value: bed.patient.name,
                          icon: UserRound,
                        },
                        {
                          label: "Age",
                          value: `${bed.patient.age} years`,
                          icon: Calendar,
                        },
                        {
                          label: "Gender",
                          value: bed.patient.gender,
                          icon: UserRound,
                        },
                        {
                          label: "Admission Date",
                          value: new Date(
                            bed.patient.admissionDate
                          ).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }),
                          icon: Calendar,
                        },
                      ].map((item) => {
                        const Icon = item.icon;
                        return (
                          <div
                            key={item.label}
                            className="bg-slate-50 rounded-xl p-3 border border-slate-100"
                          >
                            <div className="flex items-center gap-1.5 mb-1">
                              <Icon className="w-3 h-3 text-slate-400" />
                              <p className="text-xs text-slate-500">{item.label}</p>
                            </div>
                            <p className="text-sm font-semibold text-slate-800">
                              {item.value}
                            </p>
                          </div>
                        );
                      })}
                    </div>

                    {bed.patient.diagnosis && (
                      <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                        <div className="flex items-center gap-1.5 mb-2">
                          <Stethoscope className="w-3.5 h-3.5 text-slate-400" />
                          <p className="text-xs font-semibold text-slate-500">
                            Primary Diagnosis
                          </p>
                        </div>
                        <p className="text-sm text-slate-800 leading-relaxed">
                          {bed.patient.diagnosis}
                        </p>
                      </div>
                    )}

                    {/* Length of stay */}
                    <div className="bg-rose-50 border border-rose-100 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-rose-600 font-medium">
                            Length of Stay
                          </p>
                          <p className="text-2xl font-bold text-rose-800 mt-0.5">
                            {daysStay}{" "}
                            <span className="text-base font-normal">
                              day{daysStay !== 1 ? "s" : ""}
                            </span>
                          </p>
                        </div>
                        <BedDouble className="w-8 h-8 text-rose-200" />
                      </div>
                    </div>

                    {/* Discharge button */}
                    <button
                      id="discharge-btn"
                      onClick={() => setShowCheckOut(true)}
                      className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-xl hover:bg-rose-100 transition-colors"
                    >
                      Discharge Patient
                    </button>
                  </Tabs.Content>

                  {/* Treatments Tab */}
                  <Tabs.Content value="treatments">
                    <TreatmentList
                      treatments={bed.patient.treatments}
                      onAddTreatment={handleAddTreatment}
                      onRemoveTreatment={handleRemoveTreatment}
                    />
                  </Tabs.Content>
                </Tabs.Root>
              )}

              {/* === CHECKOUT CONFIRMATION === */}
              {showCheckOut && bed.patient && (
                <CheckOutDialog
                  patient={bed.patient}
                  bedNumber={bed.number}
                  onConfirm={handleCheckOut}
                  onCancel={() => setShowCheckOut(false)}
                />
              )}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
