const mysql = require('mysql2/promise');

async function testConnection() {
    try {
        console.log('🔄 Testando conexão com o banco de dados...\n');

        const connection = await mysql.createConnection({
            host: 'srv1070.hstgr.io',
            port: 3306,
            user: 'u224197562_analyticslog',
            password: 'Softweb@4289',
            database: 'u224197562_analyticslog'
        });

        console.log('✅ CONEXÃO ESTABELECIDA COM SUCESSO!\n');

        // Testar uma query simples
        const [rows] = await connection.execute('SELECT COUNT(*) as total FROM sec_users');
        console.log(`📊 Total de usuários na tabela sec_users: ${rows[0].total}\n`);

        // Listar algumas tabelas
        const [tables] = await connection.execute('SHOW TABLES');
        console.log('📋 Tabelas encontradas no banco:');
        tables.forEach(table => {
            console.log(`   - ${Object.values(table)[0]}`);
        });

        await connection.end();
        console.log('\n✅ Teste concluído com sucesso!');
    } catch (error) {
        console.error('❌ ERRO AO CONECTAR:', error.message);
        process.exit(1);
    }
}

testConnection();
