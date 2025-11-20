"use client"

import { BookOpen, Calendar, CreditCard, Lock, Mail, User } from "lucide-react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { authAPI } from "../api/api"

export const Cadastro = () => {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
    cpf: "",
    dataNascimento: "",
    genero: "", // 🔥 novo campo
  })

  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const validateCPF = (cpf) => {
    const cleanCPF = cpf.replace(/\D/g, "")
    return cleanCPF.length === 11
  }

  const formatCPF = (value) => {
    const cleanValue = value.replace(/\D/g, "")
    if (cleanValue.length <= 11) {
      return cleanValue
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
    }
    return value
  }

  const handleCPFChange = (e) => {
    const formatted = formatCPF(e.target.value)
    setFormData({ ...formData, cpf: formatted })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.senha !== formData.confirmarSenha) {
      toast.error("As senhas não coincidem!")
      return
    }

    if (!validateCPF(formData.cpf)) {
      toast.error("CPF inválido! Digite um CPF com 11 dígitos.")
      return
    }

    if (!formData.dataNascimento) {
      toast.error("Por favor, informe sua data de nascimento.")
      return
    }

    if (!formData.genero) {
      toast.error("Por favor, selecione seu gênero.")
      return
    }

    setLoading(true)

    try {
      await authAPI.cadastro({
        nome: formData.nome,
        email: formData.email,
        senha: formData.senha,
        cpf: formData.cpf.replace(/\D/g, ""),
        data_nascimento: formData.dataNascimento,
        genero: formData.genero, // 🔥 enviado
      })

      toast.success("Cadastro realizado com sucesso! Faça login para continuar.")
      navigate("/login")
    } catch (error) {
      toast.error(error.response?.data?.message || "Erro ao criar conta. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-2xl">
              <BookOpen className="h-10 w-10 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">Crie sua conta</h1>
          <p className="text-muted-foreground">Junte-se à Neo-Xandria hoje</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="block text-sm font-medium mb-2">Nome completo</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  name="nome"
                  type="text"
                  value={formData.nome}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-background border rounded-lg"
                  placeholder="Seu nome"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-background border rounded-lg"
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">CPF</label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  name="cpf"
                  type="text"
                  value={formData.cpf}
                  onChange={handleCPFChange}
                  className="w-full pl-10 pr-4 py-3 bg-background border rounded-lg"
                  placeholder="000.000.000-00"
                  required
                  maxLength={14}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Gênero</label>
              <select
                name="genero"
                value={formData.genero}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                required
              >
                <option value="">Selecione...</option>
                <option value="MASCULINO">Masculino</option>
                <option value="FEMININO">Feminino</option>

              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Data de Nascimento</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  name="dataNascimento"
                  type="date"
                  value={formData.dataNascimento}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-background border rounded-lg"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  name="senha"
                  type="password"
                  value={formData.senha}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-background border rounded-lg"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Confirmar senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  name="confirmarSenha"
                  type="password"
                  value={formData.confirmarSenha}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-background border rounded-lg"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium"
            >
              {loading ? "Criando conta..." : "Criar conta"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Já tem uma conta?{" "}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Faça login
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}
