export interface LeaveRequest {
  id?: string;
  mys_id?: string;
  // staff?: {} // object
  start_date: Date;
  end_date: Date;
  type: string;
  status?: string;
  details: string;
}
