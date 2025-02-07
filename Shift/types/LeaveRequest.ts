export interface LeaveRequest {
  id?: string;
  mys_id?: string;
  // staff?: {} // object
  start_date: Date;
  end_date: Date;
  leave_type?: string;
  number_of_days?: number;
  status?: string;
  details?: string;
  paid_leave_dates?: string;
}
