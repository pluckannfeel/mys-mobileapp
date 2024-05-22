import { useQuery } from "react-query";
import { Post } from "../../admin/types/post";
import { axiosInstance } from "../../api/server";

const fetchNews = async (): Promise<Post[]> => {
  const { data } = await axiosInstance.get(`line_works/news/posts`);
  return data.posts;
};

export function useNews() {
  return useQuery(["news"], () => fetchNews(), {});
}
