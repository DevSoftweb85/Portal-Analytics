const bcrypt = require('bcryptjs');

async function generateCredentials() {
    const password = 'demo123';
    const hash = await bcrypt.hash(password, 10);

    console.log('\n🔐 CREDENCIAIS FICTÍCIAS GERADAS\n');
    console.log('================================\n');

    console.log('📋 DADOS PARA INSERIR NO BANCO:\n');
    console.log('Tabela: clientes');
    console.log('INSERT INTO clientes (clisigla, cliNome) VALUES ("DEMO", "Empresa Demo");\n');

    console.log('Tabela: sec_users');
    console.log(`INSERT INTO sec_users (login, pswd, name, active, priv_admin, clisigla) 
VALUES ("admin", "${hash}", "Administrador Demo", 1, 1, "DEMO");\n`);

    console.log('================================\n');
    console.log('🚀 CREDENCIAIS PARA LOGIN NO PORTAL:\n');
    console.log('Domínio/Transportadora: DEMO');
    console.log('Usuário: admin');
    console.log('Senha: demo123');
    console.log('\n================================\n');

    console.log('📝 COPIE E EXECUTE NO phpMyAdmin:\n');
    console.log(`-- 1. Inserir empresa demo
INSERT INTO clientes (clisigla, cliNome) VALUES ('DEMO', 'Empresa Demo');

-- 2. Inserir usuário demo
INSERT INTO sec_users (login, pswd, name, active, priv_admin, clisigla) 
VALUES ('admin', '${hash}', 'Administrador Demo', 1, 1, 'DEMO');`);
}

generateCredentials();
