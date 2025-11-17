"use client"

import { BookOpen, Calendar, DollarSign, Package } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { aluguelAPI, vendaAPI } from "../api/api"

export const MeusPedidos = () => {
  const [pedidos, setPedidos] = useState([])
  const [alugueis, setAlugueis] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDados()
  }, [])

  const fetchDados = async () => {
    try {
      const [vendasRes, alugueisRes] = await Promise.all([
        vendaAPI.getRelatorio(),
        aluguelAPI.getHistoricoAluguel(),
      ])
      console.log(vendasRes.data)
      console.log(alugueisRes.data)
      setPedidos(vendasRes.data)
      setAlugueis(alugueisRes.data)
    } catch (error) {
      toast.error("Erro ao carregar histórico")
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Package className="h-12 w-12 text-primary animate-pulse mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando histórico...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Meu Histórico</h1>
          <p className="text-muted-foreground">
            Acompanhe suas compras e aluguéis realizados
          </p>
        </div>

        {/* Compras */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" /> Histórico de Compras
          </h2>

          {pedidos.length === 0 ? (
            <div className="text-center py-10 bg-card border border-border rounded-2xl">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma compra encontrada</h3>
              <p className="text-muted-foreground">
                Você ainda não realizou nenhuma compra.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {pedidos.map((pedido) => (
                <div key={pedido.id} className="bg-card border border-border rounded-xl p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{pedido.livroTitulo}</h3>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(pedido.dataVenda)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          <span>R$ {pedido.preco?.toFixed(2) ?? "0.00"}</span>
                        </div>
                      </div>
                    </div>
                    <span className="px-3 py-1.5 bg-green-500/10 text-green-500 rounded-full text-sm font-medium">
                      Concluído
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Aluguéis */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" /> Histórico de Aluguéis
          </h2>

          {alugueis.length === 0 ? (
            <div className="text-center py-10 bg-card border border-border rounded-2xl">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">Nenhum aluguel encontrado</h3>
              <p className="text-muted-foreground">
                Você ainda não realizou nenhum aluguel.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {alugueis.map((aluguel) => (
                <div key={aluguel.id} className="bg-card border border-border rounded-xl p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">
                        {aluguel.livroTitulo ?? "Livro desconhecido"}
                      </h3>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>Início: {formatDate(aluguel.dataAluguel)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>Devolução: {formatDate(aluguel.dataDevolucao)}</span>
                        </div>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                        aluguel.status === "FINALIZADO"
                          ? "bg-green-500/10 text-green-500"
                          : aluguel.status === "ATRASADO"
                          ? "bg-red-500/10 text-red-500"
                          : "bg-yellow-500/10 text-yellow-500"
                      }`}
                    >
                      {aluguel.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
