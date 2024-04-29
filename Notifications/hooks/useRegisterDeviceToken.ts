import { useMutation, useQueryClient } from "react-query";
import { addOne } from "../../core/utils/crudUtils";
import { axiosInstance } from "../../api/server";
import { DeviceToken } from "../types/Notification";

const registerDeviceToken = async (
  credentials: DeviceToken
): Promise<DeviceToken> => {
  const formData = new FormData();
  formData.append("credentials_json", JSON.stringify(credentials));

  console.log("register device token hook");
  // console.log(credentials);
  const { data } = await axiosInstance.post(
    "/device_tokens/register",
    formData
  );

  return data;
  //   return {} as DeviceToken;
};

export function useRegisterDeviceToken() {
  const queryClient = useQueryClient();
  const { mutateAsync, isLoading } = useMutation(registerDeviceToken, {
    onSuccess: () => {
      queryClient.invalidateQueries("device_tokens");
    },
  });

  return {
    registerDeviceToken: mutateAsync,
    isRegistering: isLoading,
  };
}
