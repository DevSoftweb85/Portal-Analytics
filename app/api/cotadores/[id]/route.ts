import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

// PUT /api/cotadores/[id]
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

        // updateMany com where clisigla garante isolamento multi-tenant
        await prisma.cotadores.updateMany({
            where: {
                id,
                clisigla: session.user.clisigla, // Só atualiza se for da mesma empresa
            },
            data: {
                codigo: body.codigo,
                cotador: body.codigo,
                nome: body.nome,
                status: body.status,
                unidade: body.unidade,
                equipe: body.equipe,
                clientes: body.filial,
            }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error updating cotador:", error)
        return NextResponse.json({ error: "Erro ao atualizar cotador" }, { status: 500 })
    }
}

// DELETE /api/cotadores/[id]
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

        // deleteMany com where clisigla garante isolamento multi-tenant
        await prisma.cotadores.deleteMany({
            where: {
                id,
                clisigla: session.user.clisigla, // Só deleta se for da mesma empresa
            }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error deleting cotador:", error)
        return NextResponse.json({ error: "Erro ao deletar cotador" }, { status: 500 })
    }
}
