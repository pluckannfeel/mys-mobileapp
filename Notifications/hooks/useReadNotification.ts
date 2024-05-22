import { useMutation, useQueryClient } from "react-query";
import { axiosInstance } from "../../api/server";

// Function to mark a notification as read
const readNotification = async (notificationId: string) => {
  const { data } = await axiosInstance.put(
    `/notifications/read_notification/${notificationId}`
  );
  return data;
};

export function useReadNotification() {
  const queryClient = useQueryClient();

  const { isLoading, mutateAsync } = useMutation(readNotification, {
    onSuccess: () => {
      // Invalidate and refetch notifications after a successful mutation
      queryClient.invalidateQueries("notifications");
    },
  });

  return { isReading: isLoading, readNotification: mutateAsync };
}
