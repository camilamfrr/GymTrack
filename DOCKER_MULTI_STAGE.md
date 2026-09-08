CI build notes

- Ensure the lockfile is up to date locally before CI builds:

  pnpm install
  pnpm build

- Approve build scripts non-interactively in CI before installing:

  pnpm approve-builds --all
  pnpm install --frozen-lockfile

This ensures packages that run native build scripts (Prisma, bcrypt, esbuild) are allowed to execute during installation inside the clean CI/build environment.

If you prefer not to run `approve-builds` in CI, an alternative is to run `pnpm install --no-frozen-lockfile` inside the builder stage, or to commit `.pnpm/approved-builds.json` into the repo (less recommended).