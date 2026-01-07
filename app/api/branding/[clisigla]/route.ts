import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

// GET /api/branding/[clisigla]
export async function GET(
    request: NextRequest,
    { params }: { params: { clisigla: string } }
) {
    try {
        const { clisigla } = params

        const cliente = await prisma.clientes.findFirst({
            where: { clisigla: clisigla.toUpperCase() }
        })

        if (!cliente) {
            return NextResponse.json(
                { error: "Cliente não encontrado" },
                { status: 404 }
            )
        }

        return NextResponse.json({
            clisigla: cliente.clisigla,
            nomeEmpresa: cliente.cliNome,
            logoUrl: cliente.clilogo || null,
            corPrimaria: "#7C3AED",
            corSecundaria: "#EC4899",
            corFundoLogin: "#1F2937",
        })
    } catch (error) {
        console.error("Error fetching branding:", error)
        return NextResponse.json(
            { error: "Erro ao buscar configurações" },
            { status: 500 }
        )
    }
}
