import axios from "axios"
import { toast } from "react-toastify"

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080"

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor - inject JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor - handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response

      // Handle 401 - Unauthorized (token expired or invalid)
      if (status === 401) {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        toast.error("Sessão expirada. Por favor, faça login novamente.")
        window.location.href = "/login"
      }

      // Handle 403 - Forbidden (insufficient permissions)
      if (status === 403) {
        toast.error("Você não tem permissão para acessar este recurso.")
      }

      // Handle other errors
      if (status >= 500) {
        toast.error("Erro no servidor. Tente novamente mais tarde.")
      }
    } else if (error.request) {
      toast.error("Erro de conexão. Verifique sua internet.")
    }

    return Promise.reject(error)
  },
)

export default api

// API endpoints
export const authAPI = {
  cadastro: (data) => api.post("/auth/cadastro", data),
  login: (data) => api.post("/auth/login", data),
}

export const clienteAPI = {
  getPerfil: () => api.get("/cliente/perfil"),
  atualizarPerfil: (data) => api.put("/cliente/atualizar", data),
}

export const livrosAPI = {
  getAtivos: () => api.get("/livros/ativos"),
  getMeusLivros: () => api.get("/cliente/meus-livros"),
  getById: (id) => api.get(`/livros/${id}`),
  cadastrar: (formData) =>
    api.post("/livros/cadastrar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  atualizar: (id, data) => api.put(`/livros/atualizarLivro/${id}`, data),
  toggleStatus: (id) => api.patch(`/livros/toggle-status/${id}`),
  getFuncionarioLivros: () => api.get("/funcionario/livros"),
  deletar: (id) => api.delete(`/livros/deletar/${id}`),
  getPdf: (id) => {
  const token = localStorage.getItem("token")
  return api.get(`/livros/pdf/${id}`, {
    responseType: "blob",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
},
}

export const vendaAPI = {
  vender: (clienteId, livroId) => api.post(`/venda/vender?email=${clienteId}&livroId=${livroId}`),
  alugar: (clienteId, livroId) => api.post(`/venda/alugar?email=${clienteId}&livroId=${livroId}`),
  getRelatorio: () => api.get("/venda/relatorio"),
  getRelatorioAluguel: () => api.get("/venda/relatorio-aluguel"),
}

// Admin API endpoints for managing employees and clients
export const adminAPI = {
  // Employee management
  cadastrarFuncionario: (data) => api.post("/adm/funcionario/cadastro", data),
  getFuncionarios: () => api.get("/adm/buscar-funcionario"),
  deletarFuncionario: (id) => api.delete(`/admin/funcionario/deletar/${id}`),

  // Client management
  getClientes: () => api.get("/adm/cliente"),
  deletarCliente: (id) => api.delete(`/admin/cliente/deletar/${id}`),
}
