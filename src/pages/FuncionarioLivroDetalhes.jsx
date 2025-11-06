"use client"

import { ArrowLeft, BookOpen, Building2, Calendar, Edit, FileText, Globe, Power, Save, X } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "react-toastify"
import { livrosAPI } from "../api/api"

export const FuncionarioLivroDetalhes = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [livro, setLivro] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [pdfUrl, setPdfUrl] = useState(null)
  const [formData, setFormData] = useState({
    titulo: "",
    autor: "",
    editora: "",
    anoPublicacao: "",
    genero: "",
    sinopse: "",
    idioma: "",
    preco: "",
    ativo: true,
  })

  const generos = [
    "ROMANCE",
    "CONTO",
    "DRAMA",
    "FANTASIA",
    "MEMORIAS",
    "MANGA",
    "TERROR",
    "FICCAO",
    "DOCUMENTARIO",
    "ACAO",
    "SUSPENSE",
    "DORAMA",
    "INFANTIL",
  ]

  const idiomas = ["PORTUGUES", "INGLES"]

  useEffect(() => {
    fetchLivro()
    fetchPdf()
  }, [id])

  const fetchLivro = async () => {
    try {
      const response = await livrosAPI.getById(id)
      setLivro(response.data)
      setFormData({
        titulo: response.data.titulo || "",
        autor: response.data.autor || "",
        editora: response.data.editora || "",
        anoPublicacao: response.data.ano_publicacao || "",
        genero: response.data.genero || "",
        sinopse: response.data.sinopse || "",
        idioma: response.data.idioma || "",
        preco: response.data.preco || "",
        ativo: response.data.ativo ?? true,
      })
    } catch (error) {
      toast.error("Erro ao carregar detalhes do livro")
      navigate("/funcionario/livros")
    } finally {
      setLoading(false)
    }
  }

  const fetchPdf = async () => {
    try {
      const response = await livrosAPI.getPdf(id)
      const url = URL.createObjectURL(response.data)
      setPdfUrl(url)
    } catch (error) {
      console.error("Erro ao carregar PDF:", error)
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSave = async () => {
    try {
      await livrosAPI.atualizar(id, {
        ...formData,
        ano_publicacao: formData.anoPublicacao, // 👈 converte para o formato do backend
      })
      toast.success("Livro atualizado com sucesso!")
      setEditMode(false)
      fetchLivro()
    } catch (error) {
      toast.error(error.response?.data?.message || "Erro ao atualizar livro")
    }
  }

  const handleToggleStatus = async () => {
    try {
      await livrosAPI.toggleStatus(id)
      toast.success(`Livro ${livro.ativo ? "desativado" : "ativado"} com sucesso!`)
      fetchLivro()
    } catch (error) {
      toast.error("Erro ao alterar status do livro")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-12 w-12 text-primary animate-pulse mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando detalhes...</p>
        </div>
      </div>
    )
  }

  if (!livro) return null

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate("/funcionario/livros")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Voltar para lista
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={handleToggleStatus}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${livro.ativo
                  ? "bg-muted text-muted-foreground hover:bg-muted/80"
                  : "bg-green-500/10 text-green-500 hover:bg-green-500/20"
                }`}
            >
              <Power className="h-4 w-4" />
              {livro.ativo ? "Desativar" : "Ativar"}
            </button>
            {!editMode ? (
              <button
                onClick={() => setEditMode(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                <Edit className="h-4 w-4" />
                Editar
              </button>
            ) : (
              <>
                <button
                  onClick={() => setEditMode(false)}
                  className="flex items-center gap-2 px-4 py-2 bg-muted text-muted-foreground rounded-lg font-medium hover:bg-muted/80 transition-colors"
                >
                  <X className="h-4 w-4" />
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
                >
                  <Save className="h-4 w-4" />
                  Salvar
                </button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Book Info */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-xl p-6 sticky top-8">
              {/* Book Cover */}
              <div className="aspect-[3/4] overflow-hidden">
                {livro.capaPath ? (
                  <img
                    src={`http://localhost:8080/livros/capa/${livro.capaPath}`}
                    alt={livro.titulo}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <BookOpen className="h-16 w-16 text-primary/40" />
                  </div>
                )}
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  {livro.ativo ? (
                    <span className="text-xs px-2 py-1 bg-green-500/10 text-green-500 rounded-full">Ativo</span>
                  ) : (
                    <span className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded-full">Inativo</span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Preço</span>
                  <span className="text-lg font-bold text-primary">R$ {livro.preco?.toFixed(2) ?? "0.00"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Gênero</span>
                  <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">{livro.genero}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Book Details & PDF Viewer */}
          <div className="lg:col-span-2 space-y-6">
            {/* Details Form */}
            <div className="bg-card border border-border rounded-xl p-8">
              {editMode ? (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Título</label>
                    <input
                      type="text"
                      name="titulo"
                      value={formData.titulo}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Autor</label>
                      <input
                        type="text"
                        name="autor"
                        value={formData.autor}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Editora</label>
                      <input
                        type="text"
                        name="editora"
                        value={formData.editora}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Ano</label>
                      <input
                        type="number"
                        name="anoPublicacao"
                        value={formData.anoPublicacao}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Gênero</label>
                      <select
                        name="genero"
                        value={formData.genero}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 bg-[#1E1E2F] text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4B92DB] appearance-none cursor-pointer"
                      >
                        {generos.map((g) => (
                          <option key={g} value={g}>
                            {g}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Idioma</label>
                      <select
                        name="idioma"
                        value={formData.idioma}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 bg-[#1E1E2F] text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4B92DB] appearance-none cursor-pointer"
                      >
                        {idiomas.map((i) => (
                          <option key={i} value={i}>
                            {i}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Preço (R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      name="preco"
                      value={formData.preco}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Sinopse</label>
                    <textarea
                      name="sinopse"
                      value={formData.sinopse}
                      onChange={handleInputChange}
                      rows={6}
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="ativo"
                      name="ativo"
                      checked={formData.ativo}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-2 focus:ring-ring"
                    />
                    <label htmlFor="ativo" className="text-sm font-medium">
                      Livro ativo
                    </label>
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="text-4xl font-bold text-balance mb-2">{livro.titulo}</h1>
                  <p className="text-xl text-muted-foreground mb-6">por {livro.autor}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
                      <Building2 className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Editora</p>
                        <p className="font-medium">{livro.editora || "Não informado"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
                      <Calendar className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Ano de Publicação</p>
                        <p className="font-medium">{livro.anoPublicacao || "Não informado"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
                      <Globe className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Idioma</p>
                        <p className="font-medium">{livro.idioma || "Não informado"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
                      <BookOpen className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Gênero</p>
                        <p className="font-medium">{livro.genero}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold mb-4">Sinopse</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      {livro.sinopse || "Sinopse não disponível para este livro."}
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* PDF Viewer */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <FileText className="h-6 w-6 text-primary" />
                Visualizar PDF
              </h2>
              {pdfUrl ? (
                <div className="border border-border rounded-lg overflow-hidden" style={{ height: "600px" }}>
                  <iframe src={pdfUrl} className="w-full h-full" title="PDF Viewer" />
                </div>
              ) : (
                <div className="bg-muted/30 rounded-lg p-12 text-center">
                  <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">PDF não disponível</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
