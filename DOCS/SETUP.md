## Setup e Execução — Backend (NestJS + Prisma)

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- PostgreSQL local ou via Docker

### 1) Instalar dependências
```bash
npm install
```

### 2) Variáveis de ambiente
Crie `.env` na raiz:
```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DBNAME?schema=public"
JWT_SECRET="sua_chave_segura"
PORT=3000
```

### 3) Prisma
```bash
npx prisma format
npx prisma migrate dev -n init
npx prisma generate
```

### 4) Executar a API
```bash
npm run start:dev
```

### 5) Testes
```bash
npm run test
npm run test:e2e
npm run test:cov
```

### 6) Rotas esperadas
- POST `/auth/register`
- POST `/auth/login`
- GET `/tasks`
- POST `/tasks`
- PUT `/tasks/:id`
- DELETE `/tasks/:id`

### 7) Docker (opcional)
Exemplo de `docker-compose.yml` com Postgres e API disponível no README.

