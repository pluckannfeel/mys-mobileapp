// import axios from "axios";
import { useMutation } from "react-query";

const logout = async (): Promise<string> => {
  // const { data } = await axios.post("/api/logout");

  // nothing to do when logging out just remove auth key on local storage
  return "";
};

export function useLogout() {
  const { isLoading, mutateAsync } = useMutation(logout);

  return { isLoggingOut: isLoading, logout: mutateAsync };
}
