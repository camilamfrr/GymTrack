# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Enable corepack and use pnpm
RUN corepack enable && corepack prepare pnpm@10.33.0 --activate

	# Allow CI to enable pnpm execution policy via build-arg
	ARG PNPM_ALLOW_EXECUTION=0
	ENV PNPM_ALLOW_EXECUTION=${PNPM_ALLOW_EXECUTION}

	# Install deps based on lockfile
	COPY package.json pnpm-lock.yaml ./
	# Approve build scripts non-interactively in CI builder, then install
	# RUN pnpm approve-builds --all || true
	RUN pnpm install --frozen-lockfile

# Copy sources and build
COPY . .
RUN pnpm exec prisma generate --schema=prisma/schema.prisma && pnpm build

# Runtime stage
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN corepack enable && corepack prepare pnpm@10.33.0 --activate

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
CMD ["sh", "-c", "pnpm exec prisma migrate deploy && node dist/main"]
