// Test database connection
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testConnection() {
    try {
        console.log('🔍 Testando conexão com banco...')

        // Test 1: Connection
        await prisma.$connect()
        console.log('✅ Conexão estabelecida!')

        // Test 2: Query simples
        const count = await prisma.sec_users.count()
        console.log(`✅ Usuários no banco: ${count}`)

        // Test 3: Buscar usuário específico
        const user = await prisma.sec_users.findFirst({
            where: {
                login: 'fabioBRaex',
                clisigla: 'BXE'
            }
        })

        if (user) {
            console.log('✅ Usuário encontrado:', {
                login: user.login,
                name: user.name,
                clisigla: user.clisigla,
                active: user.active,
                priv_admin: user.priv_admin
            })

            // Test password
            console.log('Senha no banco:', user.pswd)
            console.log('Senha é plain text?', user.pswd === '123456')
        } else {
            console.log('❌ Usuário NÃO encontrado')
        }

    } catch (error) {
        console.error('❌ Erro:', error)
    } finally {
        await prisma.$disconnect()
    }
}

testConnection()
