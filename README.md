# Sistema de Gestión Veterinaria - Frontend

Frontend Angular 19 para el Sistema de Gestión Veterinaria con Docker + Nginx.

## 🚀 Inicio Rápido

### Requisitos

- Docker Desktop instalado
- Backend corriendo en `http://localhost:3000`

### Configuración

1. **Copiar variables de entorno:**

   ```bash
   cp .env.example .env
   ```

2. **Levantar el frontend:**

   ```bash
   docker compose up -d
   ```

3. **Acceder a la aplicación:**
   - Frontend: [http://localhost](http://localhost)
   - API (proxy): [http://localhost/api](http://localhost/api)

### Verificar Estado

```bash
# Ver estado del contenedor
docker ps --filter "name=sgv_frontend"

# Ver logs
docker logs -f sgv_frontend

# Verificar health check
docker inspect sgv_frontend --format='{{.State.Health.Status}}'
```

## 📚 Documentación

- **[DOCKER.md](DOCKER.md)** - Documentación completa de Docker
- **[CLAUDE.md](CLAUDE.md)** - Guía del proyecto para Claude Code

## 🛠 Desarrollo

### Desarrollo Local (sin Docker)

```bash
npm install
npm start
```

La aplicación estará disponible en [http://localhost:4200](http://localhost:4200)

### Build de Producción

```bash
npm run build
```

El build se genera en `dist/sistema-gestion-veterinaria/`

## 🔧 Comandos Útiles

```bash
# Reiniciar frontend
docker compose restart

# Rebuild con cambios
docker compose up -d --build

# Detener
docker compose down

# Ver logs en tiempo real
docker compose logs -f
```

## 📦 Tech Stack

- Angular 19.2.18
- PrimeNG 19.1.4
- TypeScript 5.8.3
- Nginx (Alpine)
- Docker

## 📄 Licencia

Sistema de Gestión Veterinaria
