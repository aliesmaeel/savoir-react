import { ApiClient } from "./apiClient";

const api = new ApiClient();

// export async function getAllOffPlans(page: any, limit: any) {
//   return api.get(`/api/offplan-projects?page=${page}&limit=${limit}`);
// }

export async function getAllOffPlans(page: any, limit: any, body: any, sortField: string = "updated_at", sortOrder: string = "desc") {
  return api.post(
    `/api/search-offplan?page=${page}&sort_field=${sortField}&sort_order=${sortOrder}&limit=${limit}`,
    body
  );
}

export async function getOffPlanPage(offPlanSlug: string) {
  return api.get(`/api/offplan-projects/${offPlanSlug}`);
}

export async function getOffSearch() {
  return api.get(`/api/search-offplan-suggestions`);
}
