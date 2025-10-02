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

1. **Instale as dependências:**

   ```bash
   npm install
   ```

2. **Variáveis de Ambiente:**

   Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

   ```env
   DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DBNAME?schema=public"
   JWT_SECRET="sua_chave_secreta_aqui"
   PORT=3000
   ```

   - `DATABASE_URL`: A URL de conexão com o seu banco de dados PostgreSQL.
   - `JWT_SECRET`: Uma string secreta forte para assinar os tokens JWT.
   - `PORT`: A porta em que a aplicação será executada.

---

### 3. Execução

#### Com Docker Compose (Recomendado)

A maneira mais fácil de iniciar a aplicação com o banco de dados:

```bash
docker-compose up --build
```

Isso irá:

- Iniciar um container do PostgreSQL.
- Construir e rodar o container da aplicação Node.js.
- Executar as migrações do Prisma automaticamente.

---

#### Sem Docker

Se você tem o PostgreSQL instalado localmente, siga estes passos:

1. **Execute as migrações do Prisma:**

   ```bash
   npx prisma migrate deploy
   ```

2. **Inicie a aplicação:**

   ```bash
   # Modo de desenvolvimento (com hot-reload)
   npm run start:dev

   # Modo de produção
   npm run build && npm run start:prod
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
