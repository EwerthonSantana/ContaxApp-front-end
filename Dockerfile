# Etapa 1: Build do projeto
FROM node:20-alpine AS build

# Definir diretório de trabalho
WORKDIR /app

# Copiar package.json e package-lock.json (ou yarn.lock)
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar todo o código-fonte
COPY . .

# Build do projeto
RUN npm run build

# Etapa 2: Servir com Nginx
FROM nginx:alpine

# Copiar build gerado para o Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar configuração customizada do Nginx (opcional)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expor porta 80
EXPOSE 80

# Comando padrão
CMD ["nginx", "-g", "daemon off;"]
