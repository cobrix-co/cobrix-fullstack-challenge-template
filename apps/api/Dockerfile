FROM node:24-alpine

RUN npm install --global pnpm@10.33.0
WORKDIR /workspace

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json ./
COPY apps ./apps
COPY packages ./packages
RUN pnpm install --frozen-lockfile

EXPOSE 4000
CMD ["pnpm", "--filter", "@cobrix/api", "exec", "tsx", "src/main.ts"]
