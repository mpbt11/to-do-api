<p align="center">
  <strong>🚀 ToDo API</strong>
</p>

<p align="center">
  Uma API RESTful para gerenciamento de tarefas (ToDo), construída com NestJS.
</p>

---

### Visão Geral

Este projeto oferece uma solução de backend robusta para um aplicativo de lista de tarefas, com foco em arquitetura desacoplada, segurança e automação. Ele inclui um sistema de autenticação e um CRUD para gerenciar tarefas.

### Funcionalidades

- **Autenticação de Usuário**: Cadastro e login com email e senha, utilizando tokens JWT para proteção de rotas.
- **Gerenciamento de Tarefas**:
  - **CRUD Completo**: Crie, edite, exclua e liste tarefas.
  - **Segurança por Usuário**: Cada usuário pode ver e gerenciar apenas suas próprias tarefas.
  - **Campos da Tarefa**: Cada tarefa inclui `título`, `descrição`, `status` (pendente, em_andamento, concluida), e timestamps de criação e atualização.
- **CI/CD**: Pipeline de integração contínua configurado com GitHub Actions para garantir a qualidade do código.
- **Pronto para Docker**: Scripts de Docker e Docker Compose para facilitar a execução em ambientes de desenvolvimento e produção.

---

### Tecnologias

- **Backend**: [NestJS](https://nestjs.com/) (TypeScript)
- **Banco de dados**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Autenticação**: [JSON Web Tokens (JWT)](https://jwt.io/)
- **Testes**: [Jest](https://jestjs.io/)
- **Automação**: [GitHub Actions](https://github.com/features/actions)
- **Containerização**: [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/)

---

## Primeiros Passos

### 1. Pré-requisitos

Certifique-se de ter os seguintes softwares instalados:

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- [Docker](https://docs.docker.com/get-docker/) (recomendado)

---

### 2. Configuração do Projeto

#### Com Docker (Recomendado)

1. **Clone o repositório:**

   ```bash
   git clone <url-do-repositorio>
   cd to-do-api
   ```

2. **Configure as variáveis de ambiente:**

   ```bash
   cp env.example .env
   ```

3. **Subir a aplicação:**

   ```bash
   docker-compose up -d
   ```

   Isso irá:
   - Iniciar um container do PostgreSQL na porta 5432
   - Construir e rodar o container da aplicação NestJS na porta 3000
   - Executar as migrações do Prisma automaticamente

   **Acessos:**
   - API: http://localhost:3000
   - Banco PostgreSQL: localhost:5432

4. **Verificar se está funcionando:**

   ```bash
   # Ver logs da aplicação
   docker-compose logs -f app

   # Testar a API
   curl http://localhost:3000/health
   ```

5. **Parar a aplicação:**
   ```bash
   docker-compose down
   ```

#### Sem Docker (Desenvolvimento Local)

1. **Instale as dependências:**

   ```bash
   npm install
   ```

2. **Configure o banco PostgreSQL localmente**

3. **Configure as variáveis de ambiente:**

   ```bash
   cp env.example .env
   # Edite o .env com suas configurações locais
   ```

4. **Execute as migrações:**

   ```bash
   npx prisma migrate deploy
   ```

5. **Inicie a aplicação:**

   ```bash
   # Modo de desenvolvimento
   npm run start:dev

   # Modo de produção
   npm run build && npm run start:prod
   ```

---

## Comandos Úteis do Docker

```bash
# Ver logs em tempo real
docker-compose logs -f app

# Ver logs do banco
docker-compose logs -f postgres

# Entrar no container da aplicação
docker exec -it todo-app sh

# Entrar no banco PostgreSQL
docker exec -it todo-postgres psql -U todo_user -d todo_db

# Rebuild da aplicação
docker-compose build app

# Parar e remover volumes (CUIDADO: apaga dados)
docker-compose down -v
```

---

## Rotas da API

| Método | Endpoint         | Descrição                                      |
| ------ | ---------------- | ---------------------------------------------- |
| POST   | `/auth/register` | Cadastra um novo usuário.                      |
| POST   | `/auth/login`    | Autentica um usuário e retorna um token JWT.   |
| GET    | `/tasks`         | Lista todas as tarefas do usuário autenticado. |
| POST   | `/tasks`         | Cria uma nova tarefa.                          |
| PATCH  | `/tasks/:id`     | Atualiza uma tarefa específica.                |
| DELETE | `/tasks/:id`     | Exclui uma tarefa específica.                  |

---

## Testes

Os testes unitários e de integração são executados usando o **Jest**.

```bash
# Executa todos os testes
npm run test

# Executa testes com relatório de cobertura
npm run test:cov
```

---

## Licença

Este projeto está licenciado sob a [Licença MIT](LICENSE).
