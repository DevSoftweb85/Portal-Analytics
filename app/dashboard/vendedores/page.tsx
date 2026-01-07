"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Pencil, Trash2, Search, Users } from "lucide-react"

interface Vendedor {
    id: number
    codigo: string | null
    vendedor: string | null
    nome: string | null
    status: string | null
    unidade: string | null
    equipe: string | null
    clientes: string | null
    clisigla: string | null
}

export default function VendedoresPage() {
    const { data: session } = useSession()
    const [vendedores, setVendedores] = useState<Vendedor[]>([])
    const [unidades, setUnidades] = useState<any[]>([])
    const [filiais, setFiliais] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [editing, setEditing] = useState<number | null>(null)
    const [formData, setFormData] = useState({
        codigo: "",
        vendedor: "",
        nome: "",
        status: "Ativo",
        unidade: "",
        equipe: "",
        filial: ""
    })

    useEffect(() => {
        loadVendedores()
        loadUnidades()
        loadFiliais()
    }, [])

    const loadVendedores = async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/vendedores")
            const data = await res.json()
            if (!data.error) {
                setVendedores(data)
            }
        } catch (error) {
            console.error("Error loading vendedores:", error)
        } finally {
            setLoading(false)
        }
    }

    const loadUnidades = async () => {
        try {
            const res = await fetch("/api/unidades")
            const data = await res.json()
            if (!data.error) {
                setUnidades(data)
            }
        } catch (error) {
            console.error("Error loading unidades:", error)
        }
    }

    const loadFiliais = async () => {
        try {
            const res = await fetch("/api/filiais")
            const data = await res.json()
            if (!data.error) {
                setFiliais(data)
            }
        } catch (error) {
            console.error("Error loading filiais:", error)
        }
    }

    const filteredVendedores = vendedores.filter(v =>
        (v.nome?.toLowerCase().includes(search.toLowerCase())) ||
        (v.vendedor?.toLowerCase().includes(search.toLowerCase())) ||
        (v.codigo?.toLowerCase().includes(search.toLowerCase()))
    )

    const handleAdd = async () => {
        if (!formData.vendedor || !formData.nome) return

        try {
            const res = await fetch("/api/vendedores", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            })

            if (res.ok) {
                loadVendedores()
                resetForm()
            }
        } catch (error) {
            console.error("Error adding vendedor:", error)
        }
    }

    const handleEdit = (v: Vendedor) => {
        setFormData({
            codigo: v.codigo || "",
            vendedor: v.vendedor || "",
            nome: v.nome || "",
            status: v.status || "Ativo",
            unidade: v.unidade || "",
            equipe: v.equipe || "",
            filial: v.clientes || ""
        })
        setEditing(v.id)
    }

    const handleUpdate = async () => {
        if (!editing) return

        try {
            const res = await fetch(`/api/vendedores/${editing}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            })

            if (res.ok) {
                loadVendedores()
                setEditing(null)
                resetForm()
            }
        } catch (error) {
            console.error("Error updating vendedor:", error)
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm("Tem certeza que deseja excluir este vendedor?")) return

        try {
            const res = await fetch(`/api/vendedores/${id}`, {
                method: "DELETE"
            })

            if (res.ok) {
                loadVendedores()
            }
        } catch (error) {
            console.error("Error deleting vendedor:", error)
        }
    }

    const resetForm = () => {
        setFormData({
            codigo: "",
            vendedor: "",
            nome: "",
            status: "Ativo",
            unidade: "",
            equipe: "",
            filial: ""
        })
    }

    if (loading) {
        return (
            <div className="p-8 flex items-center justify-center">
                <div className="text-gray-500">Carregando vendedores...</div>
            </div>
        )
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-purple-600">
                    Vendedores
                </h1>
                <p className="text-gray-600 mt-1">Gerencie os vendedores</p>
            </div>

            {/* Formulário */}
            <Card className="mb-6 border-0 shadow-lg">
                <CardHeader className="py-3 bg-purple-50">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        {editing ? "Editar Vendedor" : "Novo Vendedor"}
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <label className="text-sm font-medium mb-1 block">Código</label>
                            <Input
                                placeholder="Código"
                                value={formData.codigo}
                                onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-1 block">Vendedor *</label>
                            <Input
                                placeholder="Ex: FABIO"
                                value={formData.vendedor}
                                onChange={(e) => setFormData({ ...formData, vendedor: e.target.value.toUpperCase() })}
                            />
                        </div>

                        <div className="lg:col-span-2">
                            <label className="text-sm font-medium mb-1 block">Nome *</label>
                            <Input
                                placeholder="Nome completo"
                                value={formData.nome}
                                onChange={(e) => setFormData({ ...formData, nome: e.target.value.toUpperCase() })}
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-1 block">Status</label>
                            <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Ativo">Ativo</SelectItem>
                                    <SelectItem value="Inativo">Inativo</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-1 block">Unidade</label>
                            <Select value={formData.unidade} onValueChange={(v) => setFormData({ ...formData, unidade: v })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">Nenhuma</SelectItem>
                                    {unidades.map((u) => (
                                        <SelectItem key={u.id} value={u.nome}>
                                            {u.nome}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-1 block">Filial</label>
                            <Select value={formData.filial} onValueChange={(v) => setFormData({ ...formData, filial: v })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">Nenhuma</SelectItem>
                                    {filiais.map((f) => (
                                        <SelectItem key={f.id} value={f.nome_filial}>
                                            {f.nome_filial}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-1 block">Equipe</label>
                            <Input
                                placeholder="Ex: GO"
                                value={formData.equipe}
                                onChange={(e) => setFormData({ ...formData, equipe: e.target.value.toUpperCase() })}
                            />
                        </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                        <Button
                            onClick={editing ? handleUpdate : handleAdd}
                            className="bg-purple-600"
                            disabled={!formData.vendedor || !formData.nome}
                        >
                            <Plus className="h-4 w-4 mr-1" />
                            {editing ? "Atualizar" : "Adicionar"}
                        </Button>
                        {editing && (
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setEditing(null)
                                    resetForm()
                                }}
                            >
                                Cancelar
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Busca e Tabela */}
            <Card className="border-0 shadow-lg">
                <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <CardTitle>Lista de Vendedores ({filteredVendedores.length})</CardTitle>
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Buscar..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b bg-gray-50">
                                    <th className="text-left p-3 font-medium text-gray-600">Código</th>
                                    <th className="text-left p-3 font-medium text-gray-600">Vendedor</th>
                                    <th className="text-left p-3 font-medium text-gray-600">Nome</th>
                                    <th className="text-left p-3 font-medium text-gray-600">Status</th>
                                    <th className="text-left p-3 font-medium text-gray-600">Unidade</th>
                                    <th className="text-left p-3 font-medium text-gray-600">Filial</th>
                                    <th className="text-left p-3 font-medium text-gray-600">Equipe</th>
                                    <th className="text-right p-3 font-medium text-gray-600">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredVendedores.map((vendedor) => (
                                    <tr key={vendedor.id} className="border-b hover:bg-purple-50 transition-colors">
                                        <td className="p-3 font-medium">{vendedor.codigo}</td>
                                        <td className="p-3 font-semibold text-purple-600">{vendedor.vendedor}</td>
                                        <td className="p-3">{vendedor.nome}</td>
                                        <td className="p-3">
                                            <span className={`px-2 py-1 rounded-full text-xs ${vendedor.status === "Ativo"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-gray-100 text-gray-700"
                                                }`}>
                                                {vendedor.status}
                                            </span>
                                        </td>
                                        <td className="p-3">{vendedor.unidade}</td>
                                        <td className="p-3 text-sm">{vendedor.clientes}</td>
                                        <td className="p-3">{vendedor.equipe}</td>
                                        <td className="p-3 text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleEdit(vendedor)}
                                                className="mr-1"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDelete(vendedor.id)}
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredVendedores.length === 0 && (
                                    <tr>
                                        <td colSpan={8} className="p-8 text-center text-gray-500">
                                            Nenhum vendedor encontrado.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
