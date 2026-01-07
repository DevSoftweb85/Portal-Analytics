import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

// PUT /api/transportadoras/[id]
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)

        if (session?.user?.role !== "superadmin") {
            return NextResponse.json({ error: "Apenas SuperAdmin" }, { status: 403 })
        }

        const body = await request.json()
        const id = parseInt(params.id)

        await prisma.clientes.update({
            where: { cliid: id },
            data: {
                cliNome: body.nome,
                clilogo: body.logoUrl,
            }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error updating transportadora:", error)
        return NextResponse.json({ error: "Erro ao atualizar" }, { status: 500 })
    }
}

// DELETE /api/transportadoras/[id]
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)

        if (session?.user?.role !== "superadmin") {
            return NextResponse.json({ error: "Apenas SuperAdmin" }, { status: 403 })
        }

        const id = parseInt(params.id)

        await prisma.clientes.delete({
            where: { cliid: id }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error deleting transportadora:", error)
        return NextResponse.json({ error: "Erro ao deletar" }, { status: 500 })
    }
}
