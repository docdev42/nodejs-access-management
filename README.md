# Sistema de Gestão de Acessos

Este é um projeto de gestão de acessos que permite que usuários criem contas e façam login. Um usuário com permissões administrativas pode aprovar cadastros e designar permissões a outros usuários.

## 🚀 Tecnologias Utilizadas

- **Backend**: [NestJS](https://nestjs.com/) com [Prisma](https://www.prisma.io/) para conexão com o banco de dados
- **Frontend**: [Quasar Framework](https://quasar.dev/) + [Vue 3](https://vuejs.org/)
- **Banco de Dados**: [PostgreSQL](https://www.postgresql.org/)
- **Containerização**: [Docker](https://www.docker.com/) com um container para cada parte do projeto (backend, frontend, banco de dados)
- **Autenticação**: [JWT](https://jwt.io/) para autenticação e validação de permissões

## 📋 Funcionalidades

- Cadastro de novos usuários
- Autenticação e login de usuários
- Painel administrativo para aprovação de novos cadastros
- Gerenciamento de permissões de usuários
- Validação de permissões com JWT
- Dashboard administrativo com visualização gráfica de dados

## 🏗️ Arquitetura

O projeto foi estruturado em três containers Docker:

1. **Backend**: API RESTful construída com NestJS e Prisma
2. **Frontend**: Interface de usuário construída com Quasar e Vue 3
3. **Banco de Dados**: PostgreSQL para armazenamento persistente

A comunicação entre frontend e backend é feita através de chamadas à API, com validação JWT para autenticação e autorização.

## 📊 Modelo UML

![alt text](/assets/images/image-5.png)

## 🚦 Como Executar

1. Clone o repositório:
```bash
git clone git@github.com:docdev42/nodejs-access-management.git
```

2. Na raiz do projeto, execute:
```bash
docker compose up --build
```

3. Acesse o sistema no navegador:
```
http://localhost
```

4. Usuário inicial para acesso:
```
Usuário: admin@user.com
Senha: admin123
```

## 📸 Screenshots

### Tela Inicial
![alt text](/assets/images/image.png)![alt text](/assets/images/image-1.png)
*Tela de inicial ao logar ou registrar.*

### Painel Administrativo
![alt text](/assets/images/image-3.png)![alt text](/assets/images/image-2.png)
*Tela de dashboard administrativo mostrando gráficos de usuários e permissões.*

### Gerenciamento de Permissões
![alt text](/assets/images/image-4.png)

*Interface para configuração de permissões de usuários.*

## 🔜 Melhorias Futuras

- **Sistema de Mensageria**: Implementação de webhooks para validação em tempo real de modificações e revogações de permissões
- **Validação Frontend**: Aplicar validação de acesso diretamente no frontend para evitar acesso a telas com dados incompletos
- **Expansão do Frontend**: Adicionar mais módulos e funcionalidades à interface do usuário
- **Testes Automatizados**: Implementar testes unitários e de integração para garantir a qualidade do código

## 📝 Observações

O projeto foi desenvolvido com foco na arquitetura e implementação de autenticação, bem como na análise de dados com gráficos no painel administrativo. A interface frontend foi mantida simples devido às restrições de tempo de desenvolvimento.