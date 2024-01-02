import { useMutation, useQueryClient } from "react-query";
import { updateOne } from "../../core/utils/crudUtils";
import { Profile } from "../types/profile";
import { axiosInstance } from "../../api/server";
import * as FileSystem from "expo-file-system";

const updateProfile = async (profile: Profile) => {
  const formData = new FormData();

  const profileImage = profile.img_url;
  delete profile.img_url;
  delete profile.created_at;

  delete profile.bank_card_images;
  delete profile.residence_card_details;
  delete profile.passport_details;
  delete profile.licenses;

  formData.append("staff_json", JSON.stringify(profile));

  if (profileImage) {
    const fileInfo = await FileSystem.getInfoAsync(profileImage);

    if (fileInfo.exists) {
      const imageFile = {
        uri: profileImage,
        name: fileInfo.uri.split("/").pop(),
        type: "image/jpeg",
      };
      formData.append("staff_image", imageFile as any);
    }
  }

  const { data } = await axiosInstance.put("/staff/update_staff", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  const { isLoading, mutateAsync } = useMutation(updateProfile, {
    onSuccess: (profile: Profile) => queryClient.invalidateQueries("user-info"),
  });

  return { isUpdating: isLoading, updateProfile: mutateAsync };
}
