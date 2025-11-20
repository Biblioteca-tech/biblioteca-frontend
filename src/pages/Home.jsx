"use client"

import { BookOpen, Clock, Filter, Search, ShoppingCart } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { livrosAPI } from "../api/api"
import { useAuth } from "../auth/AuthProvider"
import { useCart } from "../context/CartContext"

export const Home = () => {
  const [livros, setLivros] = useState([])
  const [filteredLivros, setFilteredLivros] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGenero, setSelectedGenero] = useState("all")
  const { addToCart, addToRental } = useCart()
  const { user, isCliente } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    fetchLivros()
  }, [])

  useEffect(() => {
    filterLivros()
  }, [searchTerm, selectedGenero, livros])

  const fetchLivros = async () => {
    try {
      const response = await livrosAPI.getAtivos()
      setLivros(response.data)
      setFilteredLivros(response.data)
    } catch (error) {
      toast.error("Erro ao carregar livros")
    } finally {
      setLoading(false)
    }
  }

  const filterLivros = () => {
    let filtered = livros

    if (searchTerm) {
      filtered = filtered.filter(
        (livro) =>
          livro.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          livro.autor.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedGenero !== "all") {
      filtered = filtered.filter((livro) => livro.genero === selectedGenero)
    }

    setFilteredLivros(filtered)
  }

  const handleAddToCart = (e, livro) => {
    e.stopPropagation() // Prevent card click when clicking button
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

  const handleRentBook = (e, livro) => {
    e.stopPropagation()
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

  const handleBookClick = (livroId) => {
    navigate(`/livro/${livroId}`)
  }

  const generos = ["all", ...new Set((livros || []).map((l) => l.genero))];
  
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
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-primary/10 to-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-balance mb-4">Descubra sua próxima leitura</h1>
            <p className="text-lg text-muted-foreground text-pretty">
              Explore nossa coleção de livros digitais e mergulhe em histórias incríveis
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar por título ou autor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Genre Filter */}
          <div className="relative md:w-64">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#4B92DB]" />
            <select
              value={selectedGenero}
              onChange={(e) => setSelectedGenero(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[#1E1E2F] text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4B92DB] appearance-none cursor-pointer"
            >
              <option value="all">Todos os gêneros</option>
              {generos
                .filter((g) => g !== "all")
                .map((genero) => (
                  <option key={genero} value={genero}>
                    {genero}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Results Count */}
        <p className="text-sm text-muted-foreground mb-6">
          {filteredLivros.length} {filteredLivros.length === 1 ? "livro encontrado" : "livros encontrados"}
        </p>

        {/* Books Grid */}
        {filteredLivros.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">Nenhum livro encontrado</h3>
            <p className="text-muted-foreground">Tente ajustar seus filtros de busca</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredLivros.map((livro) => (
              <div
                key={livro.id}
                onClick={() => handleBookClick(livro.id)}
                className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              >
                {/* Book Cover */}
                <div className="aspect-[3/4] overflow-hidden">
                  {livro.capaPath ? (
                    <img
                      src={`http://44.210.85.172:8080/livros/capa/${livro.capaPath}`}
                      alt={livro.titulo}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <BookOpen className="h-16 w-16 text-primary/40" />
                    </div>
                  )}
                </div>


                {/* Book Info */}
                <div className="p-4">
                  <div className="mb-3">
                    <h3 className="font-semibold text-lg text-balance mb-1 line-clamp-2">{livro.titulo}</h3>
                    <p className="text-sm text-muted-foreground">{livro.autor}</p>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">{livro.genero}</span>
                    <span className="text-lg font-bold text-primary">R$ {livro.preco.toFixed(2)}</span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={(e) => handleAddToCart(e, livro)}
                      className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Comprar
                    </button>
                    <button
                      onClick={(e) => handleRentBook(e, livro)}
                      className="flex-1 py-2.5 bg-accent text-accent-foreground rounded-lg font-medium hover:bg-accent/90 transition-colors flex items-center justify-center gap-2"
                    >
                      <Clock className="h-4 w-4" />
                      Alugar
                    </button>
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
