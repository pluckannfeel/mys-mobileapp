import { useQuery } from "react-query";

import { axiosInstance } from "../../api/server";
import { TaxCertificate } from "../types/taxcertificate";

const fetchTaxCertificates = async (
  mys_id: string
): Promise<TaxCertificate[]> => {
  const { data } = await axiosInstance.get(`taxcertificate/${mys_id}`);
  return data;
};

export function useTaxCertificates(mys_id: string) {
  return useQuery(
    ["taxcertificates", mys_id],
    () => fetchTaxCertificates(mys_id),
    {
      enabled: !!mys_id,
      // suspense: true,
    }
  );
}
