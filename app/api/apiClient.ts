import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from "axios";
import { envConfig } from "~/config/envConfig";

export class ApiClient {
  private axiosInstance: AxiosInstance;

  constructor() {
    const baseUrl = envConfig.baseUrl;

    this.axiosInstance = axios.create({
      baseURL: baseUrl?.replace(/\/+$/, ""), // strip trailing slashes
      headers: { "Content-Type": "application/json" },
      withCredentials: false, // ← turn OFF if you use Bearer tokens
    });

    this.axiosInstance.interceptors.request.use((config: any) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers = { ...config.headers, Authorization: `Bearer ${token}` };
      }
      return config;
    });

    this.axiosInstance.interceptors.response.use(
      (r) => r,
      (error) => {
        console.error("API error:", error?.response?.data || error?.message || error);
        return Promise.reject(error);
      }
    );
  }

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const res: AxiosResponse<T> = await this.axiosInstance.get(url, config);
    return res.data;
  }
  public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const res: AxiosResponse<T> = await this.axiosInstance.post(url, data, config);
    return res.data;
  }
  public async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const res: AxiosResponse<T> = await this.axiosInstance.patch(url, data, config);
    return res.data;
  }
  public async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const res: AxiosResponse<T> = await this.axiosInstance.put(url, data, config);
    return res.data;
  }
  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const res: AxiosResponse<T> = await this.axiosInstance.delete(url, config);
    return res.data;
  }
}
