import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { hash } from "bcryptjs"

// PUT /api/usuarios/[login]
export async function PUT(
    request: NextRequest,
    { params }: { params: { login: string } }
) {
    try {
        const session = await getServerSession(authOptions)

        if (session?.user?.role !== "superadmin") {
            return NextResponse.json({ error: "Apenas SuperAdmin" }, { status: 403 })
        }

        const body = await request.json()
        const login = decodeURIComponent(params.login)

        const updateData: any = {
            name: body.name,
            active: body.active,
            priv_admin: body.priv_admin,
            clisigla: body.clisigla ? body.clisigla.toUpperCase() : null,
            cpf: body.cpf,
            telefone: body.telefone,
        }

        // Atualizar senha apenas se fornecida
        if (body.password && body.password.trim() !== "") {
            updateData.pswd = await hash(body.password, 10)
        }

        await prisma.sec_users.update({
            where: { login },
            data: updateData
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error updating user:", error)
        return NextResponse.json({ error: "Erro ao atualizar usuário" }, { status: 500 })
    }
}

// DELETE /api/usuarios/[login]
export async function DELETE(
    request: NextRequest,
    { params }: { params: { login: string } }
) {
    try {
        const session = await getServerSession(authOptions)

        if (session?.user?.role !== "superadmin") {
            return NextResponse.json({ error: "Apenas SuperAdmin" }, { status: 403 })
        }

        const login = decodeURIComponent(params.login)

        // Impedir deletar a si mesmo
        if (session.user.email === login) {
            return NextResponse.json({ error: "Não pode deletar a si mesmo" }, { status: 400 })
        }

        // Impedir deletar o superadmin padrão
        if (login === "superadmin") {
            return NextResponse.json({ error: "Não pode deletar o usuário sistema" }, { status: 400 })
        }

        await prisma.sec_users.delete({
            where: { login }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error deleting user:", error)
        return NextResponse.json({ error: "Erro ao deletar usuário" }, { status: 500 })
    }
}
