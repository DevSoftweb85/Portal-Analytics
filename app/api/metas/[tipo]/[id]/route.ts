import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

// DELETE /api/metas/[tipo]/[id]
export async function DELETE(
    request: NextRequest,
    { params }: { params: { tipo: string; id: string } }
) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.clisigla) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
        }

        const { tipo, id } = params
        const metaId = parseInt(id)
        const clisigla = session.user.clisigla

        // Deletar meta do tipo apropriado (com verificação de clisigla)
        switch (tipo) {
            case 'vendedor':
                await prisma.metas_vendedores.deleteMany({
                    where: {
                        id: metaId,
                        clisigla: clisigla, // Garantir multi-tenancy
                    }
                })
                break

            case 'cotador':
                await prisma.metas_cotadores.deleteMany({
                    where: {
                        id: metaId,
                        dominio: clisigla,
                    }
                })
                break

            case 'faturamento':
                await prisma.meta_faturamento.deleteMany({
                    where: {
                        id: BigInt(metaId),
                        clisigla: clisigla,
                    }
                })
                break

            case 'unidade':
                await prisma.metas_unidade.deleteMany({
                    where: {
                        id: metaId,
                        clisigla: clisigla,
                    }
                })
                break

            default:
                return NextResponse.json({ error: "Tipo inválido" }, { status: 400 })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error deleting meta:", error)
        return NextResponse.json({ error: "Erro ao deletar meta" }, { status: 500 })
    }
}
