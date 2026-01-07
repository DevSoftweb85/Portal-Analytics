"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Pencil, Trash2, Search, Building2 } from "lucide-react"

const initialClientes = [
    { id: 1, clisigla: "DEMO", cliNome: "Empresa Demo", clidb: "demo_db", clivalorcotadores: "1500.00" },
    { id: 2, clisigla: "TESTE", cliNome: "Transportadora Teste", clidb: "teste_db", clivalorcotadores: "2000.00" },
    { id: 3, clisigla: "ABC", cliNome: "ABC Logística", clidb: "abc_db", clivalorcotadores: "1800.00" },
]

export default function ClientesPage() {
    const [clientes, setClientes] = useState(initialClientes)
    const [search, setSearch] = useState("")
    const [editing, setEditing] = useState<number | null>(null)
    const [formData, setFormData] = useState({ clisigla: "", cliNome: "", clidb: "", clivalorcotadores: "" })

    const filteredClientes = clientes.filter(c =>
        c.cliNome.toLowerCase().includes(search.toLowerCase()) ||
        c.clisigla.toLowerCase().includes(search.toLowerCase())
    )

    const handleAdd = () => {
        if (!formData.clisigla || !formData.cliNome) return
        const newCliente = {
            id: Math.max(...clientes.map(c => c.id)) + 1,
            ...formData
        }
        setClientes([...clientes, newCliente])
        setFormData({ clisigla: "", cliNome: "", clidb: "", clivalorcotadores: "" })
    }

    const handleEdit = (id: number) => {
        const cliente = clientes.find(c => c.id === id)
        if (cliente) {
            setFormData(cliente)
            setEditing(id)
        }
    }

    const handleUpdate = () => {
        setClientes(clientes.map(c => c.id === editing ? { ...c, ...formData } : c))
        setEditing(null)
        setFormData({ clisigla: "", cliNome: "", clidb: "", clivalorcotadores: "" })
    }

    const handleDelete = (id: number) => {
        if (confirm("Tem certeza que deseja excluir este cliente?")) {
            setClientes(clientes.filter(c => c.id !== id))
        }
    }

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-purple-600">
                    Clientes / Transportadoras
                </h1>
                <p className="text-gray-600 mt-2">Gerencie as empresas clientes do sistema</p>
            </div>

            <Card className="mb-6 border-0 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-lg">{editing ? "Editar Cliente" : "Novo Cliente"}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <Input
                            placeholder="Sigla"
                            value={formData.clisigla}
                            onChange={(e) => setFormData({ ...formData, clisigla: e.target.value.toUpperCase() })}
                        />
                        <Input
                            placeholder="Nome da Empresa"
                            value={formData.cliNome}
                            onChange={(e) => setFormData({ ...formData, cliNome: e.target.value })}
                        />
                        <Input
                            placeholder="Database"
                            value={formData.clidb}
                            onChange={(e) => setFormData({ ...formData, clidb: e.target.value })}
                        />
                        <Input
                            placeholder="Valor Cotadores"
                            value={formData.clivalorcotadores}
                            onChange={(e) => setFormData({ ...formData, clivalorcotadores: e.target.value })}
                        />
                        <Button onClick={editing ? handleUpdate : handleAdd} className="w-full">
                            <Plus className="h-4 w-4 mr-2" />
                            {editing ? "Atualizar" : "Adicionar"}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Lista de Clientes ({filteredClientes.length})</CardTitle>
                        <div className="relative w-64">
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredClientes.map((cliente) => (
                            <Card key={cliente.id} className="border-2 border-purple-100 hover:border-purple-300 transition-all hover:shadow-lg">
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="p-3 bg-purple-600 rounded-lg">
                                            <Building2 className="h-6 w-6 text-white" />
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="ghost" size="sm" onClick={() => handleEdit(cliente.id)}>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDelete(cliente.id)}
                                                className="text-red-600"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="text-lg font-bold text-purple-600">{cliente.clisigla}</div>
                                    <div className="text-gray-900 font-medium">{cliente.cliNome}</div>
                                    <div className="text-sm text-gray-500 mt-2">DB: {cliente.clidb}</div>
                                    <div className="text-sm text-gray-500">Valor: R$ {cliente.clivalorcotadores}</div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
