FROM node:20.18.3

USER node

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

# Copiar código-fonte
COPY . .

# Expor porta e iniciar a aplicação
EXPOSE 3000

CMD [ "npm", "start", "tail", "-f", "/dev/null"]