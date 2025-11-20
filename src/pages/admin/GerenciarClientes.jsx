"use client"

import { Ban, Calendar, CreditCard, Search, Trash2, Users } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { adminAPI } from "../../api/api"

export const GerenciarClientes = () => {
  const [clientes, setClientes] = useState([])
  const [filteredClientes, setFilteredClientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchClientes()
  }, [])

  useEffect(() => {
    filterClientes()
  }, [searchTerm, clientes])

  const fetchClientes = async () => {
    try {
      const response = await adminAPI.getClientes()
      setClientes(response.data)
      setFilteredClientes(response.data)
    } catch (error) {
      toast.error("Erro ao carregar clientes")
    } finally {
      setLoading(false)
    }
  }

  const filterClientes = () => {
    if (searchTerm) {
      const filtered = clientes.filter(
        (cliente) =>
          cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cliente.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredClientes(filtered)
    } else {
      setFilteredClientes(clientes)
    }
  }

  const handleDelete = async (id, nome) => {
    if (window.confirm(`Tem certeza que deseja excluir o cliente ${nome}?`)) {
      try {
        await adminAPI.deletarCliente(id)
        toast.success("Cliente excluído com sucesso!")
        fetchClientes()
      } catch (error) {
        toast.error("Erro ao excluir cliente")
      }
    }
  }

  const handleDeactivate = async (cliente) => {
    const novoStatus = cliente.statusCliente === "ATIVO" ? "INATIVO" : "ATIVO"

    const verboAcao = novoStatus === "INATIVO" ? "desativar" : "reativar"
    const acaoToast = novoStatus === "INATIVO" ? "desativado" : "reativado"

    if (window.confirm(`Deseja ${verboAcao} o cliente ${cliente.nome}?`)) {
      try {
        await adminAPI.alterarStatusCliente(cliente.id, novoStatus)
        toast.info(`Cliente ${cliente.nome} foi ${acaoToast}.`)
        fetchClientes()
      } catch (error) {
        toast.error("Erro ao alterar status do cliente")
      }
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("pt-BR")
  }

  const formatCPF = (cpf) => {
    if (!cpf) return "N/A"
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Users className="h-12 w-12 text-primary animate-pulse mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando clientes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Gerenciar Clientes</h1>
            <p className="text-muted-foreground">Visualize e gerencie todos os clientes cadastrados</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total de Clientes</p>
                  <p className="text-3xl font-bold">{clientes.length}</p>
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

        {/* Clientes List */}
        {filteredClientes.length === 0 ? (
          <div className="text-center py-16 bg-card border border-border rounded-xl">
            <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">Nenhum cliente encontrado</h3>
            <p className="text-muted-foreground">
              {searchTerm ? "Tente ajustar sua busca" : "Nenhum cliente cadastrado ainda"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredClientes.map((cliente) => (
              <div
                key={cliente.id}
                className={`bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow ${!cliente.ativo ? "opacity-50" : ""
                  }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{cliente.nome}</h3>
                      <p className="text-sm text-muted-foreground">{cliente.email}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDeactivate(cliente)}
                      className="p-2 text-yellow-500 hover:bg-yellow-100 rounded-lg transition-colors"
                      title="Desativar"
                    >
                      <Ban className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(cliente.id, cliente.nome)}
                      className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                      title="Excluir"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CreditCard className="h-4 w-4" />
                    <span>CPF: {formatCPF(cliente.cpf)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Nascimento: {formatDate(cliente.data_nascimento)}</span>
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
