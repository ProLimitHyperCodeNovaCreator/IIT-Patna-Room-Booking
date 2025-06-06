import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// 👇 Fix: use InternalAxiosRequestConfig
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    return config;
  },
  (error: AxiosError): Promise<AxiosError> => {
    return Promise.reject(error);
  }
);

// Response interceptor
instance.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    return response;
  },
  (error: AxiosError): Promise<AxiosError> => {
    if (
      error.response?.status === 401 &&
      window.location.pathname !== "/login"
    ) {
      handleUnauthorized();
    }
    return Promise.reject(error);
  }
);

// Unauthorized handler
function handleUnauthorized(): void {
  localStorage.clear();
  sessionStorage.clear();

  instance.get("/auth/logout").catch((err: AxiosError) => {
    console.warn("Failed to hit logout endpoint:", err.message);
  });

  window.location.href = "/login";
}

// Utility functions
export const get = <T>(url: string, params?: any) =>
  instance.get<T>(url, { params });

export const post = <T>(url: string, data: any) =>
  instance.post<T>(url, data);

export const put = <T>(url: string, data: any) =>
  instance.put<T>(url, data);

export const deleteRequest = <T>(url: string) => instance.delete<T>(url);

export default instance;