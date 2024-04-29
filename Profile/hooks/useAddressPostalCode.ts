import { useQuery } from "react-query";
import { axiosInstance } from "../../api/server";
import { PostalCode } from "../types/address";

const fetchPostalCodes = async (): Promise<PostalCode[]> => {
  const { data } = await axiosInstance.get("/jp_addresses/postal_codes");

  return data;
};

export function usePostalCodes() {
  return useQuery(["jp_postalcode"], () => fetchPostalCodes(), {
    // enabled: !!language,
  });
}
