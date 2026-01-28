
FROM node:20-alpine AS base
WORKDIR /app

FROM base AS deps

COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./

RUN \
  if [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable && pnpm install --frozen-lockfile; \
  elif [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
  else npm install; \
  fi


FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV DATABASE_URL=postgresql://postgres:egolam@maresans-db-olf0ie:5432/postgres

ENV BETTER_AUTH_SECRET=OZFdOPPzCkS6wDhGyO9tsRFo1pp80ORk
ENV BETTER_AUTH_URL=http://localhost:3000

ENV GOOGLE_CLIENT_ID=426620127768-foi43ql4dj6325mm7tf5v7kum0j0de3r.apps.googleusercontent.com
ENV GOOGLE_CLIENT_SECRET=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

ENV RESEND_API_KEY=re_TL4XKmP1_3Y4mqqrdAxsDGTXAXt5gwuyi
ENV RESEND_EMAIL=eyavuz1273@hotmail.com

RUN npm run build


FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1


COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=deps /app/node_modules ./node_modules

EXPOSE 3000

CMD ["npm", "run", "start"]
