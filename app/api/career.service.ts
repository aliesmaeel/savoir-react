import axios from "axios";
import { envConfig } from "~/config/envConfig";
import { ApiClient } from "./apiClient";

const api = new ApiClient();

export async function getAllCareers() {
  return api.get(`/api/careers`);
}

export async function applyToCareer(careerId: string | number, formData: FormData) {
  // For FormData, let the browser set Content-Type automatically (includes boundary)
  const baseUrl = envConfig.baseUrl?.replace(/\/+$/, "");
  const token = localStorage.getItem("accessToken");
  
  const headers: Record<string, string> = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await axios.post(
    `${baseUrl}/api/career_apply/${careerId}`,
    formData,
    { headers }
  );
  
  return response.data;
}

