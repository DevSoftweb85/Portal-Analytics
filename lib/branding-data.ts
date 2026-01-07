/**
 * Configurações de branding - agora usando banco de dados real
 */

import { prisma } from "@/lib/db"

export interface BrandingConfig {
    clisigla: string
    nomeEmpresa: string
    logoUrl?: string
    corPrimaria: string
    corSecundaria: string
    corFundoLogin: string
}

// Cores padrão (banco não tem campos de cor)
const DEFAULT_COLORS = {
    corPrimaria: "#7C3AED",
    corSecundaria: "#EC4899",
    corFundoLogin: "#1F2937",
}

// Função para obter branding de uma empresa (do banco de dados)
export async function getBranding(clisigla: string): Promise<BrandingConfig | null> {
    try {
        const cliente = await prisma.clientes.findFirst({
            where: { clisigla: clisigla.toUpperCase() }
        })

        if (!cliente) {
            return null
        }

        return {
            clisigla: cliente.clisigla || clisigla,
            nomeEmpresa: cliente.cliNome || clisigla,
            logoUrl: cliente.clilogo || undefined,
            ...DEFAULT_COLORS,
        }
    } catch (error) {
        console.error("Error fetching branding:", error)
        return null
    }
}

// Função para atualizar branding (logo apenas, cores são fixas)
export async function updateBranding(clisigla: string, logoUrl: string): Promise<void> {
    try {
        await prisma.clientes.updateMany({
            where: { clisigla: clisigla.toUpperCase() },
            data: { clilogo: logoUrl }
        })
    } catch (error) {
        console.error("Error updating branding:", error)
        throw error
    }
}

// Função sincronizada para usar no Client Component (busca cache ou retorna default)
export function getBrandingSync(clisigla: string): BrandingConfig {
    return {
        clisigla,
        nomeEmpresa: clisigla,
        logoUrl: undefined,
        ...DEFAULT_COLORS,
    }
}
