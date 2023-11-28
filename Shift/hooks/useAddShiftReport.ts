import { useMutation, useQueryClient } from "react-query";
import { addOne } from "../../core/utils/crudUtils";
import { ShiftReport } from "../types/Shift";
import { axiosInstance } from "../../api/server";

const addShiftReport = async (
  shiftReport: ShiftReport
): Promise<ShiftReport> => {
  // const shift_report = {
  //   ...shiftReport,
  // };

  const formData = new FormData();
  formData.append("shift_report_json", JSON.stringify(shiftReport));

  const { data } = await axiosInstance.post(
    "/shift_report/add_shift_report",
    formData
  );
  return data;
};

export function useAddShiftReport() {
  const queryClient = useQueryClient();
  const { mutateAsync, isLoading } = useMutation(addShiftReport, {
    onSuccess: () => {
        queryClient.invalidateQueries("shift_report");
      // queryClient.setQueryData<ShiftReport[]>(
      //   ["shift_report"],
      //   (oldShiftReports) => addOne(oldShiftReports, shift_report)
      // );
    },
  });

  return {
    addShiftReport: mutateAsync,
    isAdding: isLoading,
  };
}
