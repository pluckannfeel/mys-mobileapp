import { useQuery } from "react-query";
import { axiosInstance } from "../../api/server";
import { Municipality } from "../types/address";

const fetchMunicipalities = async (): Promise<Municipality[]> => {
  const { data } = await axiosInstance.get("/jp_addresses/municipalities");

  return data;
};

export function useMunicipalities() {
  return useQuery(["jp_municipalities"], () => fetchMunicipalities(), {
    // enabled: !!language,
  });
}
