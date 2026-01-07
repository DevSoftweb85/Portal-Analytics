import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

// DELETE /api/filiais/[id]
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

        await prisma.filiais.deleteMany({
            where: {
                id,
                clisigla: session.user.clisigla,
            }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error deleting filial:", error)
        return NextResponse.json({ error: "Erro ao deletar filial" }, { status: 500 })
    }
}
