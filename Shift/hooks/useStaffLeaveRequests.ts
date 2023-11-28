import { useQuery } from "react-query";
import { ShiftReport } from "../types/Shift";
import { axiosInstance } from "../../api/server";
import { LeaveRequest } from "../types/LeaveRequest";

const fetchleaveRequests = async (staff_id: string): Promise<LeaveRequest[]> => {
  const { data } = await axiosInstance.get(`/staff/leave_requests/${staff_id}`);
  return data;
};

export function useStaffLeaveRequests(staff_id: string) {
  return useQuery(["leave_requests", staff_id], () => fetchleaveRequests(staff_id), {
    enabled: !!staff_id, // Fetch the report only if the ID is truthy
  });
}
