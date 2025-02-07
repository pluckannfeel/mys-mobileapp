import { useMutation, useQueryClient } from "react-query";
import { updateOne } from "../../core/utils/crudUtils";
import { ShiftReport } from "../types/Shift";
import { axiosInstance } from "../../api/server";
import { LeaveRequest } from "../types/LeaveRequest";

const deleteLeaveRequest = async (
  leaveRequestId: string
): Promise<ShiftReport> => {
  const { data } = await axiosInstance.delete(
    `/staff/staff_delete_leave_request/${leaveRequestId}` // Pass the id in the path
  );

  return data;
};

export function useDeleteLeaveRequest() {
  const queryClient = useQueryClient();
  const { mutateAsync, isLoading } = useMutation(deleteLeaveRequest, {
    onSuccess: () => {
      queryClient.invalidateQueries("leave_requests");
      // queryClient.setQueryData<ShiftReport[]>(
      //   ["shift_report"],
      //   (oldShiftReports) => updateOne(oldShiftReports, shift_report)
      // );
    },
  });

  return {
    deleteLeaveRequest: mutateAsync,
    isDeleting: isLoading,
  };
}
