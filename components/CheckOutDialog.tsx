"use client";

import { Patient } from "@/lib/types";
import { LogOut, AlertTriangle } from "lucide-react";

interface CheckOutDialogProps {
  patient: Patient;
  bedNumber: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export function CheckOutDialog({
  patient,
  bedNumber,
  onConfirm,
  onCancel,
}: CheckOutDialogProps) {
  const admissionDate = new Date(patient.admissionDate);
  const today = new Date();
  const days = Math.max(
    0,
    Math.floor(
      (today.getTime() - admissionDate.getTime()) / (1000 * 60 * 60 * 24)
    )
  );

  return (
    <div className="space-y-5" id="checkout-dialog">
      {/* Warning header */}
      <div className="flex items-start gap-3 bg-rose-50 border border-rose-200 rounded-xl p-4">
        <div className="flex-shrink-0 w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center">
          <AlertTriangle className="w-4 h-4 text-rose-600" />
        </div>
        <div>
          <p className="text-sm font-semibold text-rose-800">
            Confirm Discharge
          </p>
          <p className="text-xs text-rose-600 mt-0.5">
            This action will discharge the patient and mark the bed for cleaning.
          </p>
        </div>
      </div>

      {/* Patient Summary */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-slate-500">Patient Name</p>
            <p className="text-sm font-semibold text-slate-800">{patient.name}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Bed Number</p>
            <p className="text-sm font-semibold text-slate-800">#{bedNumber}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Age / Gender</p>
            <p className="text-sm font-semibold text-slate-800">
              {patient.age} yrs · {patient.gender}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Length of Stay</p>
            <p className="text-sm font-semibold text-slate-800">
              {days} day{days !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        {patient.diagnosis && (
          <div className="pt-2 border-t border-slate-100">
            <p className="text-xs text-slate-500">Diagnosis</p>
            <p className="text-sm text-slate-700">{patient.diagnosis}</p>
          </div>
        )}
      </div>

      <p className="text-xs text-slate-400 text-center">
        The bed will be marked as{" "}
        <span className="font-semibold text-amber-600">Cleaning</span> after discharge.
      </p>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          id="checkout-cancel"
          onClick={onCancel}
          className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
        >
          Keep Patient
        </button>
        <button
          id="checkout-confirm"
          onClick={onConfirm}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-rose-500 to-rose-700 rounded-lg hover:from-rose-600 hover:to-rose-800 transition-all shadow-sm"
        >
          <LogOut className="w-4 h-4" />
          Discharge
        </button>
      </div>
    </div>
  );
}
