import { useMutation, useQueryClient } from "react-query";
import { updateOne } from "../../core/utils/crudUtils";
import { AddDocumentProps, Profile } from "../types/profile";
import { axiosInstance } from "../../api/server";
import * as FileSystem from "expo-file-system";

const addDocument = async ({
  staff_id,
  documentType,
  documentImage,
}: AddDocumentProps) => {
  const formData = new FormData();

  formData.append("staff_id", staff_id);

  formData.append("document_type", documentType);

  const fileInfo = await FileSystem.getInfoAsync(documentImage);

  if (fileInfo.exists) {
    const imageFile = {
      uri: documentImage,
      name: fileInfo.uri.split("/").pop(),
      type: "image/jpeg",
    };
    formData.append("document_image", imageFile as any);
  }

  const { data } = await axiosInstance.put("/staff/add_document", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};

export function useAddDocument() {
  const queryClient = useQueryClient();

  const { isLoading, mutateAsync } = useMutation(addDocument, {
    onSuccess: (profile: Profile) => queryClient.invalidateQueries("user-info"),
  });

  return { isAdding: isLoading, addDocument: mutateAsync };
}
