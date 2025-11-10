"use client"

import { BarChart3, Book, TrendingUp, Users } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { adminAPI, livrosAPI, vendaAPI } from "../api/api"


export const ExecutiveDashboard = () => {
  const [dados, setDados] = useState({
    funcionariosAtivos: 0,
    ebooksAlugados: 0,
    faturamentoMes: 0,
    faturamentoSemana: 0,
    totalTitulos: 0,
    ativos: 0,
    inativos: 0,
    transacoes: { compra: 0, locacao: 0 },
  })

  const [topVendas, setTopVendas] = useState([])
  const [topAlugueis, setTopAlugueis] = useState([])
  const [vendasPorMes, setVendasPorMes] = useState([])
  const [livrosGenero, setLivrosGenero] = useState([])
  const [idiomasMaisBuscados, setIdiomasMaisBuscados] = useState([])
  const [livrosPorGeneroCliente, setLivrosPorGeneroCliente] = useState([])
  const [livrosPorIdade, setLivrosPorIdade] = useState([])

  useEffect(() => {
    carregarDados()
  }, [])

  const carregarDados = async () => {
    try {
      const [funcRes, vendaRes, aluguelRes, livrosRes] = await Promise.allSettled([
        adminAPI.getFuncionarios(),
        vendaAPI.getRelatorio(),
        vendaAPI.getRelatorioAluguel(),
        livrosAPI.getFuncionarioLivros(),
      ])

      const funcionariosAtivos = funcRes.value?.data?.length || 0
      const vendas = vendaRes.value?.data || []
      const alugueis = aluguelRes.value?.data || []
      const livros = livrosRes.value?.data || []

      const faturamentoMes = vendas
        .filter((v) => new Date(v.dataVenda).getMonth() === new Date().getMonth())
        .reduce((s, v) => s + v.preco, 0)

      const semanaAtual = new Date().getWeek?.() ?? Math.ceil((new Date().getDate() - 1) / 7)
      const faturamentoSemana = vendas
        .filter((v) => {
          const data = new Date(v.dataVenda)
          const semanaVenda = Math.ceil((data.getDate() - 1) / 7)
          return semanaVenda === semanaAtual
        })
        .reduce((s, v) => s + v.preco, 0)

      const ebooksAtivos = livros.filter((l) => l.ativo).length
      const ebooksInativos = livros.filter((l) => !l.ativo).length

      const transacoes = {
        compra: vendas.length,
        locacao: alugueis.length,
      }

      const topVendidos = agruparTop(vendas, "livroTitulo", "vendas")
      const topAlugados = agruparTop(alugueis, "livroTitulo", "alugueis")

      const vendasPorMes = agruparPorMes(vendas)
      const livrosGenero = agruparPorGenero(vendas)
      const idiomasMock = [
        { name: "Português", value: 45 },
        { name: "Inglês", value: 30 },
        { name: "Espanhol", value: 15 },
        { name: "Francês", value: 10 },
      ]

      setDados({
        funcionariosAtivos,
        ebooksAlugados: alugueis.length,
        faturamentoMes,
        faturamentoSemana,
        totalTitulos: livros.length,
        ativos: ebooksAtivos,
        inativos: ebooksInativos,
        transacoes,
      })

      setTopVendas(topVendidos)
      setTopAlugueis(topAlugados)
      setVendasPorMes(vendasPorMes)
      setLivrosGenero(livrosGenero)
      setIdiomasMaisBuscados(idiomasMock)
    } catch (e) {
      toast.error("Erro ao carregar dados executivos.")
    }
  }

  const agruparTop = (lista, campo, nomeCampo) => {
    const contagem = lista.reduce((acc, item) => {
      acc[item[campo]] = (acc[item[campo]] || 0) + 1
      return acc
    }, {})
    return Object.entries(contagem)
      .map(([titulo, qtd]) => ({ titulo, [nomeCampo]: qtd }))
      .sort((a, b) => b[nomeCampo] - a[nomeCampo])
      .slice(0, 5)
  }

  const agruparPorMes = (vendas) => {
    const mapa = vendas.reduce((acc, v) => {
      const mes = new Date(v.dataVenda).toLocaleDateString("pt-BR", { month: "short" })
      acc[mes] = (acc[mes] || 0) + 1
      return acc
    }, {})
    return Object.entries(mapa).map(([mes, vendas]) => ({ mes, vendas }))
  }

  const agruparPorGenero = (vendas) => {
    const mapa = vendas.reduce((acc, v) => {
      const genero = v.livroGenero || "Outros"
      acc[genero] = (acc[genero] || 0) + 1
      return acc
    }, {})
    return Object.entries(mapa).map(([genero, qtd]) => ({ genero, qtd }))
  }

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444"]

  return (
    <div className="bg-background py-12 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-6">Dashboard Executivo</h1>

        {/* KPIs principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card icon={<Users />} label="Funcionários Ativos" value={dados.funcionariosAtivos} color="text-blue-500" />
          <Card icon={<Book />} label="E-books Alugados" value={dados.ebooksAlugados} color="text-green-500" />
          <Card icon={<TrendingUp />} label="Faturamento Mês" value={`R$ ${dados.faturamentoMes.toFixed(2)}`} color="text-amber-500" />
          <Card icon={<BarChart3 />} label="Faturamento Semana" value={`R$ ${dados.faturamentoSemana.toFixed(2)}`} color="text-purple-500" />
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ChartBox title="Transações (Compra vs Locação)">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={[
                  { name: "Compra", value: dados.transacoes.compra },
                  { name: "Locação", value: dados.transacoes.locacao },
                ]} outerRadius={100} label>
                  <Cell fill="#3b82f6" />
                  <Cell fill="#10b981" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartBox>

          <ChartBox title="E-books Ativos x Inativos">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={[
                  { name: "Ativos", value: dados.ativos },
                  { name: "Inativos", value: dados.inativos },
                ]} outerRadius={100} label>
                  <Cell fill="#22c55e" />
                  <Cell fill="#ef4444" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartBox>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ChartBox title="Livros comprados por gênero do comprador">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={livrosPorGeneroCliente}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nome" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="masculino" fill="#60a5fa" name="Masculino" />
                <Bar dataKey="feminino" fill="#f472b6" name="Feminino" />
              </BarChart>
            </ResponsiveContainer>
          </ChartBox>

          <ChartBox title="Livros mais vendidos por faixa etária">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={livrosPorIdade}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nome" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="18-25" stroke="#93c5fd" name="18-25 anos" strokeWidth={2} />
                <Line type="monotone" dataKey="26-35" stroke="#3b82f6" name="26-35 anos" strokeWidth={2} />
                <Line type="monotone" dataKey="36-50" stroke="#2563eb" name="36-50 anos" strokeWidth={2} />
                <Line type="monotone" dataKey="51+" stroke="#1e3a8a" name="51+ anos" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </ChartBox>
        </div>

        

        {/* Top Vendas / Alugueis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ChartBox title="Top E-books Mais Vendidos">
            <ul className="divide-y divide-border">
              {topVendas.map((item, i) => (
                <li key={i} className="py-2 flex justify-between">
                  <span>{item.titulo}</span>
                  <span className="font-semibold">{item.vendas}</span>
                </li>
              ))}
            </ul>
          </ChartBox>

          <ChartBox title="Top E-books Mais Alugados">
            <ul className="divide-y divide-border">
              {topAlugueis.map((item, i) => (
                <li key={i} className="py-2 flex justify-between">
                  <span>{item.titulo}</span>
                  <span className="font-semibold">{item.alugueis}</span>
                </li>
              ))}
            </ul>
          </ChartBox>
        </div>

        {/* Livros por gênero / idiomas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ChartBox title="Livros Mais Vendidos por Gênero">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={livrosGenero}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="genero" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="qtd" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartBox>

          <ChartBox title="Idiomas Mais Buscados">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={idiomasMaisBuscados} outerRadius={100} dataKey="value" label>
                  {idiomasMaisBuscados.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartBox>
        </div>

        {/* Total de títulos */}
        <div className="bg-card border border-border rounded-xl p-6 text-center">
          <p className="text-sm text-muted-foreground mb-2">Quantidade Total de Títulos</p>
          <p className="text-3xl font-bold">{dados.totalTitulos}</p>
        </div>
      </div>
    </div>
  )
}

const Card = ({ icon, label, value, color }) => (
  <div className="bg-card border border-border rounded-xl p-6">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-lg bg-muted/20 ${color}`}>{icon}</div>
    </div>
    <p className="text-sm text-muted-foreground mb-1">{label}</p>
    <p className={`text-3xl font-bold ${color}`}>{value}</p>
  </div>
)

const ChartBox = ({ title, children }) => (
  <div className="bg-card border border-border rounded-xl p-6">
    <h2 className="text-xl font-bold mb-4">{title}</h2>
    {children}
  </div>
)
