"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Target, Plus, Trash2, TrendingUp } from "lucide-react"

interface Meta {
    id: string
    tipo: string
    data: Date | null
    meta: any
    responsavel_id?: number | null
    filial?: string | null
    sigla?: string | null
    unidade_id?: number | null
    clisigla?: string | null
    detalhes?: any
}

export default function MetasPage() {
    const { data: session } = useSession()
    const [metas, setMetas] = useState<Meta[]>([])
    const [vendedores, setVendedores] = useState<any[]>([])
    const [cotadores, setCotadores] = useState<any[]>([])
    const [unidades, setUnidades] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState("Todos")
    const [showForm, setShowForm] = useState(false)
    const [formData, setFormData] = useState({
        tipo: "Vendedor",
        vendedor_id: "",
        cotador: "",
        filial: "",
        sigla: "",
        unidade_id: "",
        meta: "",
        data: new Date().toISOString().slice(0, 10),
        Meta_Tomadores: "",
        meta_vlr_medio: "",
        meta_frequencia: "",
        meta_cte: "",
    })

    useEffect(() => {
        loadMetas()
        loadVendedores()
        loadCotadores()
        loadUnidades()
    }, [])

    const loadMetas = async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/metas")
            const data = await res.json()
            if (!data.error) {
                setMetas(data)
            }
        } catch (error) {
            console.error("Error loading metas:", error)
        } finally {
            setLoading(false)
        }
    }

    const loadVendedores = async () => {
        try {
            const res = await fetch("/api/vendedores")
            const data = await res.json()
            if (!data.error) setVendedores(data)
        } catch (error) {
            console.error("Error loading vendedores:", error)
        }
    }

    const loadCotadores = async () => {
        try {
            const res = await fetch("/api/cotadores")
            const data = await res.json()
            if (!data.error) setCotadores(data)
        } catch (error) {
            console.error("Error loading cotadores:", error)
        }
    }

    const loadUnidades = async () => {
        try {
            const res = await fetch("/api/unidades")
            const data = await res.json()
            if (!data.error) setUnidades(data)
        } catch (error) {
            console.error("Error loading unidades:", error)
        }
    }

    const handleAdd = async () => {
        try {
            const payload: any = {
                tipo: formData.tipo,
                meta: parseFloat(formData.meta) || 0,
                data: formData.data,
            }

            if (formData.tipo === "Vendedor") {
                payload.vendedor_id = parseInt(formData.vendedor_id)
                payload.Meta_Tomadores = parseInt(formData.Meta_Tomadores) || 0
                payload.meta_vlr_medio = parseFloat(formData.meta_vlr_medio) || 0
                payload.meta_frequencia = parseInt(formData.meta_frequencia) || 0
                payload.meta_cte = parseInt(formData.meta_cte) || 0
            } else if (formData.tipo === "Cotador") {
                payload.cotador = parseInt(formData.cotador)
            } else if (formData.tipo === "Faturamento") {
                payload.filial = formData.filial
                payload.sigla = formData.sigla
                payload.valor = parseFloat(formData.meta) || 0
            } else if (formData.tipo === "Unidade") {
                payload.unidade_id = parseInt(formData.unidade_id)
            }

            const res = await fetch("/api/metas", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            })

            if (res.ok) {
                loadMetas()
                setShowForm(false)
                resetForm()
            }
        } catch (error) {
            console.error("Error adding meta:", error)
        }
    }

    const resetForm = () => {
        setFormData({
            tipo: "Vendedor",
            vendedor_id: "",
            cotador: "",
            filial: "",
            sigla: "",
            unidade_id: "",
            meta: "",
            data: new Date().toISOString().slice(0, 10),
            Meta_Tomadores: "",
            meta_vlr_medio: "",
            meta_frequencia: "",
            meta_cte: "",
        })
    }

    const handleDelete = async (id: string, tipo: string) => {
        if (!confirm("Tem certeza que deseja excluir esta meta?")) return

        try {
            const tipoMap: Record<string, string> = {
                "Vendedor": "vendedor",
                "Cotador": "cotador",
                "Faturamento": "faturamento",
                "Unidade": "unidade"
            }

            const realId = id.split('-')[1]
            const res = await fetch(`/api/metas/${tipoMap[tipo]}/${realId}`, {
                method: "DELETE"
            })

            if (res.ok) loadMetas()
        } catch (error) {
            console.error("Error deleting meta:", error)
        }
    }

    const filteredMetas = filter === "Todos" ? metas : metas.filter(m => m.tipo === filter)

    const formatValue = (value: any) => {
        if (!value) return "R$ 0,00"
        const num = parseFloat(value.toString())
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(num)
    }

    const formatDate = (date: Date | null) => {
        if (!date) return "-"
        return new Date(date).toLocaleDateString('pt-BR')
    }

    if (loading) {
        return (
            <div className="p-8 flex items-center justify-center">
                <div className="text-gray-500">Carregando metas...</div>
            </div>
        )
    }

    const tipos = ["Todos", "Vendedor", "Cotador", "Faturamento", "Unidade"]
    const counts = {
        Todos: metas.length,
        Vendedor: metas.filter(m => m.tipo === "Vendedor").length,
        Cotador: metas.filter(m => m.tipo === "Cotador").length,
        Faturamento: metas.filter(m => m.tipo === "Faturamento").length,
        Unidade: metas.filter(m => m.tipo === "Unidade").length,
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            {/* Header */}
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Gerenciar Metas</h1>
                    <p className="text-gray-600 mt-1">Visualize e cadastre metas</p>
                </div>
                <Button onClick={() => setShowForm(!showForm)} className="bg-purple-600 hover:bg-purple-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Meta
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
                {tipos.map((tipo) => {
                    const count = counts[tipo as keyof typeof counts]
                    const isActive = filter === tipo
                    return (
                        <Card
                            key={tipo}
                            className={`cursor-pointer transition-all ${isActive ? 'ring-2 ring-purple-500 bg-purple-50' : 'hover:shadow-md'}`}
                            onClick={() => setFilter(tipo)}
                        >
                            <CardContent className="p-3 text-center">
                                <p className="text-sm text-gray-600">{tipo}</p>
                                <p className="text-xl font-bold">{count}</p>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            {/* Formulário */}
            {showForm && (
                <Card className="mb-6 border-2 border-purple-300">
                    <CardHeader className="bg-purple-50 py-3">
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Target className="h-5 w-5 text-purple-600" />
                            Nova Meta
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <Select value={formData.tipo} onValueChange={(v: string) => setFormData({ ...formData, tipo: v })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Vendedor">Vendedor</SelectItem>
                                    <SelectItem value="Cotador">Cotador</SelectItem>
                                    <SelectItem value="Faturamento">Faturamento</SelectItem>
                                    <SelectItem value="Unidade">Unidade</SelectItem>
                                </SelectContent>
                            </Select>

                            {formData.tipo === "Vendedor" && (
                                <Select value={formData.vendedor_id} onValueChange={(v: string) => setFormData({ ...formData, vendedor_id: v })}>
                                    <SelectTrigger><SelectValue placeholder="Vendedor" /></SelectTrigger>
                                    <SelectContent>
                                        {vendedores.map((v: any) => (
                                            <SelectItem key={v.id} value={v.id.toString()}>{v.nome}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}

                            {formData.tipo === "Cotador" && (
                                <Select value={formData.cotador} onValueChange={(v: string) => setFormData({ ...formData, cotador: v })}>
                                    <SelectTrigger><SelectValue placeholder="Cotador" /></SelectTrigger>
                                    <SelectContent>
                                        {cotadores.map((c: any) => (
                                            <SelectItem key={c.id} value={c.id.toString()}>{c.nome}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}

                            {formData.tipo === "Faturamento" && (
                                <>
                                    <Input placeholder="Filial" value={formData.filial} onChange={(e) => setFormData({ ...formData, filial: e.target.value })} />
                                    <Input placeholder="Sigla" value={formData.sigla} onChange={(e) => setFormData({ ...formData, sigla: e.target.value })} />
                                </>
                            )}

                            {formData.tipo === "Unidade" && (
                                <Select value={formData.unidade_id} onValueChange={(v: string) => setFormData({ ...formData, unidade_id: v })}>
                                    <SelectTrigger><SelectValue placeholder="Unidade" /></SelectTrigger>
                                    <SelectContent>
                                        {unidades.map((u: any) => (
                                            <SelectItem key={u.id} value={u.id.toString()}>{u.nome}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}

                            <Input placeholder="Valor (R$)" type="number" value={formData.meta} onChange={(e) => setFormData({ ...formData, meta: e.target.value })} />
                            <Input type="date" value={formData.data} onChange={(e) => setFormData({ ...formData, data: e.target.value })} />
                        </div>

                        {formData.tipo === "Vendedor" && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                <Input placeholder="Meta Tomadores" type="number" value={formData.Meta_Tomadores} onChange={(e) => setFormData({ ...formData, Meta_Tomadores: e.target.value })} />
                                <Input placeholder="Valor Médio" type="number" value={formData.meta_vlr_medio} onChange={(e) => setFormData({ ...formData, meta_vlr_medio: e.target.value })} />
                                <Input placeholder="Frequência" type="number" value={formData.meta_frequencia} onChange={(e) => setFormData({ ...formData, meta_frequencia: e.target.value })} />
                                <Input placeholder="Meta CTe" type="number" value={formData.meta_cte} onChange={(e) => setFormData({ ...formData, meta_cte: e.target.value })} />
                            </div>
                        )}

                        <div className="mt-4 flex gap-2">
                            <Button onClick={handleAdd} className="bg-purple-600"><Plus className="h-4 w-4 mr-1" /> Adicionar</Button>
                            <Button variant="outline" onClick={() => { setShowForm(false); resetForm() }}>Cancelar</Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Tabela de Metas */}
            <Card className="border-0 shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Metas Cadastradas ({filteredMetas.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b bg-gray-50">
                                    <th className="text-left p-3 font-medium text-gray-600">Tipo</th>
                                    <th className="text-left p-3 font-medium text-gray-600">Data</th>
                                    <th className="text-left p-3 font-medium text-gray-600">Valor</th>
                                    <th className="text-left p-3 font-medium text-gray-600">Detalhes</th>
                                    <th className="text-right p-3 font-medium text-gray-600">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredMetas.map((meta) => (
                                    <tr key={meta.id} className="border-b hover:bg-gray-50">
                                        <td className="p-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${meta.tipo === "Vendedor" ? "bg-blue-100 text-blue-700" :
                                                meta.tipo === "Cotador" ? "bg-green-100 text-green-700" :
                                                    meta.tipo === "Faturamento" ? "bg-purple-100 text-purple-700" :
                                                        "bg-orange-100 text-orange-700"
                                                }`}>
                                                {meta.tipo}
                                            </span>
                                        </td>
                                        <td className="p-3 text-gray-600">{formatDate(meta.data)}</td>
                                        <td className="p-3 font-semibold text-gray-900">{formatValue(meta.meta)}</td>
                                        <td className="p-3 text-sm text-gray-500">
                                            <td className="p-3 text-sm text-gray-500">
                                                {meta.responsavel_nome && <div className="font-medium text-gray-900">{meta.responsavel_nome}</div>}
                                                {meta.sigla && <div className="text-xs text-gray-400">Sigla: {meta.sigla}</div>}
                                                {meta.detalhes?.Meta_Tomadores > 0 && ` | Tom: ${meta.detalhes.Meta_Tomadores}`}
                                                {meta.detalhes?.meta_cte > 0 && ` | CTe: ${meta.detalhes.meta_cte}`}
                                            </td>
                                        </td>
                                        <td className="p-3 text-right">
                                            <Button variant="ghost" size="sm" onClick={() => handleDelete(meta.id, meta.tipo)} className="text-red-600">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredMetas.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-gray-500">
                                            Nenhuma meta encontrada.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div >
    )
}
