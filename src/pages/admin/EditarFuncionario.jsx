"use client"

import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "react-toastify"
import { adminAPI } from "../../api/api"
import { ArrowLeft, Save } from "lucide-react"

export const EditarFuncionario = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        nome: "",
        email: "",
        data_nascimento: "",
        dataAdmissao: "",
        numeroTelefone: "",
        endereco: "",
    })

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchFuncionario()
    }, [])

    const fetchFuncionario = async () => {
        try {
            const response = await adminAPI.getFuncionarioById(id)
            const func = response.data

            setFormData({
                nome: func.nome || "",
                email: func.email || "",
                data_nascimento: func.data_nascimento || "",
                dataAdmissao: func.dataAdmissao || "",
                numeroTelefone: func.numeroTelefone || "",
                endereco: func.endereco || "",
            })
        } catch (error) {
            toast.error("Erro ao carregar funcionário")
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await adminAPI.atualizarFuncionario(id, formData)
            toast.success("Funcionário atualizado com sucesso!")
            navigate("/admin/gerenciar-funcionarios")
        } catch (error) {
            toast.error("Erro ao atualizar funcionário")
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-muted-foreground">Carregando dados...</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background py-8 px-4">
            <div className="max-w-3xl mx-auto bg-card border border-border rounded-xl p-8 shadow-md">

                <button
                    onClick={() => navigate("/admin/funcionarios")}
                    className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Voltar
                </button>

                <h1 className="text-2xl font-bold mb-6">Editar Funcionário</h1>

                <form onSubmit={handleSubmit} className="space-y-4">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm mb-1">Nome</label>
                            <input
                                type="text"
                                name="nome"
                                value={formData.nome}
                                onChange={handleChange}
                                className="w-full p-3 bg-card border border-border rounded-lg"
                            />
                        </div>

                        <div>
                            <label className="block text-sm mb-1">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full p-3 bg-card border border-border rounded-lg"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm mb-1">Data de Nascimento</label>
                            <input
                                type="date"
                                name="data_nascimento"
                                value={formData.data_nascimento}
                                onChange={handleChange}
                                className="w-full p-3 bg-card border border-border rounded-lg"
                            />
                        </div>

                        <div>
                            <label className="block text-sm mb-1">Data de Admissão</label>
                            <input
                                type="date"
                                name="dataAdmissao"
                                value={formData.dataAdmissao}
                                onChange={handleChange}
                                className="w-full p-3 bg-card border border-border rounded-lg"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm mb-1">Telefone</label>
                        <input
                            type="text"
                            name="numeroTelefone"
                            value={formData.numeroTelefone}
                            onChange={handleChange}
                            className="w-full p-3 bg-card border border-border rounded-lg"
                            placeholder="(XX) XXXXX-XXXX"
                        />
                    </div>

                    <div>
                        <label className="block text-sm mb-1">Endereço</label>
                        <textarea
                            name="endereco"
                            value={formData.endereco}
                            onChange={handleChange}
                            className="w-full p-3 bg-card border border-border rounded-lg"
                            rows={3}
                        />
                    </div>

                    <button
                        type="submit"
                        className="mt-4 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
                    >
                        <Save className="h-4 w-4" />
                        Salvar Alterações
                    </button>
                </form>
            </div>
        </div>
    )
}
