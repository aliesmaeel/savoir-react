// api/home.service.ts

import { ApiClient } from "./apiClient";

const api = new ApiClient();

export async function getHomeInfo() {
  return api.get(`/api/home`);
}

export async function getSuggestionSearch() {
  return api.get(`/api/search-suggestions`);
}

export async function search(page: any, limit: any, body: any) {
  return api.post(`/api/search?page=${page}&limit=${limit}`, body);
}
