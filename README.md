# eda-nestjs

Implementação de referência de **arquitetura orientada a eventos** com NestJS: API REST, mensageria com RabbitMQ, persistência em PostgreSQL e autenticação por JWT emitido pelo Keycloak.

Projeto de estudo, organizado em camadas (domínio, aplicação e infraestrutura) e com testes unitários, de integração e e2e.

## Stack

- **NestJS** e **TypeScript**
- **RabbitMQ** (`@golevelup/nestjs-rabbitmq`), com fila de mensagens mortas (DLX) e tratamento de erros dos consumidores
- **PostgreSQL** com **TypeORM** e migrations
- **Keycloak** (JWT com `passport-jwt`)
- **Swagger** na raiz da API
- **Jest** para testes
- **Docker** e manifestos de **Kubernetes** de exemplo

## Arquitetura

```
src/
  core/                  regras de negócio, sem dependência do framework
    contrato/            domínio de contratos (entidade, validadores, repositório)
    user-permission/     domínio de permissões de usuário
    shared/              blocos reutilizáveis (domain, application, infra)
  nest-modules/          adaptadores do NestJS
    auth-module/         autenticação e emissão de token
    contracts-module/    API de contratos
    users-permissions-model/
    event-module/        eventos de aplicação
    rabbitmq-module/     mensageria, DLX e filtro de erros dos consumidores
    database-module/     configuração do TypeORM
    config-module/       configuração validada por ambiente
  cmd/rabbitmq.ts        ponto de entrada dos consumidores
  migrations/            migrations do banco
```

Cada domínio em `core/` se divide em `domain`, `application` e `infra`. O NestJS fica na borda, em `nest-modules/`.

## Como rodar

Requer Node.js, Yarn, PostgreSQL e RabbitMQ.

```bash
yarn install
cp envs/.env.example envs/.env
# preencha envs/.env (banco, RabbitMQ e Keycloak)
yarn migration:run
yarn start:dev
```

A API sobe em `http://localhost:3000` (variável `API_PORT`), com a documentação Swagger na raiz.

Os consumidores do RabbitMQ rodam em um processo separado:

```bash
yarn rabbitmq:consumers:dev
```

Com Docker, o `docker-compose.yml` sobe a aplicação e o PostgreSQL e lê as variáveis de `envs/.env.prod`.

## Testes

```bash
yarn test         # unitários e de integração
yarn test:e2e     # ponta a ponta
```

## Configuração e segredos

O arquivo `envs/.env.example` lista as variáveis necessárias. As chaves e os segredos do Keycloak vêm do ambiente: nunca grave credenciais reais no repositório. Os manifestos em `.k8s/` usam valores de exemplo, e em um cluster real essas credenciais devem vir de Secrets do Kubernetes.
