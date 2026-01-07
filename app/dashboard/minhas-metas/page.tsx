"use client"

import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Target, TrendingUp, Calendar } from "lucide-react"

const minhasMetas = [
    {
        id: 1,
        periodo: "Janeiro 2024",
        meta: 50000,
        realizado: 42000,
        percentual: 84,
    },
    {
        id: 2,
        periodo: "Dezembro 2023",
        meta: 45000,
        realizado: 47500,
        percentual: 106,
    },
    {
        id: 3,
        periodo: "Novembro 2023",
        meta: 40000,
        realizado: 38500,
        percentual: 96,
    },
]

export default function MinhasMetasPage() {
    const { data: session } = useSession()

    if (session?.user?.role !== "user") {
        return (
            <div className="p-8">
                <Card className="border-orange-200 bg-orange-50">
                    <CardContent className="p-6">
                        <p className="text-orange-700 font-medium">⚠️ Esta página é exclusiva para vendedores.</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const metaAtual = minhasMetas[0]

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-purple-600">
                    Minhas Metas
                </h1>
                <p className="text-gray-600 mt-2">Olá, {session?.user?.name}! Suas metas cadastradas</p>
            </div>

            {/* Meta Atual */}
            <Card className="shadow-lg border-0 mb-6 bg-gradient-to-br from-purple-50 to-pink-50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5 text-purple-600" />
                        Meta Atual - {metaAtual.periodo}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Meta</p>
                            <p className="text-2xl font-bold text-purple-600">
                                R$ {metaAtual.meta.toLocaleString('pt-BR')}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Realizado</p>
                            <p className="text-2xl font-bold text-green-600">
                                R$ {metaAtual.realizado.toLocaleString('pt-BR')}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Percentual</p>
                            <p className={`text-2xl font-bold ${metaAtual.percentual >= 100 ? 'text-green-600' : 'text-orange-600'}`}>
                                {metaAtual.percentual}%
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Histórico */}
            <Card className="border-0 shadow-lg">
                <CardHeader>
                    <CardTitle>Histórico de Metas</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left p-3 font-medium text-gray-600">Período</th>
                                    <th className="text-right p-3 font-medium text-gray-600">Meta</th>
                                    <th className="text-right p-3 font-medium text-gray-600">Realizado</th>
                                    <th className="text-right p-3 font-medium text-gray-600">%</th>
                                </tr>
                            </thead>
                            <tbody>
                                {minhasMetas.map((meta) => (
                                    <tr key={meta.id} className="border-b hover:bg-purple-50">
                                        <td className="p-3 font-medium">{meta.periodo}</td>
                                        <td className="p-3 text-right">R$ {meta.meta.toLocaleString('pt-BR')}</td>
                                        <td className="p-3 text-right">R$ {meta.realizado.toLocaleString('pt-BR')}</td>
                                        <td className="p-3 text-right">
                                            <span className={`px-2 py-1 rounded-full text-sm font-medium ${meta.percentual >= 100
                                                    ? 'bg-green-100 text-green-700'
                                                    : meta.percentual >= 80
                                                        ? 'bg-blue-100 text-blue-700'
                                                        : 'bg-orange-100 text-orange-700'
                                                }`}>
                                                {meta.percentual}%
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
