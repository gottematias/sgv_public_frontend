# DOCKER.md

Este documento proporciona instrucciones para construir la imagen Docker del SGV Frontend, gestionar sus variables de entorno y migrarla a otros servidores.

## Tabla de Contenidos

1. [Variables de Entorno](#variables-de-entorno)
2. [Construir Imagen Docker](#construir-imagen-docker)
3. [Exportar e Importar Imágenes](#exportar-e-importar-imágenes)

---

## Variables de Entorno

### Variables en Tiempo de Construcción

El [Dockerfile](Dockerfile) no requiere variables específicas durante la construcción, ya que utiliza la configuración por defecto de Angular y Nginx.

### Variables en Tiempo de Ejecución

Estas variables deben ser inyectadas en el contenedor al momento de ejecutarse en el servidor de destino. Son procesadas por el script `docker-entrypoint.sh` para generar la configuración en tiempo de ejecución (`env-config.js`).

#### Application Configuration

- `API_URL` - URL base del backend API (default: `/api`)
- `PRODUCTION` - Define si la aplicación corre en modo producción (default: `true`)

---

## Construir Imagen Docker

Para generar una nueva versión de la imagen del frontend, sigue estos pasos:

### 1. Actualizar Versión (Opcional)

Si deseas versionar la imagen, actualiza primero el `package.json`:

```json
{
  "version": "1.0.1"
}
```

### 2. Ejecutar Build

Construye la imagen usando `docker build`. Se recomienda usar etiquetas (tags) para la versión y `latest`.

```bash
docker build --no-cache -t sgv_frontend:1.0.1 -t sgv_frontend:latest .
```

Verifica que la imagen se haya creado correctamente:

```bash
docker images sgv_frontend
```

---

## Exportar e Importar Imágenes

Estos pasos permiten mover la imagen compilada a otro servidor sin necesidad del código fuente.

### 1. Exportar Imagen (En máquina desarrollo)

**Método Estándar (Sin compresión):**

```bash
docker save -o sgv_frontend_v1.0.1.tar sgv_frontend:1.0.1
```

**Método Alternativo (Comprimido con gzip):**

Reduce el tamaño del archivo significativamente.

```bash
docker save sgv_frontend:1.0.1 | gzip > sgv_frontend_v1.0.1.tar.gz
```

Transfiere el archivo generado (`.tar` o `.tar.gz`) al servidor de destino (usando SCP, FTP, USB, etc.).

### 2. Importar Imagen (En servidor destino)

Una vez el archivo esté en el servidor, cárgalo en Docker.

**Para archivo .tar:**

```bash
docker load -i sgv_frontend_v1.0.1.tar
```

**Para archivo .tar.gz:**

```bash
docker load -i sgv_frontend_v1.0.1.tar.gz
```

### 3. Verificar Importación

Comprueba que la imagen está disponible en el servidor:

```bash
docker images sgv_frontend
```

Ahora la imagen está lista para ser usada en el servidor.
