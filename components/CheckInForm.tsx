"use client";

import { useState } from "react";
import { CheckInFormData, Gender } from "@/lib/types";
import { UserRound, Calendar, Hash, Stethoscope } from "lucide-react";
import { cn } from "@/lib/utils";

interface CheckInFormProps {
  bedNumber: number;
  onSubmit: (data: CheckInFormData) => void;
  onCancel: () => void;
}

const inputClass =
  "w-full px-3 py-2.5 text-sm bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all";

const labelClass = "block text-xs font-semibold text-slate-600 mb-1.5";

export function CheckInForm({ bedNumber, onSubmit, onCancel }: CheckInFormProps) {
  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState<CheckInFormData>({
    name: "",
    age: 0,
    gender: "Male",
    admissionDate: today,
    diagnosis: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CheckInFormData, string>>>({});

  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    if (!form.name.trim()) newErrors.name = "Patient name is required";
    if (!form.age || form.age < 1 || form.age > 130)
      newErrors.age = "Enter a valid age (1–130)";
    if (!form.admissionDate) newErrors.admissionDate = "Admission date is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" id="check-in-form">
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 mb-4">
        <p className="text-sm font-medium text-emerald-800">
          Admitting patient to{" "}
          <span className="font-bold">Bed #{bedNumber}</span>
        </p>
        <p className="text-xs text-emerald-600 mt-0.5">
          Fill in the patient details below to complete the check-in.
        </p>
      </div>

      {/* Name */}
      <div>
        <label className={labelClass} htmlFor="patient-name">
          <span className="flex items-center gap-1.5">
            <UserRound className="w-3.5 h-3.5" />
            Patient Name
          </span>
        </label>
        <input
          id="patient-name"
          type="text"
          placeholder="e.g. Rajesh Kumar"
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
          <label className={labelClass} htmlFor="patient-age">
            <span className="flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5" />
              Age
            </span>
          </label>
          <input
            id="patient-age"
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
          <label className={labelClass} htmlFor="patient-gender">
            Gender
          </label>
          <select
            id="patient-gender"
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

      {/* Admission Date */}
      <div>
        <label className={labelClass} htmlFor="admission-date">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            Admission Date
          </span>
        </label>
        <input
          id="admission-date"
          type="date"
          value={form.admissionDate}
          max={today}
          onChange={(e) => setForm({ ...form, admissionDate: e.target.value })}
          className={cn(
            inputClass,
            errors.admissionDate && "border-rose-400 ring-1 ring-rose-300"
          )}
        />
        {errors.admissionDate && (
          <p className="text-xs text-rose-600 mt-1">{errors.admissionDate}</p>
        )}
      </div>

      {/* Diagnosis */}
      <div>
        <label className={labelClass} htmlFor="patient-diagnosis">
          <span className="flex items-center gap-1.5">
            <Stethoscope className="w-3.5 h-3.5" />
            Diagnosis{" "}
            <span className="text-slate-400 font-normal">(optional)</span>
          </span>
        </label>
        <input
          id="patient-diagnosis"
          type="text"
          placeholder="e.g. Hypertension, Post-op recovery..."
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
          id="check-in-cancel"
          className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          id="check-in-submit"
          className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-lg hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-sm hover:shadow-emerald-200 hover:shadow-md"
        >
          Check In Patient
        </button>
      </div>
    </form>
  );
}
