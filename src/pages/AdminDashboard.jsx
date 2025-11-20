"use client"

import { BookOpen, Calendar, DollarSign, TrendingUp, Users } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { vendaAPI, clienteAPI, adminAPI } from "../api/api"

export const AdminDashboard = () => {
  const [totalClientes, setTotalClientes] = useState(0)
  const [relatorio, setRelatorio] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalVendas: 0,
    receitaTotal: 0,
    livrosMaisVendidos: 0,
    clientesAtivos: 0,
  })

  useEffect(() => {
    fetchRelatorio()
    fetchClientes()
  }, [])

  const fetchClientes = async () => {
    try {
      const response = await adminAPI.getClientes()
      setTotalClientes(response.data.length)
    } catch (error) {
      toast.error("Erro ao carregar clientes")
    }
  }

  const fetchRelatorio = async () => {
    try {
      const response = await vendaAPI.getRelatorio()
      const vendas = response.data
      setRelatorio(vendas)
      calculateStats(vendas)
    } catch (error) {
      toast.error("Erro ao carregar relatório de vendas")
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (vendas) => {
    const totalVendas = vendas.length
    const receitaTotal = vendas.reduce((sum, venda) => sum + venda.preco, 0)

    const clientesUnicos = new Set(vendas.map((v) => v.clienteEmail))
    const clientesAtivos = clientesUnicos.size


    const livrosVendidos = vendas.reduce((acc, venda) => {
      acc[venda.livroTitulo] = (acc[venda.livroTitulo] || 0) + 1
      return acc
    }, {})
    const livrosMaisVendidos = Object.keys(livrosVendidos).length

    setStats({
      totalVendas,
      receitaTotal,
      livrosMaisVendidos,
      clientesAtivos,
    })
  }

  const getTopLivros = () => {
    const livrosCount = relatorio.reduce((acc, venda) => {
      acc[venda.livroTitulo] = (acc[venda.livroTitulo] || 0) + 1
      return acc
    }, {})

    return Object.entries(livrosCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([titulo, vendas]) => ({
        titulo: titulo.length > 20 ? titulo.substring(0, 20) + "..." : titulo,
        vendas,
      }))
  }

  const getVendasPorMes = () => {
    const vendasPorMes = relatorio.reduce((acc, venda) => {
      const date = new Date(venda.dataVenda)
      const mes = date.toLocaleDateString("pt-BR", { month: "short", year: "numeric" })
      acc[mes] = (acc[mes] || 0) + 1
      return acc
    }, {})

    return Object.entries(vendasPorMes).map(([mes, vendas]) => ({
      mes,
      vendas,
    }))
  }

  const getReceitaPorGenero = () => {
    const receitaPorGenero = relatorio.reduce((acc, venda) => {
      const genero = venda.livroGenero || "Outros"
      acc[genero] = (acc[genero] || 0) + venda.preco
      return acc
    }, {})

    return Object.entries(receitaPorGenero).map(([genero, receita]) => ({
      name: genero,
      value: receita,
    }))
  }

  const COLORS = ["#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ef4444"]

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
          <TrendingUp className="h-12 w-12 text-primary animate-pulse mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard Administrativo</h1>
          <p className="text-muted-foreground">Visão geral de vendas e estatísticas da biblioteca</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-1">Total de Vendas</p>
            <p className="text-3xl font-bold">{stats.totalVendas}</p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-500" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-1">Receita Total</p>
            <p className="text-3xl font-bold text-green-500">R$ {stats.receitaTotal.toFixed(2)}</p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <BookOpen className="h-6 w-6 text-blue-500" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-1">Livros Vendidos</p>
            <p className="text-3xl font-bold text-blue-500">{stats.livrosMaisVendidos}</p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500/10 rounded-lg">
                <Users className="h-6 w-6 text-purple-500" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-1">Clientes Ativos</p>
            <p className="text-3xl font-bold text-purple-500">{totalClientes}</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Top Selling Books */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-xl font-bold mb-6">Livros Mais Vendidos</h2>
            {getTopLivros().length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={getTopLivros()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="titulo" tick={{ fill: "white" }} />
                  <YAxis tick={{ fill: "white" }} />
                  <Tooltip
                    cursor={{ fill: "hsl(var(--muted))", opacity: 0.15 }}
                    contentStyle={{
                      backgroundColor: "rgba(30, 30, 30, 0.9)", // fundo escuro semi-transparente
                      borderRadius: "8px",
                      border: "none",
                      color: "#fff", // texto branco
                    }}
                    itemStyle={{
                      color: "#fff", // texto dos itens branco
                    }}
                    labelStyle={{
                      color: "#fff", // texto do rótulo branco
                      fontWeight: "bold",
                    }}
                  />
                  <Bar dataKey="vendas" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>

            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Nenhuma venda registrada
              </div>
            )}
          </div>

          {/* Revenue by Genre */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-xl font-bold mb-6">Receita por Gênero</h2>
            {getReceitaPorGenero().length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={getReceitaPorGenero()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {getReceitaPorGenero().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value) => `R$ ${value.toFixed(2)}`}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Nenhuma venda registrada
              </div>
            )}
          </div>
        </div>

        {/* Sales by Month */}
        {getVendasPorMes().length > 0 && (
          <div className="bg-card border border-border rounded-xl p-6 mb-8">
            <h2 className="text-xl font-bold mb-6">Vendas por Mês</h2>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart
                data={getVendasPorMes()}
                margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
              >
                <defs>
                  <linearGradient id="colorVendas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0.2} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />

                <XAxis
                  dataKey="mes"
                  tick={{ fill: "#fff", fontSize: 12, fontWeight: 500 }}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fill: "#fff", fontSize: 12, fontWeight: 500 }}
                  axisLine={false}
                  tickFormatter={(v) => `${v}`}
                />

                <Tooltip
                  cursor={{ fill: "hsl(var(--muted))", opacity: 0.15 }}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "10px",
                    color: "hsl(var(--foreground))",
                    boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
                  }}
                  labelStyle={{ fontWeight: "600", marginBottom: "5px" }}
                  formatter={(value) => [`${value} vendas`, "Quantidade"]}
                />

                <Bar
                  dataKey="vendas"
                  fill="url(#colorVendas)"
                  radius={[8, 8, 0, 0]}
                  animationBegin={0}
                  animationDuration={1200}
                  animationEasing="ease-out"
                  isAnimationActive={true}
                >
                  {getVendasPorMes().map((entry, index) => (
                    <Cell key={`cell-${index}`} cursor="pointer" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}


        {/* Recent Sales Table */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-bold">Vendas Recentes</h2>
          </div>
          {relatorio.length === 0 ? (
            <div className="p-12 text-center">
              <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">Nenhuma venda registrada</h3>
              <p className="text-muted-foreground">As vendas aparecerão aqui quando forem realizadas</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-semibold">Data</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold">Cliente</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold">Livro</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold">Gênero</th>
                    <th className="text-right px-6 py-4 text-sm font-semibold">Valor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {relatorio.slice(0, 10).map((venda, index) => (
                    <tr key={index} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-sm">{formatDate(venda.dataVenda)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">{venda.clienteEmail}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-balance">{venda.livroTitulo}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                          {venda.livroGenero || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="font-semibold text-green-500">R$ {venda.preco?.toFixed(2) ?? "0.00"}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
