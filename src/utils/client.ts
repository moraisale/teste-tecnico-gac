import { API_URLS } from "@/helpers/api";
import axios from "axios";

export const mainClient = axios.create({
  baseURL: API_URLS.main,
  withCredentials: false,
});

mainClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      return Promise.reject({
        message: error.response.data?.error || "Erro desconhecido",
        status: error.response.status,
      });
    }
    return Promise.reject(error);
  }
);