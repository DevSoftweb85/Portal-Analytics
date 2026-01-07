"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Pencil, Trash2, Search, User, Shield, Building2 } from "lucide-react"

interface UserType {
    login: string
    name: string
    active: boolean
    priv_admin: boolean
    clisigla: string | null
    telefone: string | null
}

interface Transportadora {
    cliid: number
    clisigla: string
    cliNome: string
}

export default function UsuariosPage() {
    const { data: session } = useSession()
    const [users, setUsers] = useState<UserType[]>([])
    const [transportadoras, setTransportadoras] = useState<Transportadora[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [editing, setEditing] = useState<string | null>(null)
    const [formData, setFormData] = useState({
        login: "",
        name: "",
        password: "",
        active: "true",
        role: "user", // user or superadmin
        clisigla: "",
        telefone: ""
    })

    useEffect(() => {
        if (session?.user?.role === "superadmin") {
            loadUsers()
            loadTransportadoras()
        }
    }, [session])

    const loadUsers = async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/usuarios")
            const data = await res.json()
            if (!data.error) setUsers(data)
        } catch (error) {
            console.error("Error loading users:", error)
        } finally {
            setLoading(false)
        }
    }

    const loadTransportadoras = async () => {
        try {
            const res = await fetch("/api/transportadoras")
            const data = await res.json()
            if (!data.error) setTransportadoras(data)
        } catch (error) {
            console.error("Error loading transportadoras:", error)
        }
    }

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.login.toLowerCase().includes(search.toLowerCase()) ||
        (u.clisigla && u.clisigla.toLowerCase().includes(search.toLowerCase()))
    )

    const handleAdd = async () => {
        if (!formData.login || !formData.name || !formData.password) {
            alert("Preencha Login, Nome e Senha")
            return
        }

        // Se não for superadmin, exige empresa
        if (formData.role !== "superadmin" && !formData.clisigla) {
            alert("Selecione a Empresa para usuários comuns")
            return
        }

        try {
            const res = await fetch("/api/usuarios", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    active: formData.active === "true",
                    priv_admin: formData.role === "superadmin"
                })
            })

            const data = await res.json()
            if (res.ok) {
                loadUsers()
                resetForm()
            } else {
                alert(data.error || "Erro ao criar usuário")
            }
        } catch (error) {
            console.error("Error adding user:", error)
        }
    }

    const handleEdit = (u: UserType) => {
        setFormData({
            login: u.login,
            name: u.name,
            password: "", // Senha vazia na edição (só altera se preencher)
            active: u.active ? "true" : "false",
            role: u.priv_admin ? "superadmin" : "user",
            clisigla: u.clisigla || "",
            telefone: u.telefone || ""
        })
        setEditing(u.login)
    }

    const handleUpdate = async () => {
        if (!editing) return

        try {
            const res = await fetch(`/api/usuarios/${encodeURIComponent(editing)}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    active: formData.active === "true",
                    priv_admin: formData.role === "superadmin"
                })
            })

            if (res.ok) {
                loadUsers()
                setEditing(null)
                resetForm()
            } else {
                const data = await res.json()
                alert(data.error || "Erro ao atualizar")
            }
        } catch (error) {
            console.error("Error updating user:", error)
        }
    }

    const handleDelete = async (login: string) => {
        if (!confirm(`Tem certeza que deseja excluir ${login}?`)) return

        try {
            const res = await fetch(`/api/usuarios/${encodeURIComponent(login)}`, {
                method: "DELETE"
            })

            if (res.ok) {
                loadUsers()
            } else {
                const data = await res.json()
                alert(data.error || "Erro ao deletar")
            }
        } catch (error) {
            console.error("Error deleting user:", error)
        }
    }

    const resetForm = () => {
        setFormData({
            login: "",
            name: "",
            password: "",
            active: "true",
            role: "user",
            clisigla: "",
            telefone: ""
        })
    }

    if (session?.user?.role !== "superadmin") {
        return <div className="p-8 text-center">Acesso negado. Apenas SuperAdmin.</div>
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-purple-600">
                    Gerenciamento de Usuários
                </h1>
                <p className="text-gray-600 mt-1">Crie usuários e atribua às transportadoras</p>
            </div>

            {/* Formulário */}
            <Card className="mb-6 border-0 shadow-lg">
                <CardHeader className="py-3 bg-purple-50">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <User className="h-5 w-5" />
                        {editing ? "Editar Usuário" : "Novo Usuário"}
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <label className="text-sm font-medium mb-1 block">Login (Email/User) *</label>
                            <Input
                                placeholder="usuario.login"
                                value={formData.login}
                                onChange={(e) => setFormData({ ...formData, login: e.target.value })}
                                disabled={editing !== null}
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-1 block">Nome Completo *</label>
                            <Input
                                placeholder="Nome do usuário"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-1 block">
                                {editing ? "Nova Senha (opcional)" : "Senha *"}
                            </label>
                            <Input
                                type="password"
                                placeholder={editing ? "Manter atual" : "Senha forte"}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-1 block">Telefone</label>
                            <Input
                                placeholder="(00) 00000-0000"
                                value={formData.telefone}
                                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-1 block">Tipo de Acesso</label>
                            <Select value={formData.role} onValueChange={(v) => setFormData({ ...formData, role: v })}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="user">Usuário Transportadora</SelectItem>
                                    <SelectItem value="superadmin">Super Admin (Sistema)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {formData.role === "user" && (
                            <div className="lg:col-span-2">
                                <label className="text-sm font-medium mb-1 block">Empresa (Transportadora) *</label>
                                <Select value={formData.clisigla} onValueChange={(v) => setFormData({ ...formData, clisigla: v })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione a empresa" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {transportadoras.map((t) => (
                                            <SelectItem key={t.cliid} value={t.clisigla || "ALL"}>
                                                {t.clisigla} - {t.cliNome}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        <div>
                            <label className="text-sm font-medium mb-1 block">Status</label>
                            <Select value={formData.active} onValueChange={(v) => setFormData({ ...formData, active: v })}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="true">Ativo</SelectItem>
                                    <SelectItem value="false">Inativo</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                        <Button
                            onClick={editing ? handleUpdate : handleAdd}
                            className="bg-purple-600"
                        >
                            <Plus className="h-4 w-4 mr-1" />
                            {editing ? "Atualizar" : "Criar Usuário"}
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

            {/* Tabela */}
            <Card className="border-0 shadow-lg">
                <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <CardTitle>Usuários ({filteredUsers.length})</CardTitle>
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Buscar usuários..."
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
                                    <th className="text-left p-3 font-medium text-gray-600">Login</th>
                                    <th className="text-left p-3 font-medium text-gray-600">Nome</th>
                                    <th className="text-left p-3 font-medium text-gray-600">Tipo</th>
                                    <th className="text-left p-3 font-medium text-gray-600">Empresa</th>
                                    <th className="text-left p-3 font-medium text-gray-600">Status</th>
                                    <th className="text-right p-3 font-medium text-gray-600">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user) => (
                                    <tr key={user.login} className="border-b hover:bg-purple-50 transition-colors">
                                        <td className="p-3 font-medium">{user.login}</td>
                                        <td className="p-3">{user.name}</td>
                                        <td className="p-3">
                                            {user.priv_admin ? (
                                                <span className="flex items-center gap-1 text-purple-600 font-bold text-xs">
                                                    <Shield className="h-3 w-3" /> SUPER ADMIN
                                                </span>
                                            ) : (
                                                <span className="text-gray-600 text-sm">Usuário</span>
                                            )}
                                        </td>
                                        <td className="p-3">
                                            {user.clisigla ? (
                                                <span className="flex items-center gap-1 text-blue-600 font-medium text-sm">
                                                    <Building2 className="h-3 w-3" /> {user.clisigla}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </td>
                                        <td className="p-3">
                                            <span className={`px-2 py-1 rounded-full text-xs ${user.active
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                                }`}>
                                                {user.active ? "Ativo" : "Inativo"}
                                            </span>
                                        </td>
                                        <td className="p-3 text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleEdit(user)}
                                                className="mr-1"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDelete(user.login)}
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredUsers.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="p-8 text-center text-gray-500">
                                            Nenhum usuário encontrado.
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
