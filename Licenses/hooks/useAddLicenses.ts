import { useMutation, useQueryClient } from "react-query";
import { License } from "../../Document/types/Document";
import { axiosInstance } from "../../api/server";
import * as FileSystem from "expo-file-system";

const addLicense = async ({
  staff_id,
  license,
}: {
  staff_id: string;
  license: License;
}) => {
  const formData = new FormData();

  const details = {
    staff_id,
    license_type: license.type,
    license_number: license.number,
    license_name: license.name,
    license_date: license.date,
  };

  formData.append("details", JSON.stringify(details));

  // document could "pdf" or "image/jpeg"
  const fileInfo = await FileSystem.getInfoAsync(license.file as string);
  if (fileInfo.exists) {
    const uploadFile = {
      uri: license.file,
      name: fileInfo.uri.split("/").pop(),
      type: license.type,
    };
    formData.append("license_file", uploadFile as any);
  }

  const { data } = await axiosInstance.put("/staff/add_license", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

export function useAddLicense() {
  const queryClient = useQueryClient();

  const { isLoading, mutateAsync } = useMutation(addLicense, {
    onSuccess: () => queryClient.invalidateQueries("licenses"),
  });

  return { isAdding: isLoading, addLicense: mutateAsync };
}
