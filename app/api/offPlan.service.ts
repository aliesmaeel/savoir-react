import { ApiClient } from "./apiClient";

const api = new ApiClient();

export async function getAllOffPlans(page: any, limit: any) {
  return api.get(`/api/offplan-projects?page=${page}&limit=${limit}`);
}

export async function getOffPlanPage(offPlanSlug: string) {
  return api.get(`/api/offplan-projects/${offPlanSlug}`);
}
