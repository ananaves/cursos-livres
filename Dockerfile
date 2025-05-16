# Usa uma imagem Node.js para o build
FROM node:lts-slim as build

# Define o diretório de trabalho
WORKDIR /app

# Copia o arquivo de configuração do Node.js
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia todo o código fonte
COPY . .

# Compila o TypeScript
RUN npm run start

# Usa uma nova imagem para o ambiente final
FROM node:lts-slim as production

# Define o diretório de trabalho
WORKDIR /app

# Copia apenas o código compilado e dependências
COPY --from=build /app/dist ./dist
COPY package*.json ./

# Instala apenas dependências de produção
RUN npm install --only=production

# Expor a porta que a aplicação vai rodar
EXPOSE 4444

# Comando para rodar a aplicação
CMD ["node", "dist/index.js"]
