// import { Staff } from "../../staff/types/staff";

export type TaxCertificate = {
  id: string;
  //   staff?: Staff | null; // object staff details/
  release_date: Date;
  file_url?: File | string | null; // s3 url
  created_at: Date;
};
