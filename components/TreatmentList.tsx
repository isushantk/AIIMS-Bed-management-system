"use client";

import { useState } from "react";
import { Treatment, AddTreatmentFormData, TreatmentType } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  Pill,
  Droplets,
  Eye,
  Dumbbell,
  Scissors,
  Bandage,
  Wind,
  Plus,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface TreatmentListProps {
  treatments: Treatment[];
  onAddTreatment: (data: AddTreatmentFormData) => void;
  onRemoveTreatment?: (treatmentId: string) => void;
}

const treatmentTypes: TreatmentType[] = [
  "Medication",
  "IV Drip",
  "Observation",
  "Physiotherapy",
  "Surgery Prep",
  "Wound Care",
  "Oxygen Therapy",
];

const treatmentIcons: Record<TreatmentType, React.ComponentType<{ className?: string }>> = {
  Medication: Pill,
  "IV Drip": Droplets,
  Observation: Eye,
  Physiotherapy: Dumbbell,
  "Surgery Prep": Scissors,
  "Wound Care": Bandage,
  "Oxygen Therapy": Wind,
};

const treatmentColors: Record<TreatmentType, string> = {
  Medication: "bg-violet-100 text-violet-700 border-violet-200",
  "IV Drip": "bg-blue-100 text-blue-700 border-blue-200",
  Observation: "bg-cyan-100 text-cyan-700 border-cyan-200",
  Physiotherapy: "bg-orange-100 text-orange-700 border-orange-200",
  "Surgery Prep": "bg-red-100 text-red-700 border-red-200",
  "Wound Care": "bg-pink-100 text-pink-700 border-pink-200",
  "Oxygen Therapy": "bg-sky-100 text-sky-700 border-sky-200",
};

const inputClass =
  "w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all";

export function TreatmentList({
  treatments,
  onAddTreatment,
  onRemoveTreatment,
}: TreatmentListProps) {
  const [showForm, setShowForm] = useState(false);
  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState<AddTreatmentFormData>({
    name: "",
    type: "Medication",
    startDate: today,
    notes: "",
  });

  const [errors, setErrors] = useState<{ name?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setErrors({ name: "Treatment name is required" });
      return;
    }
    onAddTreatment(form);
    setForm({ name: "", type: "Medication", startDate: today, notes: "" });
    setErrors({});
    setShowForm(false);
  };

  return (
    <div className="space-y-4">
      {/* Treatment count header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          {treatments.length === 0
            ? "No treatments assigned yet"
            : `${treatments.length} active treatment${treatments.length !== 1 ? "s" : ""}`}
        </p>
        <button
          id="add-treatment-toggle"
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors"
        >
          {showForm ? (
            <>
              <ChevronUp className="w-3.5 h-3.5" />
              Cancel
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5" />
              Add Treatment
            </>
          )}
        </button>
      </div>

      {/* Add treatment form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          id="add-treatment-form"
          className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3"
        >
          <p className="text-xs font-semibold text-slate-600 mb-2">
            New Treatment
          </p>

          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <input
                id="treatment-name"
                type="text"
                placeholder="Treatment name (e.g. Aspirin 150mg)"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={cn(
                  inputClass,
                  errors.name && "border-rose-400 ring-1 ring-rose-300"
                )}
              />
              {errors.name && (
                <p className="text-xs text-rose-600 mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <select
                id="treatment-type"
                value={form.type}
                onChange={(e) =>
                  setForm({ ...form, type: e.target.value as TreatmentType })
                }
                className={cn(inputClass, "cursor-pointer")}
              >
                {treatmentTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <input
                id="treatment-start-date"
                type="date"
                value={form.startDate}
                max={today}
                onChange={(e) =>
                  setForm({ ...form, startDate: e.target.value })
                }
                className={inputClass}
              />
            </div>

            <div className="col-span-2">
              <textarea
                id="treatment-notes"
                placeholder="Notes (optional)"
                rows={2}
                value={form.notes || ""}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className={cn(inputClass, "resize-none")}
              />
            </div>
          </div>

          <button
            type="submit"
            id="treatment-submit"
            className="w-full flex items-center justify-center gap-2 py-2 text-sm font-semibold text-white bg-gradient-to-r from-slate-700 to-slate-900 rounded-lg hover:from-slate-800 hover:to-slate-950 transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Treatment
          </button>
        </form>
      )}

      {/* Treatment list */}
      <div className="space-y-2.5">
        {treatments.length === 0 && !showForm ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Pill className="w-8 h-8 text-slate-200 mb-2" />
            <p className="text-sm text-slate-400">No treatments yet</p>
            <p className="text-xs text-slate-300 mt-1">
              Click "Add Treatment" to get started
            </p>
          </div>
        ) : (
          treatments.map((treatment) => {
            const Icon = treatmentIcons[treatment.type];
            const colorClass = treatmentColors[treatment.type];

            return (
              <div
                key={treatment.id}
                className="flex items-start gap-3 p-3 bg-white border border-slate-100 rounded-xl hover:border-slate-200 transition-colors group"
              >
                <div
                  className={cn(
                    "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center border",
                    colorClass
                  )}
                >
                  <Icon className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-800 truncate">
                      {treatment.name}
                    </p>
                    {onRemoveTreatment && (
                      <button
                        onClick={() => onRemoveTreatment(treatment.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 w-5 h-5 flex items-center justify-center rounded text-slate-400 hover:text-rose-500 hover:bg-rose-50"
                        aria-label={`Remove treatment: ${treatment.name}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold border",
                        colorClass
                      )}
                    >
                      {treatment.type}
                    </span>
                    <span className="text-xs text-slate-400">
                      Since{" "}
                      {new Date(treatment.startDate).toLocaleDateString(
                        "en-IN",
                        { day: "numeric", month: "short" }
                      )}
                    </span>
                  </div>
                  {treatment.notes && (
                    <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                      {treatment.notes}
                    </p>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
