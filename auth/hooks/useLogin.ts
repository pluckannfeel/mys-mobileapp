// import axios from "axios";
import { useMutation } from "react-query";
import { axiosInstance } from "../../api/server";

const login = async ({
  staff_code,
  password,
}: {
  staff_code: string;
  password: string;
}): Promise<string> => {
  // const { data } = await axios.post("/api/login", { email, password });

  const formData = {
    staff_code,
    password,
  };
  // console.log(formData)

  const { data } = await axiosInstance.post("/staff/login", formData);

  // data is object with token key take it instead of passing the whole object
  // because Auth Provider in admin takes the return data response directly

  // const token = data["token"].toString();

  return data;
};

export function useLogin() {
  const { isLoading, mutateAsync } = useMutation(login);

  return { isLoggingIn: isLoading, login: mutateAsync };
}
