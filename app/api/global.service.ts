import { ApiClient } from "./apiClient";

const api = new ApiClient();

export async function getGlobalProject(country: any) {
  return api.get(`/api/global-project/${country}`);
}
