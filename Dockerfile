# ============================================
# Stage 1: Build Stage
# ============================================
FROM node:20.19.0-alpine AS build

LABEL org.opencontainers.image.title="SGV Frontend"
LABEL org.opencontainers.image.version="1.0.0"
LABEL org.opencontainers.image.description="Sistema de Gestión Veterinaria - Angular Frontend"

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build

# ============================================
# Stage 2: Runtime Stage
# ============================================
FROM nginx:alpine

RUN apk add --no-cache gettext

COPY --from=build /app/dist/sistema-gestion-veterinaria/browser /usr/share/nginx/html

COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY nginx/security-headers.conf /etc/nginx/conf.d/security-headers.conf

COPY nginx/docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

RUN touch /usr/share/nginx/html/env-config.js

EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]
