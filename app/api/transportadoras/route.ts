import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

// GET /api/transportadoras - Apenas SuperAdmin
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (session?.user?.role !== "superadmin") {
            return NextResponse.json({ error: "Apenas SuperAdmin" }, { status: 403 })
        }

        const transportadoras = await prisma.clientes.findMany({
            orderBy: { cliNome: "asc" }
        })

        return NextResponse.json(transportadoras)
    } catch (error) {
        console.error("Error fetching transportadoras:", error)
        return NextResponse.json({ error: "Erro ao buscar transportadoras" }, { status: 500 })
    }
}

// POST /api/transportadoras - Criar nova transportadora
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (session?.user?.role !== "superadmin") {
            return NextResponse.json({ error: "Apenas SuperAdmin" }, { status: 403 })
        }

        const body = await request.json()

        const transportadora = await prisma.clientes.create({
            data: {
                clisigla: body.clisigla.toUpperCase(),
                cliNome: body.nome,
                clilogo: body.logoUrl || null,
            }
        })

        return NextResponse.json(transportadora)
    } catch (error) {
        console.error("Error creating transportadora:", error)
        return NextResponse.json({ error: "Erro ao criar transportadora" }, { status: 500 })
    }
}
