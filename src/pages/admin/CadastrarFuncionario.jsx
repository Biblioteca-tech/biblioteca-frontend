"use client"

import { Calendar, CreditCard, Lock, Mail, MapPin, Phone, User, UserPlus } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { adminAPI } from "../../api/api"

export const CadastrarFuncionario = () => {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
    cpf: "",
    dataNascimento: "",
    dataAdmissao: "",
    numeroTelefone: "",
    endereco: "",
    genero: "",
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

  const formatPhone = (value) => {
    const cleanValue = value.replace(/\D/g, "")
    if (cleanValue.length <= 11) {
      return cleanValue.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
    }
    return value
  }

  const handleCPFChange = (e) => {
    const formatted = formatCPF(e.target.value)
    setFormData({ ...formData, cpf: formatted })
  }

  const handlePhoneChange = (e) => {
    const formatted = formatPhone(e.target.value)
    setFormData({ ...formData, numeroTelefone: formatted })
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

    setLoading(true)

    try {
      await adminAPI.cadastrarFuncionario({
        nome: formData.nome,
        email: formData.email,
        senha: formData.senha,
        cpf: formData.cpf.replace(/\D/g, ""),
        data_nascimento: formData.dataNascimento,
        dataAdmissao: formData.dataAdmissao,
        numeroTelefone: formData.numeroTelefone.replace(/\D/g, ""),
        endereco: formData.endereco,
        genero: formData.genero,
      })

      toast.success("Funcionário cadastrado com sucesso!")
      navigate("/admin/funcionarios")
    } catch (error) {
      toast.error(error.response?.data?.message || "Erro ao cadastrar funcionário. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button onClick={() => navigate("/admin/funcionarios")} className="text-primary hover:underline mb-4">
            ← Voltar para Funcionários
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <UserPlus className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">Cadastrar Funcionário</h1>
          </div>
          <p className="text-muted-foreground">Preencha os dados do novo funcionário</p>
        </div>

        {/* Form */}
        <div className="bg-card border border-border rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Informações Pessoais</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="nome" className="block text-sm font-medium mb-2">
                    Nome completo *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input
                      id="nome"
                      name="nome"
                      type="text"
                      value={formData.nome}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="Nome do funcionário"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="cpf" className="block text-sm font-medium mb-2">
                    CPF *
                  </label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input
                      id="cpf"
                      name="cpf"
                      type="text"
                      value={formData.cpf}
                      onChange={handleCPFChange}
                      className="w-full pl-10 pr-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="000.000.000-00"
                      required
                      maxLength={14}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="dataNascimento" className="block text-sm font-medium mb-2">
                    Data de Nascimento *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input
                      id="dataNascimento"
                      name="dataNascimento"
                      type="date"
                      value={formData.dataNascimento}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="dataAdmissao" className="block text-sm font-medium mb-2">
                    Data de Admissão *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input
                      id="dataAdmissao"
                      name="dataAdmissao"
                      type="date"
                      value={formData.dataAdmissao}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Informações de Contato</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="funcionario@email.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="numeroTelefone" className="block text-sm font-medium mb-2">
                    Telefone *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input
                      id="numeroTelefone"
                      name="numeroTelefone"
                      type="text"
                      value={formData.numeroTelefone}
                      onChange={handlePhoneChange}
                      className="w-full pl-10 pr-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="(00) 00000-0000"
                      required
                      maxLength={15}
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="endereco" className="block text-sm font-medium mb-2">
                    Endereço *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <textarea
                      id="endereco"
                      name="endereco"
                      value={formData.endereco}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                      placeholder="Rua, número, bairro, cidade - UF"
                      rows={3}
                      required
                    />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm mb-1">Gênero</label>
                  <select
                    name="genero"
                    value={formData.genero}
                    onChange={handleChange}
                    className="w-full  px-4 py-3 bg-white text-black border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Selecione...</option>
                    <option value="MASCULINO">Masculino</option>
                    <option value="FEMININO">Feminino</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Security */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Segurança</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="senha" className="block text-sm font-medium mb-2">
                    Senha *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input
                      id="senha"
                      name="senha"
                      type="password"
                      value={formData.senha}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="••••••••"
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmarSenha" className="block text-sm font-medium mb-2">
                    Confirmar senha *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input
                      id="confirmarSenha"
                      name="confirmarSenha"
                      type="password"
                      value={formData.confirmarSenha}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate("/admin/funcionarios")}
                className="flex-1 py-3 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Cadastrando..." : "Cadastrar Funcionário"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
