<p align="center">
  <strong>✅ Desafio Técnico Full Stack — ToDo App</strong>
</p>

### Sobre o projeto
Aplicação para cadastro e gerenciamento de tarefas (ToDo), com arquitetura desacoplada. Backend em NestJS + Prisma e banco PostgreSQL (ou MongoDB). Frontend esperado em Next.js (não incluso neste repositório).

### Tecnologias
- **Backend**: NestJS (TypeScript)
- **ORM**: Prisma
- **Banco de dados**: PostgreSQL (padrão) ou MongoDB
- **Testes**: Jest
- **CI**: GitHub Actions
- **Docker**: Docker e docker-compose (opcional, recomendado)

### Escopo obrigatório
- **Autenticação**: cadastro e login por e-mail/senha; proteção de rotas (JWT ou cookies)
- **CRUD de Tarefas**: criar, editar, deletar, listar; apenas do usuário autenticado
- **Campos da tarefa**: id, título, descrição, status ("pendente" | "em_andamento" | "concluida"), `createdAt`, `updatedAt`
- **Testes**: pelo menos 2 no backend (ex.: serviços de tarefas e de autenticação)

### Documentação
- Descrição do desafio: `DOCS/DESAFIO.md`
- Setup e execução: `DOCS/SETUP.md`
---

## Como executar (Backend)

### 1) Pré-requisitos
- Node.js 18+
- npm ou yarn
- PostgreSQL local ou via Docker

### 2) Instalação
```bash
npm install
```

### 3) Variáveis de ambiente
Crie um arquivo `.env` na raiz com:
```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DBNAME?schema=public"
JWT_SECRET="sua_chave_segura"
PORT=3000
```

### 4) Prisma (migrate e client)
```bash
npx prisma format
npx prisma migrate dev -n init
npx prisma generate
```

### 5) Executar
```bash
# desenvolvimento
npm run start:dev

# produção
npm run build && npm run start:prod
```

---

## Modelos (Prisma)
Os modelos principais estão em `prisma/schema.prisma`.

Exemplo simplificado esperado:
```prisma
model User {
  id     Int     @id @default(autoincrement())
  email  String  @unique
  name   String?
  role   Role    @default(USER)
  tasks  Task[]
}

model Task {
  id        Int      @id @default(autoincrement())
  title     String
  descricao String?
  status    Status   @default(pendente)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  authorId  Int?
  author    User?    @relation(fields: [authorId], references: [id])
}

enum Role {
  USER
  ADMIN
}

enum Status {
  pendente
  em_andamento
  concluida
}
```

---

## Rotas (exemplo esperado)
- `POST /auth/register` — cadastro
- `POST /auth/login` — login (retorna JWT)
- `GET /tasks` — lista tarefas do usuário autenticado
- `POST /tasks` — cria tarefa
- `PUT /tasks/:id` — atualiza tarefa
- `DELETE /tasks/:id` — remove tarefa

---

## Testes
```bash
# unitários
npm run test

# e2e (se configurado)
npm run test:e2e

# cobertura
npm run test:cov
```

Sugestões mínimas:
- Serviço de autenticação (hash/validação de senha, geração/validação de token)
- Serviço de tarefas (criação, filtro por usuário, atualização de status)

---

## GitHub Actions (CI)
Workflow recomendado:
- Instalar dependências
- Rodar lint (`npm run lint`)
- Rodar build (`npm run build`)
- Rodar testes (`npm run test`)

Exemplo básico de passos:
```yaml
name: CI
on: [push, pull_request]
jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run lint
      - run: npm run build
      - run: npm test -- --ci
```

---

## Docker (opcional)
Arquivo `docker-compose.yml` sugerido (Postgres + app):
```yaml
version: '3.9'
services:
  db:
    image: postgres:16
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: todo
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  api:
    build: .
    environment:
      DATABASE_URL: postgresql://postgres:postgres@db:5432/todo?schema=public
      JWT_SECRET: sua_chave_segura
      PORT: 3000
    depends_on:
      - db
    ports:
      - "3000:3000"

volumes:
  pgdata:
```

## Scripts úteis
- `start` — inicia app
- `start:dev` — watch mode
- `start:prod` — inicia buildado
- `build` — transpila para `dist`
- `lint` — ESLint
- `test`, `test:e2e`, `test:cov` — testes

---

---

## Licença
MIT
