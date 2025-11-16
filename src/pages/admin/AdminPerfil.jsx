"use client"

import { ArrowLeft, Eye, EyeOff, Save, User } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { adminAPI } from "../../api/api"
import { useAuth } from "../../auth/AuthProvider"

export const AdminPerfil = () => {
    const navigate = useNavigate()
    const { user } = useAuth()
    const [loading, setLoading] = useState(false)
    const [loadingData, setLoadingData] = useState(true)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const [formData, setFormData] = useState({
        nome: "",
        email: "",
        cpf: "",
        data_nascimento: "",
        senha: "",
        confirmarSenha: "",
        genero: "",
    })

    useEffect(() => {
        loadAdminData()
    }, [])

    const loadAdminData = async () => {
        try {
            const response = await adminAPI.getPerfil()
            const admin = response.data

            const dataFormatada = admin.data_nascimento
                ? new Date(admin.data_nascimento).toISOString().split("T")[0]
                : ""

            setFormData({
                nome: admin.nome || "",
                email: admin.email || "",
                cpf: admin.cpf || "",
                data_nascimento: dataFormatada,
                senha: "",
                confirmarSenha: "",
                genero: admin.genero || "",
            })
        } catch (error) {
            toast.error("Erro ao carregar dados do administrador")
        } finally {
            setLoadingData(false)
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (formData.senha && formData.senha !== formData.confirmarSenha) {
            toast.error("As senhas não coincidem")
            return
        }

        setLoading(true)

        try {
            const body = {
                nome: formData.nome,
                email: formData.email,
                cpf: formData.cpf,
                data_nascimento: formData.data_nascimento,
                genero: formData.genero,
            }

            if (formData.senha) body.senha = formData.senha

            await adminAPI.atualizarPerfil(body)

            toast.success("Perfil atualizado com sucesso!")
            setFormData(prev => ({ ...prev, senha: "", confirmarSenha: "" }))
        } catch (error) {
            toast.error(error.response?.data?.message || "Erro ao atualizar perfil")
        } finally {
            setLoading(false)
        }
    }

    if (loadingData) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Carregando perfil...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                <div className="mb-8">
                    <button
                        onClick={() => navigate("/")}
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        <span>Voltar</span>
                    </button>

                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <User className="h-6 w-6 text-primary" />
                        </div>
                        <h1 className="text-3xl font-bold">Perfil Administrativo</h1>
                    </div>
                    <p className="text-muted-foreground">Gerencie suas informações</p>
                </div>

                {/* --- FORM --- */}
                <div className="bg-card border border-border rounded-2xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Nome */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Nome Completo</label>
                            <input
                                name="nome"
                                type="text"
                                value={formData.nome}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-background border border-input rounded-lg"
                                required
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Email</label>
                            <input
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-background border border-input rounded-lg"
                                required
                            />
                        </div>

                        {/* CPF */}
                        <div>
                            <label className="block text-sm font-medium mb-2">CPF</label>
                            <input
                                name="cpf"
                                type="text"
                                value={formData.cpf}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-background border border-input rounded-lg"
                                required
                            />
                        </div>

                        {/* Data */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Data de Nascimento</label>
                            <input
                                name="data_nascimento"
                                type="date"
                                value={formData.data_nascimento}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-background border border-input rounded-lg"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm mb-1">Gênero</label>
                            <select
                                name="genero"
                                value={formData.genero}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-white text-black border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                            >
                                <option value="">Selecione...</option>
                                <option value="MASCULINO">Masculino</option>
                                <option value="FEMININO">Feminino</option>
                            </select>
                        </div>

                        {/* --- SENHA --- */}
                        <div className="border-t border-border pt-6">
                            <h3 className="text-lg font-semibold mb-4">Alterar Senha</h3>

                            <div className="space-y-4">
                                {/* Senha */}
                                <div>
                                    <label className="block text-sm font-medium mb-2">Nova Senha</label>
                                    <div className="relative">
                                        <input
                                            name="senha"
                                            type={showPassword ? "text" : "password"}
                                            value={formData.senha}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 bg-background border border-input rounded-lg pr-12"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2"
                                        >
                                            {showPassword ? <EyeOff /> : <Eye />}
                                        </button>
                                    </div>
                                </div>

                                {/* Confirmar */}
                                <div>
                                    <label className="block text-sm font-medium mb-2">Confirmar Nova Senha</label>
                                    <div className="relative">
                                        <input
                                            name="confirmarSenha"
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={formData.confirmarSenha}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 bg-background border border-input rounded-lg pr-12"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2"
                                        >
                                            {showConfirmPassword ? <EyeOff /> : <Eye />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4 pt-4">
                            <button
                                type="button"
                                onClick={() => navigate("/")}
                                className="flex-1 py-3 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                <Save className="h-5 w-5" />
                                {loading ? "Salvando..." : "Salvar Alterações"}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    )
}
