## Desafio Técnico Full Stack — ToDo

### Objetivo
Construir uma aplicação Full Stack para cadastro e gerenciamento de tarefas (ToDo).

### Requisitos
- **Arquitetura**: desacoplada (Frontend e Backend separados)
- **Frontend**: Next.js (TypeScript)
- **Backend**: NestJS (TypeScript)
- **ORM**: Prisma
- **Banco de dados**: PostgreSQL 
- **CI**: GitHub Actions
- **Testes**: Jest

### Funcionalidades
- **Autenticação**
  - Cadastro por e-mail e senha
  - Login por e-mail e senha
  - Proteção de rotas autenticadas (JWT ou cookies)

- **CRUD de Tarefas**
  - Criar, editar, deletar e listar tarefas
  - Listar apenas tarefas do usuário autenticado
  - Campos: `id`, `title`, `descricao`, `status` ("pendente" | "em_andamento" | "concluida"), `createdAt`, `updatedAt`





