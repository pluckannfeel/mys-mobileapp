import { useQuery } from "react-query";
import { ShiftReport } from "../types/Shift";
import { axiosInstance } from "../../api/server";

const fetchShiftReport = async (id: string): Promise<ShiftReport> => {
  const { data } = await axiosInstance.get(`/shift_report/${id}`);
  return data;
};

export function useShiftReport(id: string) {
  return useQuery(["shift_report", id], () => fetchShiftReport(id), {
    enabled: !!id, // Fetch the report only if the ID is truthy
  });
}
