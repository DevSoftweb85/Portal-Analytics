/**
 * Funções utilitárias para controle de permissões baseado em roles
 */

export type UserRole = "superadmin" | "admin" | "user"

/**
 * SuperAdmin pode gerenciar transportadoras e criar admins
 */
export function canManageCompanies(role?: UserRole | null): boolean {
    return role === "superadmin"
}

/**
 * Admin e SuperAdmin podem gerenciar usuários
 */
export function canManageUsers(role?: UserRole | null): boolean {
    return role === "admin" || role === "superadmin"
}

/**
 * Admin e SuperAdmin podem editar dados (criar, editar, excluir)
 */
export function canEditData(role?: UserRole | null): boolean {
    return role === "admin" || role === "superadmin"
}

/**
 * Admin e SuperAdmin podem criar metas
 */
export function canCreateGoals(role?: UserRole | null): boolean {
    return role === "admin" || role === "superadmin"
}

/**
 * Todos podem visualizar dados (mas Users só veem seus próprios)
 */
export function canViewData(role?: UserRole | null): boolean {
    return !!role
}

/**
 * Verifica se o usuário é SuperAdmin
 */
export function isSuperAdmin(role?: UserRole | null): boolean {
    return role === "superadmin"
}

/**
 * Verifica se o usuário é Admin
 */
export function isAdmin(role?: UserRole | null): boolean {
    return role === "admin"
}

/**
 * Verifica se o usuário é User/Vendedor
 */
export function isUser(role?: UserRole | null): boolean {
    return role === "user"
}
