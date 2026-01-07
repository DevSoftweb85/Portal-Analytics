"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Pencil, MapPin, Trash2, Search } from "lucide-react"

interface Unidade {
    id: number
    sigla: string
    nome: string
}

export default function UnidadesPage() {
    const { data: session } = useSession()
    const [unidades, setUnidades] = useState<Unidade[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [editing, setEditing] = useState<number | null>(null)
    const [formData, setFormData] = useState({ sigla: "", nome: "" })

    useEffect(() => {
        loadUnidades()
    }, [])

    const loadUnidades = async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/unidades")
            const data = await res.json()
            if (!data.error) {
                setUnidades(data)
            }
        } catch (error) {
            console.error("Error loading unidades:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleAdd = async () => {
        if (!formData.sigla || !formData.nome) return

        try {
            const res = await fetch("/api/unidades", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            })

            if (res.ok) {
                loadUnidades()
                setFormData({ sigla: "", nome: "" })
            }
        } catch (error) {
            console.error("Error adding unidade:", error)
        }
    }

    const handleEdit = (u: Unidade) => {
        setFormData({ sigla: u.sigla, nome: u.nome })
        setEditing(u.id)
    }

    const handleUpdate = async () => {
        if (!editing) return

        try {
            const res = await fetch(`/api/unidades/${editing}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            })

            if (res.ok) {
                loadUnidades()
                setEditing(null)
                setFormData({ sigla: "", nome: "" })
            }
        } catch (error) {
            console.error("Error updating unidade:", error)
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm("Tem certeza que deseja excluir esta unidade?")) return

        try {
            const res = await fetch(`/api/unidades/${id}`, {
                method: "DELETE"
            })

            if (res.ok) {
                loadUnidades()
            }
        } catch (error) {
            console.error("Error deleting unidade:", error)
        }
    }

    const filteredUnidades = unidades.filter(u =>
        u.nome.toLowerCase().includes(search.toLowerCase()) ||
        u.sigla.toLowerCase().includes(search.toLowerCase())
    )

    if (loading) {
        return (
            <div className="p-8 flex items-center justify-center">
                <div className="text-gray-500">Carregando unidades...</div>
            </div>
        )
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-purple-600">
                    Unidades
                </h1>
                <p className="text-gray-600 mt-2">
                    Gerencie as unidades (compartilhadas entre todas as empresas)
                </p>
            </div>

            {/* Formulário */}
            <Card className="mb-6 border-0 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-lg">{editing ? "Editar Unidade" : "Nova Unidade"}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input
                            placeholder="Sigla (ex: SP)"
                            value={formData.sigla}
                            onChange={(e) => setFormData({ ...formData, sigla: e.target.value })}
                            maxLength={5}
                        />
                        <div className="md:col-span-2">
                            <Input
                                placeholder="Nome (ex: São Paulo)"
                                value={formData.nome}
                                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                        <Button
                            onClick={editing ? handleUpdate : handleAdd}
                            className="flex-1 bg-purple-600"
                            disabled={!formData.sigla || !formData.nome}
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            {editing ? "Atualizar" : "Adicionar"}
                        </Button>
                        {editing && (
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setEditing(null)
                                    setFormData({ sigla: "", nome: "" })
                                }}
                            >
                                Cancelar
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Busca */}
            <Card className="mb-6 border-0 shadow-lg">
                <CardHeader>
                    <CardTitle>Buscar Unidades</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Buscar por nome ou sigla..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Grid de Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredUnidades.map((unidade) => (
                    <Card key={unidade.id} className="border-2 hover:border-purple-300 transition-all">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-purple-100 rounded-lg">
                                    <MapPin className="h-6 w-6 text-purple-600" />
                                </div>
                                <div className="flex-1">
                                    <div className="font-bold text-lg">{unidade.sigla}</div>
                                    <div className="text-sm text-gray-500">Unidade Regional</div>
                                </div>
                            </div>
                            <div className="text-gray-700 mb-4">{unidade.nome}</div>

                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEdit(unidade)}
                                    className="flex-1"
                                >
                                    <Pencil className="h-4 w-4 mr-1" />
                                    Editar
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDelete(unidade.id)}
                                    className="text-red-600"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filteredUnidades.length === 0 && (
                <Card className="border-0 shadow-lg">
                    <CardContent className="p-12 text-center text-gray-500">
                        Nenhuma unidade encontrada.
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
