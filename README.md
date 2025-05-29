# Carteira Digital - Desafio para front-end Grupo Adriano Cobuccio

Uma carteira digital com autenticação, depósitos, transferências e reversão de operações, desenvolvida com Next.js e TypeScript.

Conteinerização feita com Docker e teste unitários com Jest e React Testing Library

## Funcionalidades Principais

- **Autenticação**
  - Cadastro e login com Next-Auth
  - Proteção de rotas com middleware
  - Session management

- **Operações Financeiras**
  - Depósito com validação em tempo real
  - Transferência entre usuários cadastrados
  - Reversão de transações
  - Histórico de operações

- **Validações**
  - Formulários com Zod e React Hook Form
  - Validações no cliente e servidor

## Como Executar

### Pré-requisitos
- Docker 20.10+
- Docker Compose 2.17+
- Node.js 18+

### Passo a Passo

1. **Clone o repositório**
```bash
git clone https://github.com/moraisale/teste-tecnico-gac.git
cd teste-tecnico-gac
```

2. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
```
Edite o `.env` com as credenciais

3. **Instale as dependências e gere client Prisma**
```bash
npm install
npx prisma generate
```

4. **Inicie os containers**
```bash
docker-compose up --build
```

5. **Execute as migrations e seed**
```bash
docker-compose exec app npx prisma migrate deploy
docker-compose exec app npx prisma db seed
```

A aplicação estará disponível em: [http://localhost:3000](http://localhost:3000)

### Credenciais para Teste (ou crie uma conta em [http://localhost:3000/register](http://localhost:3000/register))

| Campo | Valor |
|-------|-------|
| Email | admin@test.com |
| Senha | admin123 |
| Saldo | R$ 10.000,00 |

## Arquitetura

### Principais Tecnologias

#### Front-end

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS

#### Back-end

- Next.js API Routes
- Prisma ORM
- PostgreSQL
- Next-Auth

### Padrões Adotados

- SOLID
  - Single Responsibility Principle (cada componente tem sua responsabilidade e cada action faz apenas 1 tarefa)
  - Open/Closed Principle
- Server Actions para as operações financeiras
- Componentização atômica

## Variáveis de Ambiente

```
DATABASE_URL=postgresql://postgres:Alexandre@123@localhost:5432/carteira-digital
NEXTAUTH_SECRET=062b7e57104027931193fed14b8bdd7c257414b42d2f959f05b707dc5e5428f2
JWT_SECRET=7d5b0ebe3111f47166ea6d5f235f763eed9db7ec550e5c3456dd530005b7c07f
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_API_BASE_URL="http://localhost:3000"
```

## Testes

```bash
# Executar testes unitários
npm test

## Comandos Úteis

| Comando | Descrição |
|---------|-----------|
| docker-compose logs -f app | Ver logs da aplicação |
| docker-compose exec db psql | Acessar PostgreSQL |
| npx prisma studio | Abrir interface do banco |
