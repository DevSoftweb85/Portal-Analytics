import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import {
    Building2,
    Users,
    Target,
    MapPin,
    UserSquare2,
    Building,
    Shield
} from "lucide-react"

export default async function DashboardPage() {
    const session = await getServerSession(authOptions)
    const userRole = session?.user?.role

    // Links baseados no role
    const quickLinks = userRole === "superadmin" ? [
        {
            title: "Transportadoras",
            description: "Gerenciar empresas e administradores",
            icon: Shield,
            href: "/dashboard/transportadoras",
            color: "from-red-500 to-orange-500"
        },
    ] : userRole === "admin" ? [
        {
            title: "Unidades",
            description: "Gerenciar unidades regionais",
            icon: MapPin,
            href: "/dashboard/unidades",
            color: "from-pink-500 to-pink-600"
        },
        {
            title: "Filiais",
            description: "Administrar filiais da empresa",
            icon: Building,
            href: "/dashboard/filiais",
            color: "from-purple-600 to-pink-500"
        },
        {
            title: "Vendedores",
            description: "Cadastrar vendedores e equipes",
            icon: Users,
            href: "/dashboard/vendedores",
            color: "from-fuchsia-500 to-purple-600"
        },
        {
            title: "Cotadores",
            description: "Gerenciar cotadores",
            icon: UserSquare2,
            href: "/dashboard/cotadores",
            color: "from-indigo-500 to-purple-500"
        },
        {
            title: "Metas",
            description: "Definir e acompanhar metas",
            icon: Target,
            href: "/dashboard/metas",
            color: "from-green-500 to-emerald-600"
        },
    ] : [
        {
            title: "Minhas Metas",
            description: "Visualizar minhas metas e progresso",
            icon: Target,
            href: "/dashboard/minhas-metas",
            color: "from-purple-500 to-pink-500"
        },
    ]

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-purple-600">
                    Bem-vindo, {session?.user?.name}!
                </h1>
                <p className="text-gray-600 mt-2 text-sm sm:text-base">
                    {userRole === "superadmin"
                        ? "Gerencie transportadoras e administradores do sistema"
                        : userRole === "admin"
                            ? "Cadastre metas e gerencie dados da sua empresa"
                            : "Acompanhe suas metas e objetivos"}
                </p>
            </div>

            <Card className="shadow-lg border-0">
                <CardHeader>
                    <CardTitle className="text-xl sm:text-2xl text-purple-600">
                        {userRole === "admin" ? "Cadastros" : "Acesso Rápido"}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                        {quickLinks.map((link) => {
                            const Icon = link.icon
                            return (
                                <Link key={link.href} href={link.href}>
                                    <Card className="border-2 border-purple-100 hover:border-purple-300 transition-all hover:shadow-xl cursor-pointer group h-full">
                                        <CardContent className="p-6">
                                            <div className={`p-3 rounded-lg bg-gradient-to-br ${link.color} w-fit mb-4 group-hover:scale-110 transition-transform`}>
                                                <Icon className="h-6 w-6 text-white" />
                                            </div>
                                            <h3 className="font-semibold text-lg mb-2 group-hover:text-purple-700 transition-colors">
                                                {link.title}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                {link.description}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </Link>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>

            {userRole === "admin" && (
                <Card className="shadow-lg border-0 mt-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                    <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-purple-600 rounded-lg">
                                <Target className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg text-purple-900 mb-2">
                                    Sistema de Cadastro de Metas
                                </h3>
                                <p className="text-sm text-purple-700 mb-3">
                                    Este portal permite cadastrar metas vinculadas a vendedores, cotadores, unidades e filiais.
                                    Os dados são integrados automaticamente com o Power BI para análise.
                                </p>
                                <ul className="text-sm text-purple-600 space-y-1">
                                    <li>• Cadastre primeiro as unidades e filiais</li>
                                    <li>• Adicione vendedores e cotadores vinculados</li>
                                    <li>• Defina metas relacionadas aos cadastros</li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
