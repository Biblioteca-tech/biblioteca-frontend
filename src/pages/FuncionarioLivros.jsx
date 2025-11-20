"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { livrosAPI } from "../api/api"
import { toast } from "react-toastify"
import { BookOpen, Plus, Trash2, Search, AlertCircle, Eye } from "lucide-react"

export const FuncionarioLivros = () => {
  const [livros, setLivros] = useState([])
  const [filteredLivros, setFilteredLivros] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteLoading, setDeleteLoading] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchLivros()
  }, [])

  useEffect(() => {
    filterLivros()
  }, [searchTerm, livros])

  const fetchLivros = async () => {
    try {
      const response = await livrosAPI.getFuncionarioLivros()
      setLivros(response.data)
      setFilteredLivros(response.data)
    } catch (error) {
      toast.error("Erro ao carregar livros")
    } finally {
      setLoading(false)
    }
  }

  const filterLivros = () => {
    if (!searchTerm) {
      setFilteredLivros(livros)
      return
    }

    const filtered = livros.filter(
      (livro) =>
        livro.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        livro.autor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        livro.genero.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredLivros(filtered)
  }

  const handleDelete = async (id, titulo) => {
    if (!window.confirm(`Tem certeza que deseja deletar "${titulo}"?`)) {
      return
    }

    setDeleteLoading(id)
    try {
      await livrosAPI.deletar(id)
      toast.success("Livro deletado com sucesso!")
      setLivros((prev) => prev.filter((livro) => livro.id !== id))
    } catch (error) {
      toast.error(error.response?.data?.message || "Erro ao deletar livro")
    } finally {
      setDeleteLoading(null)
    }
  }

  const handleViewBook = (id) => {
    navigate(`/funcionario/livro/${id}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-12 w-12 text-primary animate-pulse mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando livros...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Gerenciar Livros</h1>
            <p className="text-muted-foreground">Visualize e gerencie todos os livros do catálogo</p>
          </div>
          <button
            onClick={() => navigate("/cadastrar-livro")}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Cadastrar Novo Livro
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar por título, autor ou gênero..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total de Livros</p>
                <p className="text-3xl font-bold">{livros.length}</p>
              </div>
              <BookOpen className="h-10 w-10 text-primary/20" />
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Livros Ativos</p>
                <p className="text-3xl font-bold text-green-500">{livros.filter((l) => l.estadoRegistroLivro === "ATIVO").length}</p>
              </div>
              <BookOpen className="h-10 w-10 text-green-500/20" />
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Livros Inativos</p>
                <p className="text-3xl font-bold text-muted-foreground">{livros.filter((l) => !l.estadoRegistroLivro === "ATIVO").length}</p>
              </div>
              <BookOpen className="h-10 w-10 text-muted-foreground/20" />
            </div>
          </div>
        </div>

        {/* Results Count */}
        <p className="text-sm text-muted-foreground mb-4">
          {filteredLivros.length} {filteredLivros.length === 1 ? "livro encontrado" : "livros encontrados"}
        </p>

        {/* Books Table */}
        {filteredLivros.length === 0 ? (
          <div className="text-center py-16 bg-card border border-border rounded-2xl">
            <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">Nenhum livro encontrado</h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm ? "Tente ajustar sua busca" : "Comece cadastrando um novo livro"}
            </p>
            {!searchTerm && (
              <button
                onClick={() => navigate("/cadastrar-livro")}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Cadastrar Primeiro Livro
              </button>
            )}
          </div>
        ) : (
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-semibold">Título</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold">Autor</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold">Gênero</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold">Preço</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold">Status</th>
                    <th className="text-right px-6 py-4 text-sm font-semibold">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredLivros.map((livro) => (
                    <tr key={livro.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-balance">{livro.titulo}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-muted-foreground">{livro.autor}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                          {livro.genero}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-primary">R$ {livro.preco.toFixed(2)}</div>
                      </td>
                      <td className="px-6 py-4">
                        {livro.estadoRegistroLivro === "ATIVO" ? (
                          <span className="text-xs px-2 py-1 bg-green-500/10 text-green-500 rounded-full">Ativo</span>
                        ) : (
                          <span className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded-full">Inativo</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleViewBook(livro.id)}
                            className="p-2 text-muted-foreground hover:text-primary transition-colors"
                            title="Visualizar livro"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(livro.id, livro.titulo)}
                            disabled={deleteLoading === livro.id}
                            className="p-2 text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Deletar livro"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
