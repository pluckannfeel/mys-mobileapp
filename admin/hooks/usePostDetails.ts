import { useQuery } from "react-query";
import { PostDetails } from "../types/post";
import { axiosInstance } from "../../api/server";

type Details = {
  boardId: string;
  postId: string;
};

const fetchPostDetail = async ({
  boardId,
  postId,
}: Details): Promise<PostDetails> => {
  const { data } = await axiosInstance.get(
    `line_works/boards/${boardId}/posts/${postId}`,
    {
      params: { boardId, postId },
    }
  );
  return data;
};

export function usePostDetails(details: Details) {
  return useQuery(
    ["post-detail", details.boardId, details.postId],
    () => fetchPostDetail(details),
    {
      enabled: !!details.boardId && !!details.postId,
      // refetchOnMount: true,
      // refetchOnWindowFocus: false, // This is for web. Not necessary in React Native.
      staleTime: 0,
    }
  );
}
