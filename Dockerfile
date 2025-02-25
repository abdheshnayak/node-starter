FROM node:23.8.0-alpine3.21 as builder
RUN npm i -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./


RUN pnpm i

COPY . .

RUN pnpm lint
RUN pnpm build

FROM node:23.8.0-alpine3.21

WORKDIR /app
RUN npm i -g pnpm

COPY package.json pnpm-lock.yaml ./

RUN pnpm i --production

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/index.js"]
