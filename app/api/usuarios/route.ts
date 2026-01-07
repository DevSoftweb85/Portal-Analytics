import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { hash } from "bcryptjs"

// GET /api/usuarios
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (session?.user?.role !== "superadmin") {
            return NextResponse.json({ error: "Apenas SuperAdmin" }, { status: 403 })
        }

        const users = await prisma.sec_users.findMany({
            orderBy: { name: "asc" }
        })

        // Ocultar senhas
        const safeUsers = users.map(u => ({
            ...u,
            pswd: ""
        }))

        return NextResponse.json(safeUsers)
    } catch (error) {
        console.error("Error fetching users:", error)
        return NextResponse.json({ error: "Erro ao buscar usuários" }, { status: 500 })
    }
}

// POST /api/usuarios
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (session?.user?.role !== "superadmin") {
            return NextResponse.json({ error: "Apenas SuperAdmin" }, { status: 403 })
        }

        const body = await request.json()

        // Validar campos obrigatórios
        if (!body.login || !body.name || !body.password) {
            return NextResponse.json({ error: "Campos obrigatórios faltando" }, { status: 400 })
        }

        // Verificar se usuário já existe
        const existing = await prisma.sec_users.findUnique({
            where: { login: body.login }
        })

        if (existing) {
            return NextResponse.json({ error: "Login já existe" }, { status: 400 })
        }

        // Hash da senha
        const hashedPassword = await hash(body.password, 10)

        const user = await prisma.sec_users.create({
            data: {
                login: body.login,
                name: body.name,
                pswd: hashedPassword,
                active: body.active !== false,
                priv_admin: body.priv_admin || false,
                clisigla: body.clisigla ? body.clisigla.toUpperCase() : null,
                cpf: body.cpf || null,
                telefone: body.telefone || null,
            }
        })

        return NextResponse.json({ success: true, user: { login: user.login, name: user.name } })
    } catch (error) {
        console.error("Error creating user:", error)
        return NextResponse.json({ error: "Erro ao criar usuário" }, { status: 500 })
    }
}
