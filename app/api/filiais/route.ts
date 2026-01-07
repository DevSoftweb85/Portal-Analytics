import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

// GET /api/filiais - Filtrado por clisigla
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.clisigla) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
        }

        const filiais = await prisma.filiais.findMany({
            where: { clisigla: session.user.clisigla },
            orderBy: { nome_filial: "asc" }
        })

        return NextResponse.json(filiais)
    } catch (error) {
        console.error("Error fetching filiais:", error)
        return NextResponse.json({ error: "Erro ao buscar filiais" }, { status: 500 })
    }
}

// POST /api/filiais
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.clisigla) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
        }

        const body = await request.json()

        const filial = await prisma.filiais.create({
            data: {
                filial: body.filial,
                nome_filial: body.nome_filial,
                data: body.data ? new Date(body.data) : new Date(),
                valor: body.valor || 0,
                clisigla: session.user.clisigla,
            }
        })

        return NextResponse.json(filial)
    } catch (error) {
        console.error("Error creating filial:", error)
        return NextResponse.json({ error: "Erro ao criar filial" }, { status: 500 })
    }
}
