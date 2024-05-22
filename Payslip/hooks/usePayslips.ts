import { useQuery } from "react-query";
import { Payslip } from "../types/payslip";
import { axiosInstance } from "../../api/server";

const fetchPayslips = async (mys_id: string): Promise<Payslip[]> => {
  const { data } = await axiosInstance.get(`payslip/${mys_id}`);
  return data;
};

export function usePayslips(mys_id: string) {
  return useQuery(["payslips", mys_id], () => fetchPayslips(mys_id), {
    enabled: !!mys_id,
    // suspense: true,
  });
}
