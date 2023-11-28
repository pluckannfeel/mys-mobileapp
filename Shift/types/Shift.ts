export interface ShiftSchedule {
  id: string;
  staff: string;
  patient: string; // patient_name
  service_type?: string;
  service_details?: string;
  // date?: Date; // (number)
  start: Date | string; // as str e.g 12:00, 18:00 24 hr format
  end: Date | string; // as str e.g 12:00, 18:00 24 hr format
  duration: string; // from start to end total of hours 60 * n(h)
  remarks?: string;
  color?: string;
}

export type ShiftReport = {
  id: string;
  shift_id: string;
  patient: string;
  service_hours: string;
  toilet_assistance?: ToiletAssistance;
  meal_assistance?: MealAssistance;
  bath_assistance?: BathAssistance;
  grooming_assistance?: GroomingAssistance;
  positioning_assistance?: PositioningAssistance;
  medication_medical_care?: medicationMedicalCare;
  daily_assistance?: DailyAssistance;
  outgoing_assistance?: OutgoingAssistanceRecord[] | [];
};

type ToiletAssistance = {
  toilet: boolean;
  diaper_change: boolean;
  linen_change: boolean;
  urinal_flushing: boolean;
};

type MealAssistance = {
  posture: boolean;
  feeding: boolean;
  frequency: "alltime" | "sometime";
};

type BathAssistance = {
  bath: boolean;
  shower: boolean;
  hair_wash: boolean;
  hand_arms_wash: boolean;
  feet_wash: boolean;
  bed_bath: boolean;
  bath_type: "whole_body" | "some_part";
};

type GroomingAssistance = {
  face_wash: boolean;
  tooth_brush: boolean;
  hair: boolean;
  mustache: boolean;
  nail_cut: boolean;
  ear_cleaning: boolean;
  nose_cleaning: boolean;
  dressing: boolean;
  make_up: boolean;
};

type PositioningAssistance = {
  body: boolean;
  transfer: boolean;
  going_out: boolean;
  ready_going_out: boolean;
  going_back: boolean;
  hospital: boolean;
  shopping: boolean;
  getting_up: boolean;
  sleeping: boolean;
};

type medicationMedicalCare = {
  medication_assistance: boolean;
  medication_application: boolean;
  // medical_care: boolean;
  eye_drops: boolean;
  phlegm_suction: boolean;
  enema: boolean;
  tube_feeding: boolean;
  watch: boolean;
};

type DailyAssistance = {
  cleaning: boolean;
  garbase_disposal: boolean;
  laundry: boolean;
  cooking: boolean;
};

export type OutgoingAssistanceRecord = {
  transport_type: string;
  destination: string;
  support_hours: string;
};
