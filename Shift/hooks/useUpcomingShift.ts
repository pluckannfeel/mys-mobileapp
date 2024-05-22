import { useQuery } from "react-query";
import { ShiftSchedule } from "../types/Shift";
import { axiosInstance } from "../../api/server";

const fetchUpcomingShift = async (
  staff_name: string
): Promise<ShiftSchedule> => {
  const { data } = await axiosInstance.get("/staff/upcoming_shift_by_staff", {
    params: {
      staff_name: staff_name,
    },
  });
  // you can add affiliation later on if you want to filter by affiliation like angel care services etc..
  return data;
};

export function useUpcomingShift(staff_name: string) {
  return useQuery(["upcoming_shift"], () => fetchUpcomingShift(staff_name), {
    enabled: !!staff_name,
    suspense: true,
  });
}
