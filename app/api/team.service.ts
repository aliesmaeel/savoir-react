import { ApiClient } from "./apiClient";

const api = new ApiClient();

export async function getTeams() {
  return api.get(`/api/teams`);
}

export async function getTeamPage(teamSlug: string) {
  return api.get(`/api/teams/${teamSlug}`);
}
