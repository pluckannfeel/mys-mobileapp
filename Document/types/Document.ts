import { number } from "yup";

export type License = {
  file: string | File;
  name: string;
  type?: string;
  number: string;
  date: Date;
};
