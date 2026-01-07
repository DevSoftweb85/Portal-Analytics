import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import { prisma } from "@/lib/db"

// SuperAdmin mock (único usuário não no banco)
const SUPERADMIN = {
    domain: "SYS",
    login: "superadmin",
    password: "super123",
    name: "Super Administrador",
    companyName: "Sistema",
    role: "superadmin" as const,
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                domain: { label: "Domain", type: "text" },
                login: { label: "Login", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.domain || !credentials?.login || !credentials?.password) {
                    return null
                }

                console.log("Login attempt:", {
                    domain: credentials.domain,
                    login: credentials.login,
                })

                // SuperAdmin (mock - único não no banco)
                if (credentials.domain.toUpperCase() === SUPERADMIN.domain &&
                    credentials.login === SUPERADMIN.login &&
                    credentials.password === SUPERADMIN.password) {

                    console.log("SuperAdmin authenticated (mock)")
                    return {
                        id: SUPERADMIN.login,
                        name: SUPERADMIN.name,
                        email: SUPERADMIN.login,
                        isAdmin: true,
                        clisigla: SUPERADMIN.domain,
                        companyName: SUPERADMIN.companyName,
                        role: SUPERADMIN.role,
                    }
                }

                // Todos outros usuários: buscar no banco
                try {
                    console.log("Searching user in database:", {
                        login: credentials.login,
                        clisigla: credentials.domain.toUpperCase()
                    })

                    const user = await prisma.sec_users.findFirst({
                        where: {
                            login: credentials.login,
                            clisigla: credentials.domain.toUpperCase(),
                            active: true,
                        },
                    })

                    if (!user) {
                        console.log("❌ User not found in database")
                        return null
                    }

                    console.log("✅ User found:", {
                        login: user.login,
                        name: user.name,
                        clisigla: user.clisigla,
                        active: user.active,
                        priv_admin: user.priv_admin,
                        passwordHash: user.pswd.substring(0, 20) + "..."
                    })

                    // Verificar senha
                    let isPasswordValid = false

                    // Tentar bcrypt primeiro
                    try {
                        isPasswordValid = await compare(credentials.password, user.pswd)
                        console.log("Bcrypt comparison result:", isPasswordValid)

                        // Se bcrypt retornou false, pode ser senha plain text
                        if (!isPasswordValid) {
                            console.log("⚠️ Bcrypt failed, trying plain text comparison")
                            isPasswordValid = credentials.password === user.pswd
                            console.log("Plain text comparison result:", isPasswordValid)
                        }
                    } catch (bcryptError) {
                        // Se bcrypt deu erro (senha não é hash válido), tentar plain text
                        console.log("⚠️ Bcrypt error, trying plain text comparison")
                        isPasswordValid = credentials.password === user.pswd
                        console.log("Plain text comparison result:", isPasswordValid)
                    }

                    if (!isPasswordValid) {
                        console.log("❌ Invalid password")
                        return null
                    }

                    console.log("✅ User authenticated from database:", user.login)

                    // Buscar nome da empresa
                    const cliente = await prisma.clientes.findFirst({
                        where: { clisigla: user.clisigla || undefined }
                    })

                    console.log("Company found:", cliente?.cliNome || "N/A")

                    return {
                        id: user.login,
                        name: user.name,
                        email: user.login,
                        isAdmin: true, // Todos usuários do banco são admins da sua empresa
                        clisigla: user.clisigla || "",
                        companyName: cliente?.cliNome || user.clisigla || "Empresa",
                        role: user.priv_admin ? "superadmin" : "admin", // priv_admin true = superadmin (cria empresas), false = admin (gerencia sua empresa)
                    }
                } catch (error) {
                    console.error("❌ Database error:", error)
                    return null
                }
            },
        }),
    ],
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    callbacks: {
        async jwt({ token, user }: any) {
            if (user) {
                token.isAdmin = user.isAdmin
                token.clisigla = user.clisigla
                token.companyName = user.companyName
                token.role = user.role
            }
            return token
        },
        async session({ session, token }: any) {
            if (session.user) {
                session.user.isAdmin = token.isAdmin
                session.user.clisigla = token.clisigla
                session.user.companyName = token.companyName
                session.user.role = token.role
            }
            return session
        },
    },
}
