import { useMutation, useQueryClient } from "react-query";
import { addOne } from "../../core/utils/crudUtils";
import { LeaveRequest } from "../types/LeaveRequest";
import { axiosInstance } from "../../api/server";

const addLeaveRequest = async (
  leaveRequest: LeaveRequest
): Promise<LeaveRequest> => {
  const formData = new FormData();
  formData.append("leave_request_json", JSON.stringify(leaveRequest));

  const { data } = await axiosInstance.post(
    "/staff/add_leave_request",
    formData
  );
  return data;
};

export function useAddLeaveRequest() {
  const queryClient = useQueryClient();
  const { mutateAsync, isLoading } = useMutation(addLeaveRequest, {
    onSuccess: () => {
      queryClient.invalidateQueries("leave_requests");
    },
  });

  return {
    addLeaveRequest: mutateAsync,
    isAdding: isLoading,
  };
}
