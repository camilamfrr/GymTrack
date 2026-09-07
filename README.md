# GymTrack API

GymTrack es una API REST para la gestión de rutinas de entrenamiento y seguimiento del progreso del usuario. Está orientada a usuarios que desean registrar sus rutinas, ejercicios, entrenamientos realizados y métricas de rendimiento.

## Objetivo

Permitir que un usuario pueda:

- registrarse e iniciar sesión
- crear rutinas propias
- asociar ejercicios a una rutina
- registrar entrenamientos realizados
- consultar métricas de progreso
- mantener el acceso protegido por JWT y ownership por usuario

## Stack tecnológico

- NestJS 12
- TypeScript
- Prisma ORM
- PostgreSQL 16
- JWT + Passport
- bcrypt
- class-validator
- class-transformer
- @nestjs/config
- Helmet
- CORS
- @nestjs/throttler

## Requisitos

- Node.js 20+
- pnpm
- Docker
- PostgreSQL disponible localmente o via Docker Compose

## Instalación

1. Cloná el repositorio
2. Instalá dependencias:

```bash
pnpm install
```

3. Copiá el ejemplo de variables de entorno:

```bash
cp .env.example .env
```

4. Ajustá tus variables en `.env`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/gymtrack_db?schema=public"
JWT_SECRET="tu_secreto_jwt"
JWT_REFRESH_SECRET="tu_secreto_refresh"
PORT=3000
```

5. Levantá PostgreSQL con Docker:

```bash
docker compose up -d
```

6. Ejecutá las migraciones:

```bash
pnpm exec prisma migrate dev --name init
```

7. Iniciá la API:

```bash
pnpm run start:dev
```

## Estructura principal

```text
src/
├── app.module.ts
├── main.ts
├── auth/
├── users/
├── exercises/
├── routines/
├── workouts/
├── progress/
├── prisma/
├── common/
└── tests/
```

## Autenticación

La API usa JWT y un guard global para proteger rutas.

### Endpoints públicos

- POST `/api/v1/auth/register`
- POST `/api/v1/auth/login`
- POST `/api/v1/auth/refresh`

### Endpoints protegidos

- POST `/api/v1/auth/logout`
- GET `/api/v1/users/me`
- CRUD de rutinas
- CRUD de ejercicios
- CRUD de workouts
- GET `/api/v1/progress`

## Endpoints disponibles

### Auth

- POST `/api/v1/auth/register`
- POST `/api/v1/auth/login`
- POST `/api/v1/auth/refresh`
- POST `/api/v1/auth/logout`

### Users

- GET `/api/v1/users/me`

### Exercises

- GET `/api/v1/exercises`
- GET `/api/v1/exercises/:id`
- POST `/api/v1/exercises`
- PATCH `/api/v1/exercises/:id`
- DELETE `/api/v1/exercises/:id`

### Routines

- GET `/api/v1/routines`
- GET `/api/v1/routines/:id`
- POST `/api/v1/routines`
- PATCH `/api/v1/routines/:id`
- DELETE `/api/v1/routines/:id`
- POST `/api/v1/routines/:id/exercises`
- PATCH `/api/v1/routines/:id/exercises/:exerciseId`
- DELETE `/api/v1/routines/:id/exercises/:exerciseId`

### Workouts

- GET `/api/v1/workouts`
- GET `/api/v1/workouts/:id`
- POST `/api/v1/workouts`

### Progress

- GET `/api/v1/progress`

## Ejemplos de request

### Registro

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Perez",
    "email": "juan@example.com",
    "password": "Password123"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "Password123"
  }'
```

### Obtener perfil del usuario

```bash
curl -X GET http://localhost:3000/api/v1/users/me \
  -H "Authorization: Bearer <accessToken>"
```

### Crear rutina

```bash
curl -X POST http://localhost:3000/api/v1/routines \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <accessToken>" \
  -d '{
    "name": "Push Day",
    "description": "Rutina de fuerza para pecho y hombros"
  }'
```

### Crear workout

```bash
curl -X POST http://localhost:3000/api/v1/workouts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <accessToken>" \
  -d '{
    "routineId": "<routineId>",
    "date": "2026-09-07",
    "durationMinutes": 45,
    "exercises": [
      { "exerciseId": "<exerciseId>", "weight": 80, "repetitions": 8 },
      { "exerciseId": "<exerciseId>", "weight": 90, "repetitions": 6 }
    ]
  }'
```

## Respuestas esperadas

La API responde con JSON y utiliza códigos HTTP adecuados:

- 200 OK
- 201 Created
- 400 Bad Request
- 401 Unauthorized
- 403 Forbidden
- 404 Not Found
- 409 Conflict

Nunca se devuelven passwords ni passwordHash.

## Seguridad

La aplicación implementa:

- JWT guard global
- ownership verificado en los services
- validación global con `ValidationPipe`
- `whitelist` y `forbidNonWhitelisted`
- CORS explícito
- Helmet
- rate limiting con `@nestjs/throttler`
- secretos en variables de entorno
- `.env` y archivos sensibles ignorados por Git

## Repositorio y deploy

- Repositorio: https://github.com/tu-usuario/gymtrack-api
- Deploy: https://tu-deploy-url.example.com

> Reemplazá ambos links con los valores reales del proyecto cuando estén disponibles.

## Migraciones Prisma

```bash
pnpm exec prisma migrate dev --name init
pnpm exec prisma generate
```

## Tests

```bash
pnpm test -- --run
```

## Observación de diseño

La lógica de negocio se concentra en los services, mientras que los controllers se encargan de recibir la request y delegar la operación. La verificación de ownership se realiza con el `userId` obtenido desde el JWT, evitando que un usuario acceda a datos de otra persona.
