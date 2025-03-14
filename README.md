# Projeto de Gestão de Acessos

Este é um projeto de gestão de acessos que permite que usuários criem contas e façam login. Um usuário com permissões administrativas pode aprovar cadastros e designar permissões a outros usuários.

## Tecnologias Utilizadas

- **Backend**: [NestJS](https://nestjs.com/) com [Prisma](https://www.prisma.io/) para conexão com o banco de dados
- **Frontend**: [Quasar Framework](https://quasar.dev/) + [Vue 3](https://vuejs.org/)
- **Banco de Dados**: [PostgreSQL](https://www.postgresql.org/)
- **Containerização**: [Docker](https://www.docker.com/) com um container para cada parte do projeto (backend, frontend, banco de dados)
- **Autenticação**: [JWT](https://jwt.io/) para autenticação e validação de permissões

## Funcionalidades

- Cadastro e login de usuários
- Aprovação de cadastro por um admin
- Designação de permissões a usuários
- Validação de permissões via JWT
- Containerização com Docker
- Painel administrativo com análise de dados e gráficos

## Melhorias Futuras

- Implementação de sistema de mensageria com webhooks para validar permissões modificadas ou revogadas
- Validação de acesso no frontend para evitar que usuários acessem telas sem permissões adequadas
- Expansão do frontend com módulos mais completos

## Como Rodar o Projeto

1. Clone o repositório:
   ```sh
   git clone git@github.com:docdev42/nodejs-access-management.git
   ```
2. Acesse a pasta do projeto e execute:
   ```sh
   docker compose up --build
   ```
3. O sistema estará acessível em: [http://localhost](http://localhost)

## Credenciais Iniciais

- **Usuário**: `admin@user.com`
- **Senha**: `admin123`

---

Qualquer sugestão ou dúvida, fique à vontade para abrir uma issue ou contribuir com melhorias no código! 🚀

