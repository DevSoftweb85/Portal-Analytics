"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Building2, Trash2, Search } from "lucide-react"

interface Filial {
    id: number
    filial: string | null
    nome_filial: string | null
    data: Date | null
    valor: number | null
}

export default function FiliaisPage() {
    const { data: session } = useSession()
    const [filiais, setFiliais] = useState<Filial[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [formData, setFormData] = useState({
        filial: "",
        nome_filial: "",
        data: new Date().toISOString().slice(0, 10),
        valor: ""
    })

    useEffect(() => {
        loadFiliais()
    }, [])

    const loadFiliais = async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/filiais")
            const data = await res.json()
            if (!data.error) {
                setFiliais(data)
            }
        } catch (error) {
            console.error("Error loading filiais:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleAdd = async () => {
        if (!formData.filial || !formData.nome_filial) return

        try {
            const res = await fetch("/api/filiais", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    valor: parseFloat(formData.valor) || 0
                })
            })

            if (res.ok) {
                loadFiliais()
                setFormData({
                    filial: "",
                    nome_filial: "",
                    data: new Date().toISOString().slice(0, 10),
                    valor: ""
                })
            }
        } catch (error) {
            console.error("Error adding filial:", error)
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm("Tem certeza que deseja excluir esta filial?")) return

        try {
            const res = await fetch(`/api/filiais/${id}`, {
                method: "DELETE"
            })

            if (res.ok) {
                loadFiliais()
            }
        } catch (error) {
            console.error("Error deleting filial:", error)
        }
    }

    const filteredFiliais = filiais.filter(f =>
        (f.nome_filial?.toLowerCase().includes(search.toLowerCase())) ||
        (f.filial?.toLowerCase().includes(search.toLowerCase()))
    )

    const formatDate = (date: Date | null) => {
        if (!date) return "N/A"
        return new Date(date).toLocaleDateString('pt-BR')
    }

    const formatValue = (value: number | null) => {
        if (!value) return "R$ 0,00"
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value)
    }

    if (loading) {
        return (
            <div className="p-8 flex items-center justify-center">
                <div className="text-gray-500">Carregando filiais...</div>
            </div>
        )
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-purple-600">
                    Filiais
                </h1>
                <p className="text-gray-600 mt-2">
                    Gerencie as filiais (compartilhadas entre todas as empresas)
                </p>
            </div>

            {/* Formulário */}
            <Card className="mb-6 border-0 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-lg">Nova Filial</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Input
                            placeholder="Código (ex: SP01)"
                            value={formData.filial}
                            onChange={(e) => setFormData({ ...formData, filial: e.target.value })}
                        />
                        <Input
                            placeholder="Nome da Filial"
                            value={formData.nome_filial}
                            onChange={(e) => setFormData({ ...formData, nome_filial: e.target.value })}
                        />
                        <Input
                            type="date"
                            value={formData.data}
                            onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                        />
                        <Input
                            placeholder="Valor (R$)"
                            type="number"
                            step="0.01"
                            value={formData.valor}
                            onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                        />
                    </div>

                    <div className="mt-4">
                        <Button
                            onClick={handleAdd}
                            className="w-full bg-purple-600"
                            disabled={!formData.filial || !formData.nome_filial}
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Adicionar Filial
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Busca */}
            <Card className="mb-6 border-0 shadow-lg">
                <CardHeader>
                    <CardTitle>Buscar Filiais</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Buscar por nome ou código..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Grid de Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredFiliais.map((filial) => (
                    <Card key={filial.id} className="border-2 hover:border-purple-300 transition-all">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-purple-100 rounded-lg">
                                        <Building2 className="h-6 w-6 text-purple-600" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-lg">{filial.nome_filial}</div>
                                        <div className="text-sm text-gray-500">Código: {filial.filial}</div>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDelete(filial.id)}
                                    className="text-red-600 h-8 w-8 p-0"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>

                            <div className="space-y-2 text-sm text-gray-600">
                                <div><strong>Data:</strong> {formatDate(filial.data)}</div>
                                <div><strong>Valor:</strong> {formatValue(filial.valor)}</div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filteredFiliais.length === 0 && (
                <Card className="border-0 shadow-lg">
                    <CardContent className="p-12 text-center text-gray-500">
                        Nenhuma filial encontrada.
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
