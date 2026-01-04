import { ApiClient } from "./apiClient";

const api = new ApiClient();

export async function getArea(areaSlug: string) {
  return api.get(`/api/popular-areas/${areaSlug}`);
}

export async function getAreaTransactions(areaName: string) {
  return api.get(`/api/area-transactions?area_name=${encodeURIComponent(areaName)}`);
}
