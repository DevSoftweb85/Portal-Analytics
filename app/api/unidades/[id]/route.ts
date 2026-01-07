import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

// PUT /api/unidades/[id]
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

        await prisma.unidades.updateMany({
            where: {
                id,
                clisigla: session.user.clisigla,
            },
            data: {
                sigla: body.sigla,
                nome: body.nome,
            }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error updating unidade:", error)
        return NextResponse.json({ error: "Erro ao atualizar unidade" }, { status: 500 })
    }
}

// DELETE /api/unidades/[id]
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

        await prisma.unidades.deleteMany({
            where: {
                id,
                clisigla: session.user.clisigla,
            }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error deleting unidade:", error)
        return NextResponse.json({ error: "Erro ao deletar unidade" }, { status: 500 })
    }
}
