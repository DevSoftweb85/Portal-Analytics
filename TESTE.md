# 🧪 Guia de Testes - Portal Analytics

## 🔐 Credenciais de Login

### SuperAdmin
```
Domínio: SYS
Usuário: superadmin
Senha: super123
```
**Permissões:** Gerenciar transportadoras e criar admins

---

### Empresa DEMO
```
Domínio: DEM
Usuário: admin
Senha: demo123
```
**Permissões:** Admin completo da empresa DEMO

---

### Empresa TESTE
```
Domínio: TES
Usuário: admin
Senha: teste123
```
**Permissões:** Admin completo da empresa TESTE

---

### Empresa ABC
```
Domínio: ABC
Usuário: admin
Senha: abc123
```
**Permissões:** Admin completo da empresa ABC

---

## 📊 Dados Mocados por Empresa

### 🏢 Empresa DEMO

#### Equipes
- Comercial
- Vendas
- Cotações A
- Cotações B

#### Unidades
- SP - São Paulo
- RJ - Rio de Janeiro
- MG - Minas Gerais

#### Filiais
- FIL001 - Filial Centro - SP
- FIL002 - Filial Zona Norte - SP
- FIL003 - Filial Rio de Janeiro

#### Vendedores
| Código | Nome | Filial | Unidade | Equipe | Status |
|--------|------|--------|---------|--------|--------|
| V001 | João Silva | Filial Centro - SP | SP | Comercial | Ativo |
| V002 | Maria Santos | Filial Rio de Janeiro | RJ | Vendas | Ativo |
| V003 | Pedro Costa | Filial Zona Norte - SP | SP | Comercial | Inativo |

#### Cotadores
| Código | Nome | Filial | Unidade | Equipe | Status |
|--------|------|--------|---------|--------|--------|
| C001 | Carlos Mendes | Filial Centro - SP | SP | Cotações A | Ativo |
| C002 | Juliana Alves | Filial Rio de Janeiro | RJ | Cotações B | Ativo |

---

### 🏢 Empresa TESTE

#### Equipes
- Vendas
- Cotações

#### Unidades
- PR - Paraná
- SC - Santa Catarina

#### Filiais
- FIL004 - Filial Curitiba

#### Vendedores
| Código | Nome | Filial | Unidade | Equipe | Status |
|--------|------|--------|---------|--------|--------|
| V004 | Carlos Mendes | Filial Curitiba | PR | Vendas | Ativo |

#### Cotadores
| Código | Nome | Filial | Unidade | Equipe | Status |
|--------|------|--------|---------|--------|--------|
| C003 | Roberto Lima | Filial Curitiba | PR | Cotações | Ativo |

---

### 🏢 Empresa ABC

#### Equipes
- Comercial

#### Unidades
- RS - Rio Grande do Sul

#### Filiais
- FIL005 - Filial Porto Alegre

#### Vendedores
| Código | Nome | Filial | Unidade | Equipe | Status |
|--------|------|--------|---------|--------|--------|
| V005 | Ana Paula | Filial Porto Alegre | RS | Comercial | Ativo |

#### Cotadores
- Nenhum cotador cadastrado

---

## 🎯 Tipos de Meta

1. **Vendedor** - Meta individual por vendedor
2. **Cotador** - Meta individual por cotador
3. **Unidade** - Meta por unidade regional
4. **Filial** - Meta por filial
5. **Faturamento** - Meta geral da empresa (visível para todos)

---

## ✅ Fluxo de Teste Recomendado

### 1. Login SuperAdmin
```
1. Acesse: http://localhost:3000/login
2. Domínio: SYS
3. Usuário: superadmin
4. Senha: super123
5. Navegue para: Transportadoras
```

### 2. Login Admin (Empresa DEMO)
```
1. Acesse: http://localhost:3000/login
2. Domínio: DEM
3. Usuário: admin
4. Senha: demo123
5. Teste: Dashboard, Equipes, Unidades, Filiais, Vendedores, Cotadores, Metas
```

### 3. Cadastrar Nova Equipe
```
1. Menu: Equipes
2. Clique: "Adicionar"
3. Nome: Marketing
4. Descrição: Equipe de marketing
```

### 4. Cadastrar Novo Vendedor
```
1. Menu: Vendedores
2. Código: V010
3. Nome: Teste Silva
4. Filial: Selecionar uma filial
5. Unidade: Selecionar uma unidade
6. Equipe: Selecionar uma equipe
7. Clique: "Adicionar"
```

### 5. Cadastrar Nova Meta
```
1. Menu: Metas
2. Tipo: Vendedor
3. Selecionar: João Silva (V001)
4. Meta: 50000
5. Clique: "Cadastrar"
6. Veja detalhes preenchidos automaticamente
```

### 6. Cadastrar Meta de Faturamento
```
1. Menu: Metas
2. Tipo: Faturamento
3. Meta: 500000
4. Clique: "Cadastrar"
5. Veja que é uma meta geral da empresa
```

### 7. Filtrar Metas
```
1. Menu: Metas
2. Use filtros: Todos, Vendedor, Cotador, Unidade, Filial, Faturamento
3. Veja contador de metas por tipo
```

### 8. Testar Isolamento Multi-Tenant
```
1. Faça logout
2. Login como TESTE (TES / admin / teste123)
3. Veja que os dados são diferentes (apenas da empresa TESTE)
4. Faça logout
5. Login como ABC (ABC / admin / abc123)
6. Veja que os dados são diferentes novamente
```

---

## 🚀 URLs Importantes

- **Login:** http://localhost:3000/login
- **Dashboard:** http://localhost:3000/dashboard
- **Prisma Studio:** http://localhost:5555

---

## 📝 Notas Importantes

1. ✅ Todos os dados são mock (em memória)
2. ✅ Cada empresa vê apenas seus próprios dados
3. ✅ Domínio limitado a 3 caracteres
4. ✅ Data de meta é sempre a data atual (automática)
5. ✅ Não permite metas duplicadas para o mesmo responsável na mesma data
6. ✅ Meta de Faturamento é geral e visível para todos da empresa

---

## 🎨 Recursos Visuais

- Tema roxo (`purple-600`) sólido
- Login com fundo escuro e design moderno
- Sidebar responsiva com menu hambúrguer (mobile)
- Tabelas com hover e busca
- Cards com badges de status
- Filtros visuais com contador
