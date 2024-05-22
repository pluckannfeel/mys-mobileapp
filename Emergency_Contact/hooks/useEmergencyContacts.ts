import { useQuery } from "react-query";
import { EmergencyContact } from "../types/EmergencyContact";
import { axiosInstance } from "../../api/server";

const fetchEmergencyContacts = async (
  staff_code: string
): Promise<EmergencyContact[]> => {
  const { data } = await axiosInstance.get("/emergency_contact", {
    params: {
      staff_code: staff_code,
    },
  });
  return data;
};

export function useEmergencyContacts(staff_code: string) {
  return useQuery(
    ["emergency_contacts"],
    () => fetchEmergencyContacts(staff_code),
    {
      enabled: !!staff_code,
      //   suspense: true,
    }
  );
}
