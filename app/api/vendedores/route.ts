import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

// GET /api/vendedores
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.clisigla) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
        }

        const vendedores = await prisma.vendedores.findMany({
            where: { clisigla: session.user.clisigla },
            orderBy: { nome: "asc" }
        })

        return NextResponse.json(vendedores)
    } catch (error) {
        console.error("Error fetching vendedores:", error)
        return NextResponse.json({ error: "Erro ao buscar vendedores" }, { status: 500 })
    }
}

// POST /api/vendedores
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.clisigla) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
        }

        const body = await request.json()

        const vendedor = await prisma.vendedores.create({
            data: {
                codigo: body.codigo || null,
                vendedor: body.vendedor,
                nome: body.nome,
                status: body.status || "Ativo",
                unidade: body.unidade || null,
                equipe: body.equipe || null,
                clientes: body.clientes || null,
                clisigla: session.user.clisigla,
            }
        })

        return NextResponse.json(vendedor)
    } catch (error) {
        console.error("Error creating vendedor:", error)
        return NextResponse.json({ error: "Erro ao criar vendedor" }, { status: 500 })
    }
}
