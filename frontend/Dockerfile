FROM node:20.18.3 AS builder
ENV NODE_ENV development
RUN apt update && apt install -y openssl procps
WORKDIR /app
COPY . .
RUN npm install -g @quasar/cli \
  && npm install \
  && quasar build

FROM nginx:alpine
COPY --from=builder /app/dist/spa /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]