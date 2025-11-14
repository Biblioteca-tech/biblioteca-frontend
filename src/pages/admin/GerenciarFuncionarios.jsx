"use client"

import { Calendar, MapPin, Phone, Search, Trash2, UserPlus, Users, Pencil } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { adminAPI } from "../../api/api"

export const GerenciarFuncionarios = () => {
  const [funcionarios, setFuncionarios] = useState([])
  const [filteredFuncionarios, setFilteredFuncionarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    fetchFuncionarios()
  }, [])

  useEffect(() => {
    filterFuncionarios()
  }, [searchTerm, funcionarios])

  const fetchFuncionarios = async () => {
    try {
      const response = await adminAPI.getFuncionarios()
      setFuncionarios(response.data)
      setFilteredFuncionarios(response.data)
    } catch (error) {
      toast.error("Erro ao carregar funcionários")
    } finally {
      setLoading(false)
    }
  }

  const filterFuncionarios = () => {
    if (searchTerm) {
      const filtered = funcionarios.filter(
        (func) =>
          func.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          func.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredFuncionarios(filtered)
    } else {
      setFilteredFuncionarios(funcionarios)
    }
  }

  const handleDelete = async (id, nome) => {
    if (window.confirm(`Tem certeza que deseja excluir o funcionário ${nome}?`)) {
      try {
        await adminAPI.deletarFuncionario(id)
        toast.success("Funcionário excluído com sucesso!")
        fetchFuncionarios()
      } catch (error) {
        toast.error("Erro ao excluir funcionário")
      }
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("pt-BR")
  }

  const formatPhone = (phone) => {
    if (!phone) return "N/A"
    const cleaned = phone.replace(/\D/g, "")
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Users className="h-12 w-12 text-primary animate-pulse mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando funcionários...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Gerenciar Funcionários</h1>
              <p className="text-muted-foreground">Visualize e gerencie todos os funcionários cadastrados</p>
            </div>
            <button
              onClick={() => navigate("/admin/cadastrar-funcionario")}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
            >
              <UserPlus className="h-4 w-4" />
              Novo Funcionário
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total de Funcionários</p>
                  <p className="text-3xl font-bold">{funcionarios.length}</p>
                </div>
                <Users className="h-10 w-10 text-primary/40" />
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar por nome ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        {/* Funcionarios List */}
        {filteredFuncionarios.length === 0 ? (
          <div className="text-center py-16 bg-card border border-border rounded-xl">
            <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">Nenhum funcionário encontrado</h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm ? "Tente ajustar sua busca" : "Comece cadastrando um novo funcionário"}
            </p>
            {!searchTerm && (
              <button
                onClick={() => navigate("/admin/cadastrar-funcionario")}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
              >
                <UserPlus className="h-4 w-4" />
                Cadastrar Primeiro Funcionário
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredFuncionarios.map((funcionario) => (
              <div
                key={funcionario.id}
                className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{funcionario.nome}</h3>
                      <p className="text-sm text-muted-foreground">{funcionario.email}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {/* Botão de editar */}
                    <button
                      onClick={() => navigate(`/admin/editar-funcionario/${funcionario.id}`)}
                      className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>

                    {/* Botão de excluir */}
                    <button
                      onClick={() => handleDelete(funcionario.id, funcionario.nome)}
                      className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                      title="Excluir"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Nascimento: {formatDate(funcionario.data_nascimento)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Admissão: {formatDate(funcionario.dataAdmissao)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{formatPhone(funcionario.numeroTelefone)}</span>
                  </div>
                  <div className="flex items-start gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4 mt-0.5" />
                    <span className="flex-1">{funcionario.endereco || "N/A"}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
