# Usar uma imagem base do Node.js
FROM node:21

# Definir o diretório de trabalho
WORKDIR /app

# Copiar os arquivos de configuração do projeto (package.json e package-lock.json) primeiro
# Isso ajuda a utilizar o cache do Docker para acelerar a construção
COPY package*.json ./

# Instalar as dependências
RUN npm install

# Instalar o Angular CLI globalmente
RUN npm install -g @angular/cli

# Copiar o restante dos arquivos da aplicação
COPY . .

# Expor a porta que o Angular irá usar
EXPOSE 4200

# Comando para iniciar a aplicação Angular
CMD ["ng", "serve", "--host", "0.0.0.0"]
