import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

// GET /api/unidades
// Filtrado por clisigla - cada empresa tem suas próprias unidades
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.clisigla) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
        }

        const unidades = await prisma.unidades.findMany({
            where: { clisigla: session.user.clisigla },
            orderBy: { nome: "asc" }
        })

        return NextResponse.json(unidades)
    } catch (error) {
        console.error("Error fetching unidades:", error)
        return NextResponse.json({ error: "Erro ao buscar unidades" }, { status: 500 })
    }
}

// POST /api/unidades
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.clisigla) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
        }

        const body = await request.json()

        const unidade = await prisma.unidades.create({
            data: {
                sigla: body.sigla,
                nome: body.nome,
                clisigla: session.user.clisigla,
            }
        })

        return NextResponse.json(unidade)
    } catch (error) {
        console.error("Error creating unidade:", error)
        return NextResponse.json({ error: "Erro ao criar unidade" }, { status: 500 })
    }
}
