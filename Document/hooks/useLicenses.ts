import { useQuery } from "react-query";
import { License } from "../types/Document";
import { axiosInstance } from "../../api/server";

const fetchLicenses = async (staff_code: string): Promise<License[]> => {
  const { data } = await axiosInstance.get("/staff/get_license", {
    params: {
      staff_code: staff_code,
    },
  });
  return data;
};

export function useLicenses(staff_code: string) {
  return useQuery(["licenses"], () => fetchLicenses(staff_code), {
    enabled: !!staff_code,
  });
}
