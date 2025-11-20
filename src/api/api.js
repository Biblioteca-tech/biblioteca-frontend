import axios from "axios"
import { toast } from "react-toastify"

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://api.abracos.tech"

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

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


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      // 401 - Token inválido
      if (status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        toast.error("Sessão expirada. Por favor, faça login novamente.");
        window.location.href = "/login";
      }
      if (status === 403) {
        toast.error("Você não tem permissão para acessar este recurso.");
      }
      if (status === 409) {
        if (
          data?.message?.toLowerCase().includes("email") &&
          data?.message?.toLowerCase().includes("exist")
        ) {
          toast.error("Já existe um e-mail cadastrado com esse endereço.");
          return Promise.reject(error);
        }
      }

      if (status >= 500) {
        toast.error("Erro no servidor. Tente novamente mais tarde.");
      }
    } else if (error.request) {
      toast.error("Erro de conexão. Verifique sua internet.");
    }
    return Promise.reject(error);
  }
);


export default api

export const authAPI = {
  cadastro: (data) => api.post("/auth/cadastro", data),
  login: (data) => api.post("/auth/login", data),
}

export const clienteAPI = {
  getPerfil: () => api.get("/cliente/perfil"),
  atualizarPerfil: (data) => api.put("/cliente/atualizar", data),
  getClientes: () => api.get("/cliente/ativos"),
}

export const livrosAPI = {
  removerLivro: (id) => api.delete(`/meus/remover/${id}`),
  getAtivos: () => api.get("/livros/ativos"),
  getMeusLivros: () => api.get("/meus"),
  getById: (id) => api.get(`/livros/${id}`),
  cadastrar: (formData) =>
    api.post("/livros/cadastrar", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      },
    }),
  atualizar: (id, data) => api.put(`/livros/atualizarLivro/${id}`, data),
  toggleStatus: (id) => api.patch(`/livros/toggle-status/${id}`),
  getFuncionarioLivros: () => api.get("/livros"),
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
  atualizarCapa: (id, file) => {
    const formData = new FormData()
    formData.append("capa", file)

    return api.put(`/livros/${id}/capa`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  },
  getStatusLivros: () => api.get("/livros/status"),

}

export const vendaAPI = {
  vender: (clienteId, livroId) => api.post(`/venda/vender?email=${clienteId}&livroId=${livroId}`),
  alugar: (clienteEmail, livroId) => api.post(`/alugueis/alugar?email=${clienteEmail}&livroId=${livroId}`),
  getRelatorio: () => api.get("/venda/relatorio"),
  getRelatorioIdiomas: () => api.get("/venda/relatorio-idiomas"),
}

export const aluguelAPI = {
  getRelatorioAluguel: () => api.get("/venda/relatorio"),
  getHistoricoAluguel: () => api.get("/alugueis/historico-aluguel"),
}


export const adminAPI = {
  atualizarPerfil: (data) => api.put("/adm/perfil", data),
  getPerfil: () => api.get("/adm/perfil"),
  cadastrarFuncionario: (data) => api.post("/auth/cadastrar-funcionario", data),
  getFuncionarios: () => api.get("/adm/buscar-funcionario"),
  deletarFuncionario: (id) => api.delete(`/adm/deletar/${id}`),
  alterarStatusCliente: (id, status) => api.put(`/usuarios/alterarStatus/${id}?novoStatus=${status}`),
  atualizarFuncionario: (id, data) => api.put(`/adm/atualizarDados/${id}`, data),
  getFuncionarioById: (id) => api.get(`/adm/funcionario/${id}`),
  getPdfAdm: (id) => {
    const token = localStorage.getItem("token")
    return api.get(`/pdf/${id}`, {
      responseType: "blob",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  },

  // Cliente
  getClientes: () => api.get("/adm/cliente"),
  deletarCliente: (id) => api.delete(`/adm/cliente/deletar/${id}`),
}
