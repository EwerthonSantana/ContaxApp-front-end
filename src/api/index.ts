// src/api/index.ts
import axios, { AxiosInstance, AxiosError } from "axios";
import router from "../router";
// Certifique-se de que o roteador foi importado corretamente
// Se o seu router não for exportado como default, ajuste o import.

// ** Configure a URL base da sua API aqui! **
const API_BASE_URL = "http://localhost:8081/api/";

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor de Requisição: Adiciona o token JWT
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Interceptor de Resposta: Trata erros 401
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401 && router) {
      console.error("Token expirado ou inválido. Redirecionando.");
      localStorage.removeItem("token");
      // Garante que o redirecionamento só aconteça se a rota não for login
      if (router.currentRoute.value.name !== "login") {
        router.push({ name: "login" });
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
