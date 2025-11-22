import { ApiClient } from "./apiClient";
import axios from "axios";
import { envConfig } from "~/config/envConfig";

const api = new ApiClient();

export async function getRealEstateGuides() {
  return api.get(`/api/real-estate-guides`);
}

export async function downloadGuide(id: number | string) {
  const baseUrl = envConfig.baseUrl?.replace(/\/+$/, "") || "";
  const token = localStorage.getItem("accessToken");
  
  const response = await axios.get(`${baseUrl}/api/download-guide/${id}`, {
    responseType: "blob",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  
  return response.data;
}

export async function trackGuideDownload(body: {
  email: string;
  name: string;
  phone: string;
  brochure_name: string;
}) {
  return api.post(`/api/who-downloads-guide`, body);
}

