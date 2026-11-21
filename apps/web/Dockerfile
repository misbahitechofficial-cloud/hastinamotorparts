FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
COPY tailwind.config.ts ./
COPY postcss.config.js ./

RUN npm ci

COPY app ./app
COPY components ./components
COPY lib ./lib
COPY ../api/src/seed-data.ts ./../api/src/seed-data.ts

ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Runner Stage
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/app ./app
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["npm", "start"]
