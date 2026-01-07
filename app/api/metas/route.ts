import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

// GET /api/metas
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.clisigla) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
        }

        const clisigla = session.user.clisigla

        // Carregar catálogos para mapeamento de nomes
        const [vendedoresList, cotadoresList, unidadesList] = await Promise.all([
            prisma.vendedores.findMany({ where: { clisigla } }),
            prisma.cotadores.findMany({ where: { clisigla } }),
            prisma.unidades.findMany({ where: { clisigla } })
        ])

        // Criar mapas de ID -> Nome
        const vendedoresMap = new Map(vendedoresList.map(v => [v.id, v.nome || "Vendedor " + v.id]))
        const cotadoresMap = new Map(cotadoresList.map(c => [c.id, c.nome || "Cotador " + c.id]))
        const unidadesMap = new Map(unidadesList.map(u => [u.id, u.nome]))

        // Carregar metas
        const [metasVendedores, metasCotadores, metasFaturamento, metasUnidade] = await Promise.all([
            prisma.metas_vendedores.findMany({
                where: { clisigla },
                orderBy: { data: 'desc' }
            }),
            prisma.metas_cotadores.findMany({
                where: { dominio: clisigla },
                orderBy: { created_at: 'desc' }
            }),
            prisma.meta_faturamento.findMany({
                where: { clisigla },
                orderBy: { data: 'desc' }
            }),
            prisma.metas_unidade.findMany({
                where: { unidades: { clisigla } }, // Filtrar por unidade da empresa
                orderBy: { data_meta: 'desc' },
                include: { unidades: true }
            })
        ])

        const metasNormalizadas = [
            ...metasVendedores.map(m => ({
                id: `v-${m.id}`,
                tipo: 'Vendedor',
                data: m.data,
                meta: m.meta,
                responsavel_id: m.vendedor_id,
                responsavel_nome: m.vendedor_id ? (vendedoresMap.get(m.vendedor_id) || `ID: ${m.vendedor_id}`) : "N/I",
                clisigla: m.clisigla,
                detalhes: {
                    Meta_Tomadores: m.Meta_Tomadores,
                    meta_vlr_medio: m.meta_vlr_medio,
                    meta_frequencia: m.meta_frequencia,
                    meta_cte: m.meta_cte,
                }
            })),

            ...metasCotadores.map(m => ({
                id: `c-${m.id || Math.random()}`,
                tipo: 'Cotador',
                data: m.created_at,
                meta: m.meta,
                responsavel_id: m.cotador,
                responsavel_nome: m.cotador ? (cotadoresMap.get(m.cotador) || `ID: ${m.cotador}`) : "N/I",
                clisigla: m.dominio,
                detalhes: {
                    Cotador_Dash: m.cotador_dash
                }
            })),

            ...metasFaturamento.map(m => ({
                id: `f-${m.id}`,
                tipo: 'Faturamento',
                data: m.data,
                meta: m.valor,
                responsavel_id: m.filial,
                responsavel_nome: m.filial, // Filial já é o nome/sigla
                clisigla: m.clisigla,
                detalhes: {
                    Sigla: m.sigla
                }
            })),

            ...metasUnidade.map(m => ({
                id: `u-${m.id}`,
                tipo: 'Unidade',
                data: m.data_meta,
                meta: m.meta,
                responsavel_id: m.unidade_id,
                responsavel_nome: m.unidades?.nome || "Unidade " + m.unidade_id,
                clisigla: m.unidades?.clisigla || "N/A",
                detalhes: {}
            }))
        ]

        return NextResponse.json(metasNormalizadas)
    } catch (error) {
        console.error("Error fetching metas:", error)
        return NextResponse.json({ error: "Erro ao buscar metas" }, { status: 500 })
    }
}

// POST /api/metas - Criar nova meta
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        const clisigla = session?.user?.clisigla

        if (!clisigla) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
        }

        const body = await request.json()

        if (body.tipo === "Vendedor") {
            await prisma.metas_vendedores.create({
                data: {
                    vendedor_id: body.vendedor_id,
                    meta: body.meta,
                    data: new Date(body.data),
                    status: "Ativo",
                    clisigla: clisigla,
                    Meta_Tomadores: body.Meta_Tomadores || 0,
                    meta_vlr_medio: body.meta_vlr_medio || 0,
                    meta_frequencia: body.meta_frequencia || 0,
                    meta_cte: body.meta_cte || 0
                }
            })
        } else if (body.tipo === "Cotador") {
            await prisma.metas_cotadores.create({
                data: {
                    cotador: body.cotador, // ID do cotador
                    meta: body.meta,
                    created_at: new Date(),
                    dominio: clisigla,
                    cotador_dash: 0 // Valor padrão
                }
            })
        } else if (body.tipo === "Faturamento") {
            await prisma.meta_faturamento.create({
                data: {
                    filial: body.filial,
                    sigla: body.sigla,
                    valor: body.valor,
                    data: new Date(body.data),
                    clisigla: clisigla
                }
            })
        } else if (body.tipo === "Unidade") {
            await prisma.metas_unidade.create({
                data: {
                    unidade_id: body.unidade_id,
                    meta: body.meta,
                    data_meta: new Date(body.data)
                }
            })
        } else {
            return NextResponse.json({ error: "Tipo inválido" }, { status: 400 })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error creating meta:", error)
        return NextResponse.json({ error: "Erro ao criar meta" }, { status: 500 })
    }
}
