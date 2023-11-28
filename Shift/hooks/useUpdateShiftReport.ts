import { useMutation, useQueryClient } from "react-query";
import { updateOne } from "../../core/utils/crudUtils";
import { ShiftReport } from "../types/Shift";
import { axiosInstance } from "../../api/server";

const updateShiftReport = async (
  shiftReport: ShiftReport
): Promise<ShiftReport> => {
  const formData = new FormData();

  formData.append("shift_report_json", JSON.stringify(shiftReport));

  const { data } = await axiosInstance.put(
    "/shift_report/update_shift_report",
    formData
  );

  return data;
};

export function useUpdateShiftReport() {
    const queryClient = useQueryClient();
    const { mutateAsync, isLoading } = useMutation(updateShiftReport, {
        onSuccess: () => {
        queryClient.invalidateQueries("shift_report");
        // queryClient.setQueryData<ShiftReport[]>(
        //   ["shift_report"],
        //   (oldShiftReports) => updateOne(oldShiftReports, shift_report)
        // );
        },
    });
    
    return {
        updateShiftReport: mutateAsync,
        isUpdating: isLoading,
    };
}
