// Script para consultar usuários e domínios do banco
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('📊 Consultando banco de dados...\n')

    // Listar todos os clientes (domínios)
    const clientes = await prisma.clientes.findMany({
        select: {
            clisigla: true,
            cliNome: true,
            clilogo: true,
        },
        orderBy: { clisigla: 'asc' }
    })

    console.log('🏢 DOMÍNIOS CADASTRADOS (clientes):')
    console.log('=====================================')
    clientes.forEach(c => {
        console.log(`Domínio: ${c.clisigla || 'N/A'}`)
        console.log(`Nome: ${c.cliNome || 'N/A'}`)
        console.log(`Logo: ${c.clilogo || 'Sem logo'}`)
        console.log('-------------------------------------')
    })

    // Listar todos os usuários
    const users = await prisma.sec_users.findMany({
        select: {
            login: true,
            name: true,
            clisigla: true,
            active: true,
            priv_admin: true,
            pswd: true,
        },
        orderBy: { clisigla: 'asc' }
    })

    console.log('\n👥 USUÁRIOS CADASTRADOS (sec_users):')
    console.log('=====================================')
    users.forEach(u => {
        const passwordType = u.pswd.startsWith('$2') ? 'bcrypt' : 'plain text'
        const role = u.priv_admin ? 'SUPERADMIN' : 'USER'

        console.log(`Domínio: ${u.clisigla || 'N/A'}`)
        console.log(`Login: ${u.login}`)
        console.log(`Nome: ${u.name}`)
        console.log(`Role: ${role}`)
        console.log(`Ativo: ${u.active ? 'Sim' : 'Não'}`)
        console.log(`Senha tipo: ${passwordType}`)
        console.log(`Senha hash: ${u.pswd.substring(0, 30)}...`)
        console.log('-------------------------------------')
    })

    console.log('\n✅ Consulta concluída!')
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
