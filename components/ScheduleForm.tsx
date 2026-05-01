"use client";

import { useState } from "react";
import { SchedulePatientFormData, Gender } from "@/lib/types";
import { UserRound, Calendar, Hash, Stethoscope } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScheduleFormProps {
  bedNumber: number;
  onSubmit: (data: SchedulePatientFormData) => void;
  onCancel: () => void;
}

const inputClass =
  "w-full px-3 py-2.5 text-sm bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all";

const labelClass = "block text-xs font-semibold text-slate-600 mb-1.5";

export function ScheduleForm({ bedNumber, onSubmit, onCancel }: ScheduleFormProps) {
  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState<SchedulePatientFormData>({
    name: "",
    age: 0,
    gender: "Male",
    plannedDate: today,
    diagnosis: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof SchedulePatientFormData, string>>>({});

  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    if (!form.name.trim()) newErrors.name = "Patient name is required";
    if (!form.age || form.age < 1 || form.age > 130)
      newErrors.age = "Enter a valid age (1–130)";
    if (!form.plannedDate) newErrors.plannedDate = "Planned date is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" id="schedule-form">
      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3 mb-4">
        <p className="text-sm font-medium text-indigo-800">
          Scheduling next patient for{" "}
          <span className="font-bold">Bed #{bedNumber}</span>
        </p>
        <p className="text-xs text-indigo-600 mt-0.5">
          Fill in the details for the patient queuing for this bed.
        </p>
      </div>

      {/* Name */}
      <div>
        <label className={labelClass} htmlFor="schedule-patient-name">
          <span className="flex items-center gap-1.5">
            <UserRound className="w-3.5 h-3.5" />
            Patient Name
          </span>
        </label>
        <input
          id="schedule-patient-name"
          type="text"
          placeholder="e.g. Rahul Sharma"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className={cn(inputClass, errors.name && "border-rose-400 ring-1 ring-rose-300")}
        />
        {errors.name && (
          <p className="text-xs text-rose-600 mt-1">{errors.name}</p>
        )}
      </div>

      {/* Age + Gender */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass} htmlFor="schedule-patient-age">
            <span className="flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5" />
              Age
            </span>
          </label>
          <input
            id="schedule-patient-age"
            type="number"
            min={1}
            max={130}
            placeholder="e.g. 45"
            value={form.age || ""}
            onChange={(e) =>
              setForm({ ...form, age: parseInt(e.target.value) || 0 })
            }
            className={cn(inputClass, errors.age && "border-rose-400 ring-1 ring-rose-300")}
          />
          {errors.age && (
            <p className="text-xs text-rose-600 mt-1">{errors.age}</p>
          )}
        </div>

        <div>
          <label className={labelClass} htmlFor="schedule-patient-gender">
            Gender
          </label>
          <select
            id="schedule-patient-gender"
            value={form.gender}
            onChange={(e) =>
              setForm({ ...form, gender: e.target.value as Gender })
            }
            className={cn(inputClass, "cursor-pointer")}
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {/* Planned Date */}
      <div>
        <label className={labelClass} htmlFor="schedule-planned-date">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            Planned Admission Date
          </span>
        </label>
        <input
          id="schedule-planned-date"
          type="date"
          value={form.plannedDate}
          min={today}
          onChange={(e) => setForm({ ...form, plannedDate: e.target.value })}
          className={cn(
            inputClass,
            errors.plannedDate && "border-rose-400 ring-1 ring-rose-300"
          )}
        />
        {errors.plannedDate && (
          <p className="text-xs text-rose-600 mt-1">{errors.plannedDate}</p>
        )}
      </div>

      {/* Diagnosis */}
      <div>
        <label className={labelClass} htmlFor="schedule-patient-diagnosis">
          <span className="flex items-center gap-1.5">
            <Stethoscope className="w-3.5 h-3.5" />
            Planned Diagnosis/Reason{" "}
            <span className="text-slate-400 font-normal">(optional)</span>
          </span>
        </label>
        <input
          id="schedule-patient-diagnosis"
          type="text"
          placeholder="e.g. Scheduled Surgery..."
          value={form.diagnosis || ""}
          onChange={(e) => setForm({ ...form, diagnosis: e.target.value })}
          className={inputClass}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          id="schedule-cancel"
          className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          id="schedule-submit"
          className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-sm hover:shadow-indigo-200 hover:shadow-md"
        >
          Schedule Patient
        </button>
      </div>
    </form>
  );
}
