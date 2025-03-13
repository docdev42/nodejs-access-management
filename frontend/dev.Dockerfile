FROM node:20.18.3

WORKDIR /app

EXPOSE 9000

CMD ["npx", "quasar", "dev"]