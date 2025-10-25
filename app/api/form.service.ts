import { ApiClient } from "./apiClient";

const api = new ApiClient();

export async function subscribe(body: any) {
  return api.post(`/api/subscribe`, body);
}

export async function talkToExpert(body: any) {
  return api.post(`/api/talk-to-expert`, body);
}

export async function contactUs(body: any) {
  return api.post(`/api/contact-us`, body);
}

export async function downloadBrochure(body: any) {
  return api.post(`/api/downloadBrochure`, body);
}
