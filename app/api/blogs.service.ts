import { ApiClient } from "./apiClient";

const api = new ApiClient();

export async function getAllBlogs(page?: number, limit?: number, sortField: string = "title", sortOrder: string = "desc") {
  const params = new URLSearchParams();
  if (page) params.append("page", String(page));
  if (limit) params.append("limit", String(limit));
  params.append("sort_field", sortField);
  params.append("sort_order", sortOrder);
  const queryString = params.toString();
  return api.get(`/api/blogs${queryString ? `?${queryString}` : ""}`);
}

export async function getBlogPage(blogSlug: string) {
  return api.get(`/api/blogs/${blogSlug}`);
}

export async function getBlogShare(blogId: any) {
  return api.get(`/api/updateShares/${blogId}?type=blog`);
}
