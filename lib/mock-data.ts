/**
 * Dados mocados centralizados com isolamento por empresa (multi-tenancy)
 */

// Equipes por empresa
export const equipesMock = {
    DEM: [
        { id: 1, nome: "Comercial", descricao: "Equipe comercial", clisigla: "DEM" },
        { id: 2, nome: "Vendas", descricao: "Equipe de vendas", clisigla: "DEM" },
        { id: 3, nome: "Cotações A", descricao: "Equipe de cotações A", clisigla: "DEM" },
        { id: 4, nome: "Cotações B", descricao: "Equipe de cotações B", clisigla: "DEM" },
    ],
    TES: [
        { id: 5, nome: "Vendas", descricao: "Equipe vendas", clisigla: "TES" },
        { id: 6, nome: "Cotações", descricao: "Equipe cotações", clisigla: "TES" },
    ],
    ABC: [
        { id: 7, nome: "Comercial", descricao: "Time comercial", clisigla: "ABC" },
    ],
}

// Unidades por empresa
export const unidadesMock = {
    DEM: [
        { id: 1, sigla: "SP", nome: "São Paulo", clisigla: "DEM" },
        { id: 2, sigla: "RJ", nome: "Rio de Janeiro", clisigla: "DEM" },
        { id: 3, sigla: "MG", nome: "Minas Gerais", clisigla: "DEM" },
    ],
    TES: [
        { id: 4, sigla: "PR", nome: "Paraná", clisigla: "TES" },
        { id: 5, sigla: "SC", nome: "Santa Catarina", clisigla: "TES" },
    ],
    ABC: [
        { id: 6, sigla: "RS", nome: "Rio Grande do Sul", clisigla: "ABC" },
    ],
}

// Filiais por empresa
export const filiaisMock = {
    DEM: [
        { id: 1, filial: "FIL001", nome_filial: "Filial Centro - SP", clisigla: "DEM" },
        { id: 2, filial: "FIL002", nome_filial: "Filial Zona Norte - SP", clisigla: "DEM" },
        { id: 3, filial: "FIL003", nome_filial: "Filial Rio de Janeiro", clisigla: "DEM" },
    ],
    TES: [
        { id: 4, filial: "FIL004", nome_filial: "Filial Curitiba", clisigla: "TES" },
    ],
    ABC: [
        { id: 5, filial: "FIL005", nome_filial: "Filial Porto Alegre", clisigla: "ABC" },
    ],
}

// Vendedores por empresa - com filial, unidade e equipe
export const vendedoresMock = {
    DEM: [
        { id: 1, codigo: "V001", nome: "João Silva", status: "Ativo", filial: "Filial Centro - SP", unidade: "SP", equipe: "Comercial", clisigla: "DEM" },
        { id: 2, codigo: "V002", nome: "Maria Santos", status: "Ativo", filial: "Filial Rio de Janeiro", unidade: "RJ", equipe: "Vendas", clisigla: "DEM" },
        { id: 3, codigo: "V003", nome: "Pedro Costa", status: "Inativo", filial: "Filial Zona Norte - SP", unidade: "SP", equipe: "Comercial", clisigla: "DEM" },
    ],
    TES: [
        { id: 4, codigo: "V004", nome: "Carlos Mendes", status: "Ativo", filial: "Filial Curitiba", unidade: "PR", equipe: "Vendas", clisigla: "TES" },
    ],
    ABC: [
        { id: 5, codigo: "V005", nome: "Ana Paula", status: "Ativo", filial: "Filial Porto Alegre", unidade: "RS", equipe: "Comercial", clisigla: "ABC" },
    ],
}

// Cotadores por empresa - com filial, unidade e equipe
export const cotadoresMock = {
    DEM: [
        { id: 1, codigo: "C001", nome: "Carlos Mendes", status: "Ativo", filial: "Filial Centro - SP", unidade: "SP", equipe: "Cotações A", clisigla: "DEM" },
        { id: 2, codigo: "C002", nome: "Juliana Alves", status: "Ativo", filial: "Filial Rio de Janeiro", unidade: "RJ", equipe: "Cotações B", clisigla: "DEM" },
    ],
    TES: [
        { id: 3, codigo: "C003", nome: "Roberto Lima", status: "Ativo", filial: "Filial Curitiba", unidade: "PR", equipe: "Cotações", clisigla: "TES" },
    ],
    ABC: [],
}

// Função auxiliar para obter dados da empresa
export function getDadosEmpresa<T extends { clisigla: string }>(
    dados: Record<string, T[]>,
    clisigla: string
): T[] {
    return dados[clisigla] || []
}

// Função para obter todos os dados (para SuperAdmin)
export function getTodosDados<T>(dados: Record<string, T[]>): T[] {
    return Object.values(dados).flat()
}
