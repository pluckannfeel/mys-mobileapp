// import { Staff } from "../../staff/types/staff";

export type Payslip = {
  id: string;
  //   staff?: Staff | null; // object staff details/
  release_date: Date;
  file_url?: File | string | null; // s3 url
  created_at: Date;
  net_salary?: number;
  total_deduction?: number;
  total_hours?: number;
  details?: string
};
