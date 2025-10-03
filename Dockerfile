# Use Node.js 20 Alpine
FROM node:20-alpine

# Instalar dependências necessárias para Prisma
RUN apk add --no-cache openssl

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./
COPY prisma ./prisma/

# Instalar dependências
RUN npm ci

# Gerar cliente Prisma
RUN npx prisma generate

# Copiar código fonte
COPY . .

# Build da aplicação
RUN npm run build

# Verificar se o build foi criado
RUN ls -la dist/

# Expor porta
EXPOSE 3000

# Comando de inicialização
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/main.js"]