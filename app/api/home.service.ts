// api/home.service.ts

import { ApiClient } from "./apiClient";

const api = new ApiClient();

export async function getHomeInfo() {
  return api.get(`/api/home`);
}

export async function getSuggestionSearch() {
  return api.get(`/api/search-suggestions`);
}

export async function search(page: any, limit: any, body: any, sortField: string = "title_en", sortOrder: string = "desc") {
  return api.post(`/api/search?page=${page}&sort_field=${sortField}&sort_order=${sortOrder}&limit=${limit}`, body);
}
