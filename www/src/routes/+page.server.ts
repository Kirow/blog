import { getAllPosts } from "$lib/posts";

export const load = async () => {
  const allPosts = await getAllPosts();
  return { allPosts };
};
