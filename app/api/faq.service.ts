import { ApiClient } from "./apiClient";

const api = new ApiClient();

export async function getFAQ(type: any) {
  return api.get(`/api/faqs?type=${type}`);
}
