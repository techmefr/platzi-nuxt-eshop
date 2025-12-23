FROM node:22-alpine

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

RUN apk add --no-cache git

EXPOSE 3000

CMD ["sh", "-c", "pnpm install && pnpm dev"]
