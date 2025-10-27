import { ApiClient } from "./apiClient";

const api = new ApiClient();

export async function getAllNews(page: any, limit: any) {
  return api.get(`/api/news?page=${page}&limit=${limit}`);
}

export async function getNewsPage(newsSlug: string) {
  return api.get(`/api/news/${newsSlug}`);
}

export async function getNewsShare(newsId: any) {
  return api.get(`/api/updateShares/${newsId}?type=news`);
}
