"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Pencil, Trash2, Building2, Upload, X } from "lucide-react"

interface Transportadora {
    cliid: number
    clisigla: string | null
    cliNome: string | null
    clilogo: string | null
}

export default function TransportadorasPage() {
    const [transportadoras, setTransportadoras] = useState<Transportadora[]>([])
    const [loading, setLoading] = useState(true)
    const [editing, setEditing] = useState<number | null>(null)
    const [uploading, setUploading] = useState(false)
    const [formData, setFormData] = useState({ clisigla: "", nome: "", logoUrl: "" })
    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        loadTransportadoras()
    }, [])

    const loadTransportadoras = async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/transportadoras")
            const data = await res.json()
            if (!data.error) {
                setTransportadoras(data)
            }
        } catch (error) {
            console.error("Error loading transportadoras:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploading(true)
        try {
            const formDataUpload = new FormData()
            formDataUpload.append("file", file)
            formDataUpload.append("folder", "logos")

            const res = await fetch("/api/upload", {
                method: "POST",
                body: formDataUpload
            })

            const data = await res.json()
            if (data.url) {
                setFormData({ ...formData, logoUrl: data.url })
            } else {
                alert(data.error || "Erro ao fazer upload")
            }
        } catch (error) {
            console.error("Error uploading:", error)
            alert("Erro ao fazer upload")
        } finally {
            setUploading(false)
            if (fileInputRef.current) {
                fileInputRef.current.value = ""
            }
        }
    }

    const handleAdd = async () => {
        if (!formData.clisigla || !formData.nome) return

        try {
            const res = await fetch("/api/transportadoras", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            })

            if (res.ok) {
                loadTransportadoras()
                setFormData({ clisigla: "", nome: "", logoUrl: "" })
            }
        } catch (error) {
            console.error("Error adding transportadora:", error)
        }
    }

    const handleEdit = (t: Transportadora) => {
        setFormData({
            clisigla: t.clisigla || "",
            nome: t.cliNome || "",
            logoUrl: t.clilogo || ""
        })
        setEditing(t.cliid)
    }

    const handleUpdate = async () => {
        if (!editing) return

        try {
            const res = await fetch(`/api/transportadoras/${editing}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            })

            if (res.ok) {
                loadTransportadoras()
                setEditing(null)
                setFormData({ clisigla: "", nome: "", logoUrl: "" })
            }
        } catch (error) {
            console.error("Error updating transportadora:", error)
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm("Tem certeza? Isso excluirá todos os dados relacionados!")) return

        try {
            const res = await fetch(`/api/transportadoras/${id}`, {
                method: "DELETE"
            })

            if (res.ok) {
                loadTransportadoras()
            }
        } catch (error) {
            console.error("Error deleting transportadora:", error)
        }
    }

    const removeLogo = () => {
        setFormData({ ...formData, logoUrl: "" })
    }

    if (loading) {
        return (
            <div className="p-8 flex items-center justify-center">
                <div className="text-gray-500">Carregando transportadoras...</div>
            </div>
        )
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-purple-600">
                    Transportadoras
                </h1>
                <p className="text-gray-600 mt-2">Gerencie as transportadoras do sistema (SuperAdmin)</p>
            </div>

            {/* Formulário */}
            <Card className="mb-6 border-0 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-lg">{editing ? "Editar Transportadora" : "Nova Transportadora"}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium mb-1 block">Domínio (3 caracteres)</label>
                            <Input
                                placeholder="Ex: BXE"
                                value={formData.clisigla}
                                onChange={(e) => setFormData({ ...formData, clisigla: e.target.value.toUpperCase() })}
                                maxLength={3}
                                className="uppercase"
                                disabled={editing !== null}
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-1 block">Nome da Empresa</label>
                            <Input
                                placeholder="Nome completo da empresa"
                                value={formData.nome}
                                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="mt-4">
                        <label className="text-sm font-medium mb-2 block">Logo da Empresa</label>

                        {formData.logoUrl ? (
                            <div className="flex items-center gap-4 p-4 border rounded-lg bg-gray-50">
                                <img
                                    src={formData.logoUrl}
                                    alt="Preview"
                                    className="h-16 object-contain"
                                />
                                <div className="flex-1">
                                    <p className="text-sm text-gray-600 truncate">{formData.logoUrl}</p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={removeLogo}
                                    className="text-red-600"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ) : (
                            <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                    id="logo-upload"
                                />
                                <label
                                    htmlFor="logo-upload"
                                    className="cursor-pointer flex flex-col items-center gap-2"
                                >
                                    <Upload className={`h-8 w-8 ${uploading ? 'text-purple-400 animate-pulse' : 'text-gray-400'}`} />
                                    <span className="text-sm text-gray-600">
                                        {uploading ? "Enviando..." : "Clique para enviar imagem"}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        PNG, JPG, GIF, WEBP ou SVG (máx. 5MB)
                                    </span>
                                </label>
                            </div>
                        )}
                    </div>

                    <div className="mt-4 flex gap-2">
                        <Button
                            onClick={editing ? handleUpdate : handleAdd}
                            className="flex-1 bg-purple-600"
                            disabled={!formData.clisigla || !formData.nome || uploading}
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            {editing ? "Atualizar" : "Adicionar"}
                        </Button>
                        {editing && (
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setEditing(null)
                                    setFormData({ clisigla: "", nome: "", logoUrl: "" })
                                }}
                            >
                                Cancelar
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Grid de Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {transportadoras.map((transp) => (
                    <Card key={transp.cliid} className="border-2 hover:border-purple-300 transition-all">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    {transp.clilogo ? (
                                        <img
                                            src={transp.clilogo}
                                            alt="Logo"
                                            className="h-12 w-12 object-contain rounded"
                                        />
                                    ) : (
                                        <div className="p-3 bg-purple-600 rounded-lg">
                                            <Building2 className="h-6 w-6 text-white" />
                                        </div>
                                    )}
                                    <div>
                                        <div className="font-bold text-lg">{transp.cliNome}</div>
                                        <div className="text-sm text-gray-500">Domínio: {transp.clisigla}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2 mt-4">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEdit(transp)}
                                    className="flex-1"
                                >
                                    <Pencil className="h-4 w-4 mr-1" />
                                    Editar
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDelete(transp.cliid)}
                                    className="text-red-600"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {transportadoras.length === 0 && (
                <Card className="border-0 shadow-lg">
                    <CardContent className="p-12 text-center text-gray-500">
                        Nenhuma transportadora cadastrada.
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
