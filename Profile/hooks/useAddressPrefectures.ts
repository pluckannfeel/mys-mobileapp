import { useQuery } from "react-query";
import { axiosInstance } from "../../api/server";
import { Prefecture } from "../types/address";

const fetchPrefectures = async (): Promise<Prefecture[]> => {
  const { data } = await axiosInstance.get("/jp_addresses/prefectures");

  return data;
};

export function usePrefectures() {
  return useQuery(["jp_prefectures"], () => fetchPrefectures(), {
    // enabled: !!language,
  });
}
