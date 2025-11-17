"use client"

import { BookOpen, Eye, Library, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { livrosAPI } from "../api/api"

export const MeusLivros = () => {
  const [livros, setLivros] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchMeusLivros()
  }, [])

  const fetchMeusLivros = async () => {
    try {
      const response = await livrosAPI.getMeusLivros()
      console.log(response.data)
      setLivros(response.data)
    } catch (error) {
      toast.error("Erro ao carregar seus livros")
    } finally {
      setLoading(false)
    }
  }
  const handleRemoverLivro = async (livroId) => {
    try {
      await livrosAPI.removerLivro(livroId);
      toast.success("Livro removido da sua biblioteca!");

      setLivros((prev) => prev.filter((l) => l.id !== livroId));
    } catch (error) {
      toast.error(error.response?.data || "Não foi possível remover o livro");
    }
  };

  

const handleLerLivro = (livroId) => {
  navigate(`/livro/${livroId}/ler`)
}

if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Library className="h-12 w-12 text-primary animate-pulse mx-auto mb-4" />
        <p className="text-muted-foreground">Carregando sua biblioteca...</p>
      </div>
    </div>
  )
}

return (
  <div className="min-h-screen bg-background">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Minha Biblioteca</h1>
        <p className="text-muted-foreground">Acesse todos os seus livros adquiridos</p>
      </div>

      {/* Books Grid */}
      {livros.length === 0 ? (
        <div className="text-center py-16 bg-card border border-border rounded-2xl">
          <Library className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-semibold mb-2">Sua biblioteca está vazia</h3>
          <p className="text-muted-foreground mb-6">Comece a explorar e adicione livros à sua coleção</p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Explorar Livros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {livros.map((livro) => (
            <div
              key={livro.id}
              className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
            >
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

              {/* Book Info */}
              <div className="p-4">
                <div className="mb-4">
                  <h3 className="font-semibold text-lg text-balance mb-1 line-clamp-2">{livro.titulo}</h3>
                  <p className="text-sm text-muted-foreground">{livro.autor}</p>
                </div>

                <div className="mb-4">
                  <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">{livro.genero}</span>
                </div>

                <button
                  onClick={() => handleLerLivro(livro.livroId)}
                  className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                >
                  <Eye className="h-4 w-4" />
                  Ler Agora
                </button>
                {/* 🔥 Botão de remover */}
                <button
                  onClick={() => handleRemoverLivro(livro.id)}
                  className="w-full py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Remover da Biblioteca
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
)
}
