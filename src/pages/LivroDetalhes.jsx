"use client"

import { ArrowLeft, BookOpen, Building2, Calendar, Clock, Globe, ShoppingCart } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "react-toastify"
import { livrosAPI } from "../api/api"
import { useAuth } from "../auth/AuthProvider"
import { useCart } from "../context/CartContext"
import { API_BASE_URL } from "../api/api"

export const LivroDetalhes = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [livro, setLivro] = useState(null)
  const [loading, setLoading] = useState(true)
  const { addToCart, addToRental } = useCart()
  const { user, isCliente } = useAuth()

  useEffect(() => {
    fetchLivro()
  }, [id])

  const fetchLivro = async () => {
    try {
      const response = await livrosAPI.getById(id)
      setLivro(response.data)
    } catch (error) {
      toast.error("Erro ao carregar detalhes do livro")
      navigate("/")
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (!user) {
      toast.info("Faça login para adicionar livros ao carrinho")
      navigate("/login")
      return
    }

    if (!isCliente()) {
      toast.error("Apenas clientes podem comprar livros")
      return
    }

    addToCart(livro)
    toast.success(`${livro.titulo} adicionado ao carrinho!`)
  }

  const handleRentBook = () => {
    if (!user) {
      toast.info("Faça login para alugar livros")
      navigate("/login")
      return
    }

    if (!isCliente()) {
      toast.error("Apenas clientes podem alugar livros")
      return
    }

    addToRental(livro)
    toast.success(`${livro.titulo} adicionado ao carrinho de aluguel!`)
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
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-5 w-5" />
          Voltar para catálogo
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Book Cover */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-xl overflow-hidden sticky top-8">
              <div className="aspect-[3/4] bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center overflow-hidden">
                {livro.capaPath ? (
                  <img
                    src={`${API_BASE_URL}/livros/capa/${livro.capaPath}`}
                    alt={`Capa de ${livro.titulo}`}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <BookOpen className="h-24 w-24 text-primary/40" />
                )}
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs px-3 py-1.5 bg-primary/10 text-primary rounded-full font-medium">
                    {livro.genero}
                  </span>
                  <span className="text-2xl font-bold text-primary">R$ {livro.preco?.toFixed(2) ?? "0.00"}</span>
                </div>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleAddToCart}
                    className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    Comprar Livro
                  </button>
                  <button
                    onClick={handleRentBook}
                    className="w-full py-3 bg-accent text-accent-foreground rounded-lg font-medium hover:bg-accent/90 transition-colors flex items-center justify-center gap-2"
                  >
                    <Clock className="h-5 w-5" />
                    Alugar Livro
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Book Details */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-xl p-8">
              <h1 className="text-4xl font-bold text-balance mb-2">{livro.titulo}</h1>
              <p className="text-xl text-muted-foreground mb-6">por {livro.autor}</p>

              {/* Book Info Grid */}
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
                    <p className="font-medium">{livro.ano_publicacao || "Não informado"}</p>
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

              {/* Synopsis */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Sinopse</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {livro.sinopse || "Sinopse não disponível para este livro."}
                </p>
              </div>

              {/* Preview Section */}
              <div className="border-t border-border pt-8">
                <h2 className="text-2xl font-bold mb-4">Prévia do Livro</h2>
                <p className="text-muted-foreground mb-4">
                  Compre ou alugue este livro para ter acesso completo ao conteúdo em PDF.
                </p>
                <div className="bg-muted/30 rounded-lg p-8 text-center">
                  <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">Prévia disponível após a compra ou aluguel</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
