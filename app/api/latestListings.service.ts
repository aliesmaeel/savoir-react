import { ApiClient } from "./apiClient";

const api = new ApiClient();

export async function getLatestListings() {
  return api.get(`/api/leatest-listings`);
}

