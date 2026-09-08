# Deploy guide — GymTrack API

This document explains how to deploy GymTrack to a platform (Railway / Render) and how to build and run the production Docker image locally for verification.

## Environment variables

Required env vars:

- `DATABASE_URL` — e.g. `postgresql://user:pass@host:5432/gymtrack_db?schema=public`
- `JWT_SECRET` — secret for access tokens
- `JWT_REFRESH_SECRET` — secret for refresh tokens
- `PORT` — optional (defaults to 3000)

Never commit secrets to Git. Use the provider UI to set them.

## Build & start commands (platforms)

- Build command: `pnpm install && pnpm build && pnpm exec prisma generate`
- Start command (production): `node dist/main`
- Migration command (run once on deploy): `pnpm exec prisma migrate deploy`

Notes:
- On a managed host you should run `prisma migrate deploy` (not `migrate dev`).
- Ensure `NODE_ENV=production` for production runs.

## Railway

1. Create a new project and link your repository.
2. Add environment variables in Railway's dashboard (`DATABASE_URL`, `JWT_SECRET`, `JWT_REFRESH_SECRET`).
3. Set the build command to:

```bash
pnpm install
pnpm build
pnpm exec prisma generate
```

4. Set the start command to:

```bash
node dist/main
```

5. Add a deploy hook or trigger a deployment. After the container is built, run migrations (one-time):

```bash
pnpm exec prisma migrate deploy
```

Railway can also provision a Postgres database and provide a `DATABASE_URL` automatically.

## Render

1. Create a new web service and connect the repo.
2. Use the build command:

```bash
pnpm install
pnpm build
pnpm exec prisma generate
```

3. Use the start command:

```bash
node dist/main
```

4. Add env vars in the Render dashboard and run `pnpm exec prisma migrate deploy` once after the service is healthy.

## Docker (local verification)

Build the production image locally:

```bash
# from project root
docker build -t gymtrack:prod .
```

Run a container (example binding port 3000 and a networked Postgres):

```bash
docker run --env-file .env -p 3000:3000 --name gymtrack-prod --rm gymtrack:prod
```

If your Postgres is on Docker Compose (see `docker-compose.yml`), start it first:

```bash
docker compose up -d
```

Then run the container with the correct `DATABASE_URL` in your `.env` or pass it via `-e`.

## Notes and best practices

- Use `pnpm` (per project policy) — ensure the host supports `corepack` or install `pnpm`.
- In CI / Deploy platforms, prefer `pnpm install --frozen-lockfile` to ensure deterministic installs.
- Run `prisma generate` during build to include the Prisma Client in `node_modules`.
- For production, use `prisma migrate deploy` (applies already-created migrations).
- Do not use `prisma migrate dev` in production.

## Example CI script (pseudo)

```bash
# install
corepack enable
corepack prepare pnpm@latest --activate
pnpm install --frozen-lockfile
# build
pnpm build
pnpm exec prisma generate
# run migrations
pnpm exec prisma migrate deploy
# start (or containerize)
node dist/main
```

---

Replace repo links and provider-specific instructions as needed. If you want, I can try to build the Docker image here to verify it compiles (may require sudo on some systems).