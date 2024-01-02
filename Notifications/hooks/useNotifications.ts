import { useQuery } from "react-query";
import { Notification } from "../types/Notification";
import { axiosInstance } from "../../api/server";

const fetchNotifications = async (mys_id: string): Promise<Notification[]> => {
  const { data } = await axiosInstance.get(`/notifications/${mys_id}`);

  return data;
};

export function useNotifications(mys_id: string) {
  return useQuery("notifications", () => fetchNotifications(mys_id), {
    enabled: !!mys_id,
    suspense: false,
  });
}
