import { ApiClient } from "./apiClient";

const api = new ApiClient();

export async function getProject(projectSlug: any) {
  return api.get(`/api/property/${projectSlug}`);
}
