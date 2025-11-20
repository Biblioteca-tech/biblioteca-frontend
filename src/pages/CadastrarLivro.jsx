"use client"

import { ArrowLeft, BookOpen, ImageIcon, Upload } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { livrosAPI } from "../api/api"

export const CadastrarLivro = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    titulo: "",
    autor: "",
    editora: "",
    ano_publicacao: "",
    genero: "",
    sinopse: "",
    idioma: "",
    preco: "",
  })
  const [pdfFile, setPdfFile] = useState(null)
  const [capaFile, setCapaFile] = useState(null)
  const [capaPreview, setCapaPreview] = useState(null)

  const generosOptions = [
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

  const idiomasOptions = ["PORTUGUES", "INGLES"]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handlePdfChange = (e) => {
    const file = e.target.files[0]
    if (file && file.type === "application/pdf") {
      setPdfFile(file)
    } else {
      toast.error("Por favor, selecione um arquivo PDF válido")
      e.target.value = ""
    }
  }

  const handleCapaChange = (e) => {
    const file = e.target.files[0]
    if (file && (file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/jpg")) {
      setCapaFile(file)
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setCapaPreview(reader.result)
      }
      reader.readAsDataURL(file)
    } else {
      toast.error("Por favor, selecione uma imagem válida (JPG ou PNG)")
      e.target.value = ""
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!pdfFile) {
      toast.error("Por favor, selecione um arquivo PDF")
      return
    }

    if (!capaFile) {
      toast.error("Por favor, selecione uma imagem de capa")
      return
    }

    setLoading(true)

    try {
      const data = new FormData()

      const livro = {
        titulo: formData.titulo,
        autor: formData.autor,
        editora: formData.editora,
        ano_publicacao: formData.ano_publicacao,
        genero: formData.genero,
        sinopse: formData.sinopse,
        idioma: formData.idioma,
        preco: formData.preco
      }

      data.append("livro", new Blob([JSON.stringify(livro)], { type: "application/json" }))
      data.append("pdf", pdfFile)
      data.append("capa", capaFile)

      await livrosAPI.cadastrar(data)
      toast.success("Livro cadastrado com sucesso!")
      navigate("/funcionario/livros")
    } catch (error) {
      toast.error(error.response?.data?.message || "Erro ao cadastrar livro")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/funcionario/livros")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Voltar para Gerenciar Livros</span>
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">Cadastrar Novo Livro</h1>
          </div>
          <p className="text-muted-foreground">Adicione um novo e-book ao catálogo da biblioteca</p>
        </div>

        {/* Form */}
        <div className="bg-card border border-border rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Título */}
              <div className="md:col-span-2">
                <label htmlFor="titulo" className="block text-sm font-medium mb-2">
                  Título do Livro <span className="text-destructive">*</span>
                </label>
                <input
                  id="titulo"
                  name="titulo"
                  type="text"
                  value={formData.titulo}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Ex: O Senhor dos Anéis"
                  required
                />
              </div>

              {/* Autor */}
              <div>
                <label htmlFor="autor" className="block text-sm font-medium mb-2">
                  Autor <span className="text-destructive">*</span>
                </label>
                <input
                  id="autor"
                  name="autor"
                  type="text"
                  value={formData.autor}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Ex: J.R.R. Tolkien"
                  required
                />
              </div>

              {/* Editora */}
              <div>
                <label htmlFor="editora" className="block text-sm font-medium mb-2">
                  Editora <span className="text-destructive">*</span>
                </label>
                <input
                  id="editora"
                  name="editora"
                  type="text"
                  value={formData.editora}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Ex: HarperCollins"
                  required
                />
              </div>

              {/* Ano de Publicação */}
              <div>
                <label htmlFor="ano_publicacao" className="block text-sm font-medium mb-2">
                  Ano de Publicação <span className="text-destructive">*</span>
                </label>
                <input
                  id="ano_publicacao"
                  name="ano_publicacao"
                  type="number"
                  min="1000"
                  max={new Date().getFullYear()}
                  value={formData.ano_publicacao}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Ex: 2023"
                  required
                />
              </div>

              {/* Gênero */}
              <div>
                <label htmlFor="genero" className="block text-sm font-medium mb-2">
                  Gênero <span className="text-destructive">*</span>
                </label>
                <select
                  id="genero"
                  name="genero"
                  value={formData.genero}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white text-black border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                >
                  <option value="">Selecione um gênero</option>
                  {generosOptions.map((genero) => (
                    <option key={genero} value={genero}>
                      {genero}
                    </option>
                  ))}
                </select>
              </div>

              {/* Idioma */}
              <div>
                <label htmlFor="idioma" className="block text-sm font-medium mb-2">
                  Idioma <span className="text-destructive">*</span>
                </label>
                <select
                  id="idioma"
                  name="idioma"
                  value={formData.idioma}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white text-black border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                >
                  <option value="">Selecione um idioma</option>
                  {idiomasOptions.map((idioma) => (
                    <option key={idioma} value={idioma}>
                      {idioma}
                    </option>
                  ))}
                </select>
              </div>

              {/* Preço */}
              <div>
                <label htmlFor="preco" className="block text-sm font-medium mb-2">
                  Preço (R$) <span className="text-destructive">*</span>
                </label>
                <input
                  id="preco"
                  name="preco"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.preco}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Ex: 29.90"
                  required
                />
              </div>

              {/* Sinopse */}
              <div className="md:col-span-2">
                <label htmlFor="sinopse" className="block text-sm font-medium mb-2">
                  Sinopse <span className="text-destructive">*</span>
                </label>
                <textarea
                  id="sinopse"
                  name="sinopse"
                  value={formData.sinopse}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  placeholder="Descreva brevemente o conteúdo do livro..."
                  required
                />
              </div>
            </div>

            {/* Capa Upload */}
            <div>
              <label htmlFor="capa" className="block text-sm font-medium mb-2">
                Capa do Livro <span className="text-destructive">*</span>
              </label>
              <div className="flex gap-4">
                <div className="flex-1">
                  <input
                    id="capa"
                    type="file"
                    accept="image/jpeg,image/png,image/jpg"
                    onChange={handleCapaChange}
                    className="hidden"
                    required
                  />
                  <label
                    htmlFor="capa"
                    className="flex items-center justify-center gap-3 w-full px-4 py-8 bg-background border-2 border-dashed border-input rounded-lg cursor-pointer hover:border-primary transition-colors"
                  >
                    <ImageIcon className="h-6 w-6 text-muted-foreground" />
                    <div className="text-center">
                      {capaFile ? (
                        <div>
                          <p className="text-sm font-medium text-foreground">{capaFile.name}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {(capaFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-sm font-medium text-foreground">Clique para selecionar a capa</p>
                          <p className="text-xs text-muted-foreground mt-1">JPG ou PNG</p>
                        </div>
                      )}
                    </div>
                  </label>
                </div>
                {capaPreview && (
                  <div className="w-32 h-48 rounded-lg overflow-hidden border border-border">
                    <img
                      src={capaPreview || "/placeholder.svg"}
                      alt="Preview da capa"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* PDF Upload */}
            <div>
              <label htmlFor="pdf" className="block text-sm font-medium mb-2">
                Arquivo PDF do E-book <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <input
                  id="pdf"
                  type="file"
                  accept="application/pdf"
                  onChange={handlePdfChange}
                  className="hidden"
                  required
                />
                <label
                  htmlFor="pdf"
                  className="flex items-center justify-center gap-3 w-full px-4 py-8 bg-background border-2 border-dashed border-input rounded-lg cursor-pointer hover:border-primary transition-colors"
                >
                  <Upload className="h-6 w-6 text-muted-foreground" />
                  <div className="text-center">
                    {pdfFile ? (
                      <div>
                        <p className="text-sm font-medium text-foreground">{pdfFile.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {(pdfFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm font-medium text-foreground">Clique para selecionar o PDF</p>
                        <p className="text-xs text-muted-foreground mt-1">Apenas arquivos PDF são aceitos</p>
                      </div>
                    )}
                  </div>
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate("/funcionario/livros")}
                className="flex-1 py-3 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Cadastrando..." : "Cadastrar Livro"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
