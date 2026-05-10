# syntax=docker/dockerfile:1

FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json ./
RUN npm install --no-audit --no-fund
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev --no-audit --no-fund \
    && npm cache clean --force
COPY src/server ./src/server
COPY --from=builder /app/dist ./dist
USER node
EXPOSE 3000
CMD ["node", "src/server/server.js"]
