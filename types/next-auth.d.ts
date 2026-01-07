/// <reference types="next-auth" />

declare module "next-auth" {
    interface User {
        id: string
        name?: string | null
        email?: string | null
        isAdmin?: boolean
        clisigla?: string | null
        companyName?: string | null
        role?: "superadmin" | "admin" | "user"
    }

    interface Session {
        user: {
            id: string
            name?: string | null
            email?: string | null
            isAdmin?: boolean
            clisigla?: string | null
            companyName?: string | null
            role?: "superadmin" | "admin" | "user"
        }
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id?: string
        isAdmin?: boolean
        clisigla?: string | null
        companyName?: string | null
        role?: "superadmin" | "admin" | "user"
    }
}
