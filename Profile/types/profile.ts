export interface Profile {
  id: string;
  user_id: string;
  img_url?: string;
  affiliation?: string;
  staff_group?: string;
  staff_code?: string;
  japanese_name?: string;
  english_name?: string;
  nickname?: string;
  nationality: string;
  gender: string;
  job_position: string;
  duty_type: string;
  birth_date?: Date;
  join_date?: Date;
  leave_date?: Date;
  postal_code?: string;
  prefecture?: string;
  municipality?: string;
  town?: string;
  building?: string;
  phone_number?: string;
  personal_email?: string;
  work_email?: string;
  koyou_keitai?: string;
  zaishoku_joukyou?: string;
  licenses?: Licenses[] | [];
  customer_number?: string;
  bank_name?: string;
  branch_name?: string;
  account_type?: string;
  account_number?: string; // code number from yuucho is only needed
  account_name?: string;
  bank_card_images?: BankCardImage;
  passport_details?: PassportDetails;
  residence_card_details?: ResidenceCardDetails;

  // only for mobile, i decided to separate it for now because of production issues
  // residence_card_number?: string;
  // passport_number?: string;
  created_at?: string | null;
  // disabled: boolean;
}

export interface Licenses {
  number: string;
  name: string;
  date: Date;
  // file_url: string | File;
  file: File | string;
}

export type BankCardImage = {
  front?: string | File;
  back?: string | File;
};

export type ResidenceCardDetails = {
  number?: string;
  issue_date?: Date;
  expiry_date?: Date;
  front?: File | string;
  back?: File | string;
};

export type PassportDetails = {
  number?: string;
  issue_date?: Date;
  expiry_date?: Date;
  file?: File | string;
};

export interface FileItem {
  id: string;
  file_type:
    | "passport"
    | "residence_card_back"
    | "residence_card_front"
    | "bank_card_front"
    | "bank_card_back";
  url: string;
}

export type AddDocumentProps = {
  staff_id: string;
  documentType: string;
  documentImage: string;
};
