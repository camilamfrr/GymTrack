<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# GymTrack API

API REST para gestión de rutinas y seguimiento del progreso de entrenamiento, desarrollada con NestJS + Prisma + PostgreSQL.

## Stack

- NestJS 12
- TypeScript
- Prisma
- PostgreSQL
- JWT + Passport
- bcrypt
- class-validator + class-transformer
- Helmet
- CORS
- @nestjs/throttler
- @nestjs/config

## Requisitos

- Node.js 20+
- pnpm
- PostgreSQL corriendo localmente

## Configuración

1. Copia `.env.example` a `.env`.
2. Ajusta `DATABASE_URL`, `JWT_SECRET` y `JWT_REFRESH_SECRET`.
3. Crea la base de datos PostgreSQL.
4. Ejecuta:

```bash
pnpm install
pnpm exec prisma migrate dev --name init
pnpm run start:dev
```

## Endpoints principales

### Auth

- POST `/api/v1/auth/register`
- POST `/api/v1/auth/login`
- POST `/api/v1/auth/refresh`
- POST `/api/v1/auth/logout`

### Users

- GET `/api/v1/users/me`

### Routines

- GET `/api/v1/routines`
- GET `/api/v1/routines/:id`
- POST `/api/v1/routines`
- PATCH `/api/v1/routines/:id`
- DELETE `/api/v1/routines/:id`
- POST `/api/v1/routines/:id/exercises`
- PATCH `/api/v1/routines/:id/exercises/:exerciseId`
- DELETE `/api/v1/routines/:id/exercises/:exerciseId`

### Exercises

- GET `/api/v1/exercises`
- GET `/api/v1/exercises/:id`
- POST `/api/v1/exercises`
- PATCH `/api/v1/exercises/:id`
- DELETE `/api/v1/exercises/:id`

### Workouts

- GET `/api/v1/workouts`
- GET `/api/v1/workouts/:id`
- POST `/api/v1/workouts`

### Progress

- GET `/api/v1/progress`

## Seguridad

- JWT con guard global
- validación global con `ValidationPipe`
- rate limiting con `@nestjs/throttler`
- CORS explícito
- Helmet
- contraseñas hasheadas con bcrypt
- refresh token almacenado hasheado en la base de datos

## Nota

La API sigue la idea de ownership por usuario: cada recurso asociado a un usuario solo puede ser consultado o modificado por su propietario, comprobado en el service usando el userId del JWT.
