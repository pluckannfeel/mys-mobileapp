import { useQuery } from "react-query";
import { axiosInstance } from "../../api/server";

const fetchTotalWorkhours = async (staff_code: string): Promise<string> => {
  const { data } = await axiosInstance.get(`/shift/staff_work_hours/?staff_code=${staff_code}`);

  return String(data);
  // promise
  // return "";
};

export const useTotalHours = (mys_id: string) => {
  const { data, isLoading, refetch } = useQuery(
    ["staffTotalWorkHours", mys_id],
    () => fetchTotalWorkhours(mys_id),
    {
      //   enabled: !!mys_id, // Fetch only when languageCode is available
    }
  );

  return { data, isLoading, refetch };
};
