import { ApiClient } from "./apiClient";

const api = new ApiClient();

// export async function getAllOffPlans(page: any, limit: any) {
//   return api.get(`/api/offplan-projects?page=${page}&limit=${limit}`);
// }

export async function getAllOffPlans(page: any, limit: any, body: any) {
  return api.post(
    `/api/search-offplan?page=${page}&sort_field=updated_at&sort_order=desc&limit=${limit}`,
    body
  );
}

export async function getOffPlanPage(offPlanSlug: string) {
  return api.get(`/api/offplan-projects/${offPlanSlug}`);
}

export async function getOffSearch() {
  return api.get(`/api/search-offplan-suggestions`);
}
