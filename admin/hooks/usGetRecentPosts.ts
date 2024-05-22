import { useQuery } from "react-query";
import { Post } from "../types/post";
import { axiosInstance } from "../../api/server";

const fetchRecentPosts = async (): Promise<Post[]> => {
  const { data } = await axiosInstance.get(`line_works/recent/posts`);
  return data.posts;
};

export function useGetRecentPosts() {
  return useQuery(["recent-posts"], () => fetchRecentPosts(), {
    // suspense: true,
    // suspense: true,
  });
}
