import { ApiClient } from "./apiClient";

const api = new ApiClient();

export async function getAllBlogs() {
  return api.get(`/api/blogs`);
}

export async function getBlogPage(blogSlug: string) {
  return api.get(`/api/blogs/${blogSlug}`);
}
