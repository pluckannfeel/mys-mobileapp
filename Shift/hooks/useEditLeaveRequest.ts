import { useMutation, useQueryClient } from "react-query";
import { updateOne } from "../../core/utils/crudUtils";
import { ShiftReport } from "../types/Shift";
import { axiosInstance } from "../../api/server";
import { LeaveRequest } from "../types/LeaveRequest";

const editLeaveRequest = async (
  leaveRequest: LeaveRequest
): Promise<ShiftReport> => {
  const formData = new FormData();

  formData.append("leave_request_json", JSON.stringify(leaveRequest));

  const { data } = await axiosInstance.put(
    "/staff/staff_edit_leave_request",
    formData
  );

  return data;
};

export function useEditLeaveRequest() {
  const queryClient = useQueryClient();
  const { mutateAsync, isLoading } = useMutation(editLeaveRequest, {
    onSuccess: () => {
      queryClient.invalidateQueries("leave_requests");
      // queryClient.setQueryData<ShiftReport[]>(
      //   ["shift_report"],
      //   (oldShiftReports) => updateOne(oldShiftReports, shift_report)
      // );
    },
  });

  return {
    editLeaveRequest: mutateAsync,
    isEditing: isLoading,
  };
}
