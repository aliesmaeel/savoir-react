import { ApiClient } from "./apiClient";

const api = new ApiClient();

export async function getAllNews() {
  return api.get(`/api/news`);
}

export async function getNewsPage(newsSlug: string) {
  return api.get(`/api/news/${newsSlug}`);
}

export async function getNewsShare(newsId: any) {
  return api.get(`/api/news/updateShares/${newsId}`);
}
