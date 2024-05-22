// import axios from 'axios';
import { useQuery } from "react-query";
import { UserInfo } from "../types/userInfo";
import { axiosInstance } from "../../api/server";

const fetchUserInfo = async (key?: string): Promise<UserInfo> => {
  // const { data } = await axios.get("/api/user-info", { params: { key } });

  const { data } = await axiosInstance.get("/staff/get_staff_info", {
    params: { token: key },
  });

  return data;
};

export function useUserInfo(key?: string) {
  return useQuery(["user-info", key], () => fetchUserInfo(key), {
    enabled: !!key,
    // staleTime: 0,
    // suspense: true,
  });
}
