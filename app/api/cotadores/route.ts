import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

// GET /api/cotadores
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.clisigla) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
        }

        // Filtrar por clisigla para garantir isolamento multi-tenant
        const cotadores = await prisma.cotadores.findMany({
            where: { clisigla: session.user.clisigla },
            orderBy: { nome: "asc" }
        })

        return NextResponse.json(cotadores)
    } catch (error) {
        console.error("Error fetching cotadores:", error)
        return NextResponse.json({ error: "Erro ao buscar cotadores" }, { status: 500 })
    }
}

// POST /api/cotadores
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.clisigla) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
        }

        const body = await request.json()

        const cotador = await prisma.cotadores.create({
            data: {
                codigo: body.codigo,
                cotador: body.codigo, // campo legado
                nome: body.nome,
                status: body.status || "Ativo",
                unidade: body.unidade,
                equipe: body.equipe,
                clientes: body.filial, // usando campo clientes para filial
                clisigla: session.user.clisigla, // Garantir isolamento
            }
        })

        return NextResponse.json(cotador)
    } catch (error) {
        console.error("Error creating cotador:", error)
        return NextResponse.json({ error: "Erro ao criar cotador" }, { status: 500 })
    }
}
