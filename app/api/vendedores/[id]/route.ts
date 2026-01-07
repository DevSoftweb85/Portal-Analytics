import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

// PUT /api/vendedores/[id]
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.clisigla) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
        }

        const body = await request.json()
        const id = parseInt(params.id)

        const vendedor = await prisma.vendedores.updateMany({
            where: {
                id,
                clisigla: session.user.clisigla, // Garantir multi-tenancy
            },
            data: {
                codigo: body.codigo || null,
                vendedor: body.vendedor,
                nome: body.nome,
                status: body.status,
                unidade: body.unidade || null,
                equipe: body.equipe || null,
                clientes: body.clientes || null,
            }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error updating vendedor:", error)
        return NextResponse.json({ error: "Erro ao atualizar vendedor" }, { status: 500 })
    }
}

// DELETE /api/vendedores/[id]
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.clisigla) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
        }

        const id = parseInt(params.id)

        await prisma.vendedores.deleteMany({
            where: {
                id,
                clisigla: session.user.clisigla, // Garantir multi-tenancy
            }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error deleting vendedor:", error)
        return NextResponse.json({ error: "Erro ao deletar vendedor" }, { status: 500 })
    }
}
