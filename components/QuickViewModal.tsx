"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as Tabs from "@radix-ui/react-tabs";
import { Bed, CheckInFormData, AddTreatmentFormData, SchedulePatientFormData } from "@/lib/types";
import { StatusBadge } from "./StatusBadge";
import { CheckInForm } from "./CheckInForm";
import { ScheduleForm } from "./ScheduleForm";
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
  Clock,
  ArrowRight,
  LogOut,
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
  onSchedulePatient: (bedId: string, data: SchedulePatientFormData) => void;
  onCancelSchedule: (bedId: string) => void;
  onAdmitScheduled: (bedId: string) => void;
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
  onSchedulePatient,
  onCancelSchedule,
  onAdmitScheduled,
}: QuickViewModalProps) {
  const [showCheckOut, setShowCheckOut] = useState(false);
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [activeTab, setActiveTab] = useState<"info" | "treatments" | "schedule">("info");

  // Reset internal states when modal opens/closes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
      setTimeout(() => {
        setShowCheckOut(false);
        setShowScheduleForm(false);
        setActiveTab("info");
      }, 200);
    }
  };

  if (!bed) return null;

  const handleCheckIn = (data: CheckInFormData) => {
    onCheckIn(bed.id, data);
    onClose();
  };

  const handleCheckOut = () => {
    onCheckOut(bed.id);
    setShowCheckOut(false);
    // Don't close modal completely if we want them to see the cleaning state or schedule.
    // Let's close it so the user returns to grid.
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

  const handleScheduleSubmit = (data: SchedulePatientFormData) => {
    onSchedulePatient(bed.id, data);
    setShowScheduleForm(false);
  };

  const handleAdmitScheduledPatient = () => {
    onAdmitScheduled(bed.id);
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
    <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0" />

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
                  {bed.scheduledPatient && (
                    <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100 font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Scheduled
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
              {bed.status === "available" && !showCheckOut && !showScheduleForm && (
                <div className="space-y-6">
                  {/* If there is a scheduled patient, show option to admit them immediately */}
                  {bed.scheduledPatient && (
                    <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-indigo-800 flex items-center gap-1.5">
                          <Clock className="w-4 h-4" />
                          Scheduled Patient: {bed.scheduledPatient.name}
                        </p>
                        <p className="text-xs text-indigo-600 mt-0.5">
                          This bed is reserved for this patient.
                        </p>
                      </div>
                      <button
                        onClick={handleAdmitScheduledPatient}
                        className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition shadow-sm flex items-center gap-2"
                      >
                        <ArrowRight className="w-4 h-4" />
                        Admit Now
                      </button>
                    </div>
                  )}

                  <CheckInForm
                    bedNumber={bed.number}
                    onSubmit={handleCheckIn}
                    onCancel={() => handleOpenChange(false)}
                  />

                  {/* Option to schedule if no one is scheduled yet */}
                  {!bed.scheduledPatient && (
                    <div className="pt-4 border-t border-slate-100 flex justify-center">
                      <button
                        onClick={() => setShowScheduleForm(true)}
                        className="text-sm text-indigo-600 font-medium hover:text-indigo-800 transition"
                      >
                        Or schedule a patient for later
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Show Schedule Form Standalone */}
              {showScheduleForm && (
                <ScheduleForm
                  bedNumber={bed.number}
                  onSubmit={handleScheduleSubmit}
                  onCancel={() => setShowScheduleForm(false)}
                />
              )}

              {/* === CLEANING BED === */}
              {bed.status === "cleaning" && !showScheduleForm && (
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
                  
                  {bed.scheduledPatient ? (
                    <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 mb-4">
                      <p className="text-sm font-bold text-indigo-800 flex items-center gap-1.5 mb-1">
                        <Clock className="w-4 h-4" />
                        Next Patient: {bed.scheduledPatient.name}
                      </p>
                      <p className="text-xs text-indigo-600 mb-3">
                        Once cleaning is done, you can instantly admit the scheduled patient.
                      </p>
                      <button
                        onClick={handleAdmitScheduledPatient}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-all shadow-sm"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Finish Cleaning & Admit Patient
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowScheduleForm(true)}
                        className="flex-1 px-4 py-2.5 text-sm font-medium text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors"
                      >
                        Schedule Next Patient
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
                  )}
                </div>
              )}

              {/* === OCCUPIED BED === */}
              {bed.status === "occupied" && bed.patient && !showCheckOut && !showScheduleForm && (
                <Tabs.Root
                  value={activeTab}
                  onValueChange={(v) =>
                    setActiveTab(v as "info" | "treatments" | "schedule")
                  }
                >
                  {/* Tab List */}
                  <Tabs.List className="flex flex-wrap sm:flex-nowrap bg-slate-100 rounded-xl p-1 mb-5 gap-1">
                    <Tabs.Trigger
                      value="info"
                      className={cn(
                        "flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2 px-1.5 sm:px-2 rounded-lg text-xs sm:text-sm font-medium transition-all min-w-[30%]",
                        "data-[state=active]:bg-white data-[state=active]:text-slate-800 data-[state=active]:shadow-sm",
                        "data-[state=inactive]:text-slate-500 data-[state=inactive]:hover:text-slate-700"
                      )}
                    >
                      <UserRound className="w-4 h-4" />
                      Patient Info
                    </Tabs.Trigger>
                    <Tabs.Trigger
                      value="treatments"
                      className={cn(
                        "flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2 px-1.5 sm:px-2 rounded-lg text-xs sm:text-sm font-medium transition-all min-w-[30%]",
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
                    <Tabs.Trigger
                      value="schedule"
                      className={cn(
                        "flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2 px-1.5 sm:px-2 rounded-lg text-xs sm:text-sm font-medium transition-all min-w-[30%]",
                        "data-[state=active]:bg-white data-[state=active]:text-slate-800 data-[state=active]:shadow-sm",
                        "data-[state=inactive]:text-slate-500 data-[state=inactive]:hover:text-slate-700"
                      )}
                    >
                      <Clock className="w-4 h-4" />
                      Queue
                      {bed.scheduledPatient && (
                        <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
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
                    <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 flex items-center justify-between">
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

                    <button
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

                  {/* Schedule Tab */}
                  <Tabs.Content value="schedule">
                    {bed.scheduledPatient ? (
                      <div className="space-y-4">
                        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5">
                          <div className="flex items-center gap-2 mb-4">
                            <Clock className="w-5 h-5 text-indigo-600" />
                            <h3 className="text-base font-bold text-indigo-900">Patient in Queue</h3>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-4">
                            <div>
                              <p className="text-xs text-indigo-500 mb-0.5">Name</p>
                              <p className="text-sm font-semibold text-indigo-900">{bed.scheduledPatient.name}</p>
                            </div>
                            <div>
                              <p className="text-xs text-indigo-500 mb-0.5">Age/Gender</p>
                              <p className="text-sm font-semibold text-indigo-900">{bed.scheduledPatient.age}y · {bed.scheduledPatient.gender}</p>
                            </div>
                            <div className="col-span-2">
                              <p className="text-xs text-indigo-500 mb-0.5">Planned Date</p>
                              <p className="text-sm font-semibold text-indigo-900">
                                {new Date(bed.scheduledPatient.plannedDate).toLocaleDateString("en-IN", {
                                  day: "numeric", month: "long", year: "numeric"
                                })}
                              </p>
                            </div>
                            {bed.scheduledPatient.diagnosis && (
                              <div className="col-span-2">
                                <p className="text-xs text-indigo-500 mb-0.5">Diagnosis</p>
                                <p className="text-sm font-medium text-indigo-900">{bed.scheduledPatient.diagnosis}</p>
                              </div>
                            )}
                          </div>
                          
                          <button
                            onClick={() => onCancelSchedule(bed.id)}
                            className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-rose-600 bg-white border border-rose-200 rounded-lg hover:bg-rose-50 transition-colors"
                          >
                            <X className="w-4 h-4" />
                            Cancel Schedule
                          </button>
                        </div>
                        <p className="text-xs text-slate-500 text-center px-4">
                          This patient will be ready to admit once the current patient is discharged and the bed is cleaned.
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-10 text-center">
                        <Clock className="w-12 h-12 text-slate-200 mb-3" />
                        <h3 className="text-sm font-semibold text-slate-700 mb-1">No patient scheduled</h3>
                        <p className="text-xs text-slate-500 max-w-[250px] mb-6">
                          Queue a patient for this bed so they can be admitted right after the current patient is discharged.
                        </p>
                        <button
                          onClick={() => setShowScheduleForm(true)}
                          className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition shadow-sm"
                        >
                          Schedule Next Patient
                        </button>
                      </div>
                    )}
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
