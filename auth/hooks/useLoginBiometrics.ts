// import axios from "axios";
import { useMutation } from "react-query";
import { axiosInstance } from "../../api/server";

const loginBiometrics = async (token: string): Promise<string> => {
  const { data } = await axiosInstance.post("/staff/login_biometrics", {
    token,
  });

  return data;
};

export function useLoginBiometrics() {
  const { isLoading, mutateAsync } = useMutation(loginBiometrics);

  return { isLoggingInBiometrics: isLoading, loginWithBiometrics: mutateAsync };
}
