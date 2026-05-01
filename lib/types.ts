export type BedStatus = "available" | "occupied" | "cleaning";

export type Gender = "Male" | "Female" | "Other";

export type TreatmentType =
  | "Medication"
  | "IV Drip"
  | "Observation"
  | "Physiotherapy"
  | "Surgery Prep"
  | "Wound Care"
  | "Oxygen Therapy";

export interface Treatment {
  id: string;
  name: string;
  type: TreatmentType;
  startDate: string;
  notes?: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: Gender;
  admissionDate: string;
  diagnosis?: string;
  treatments: Treatment[];
}

export interface ScheduledPatient {
  id: string;
  name: string;
  age: number;
  gender: Gender;
  plannedDate: string;
  diagnosis?: string;
}

export interface Bed {
  id: string;
  number: number;
  ward: string;
  status: BedStatus;
  patient?: Patient;
  scheduledPatient?: ScheduledPatient;
}

export interface CheckInFormData {
  name: string;
  age: number;
  gender: Gender;
  admissionDate: string;
  diagnosis?: string;
}

export interface SchedulePatientFormData {
  name: string;
  age: number;
  gender: Gender;
  plannedDate: string;
  diagnosis?: string;
}

export interface AddTreatmentFormData {
  name: string;
  type: TreatmentType;
  startDate: string;
  notes?: string;
}
