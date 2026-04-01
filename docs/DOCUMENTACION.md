# Documentación Técnica - SGV Frontend

**Sistema de Gestión Veterinaria**
Frontend Angular 19 para gestión integral de clínicas veterinarias.

---

## Tabla de Contenidos

1. [Resumen del Proyecto](#resumen-del-proyecto)
2. [Stack Tecnológico](#stack-tecnológico)
3. [Comandos de Desarrollo](#comandos-de-desarrollo)
4. [Arquitectura General](#arquitectura-general)
5. [Autenticación y Autorización](#autenticación-y-autorización)
6. [Módulos de la Aplicación](#módulos-de-la-aplicación)
7. [Rutas de la Aplicación](#rutas-de-la-aplicación)
8. [Componentes](#componentes)
9. [Servicios](#servicios)
10. [Modelos de Datos](#modelos-de-datos)
11. [Patrones Arquitectónicos](#patrones-arquitectónicos)
12. [Integración con PrimeNG](#integración-con-primeng)
13. [Configuración de Entornos](#configuración-de-entornos)

---

## Resumen del Proyecto

El **SGV Frontend** es una Single Page Application (SPA) construida con Angular 19 para gestionar las operaciones de una clínica veterinaria. Provee interfaces para:

- Gestión de personas, mascotas y empleados
- Historiales clínicos y vacunas
- Turnos y citas
- Inventario de productos y servicios
- Ventas y pagos
- Reportes administrativos
- Backup y restauración de base de datos

El sistema implementa control de acceso basado en roles (RBAC), con 7 roles distintos que determinan qué módulos y acciones están disponibles para cada usuario.

---

## Stack Tecnológico

| Tecnología      | Versión | Descripción                                |
| --------------- | ------- | ------------------------------------------ |
| Angular         | 19.2.18 | Framework principal, standalone components |
| TypeScript      | 5.8.3   | Lenguaje con strict mode habilitado        |
| PrimeNG         | 19.1.4  | Librería de componentes UI                 |
| @primeng/themes | —       | Sistema de temas basado en design tokens   |
| PrimeFlex       | 4.0.0   | Framework CSS utilitario                   |
| PrimeIcons      | 7.0.0   | Iconografía                                |
| Node.js         | 20.19.0 | Runtime de desarrollo                      |

---

## Comandos de Desarrollo

```bash
# Servidor de desarrollo (no abre browser automáticamente)
npm start

# Build de producción (con output hashing)
npm run build

# Build en modo watch para desarrollo
npm run watch

# Ejecutar todos los tests
npm test

# Ejecutar un test específico
ng test --include='**/path/to/spec.ts'

# Lint (ESLint)
npm run lint

# Formateo de código (Prettier)
npm run format
```

---

## Arquitectura General

### Estructura de Directorios

```
sgv_frontend/
├── src/
│   ├── app/
│   │   ├── components/           # Componentes organizados por dominio
│   │   │   ├── auth/             # Login
│   │   │   ├── home/             # Página de inicio
│   │   │   ├── dashboard-recepcion/
│   │   │   ├── dashboard-veterinario/
│   │   │   ├── persona/
│   │   │   ├── mascota/
│   │   │   ├── clinica/
│   │   │   ├── vacuna/
│   │   │   ├── turno/
│   │   │   ├── stock/
│   │   │   │   ├── producto/
│   │   │   │   ├── servicio/
│   │   │   │   └── movimiento/
│   │   │   ├── venta/
│   │   │   ├── empleado/
│   │   │   ├── usuario/
│   │   │   ├── reporte/
│   │   │   └── backup/
│   │   ├── services/             # Servicios de datos y lógica de negocio
│   │   ├── models/               # Interfaces TypeScript
│   │   ├── guards/               # Guardias de ruta
│   │   ├── interceptors/         # Interceptores HTTP
│   │   ├── constants/            # Enums y constantes
│   │   ├── shared/               # Componentes compartidos (menubar)
│   │   ├── app.routes.ts
│   │   ├── app.config.ts
│   │   └── app.component.ts
│   ├── environments/
│   │   ├── environment.ts        # Producción
│   │   └── environment.development.ts
│   └── assets/
├── docs/
│   ├── database/                 # Esquema de base de datos
│   ├── openapi/                  # Especificaciones OpenAPI/Swagger
│   └── postman/                  # Colecciones Postman
├── angular.json
├── package.json
└── tsconfig.json
```

### Flujo Principal de la Aplicación

1. `src/main.ts` bootstrap `AppComponent` con `appConfig`
2. `app.config.ts` provee configuración global: Router, HttpClient con `AuthInterceptor`, PrimeNG `MessageService`, localización en español
3. `AppComponent` inicia la lógica de refresh automático de token al arrancar
4. `app.routes.ts` define todas las rutas con sus guardias
5. `MenubarComponent` (global) adapta el menú según el rol del usuario autenticado

---

## Autenticación y Autorización

### Autenticación JWT

El sistema usa JWT (JSON Web Token) con refresh automático cada 60 segundos.

**Flujo de autenticación:**

```
Usuario → LoginComponent → AuthService.login() → POST /auth/login
     → JWT recibido → decodificado con jwtDecode → guardado en localStorage
     → authEstado$ BehaviorSubject actualizado → AuthInterceptor activo
     → refresh automático cada 60s vía interval()
     → En 401: logout + redirect a /login
```

**Datos almacenados en localStorage** (keys del enum `Keys`):

| Key                 | Contenido                    |
| ------------------- | ---------------------------- |
| `token`             | JWT Bearer token             |
| `token_expiracion`  | Timestamp de expiración      |
| `usuario_id`        | ID del usuario               |
| `usuario_nombre`    | Nombre de usuario (username) |
| `persona_id`        | ID de la persona asociada    |
| `persona_nombres`   | Nombres de la persona        |
| `persona_apellidos` | Apellidos de la persona      |
| `rol_id`            | Array JSON de IDs de roles   |

**Métodos clave de `AuthService`:**

| Método                   | Descripción                       |
| ------------------------ | --------------------------------- |
| `login(credentials)`     | POST al backend, guarda token     |
| `logout()`               | Limpia token y estado             |
| `isLoggedIn()`           | Verifica expiración del token     |
| `getToken()`             | Devuelve el JWT actual            |
| `hasRole(roleId)`        | Verifica un rol específico        |
| `hasAnyRole(roleIds[])`  | Verifica si tiene al menos un rol |
| `hasAllRoles(roleIds[])` | Verifica si tiene todos los roles |
| `getRoles()`             | Devuelve array de IDs de roles    |

### Roles de Usuario

Definidos en `src/app/constants/rol.enum.ts`:

| Enum                    | ID  | Descripción                                      |
| ----------------------- | --- | ------------------------------------------------ |
| `VETERINARIO`           | 1   | Acceso clínico (consultas, vacunas, historiales) |
| `RECEPCIONISTA`         | 2   | Recepción y turnos                               |
| `CAJERO`                | 3   | Ventas y pagos                                   |
| `GESTOR_INVENTARIO`     | 4   | Stock, productos y servicios                     |
| `ADMINISTRADOR`         | 5   | Usuarios, empleados y reportes                   |
| `AUDITOR`               | 6   | Solo lectura para auditoría                      |
| `ADMINISTRADOR_SISTEMA` | 7   | Acceso total                                     |

### Sistema de Autorización en 2 Capas

**Capa 1: Guardias de Ruta** (`app.routes.ts`)

```typescript
canActivate: [authGuard, roleGuard([Rol.VETERINARIO, Rol.ADMINISTRADOR_SISTEMA])];
```

- `authGuard` — Redirige a `/login` si no está autenticado
- `roleGuard([...])` — Redirige a `/home` si el rol no está autorizado

**Capa 2: Permisos de UI** (`AuthorizationService`)

```typescript
// Inyectar AuthorizationService y llamar el método relevante
this.authorizationService.canCreatePersona(); // boolean
this.authorizationService.canEditTurno(); // boolean
this.authorizationService.canAccessBackup(); // boolean
```

Más de 50 métodos granulares (`canCreateX`, `canEditX`, `canDeleteX`, `canAccessX`) que controlan la visibilidad de botones y acciones en la UI.

---

## Módulos de la Aplicación

| Módulo                | Ruta                     | Roles                                             | Entidades Principales                             |
| --------------------- | ------------------------ | ------------------------------------------------- | ------------------------------------------------- |
| Personas              | `/persona/lista`         | VETERINARIO, RECEPCIONISTA, ADMINISTRADOR_SISTEMA | `Persona`, `Direccion`, `Contacto`                |
| Mascotas              | `/mascota/lista`         | VETERINARIO, RECEPCIONISTA, ADMINISTRADOR_SISTEMA | `Mascota`, `Raza`, `Especie`                      |
| Historiales Clínicos  | `/clinica/lista`         | VETERINARIO, ADMINISTRADOR_SISTEMA                | `HistorialClinico`, `ExamenFisico`, `Diagnostico` |
| Vacunas               | `/vacuna/lista`          | VETERINARIO, ADMINISTRADOR_SISTEMA                | `Vacuna`                                          |
| Turnos                | `/turno/lista`           | VETERINARIO, RECEPCIONISTA, ADMINISTRADOR_SISTEMA | `Turno`                                           |
| Productos             | `/stock/producto/lista`  | GESTOR_INVENTARIO, ADMINISTRADOR_SISTEMA          | `Producto`                                        |
| Servicios             | `/stock/servicio/lista`  | GESTOR_INVENTARIO, ADMINISTRADOR_SISTEMA          | `Servicio`                                        |
| Ventas                | `/venta/lista`           | CAJERO, ADMINISTRADOR, ADMINISTRADOR_SISTEMA      | `Venta`, `DetalleVenta`, `Pago`                   |
| Empleados             | `/empleado/lista`        | ADMINISTRADOR, ADMINISTRADOR_SISTEMA              | `Empleado`                                        |
| Usuarios              | `/usuario/lista`         | ADMINISTRADOR, ADMINISTRADOR_SISTEMA              | `Usuario`                                         |
| Reportes              | `/reporte/lista`         | ADMINISTRADOR, ADMINISTRADOR_SISTEMA              | Turnos, historiales, ganancias, productos, stock  |
| Backup                | `/backup`                | ADMINISTRADOR_SISTEMA                             | —                                                 |
| Dashboard Recepción   | `/dashboard-recepcion`   | RECEPCIONISTA, ADMINISTRADOR_SISTEMA              | Accesos rápidos, turnos del día                   |
| Dashboard Veterinario | `/dashboard-veterinario` | VETERINARIO, ADMINISTRADOR_SISTEMA                | Turnos, búsqueda rápida, vacunas                  |
| Ayuda                 | `/ayuda`                 | Todos los autenticados                            | —                                                 |

---

## Rutas de la Aplicación

Definidas en `src/app/app.routes.ts`:

| Ruta                     | Guardias                 | Roles Permitidos                                  |
| ------------------------ | ------------------------ | ------------------------------------------------- |
| `/`                      | —                        | Redirige a `/home`                                |
| `/login`                 | —                        | Pública                                           |
| `/home`                  | `authGuard`              | Todos (redirige al dashboard según rol)           |
| `/dashboard-recepcion`   | `authGuard`, `roleGuard` | RECEPCIONISTA, ADMINISTRADOR_SISTEMA              |
| `/dashboard-veterinario` | `authGuard`, `roleGuard` | VETERINARIO, ADMINISTRADOR_SISTEMA                |
| `/persona/lista`         | `authGuard`, `roleGuard` | VETERINARIO, RECEPCIONISTA, ADMINISTRADOR_SISTEMA |
| `/mascota/lista`         | `authGuard`, `roleGuard` | VETERINARIO, RECEPCIONISTA, ADMINISTRADOR_SISTEMA |
| `/clinica/lista`         | `authGuard`, `roleGuard` | VETERINARIO, ADMINISTRADOR_SISTEMA                |
| `/vacuna/lista`          | `authGuard`, `roleGuard` | VETERINARIO, ADMINISTRADOR_SISTEMA                |
| `/turno/lista`           | `authGuard`, `roleGuard` | VETERINARIO, RECEPCIONISTA, ADMINISTRADOR_SISTEMA |
| `/stock/producto/lista`  | `authGuard`, `roleGuard` | GESTOR_INVENTARIO, ADMINISTRADOR_SISTEMA          |
| `/stock/servicio/lista`  | `authGuard`, `roleGuard` | GESTOR_INVENTARIO, ADMINISTRADOR_SISTEMA          |
| `/venta/lista`           | `authGuard`, `roleGuard` | CAJERO, ADMINISTRADOR, ADMINISTRADOR_SISTEMA      |
| `/empleado/lista`        | `authGuard`, `roleGuard` | ADMINISTRADOR, ADMINISTRADOR_SISTEMA              |
| `/usuario/lista`         | `authGuard`, `roleGuard` | ADMINISTRADOR, ADMINISTRADOR_SISTEMA              |
| `/reporte/lista`         | `authGuard`, `roleGuard` | ADMINISTRADOR, ADMINISTRADOR_SISTEMA              |
| `/backup`                | `authGuard`, `roleGuard` | ADMINISTRADOR_SISTEMA                             |
| `/ayuda`                 | `authGuard`              | Todos los autenticados                            |
| `**` (wildcard)          | —                        | Redirige a `/login`                               |

El acceso no autorizado a una ruta protegida redirige a `/home`, no a `/login`.

---

## Componentes

### Autenticación

| Componente       | Archivo                                    | Descripción                    |
| ---------------- | ------------------------------------------ | ------------------------------ |
| `LoginComponent` | `components/auth/login/login.component.ts` | Formulario de inicio de sesión |

### Dashboards

| Componente                      | Archivo                             | Descripción                                                                    |
| ------------------------------- | ----------------------------------- | ------------------------------------------------------------------------------ |
| `HomeComponent`                 | `components/home/home.component.ts` | Redirige al dashboard apropiado según el rol                                   |
| `DashboardRecepcionComponent`   | `components/dashboard-recepcion/`   | Dashboard del recepcionista: accesos rápidos, turnos del día, vacunas próximas |
| `DashboardVeterinarioComponent` | `components/dashboard-veterinario/` | Dashboard del veterinario: turnos, búsqueda rápida de mascotas, vacunas        |

### Personas y Personal

| Componente               | Archivo                           | Descripción                                                          |
| ------------------------ | --------------------------------- | -------------------------------------------------------------------- |
| `PersonaListaComponent`  | `components/persona/lista/`       | Lista de personas con búsqueda, filtros y paginación                 |
| `PersonaFormComponent`   | `components/persona/formulario/`  | Formulario CRUD para personas (con direcciones y contactos anidados) |
| `EmpleadoListaComponent` | `components/empleado/lista/`      | Lista de empleados                                                   |
| `EmpleadoFormComponent`  | `components/empleado/formulario/` | Formulario CRUD para empleados                                       |
| `UsuarioListaComponent`  | `components/usuario/lista/`       | Lista de cuentas de usuario del sistema                              |
| `UsuarioFormComponent`   | `components/usuario/formulario/`  | Formulario CRUD para usuarios (con asignación de roles)              |

### Mascotas

| Componente              | Archivo                              | Descripción                                                                                                                                                               |
| ----------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `MascotaListaComponent` | `components/mascota/lista/`          | Lista de mascotas con búsqueda y filtros                                                                                                                                  |
| `MascotaFormComponent`  | `components/mascota/formulario/`     | Formulario CRUD para mascotas                                                                                                                                             |
| `MascotaFichaCompleta`  | `components/mascota/ficha-completa/` | **Patrón especial**: Dialog con tabs que agrega datos completos de la mascota (dueño, historial, vacunas). Abierto desde múltiples puntos de entrada vía `DialogService`. |

### Clínica y Vacunas

| Componente              | Archivo                          | Descripción                                                                            |
| ----------------------- | -------------------------------- | -------------------------------------------------------------------------------------- |
| `ClinicaListaComponent` | `components/clinica/lista/`      | Lista de historiales clínicos                                                          |
| `ClinicaFormComponent`  | `components/clinica/formulario/` | Formulario para registrar/editar historiales clínicos con examen físico y diagnósticos |
| `VacunaListaComponent`  | `components/vacuna/lista/`       | Lista de vacunas aplicadas                                                             |
| `VacunaFormComponent`   | `components/vacuna/formulario/`  | Formulario para registrar vacunas                                                      |

### Turnos

| Componente            | Archivo                        | Descripción                                                 |
| --------------------- | ------------------------------ | ----------------------------------------------------------- |
| `TurnoListaComponent` | `components/turno/lista/`      | Lista de turnos con filtros por estado, fecha y veterinario |
| `TurnoFormComponent`  | `components/turno/formulario/` | Formulario para crear/editar turnos                         |

### Inventario (Stock)

| Componente                 | Archivo                                   | Descripción                                                            |
| -------------------------- | ----------------------------------------- | ---------------------------------------------------------------------- |
| `ProductoListaComponent`   | `components/stock/producto/lista/`        | Lista de productos con stock y precios                                 |
| `ProductoFormComponent`    | `components/stock/producto/formulario/`   | Formulario CRUD para productos                                         |
| `ServicioListaComponent`   | `components/stock/servicio/lista/`        | Lista de servicios                                                     |
| `ServicioFormComponent`    | `components/stock/servicio/formulario/`   | Formulario CRUD para servicios                                         |
| `MovimientoListaComponent` | `components/stock/movimiento/lista/`      | Vista de solo lectura del registro de movimientos de stock             |
| `MovimientoFormComponent`  | `components/stock/movimiento/formulario/` | Formulario para registrar movimientos de stock (solo crear, inmutable) |

### Ventas y Pagos

| Componente                  | Archivo                                | Descripción                                                                                             |
| --------------------------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `VentaListaComponent`       | `components/venta/lista/`              | Lista de ventas con filtros por cliente, empleado, estado y fechas                                      |
| `VentaFormComponent`        | `components/venta/formulario/`         | Formulario para crear/editar ventas con ítems y pagos integrados                                        |
| `VentaDetalleComponent`     | `components/venta/detalle/`            | **Patrón especial**: Dialog de solo lectura con detalles completos de venta y acciones de pago anidadas |
| `AgregarPagoComponent`      | `components/venta/agregar-pago/`       | Dialog para agregar un pago a una venta                                                                 |
| `EditarEstadoPagoComponent` | `components/venta/editar-estado-pago/` | Dialog para editar el estado de un pago                                                                 |
| `AnularVentaComponent`      | `components/venta/anular-venta/`       | Dialog de confirmación para anular una venta                                                            |

### Reportes

| Componente              | Archivo                                   | Descripción                         |
| ----------------------- | ----------------------------------------- | ----------------------------------- |
| `ReporteListaComponent` | `components/reporte/lista/`               | Índice de reportes disponibles      |
| Reporte Turnos          | `components/reporte/reporte-turnos/`      | Reporte de turnos por período       |
| Reporte Historiales     | `components/reporte/reporte-historiales/` | Reporte de historiales clínicos     |
| Reporte Ganancias       | `components/reporte/reporte-ganancias/`   | Reporte de ingresos y ganancias     |
| Reporte Productos       | `components/reporte/reporte-productos/`   | Reporte de productos más vendidos   |
| Reporte Stock Bajo      | `components/reporte/reporte-stock-bajo/`  | Alertas de productos con bajo stock |

### Sistema

| Componente        | Archivo                                 | Descripción                                                                                                                                                                                                          |
| ----------------- | --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `BackupComponent` | `components/backup/backup.component.ts` | Backup manual de BD (descargar `.dump`) y restauración (subir `.dump`). Gestión de backups programados del servidor: listar, descargar, restaurar y eliminar. Solo ADMINISTRADOR_SISTEMA. Confirmación en operaciones destructivas. |
| `AyudaComponent`  | `components/ayuda/ayuda.component.ts`   | Módulo de ayuda interactivo con tabs por dominio. Muestra contenido (texto, GIFs animados) filtrado por rol del usuario. Cada sección incluye breadcrumbs de navegación para localizar la funcionalidad en el menú. Accesible para todos los usuarios autenticados. |

### Compartidos

| Componente                   | Archivo                            | Descripción                                                                                                                     |
| ---------------------------- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `MenubarComponent`           | `shared/menu/menubar.component.ts` | Menú de navegación global. Muestra/oculta ítems según rol vía `AuthorizationService`. Importado directamente en `AppComponent`. |
| `CambiarContrasenaComponent` | `shared/menu/cambiar-contrasena/`  | Dialog para cambiar contraseña, abierto desde el menú                                                                           |

---

## Servicios

### Servicios Core

| Servicio                   | Archivo                                  | Responsabilidad                                                                                |
| -------------------------- | ---------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `AuthService`              | `services/auth.service.ts`               | Estado de autenticación JWT, login/logout, decodificación de token, verificación de roles      |
| `AuthorizationService`     | `services/authorization.service.ts`      | Permisos de UI: más de 50 métodos `canCreateX()`, `canEditX()`, `canDeleteX()`, `canAccessX()` |
| `HttpErrorHandlerService`  | `services/http-error-handler.service.ts` | Manejo centralizado de errores HTTP, extrae mensajes de 3 formatos de respuesta del backend    |
| `ToastNotificationService` | `services/toast-notification.service.ts` | Wrapper de PrimeNG `MessageService` con métodos de conveniencia (success, error, warn, info)   |

### Servicios de Dominio (patrón CRUD)

| Servicio                 | Entidades                                    | Endpoints base         |
| ------------------------ | -------------------------------------------- | ---------------------- |
| `PersonaService`         | `Persona` (con `Direccion[]` y `Contacto[]`) | `/persona`             |
| `MascotaService`         | `Mascota`, `Raza`, `Especie`                 | `/mascota`, `/especie` |
| `EmpleadoService`        | `Empleado`                                   | `/empleado`            |
| `UsuarioService`         | `Usuario`                                    | `/usuario`             |
| `TurnoService`           | `Turno`                                      | `/turno`               |
| `ClinicaService`         | `HistorialClinico`, `ExamenFisico`           | `/historial-clinico`   |
| `VacunaService`          | `Vacuna`                                     | `/vacuna`              |
| `ProductoService`        | `Producto`                                   | `/producto`            |
| `ServicioService`        | `Servicio`                                   | `/servicio`            |
| `StockMovimientoService` | `StockMovimiento`                            | `/stock-movimiento`    |
| `VentaService`           | `Venta`, `DetalleVenta`                      | `/venta`               |
| `PagoService`            | `Pago`                                       | `/pago`                |
| `BackupService`          | — (`BackupInfo`: `{ nombre, fecha, tamano }`) | `/backup`, `/backup/programados` |

### Servicios Especializados

| Servicio             | Responsabilidad                                                                                                                                        |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `RoundingService`    | Calcula opciones de redondeo de precios (arriba/abajo) para totales de ventas. Incrementos dinámicos: 0.05, 0.10, 0.50, 1.00 según la porción decimal. |
| `ReporteService`     | Endpoints de reportes: turnos, historiales, ganancias, productos, stock bajo                                                                           |
| `DiagnosticoService` | Catálogo de códigos de diagnóstico                                                                                                                     |
| `AdjuntoService`     | Gestión de archivos adjuntos (imágenes, documentos)                                                                                                    |

### Patrón de Implementación de Servicios

```typescript
export class ExampleService {
  private readonly API_URL: string;
  private readonly SERVICE = 'resource-name';

  constructor(private readonly http: HttpClient) {
    this.API_URL = environment.apiUrl.toLowerCase();
  }

  list(q?: string, limit?: number, offset?: number): Observable<ExampleListResponse> {
    return this.http.get<ExampleListResponse>(`${this.API_URL}/${this.SERVICE}`, { params: { q, limit, offset } })
      .pipe(this.httpErrorHandler.handleHttpError<ExampleListResponse>());
  }

  get(id: number): Observable<ExampleResponse> { ... }
  create(request: ExampleRequest): Observable<ExampleResponse> { ... }
  update(id: number, request: ExampleRequest): Observable<ExampleResponse> { ... }
  delete(id: number): Observable<ExampleResponse> { ... }
}
```

---

## Modelos de Datos

### Patrón de Respuesta Base

Todas las respuestas de la API extienden `BaseResponse`:

```typescript
// generic-response.interface.ts
interface BaseResponse {
  code: number; // 0 = éxito, non-zero = error
  error: string | null;
}

interface ExampleResponse extends BaseResponse {
  data: ExampleType | ExampleType[] | number | null;
}
```

### Autenticación

**`auth.model.ts`**

```typescript
interface LoginRequest {
  usuario_nombre: string;
  contrasena: string;
}
interface LoginResponse extends BaseResponse {
  data: string;
} // JWT token
interface JwtPayload {
  usuario_id: number;
  usuario_nombre: string;
  persona_id: number;
  persona_nombre: string;
  persona_apellido: string;
  rol_id: number[];
}
```

### Personas y Geografía

| Archivo                   | Modelos                                    | Estructura                                |
| ------------------------- | ------------------------------------------ | ----------------------------------------- |
| `persona.interfaces.ts`   | `Persona`                                  | Con `Direccion[]` y `Contacto[]` anidados |
| `direccion.interfaces.ts` | `Direccion`, `Ciudad`, `Provincia`, `Pais` | Jerarquía geográfica                      |
| `contacto.interfaces.ts`  | `Contacto`, `ContactoTipo`                 | Tipos: teléfono, email, etc.              |
| `empleado.interfaces.ts`  | `Empleado`                                 | Extiende datos de persona                 |
| `usuario.interfaces.ts`   | `Usuario`                                  | Con array de roles asignados              |

### Mascotas y Clínica

| Archivo                           | Modelos                            | Notas                               |
| --------------------------------- | ---------------------------------- | ----------------------------------- |
| `mascota.interfaces.ts`           | `Mascota`, `Raza`, `Especie`       | Con alergias y condiciones crónicas |
| `historial-clinico.interfaces.ts` | `HistorialClinico`, `ExamenFisico` | Con diagnósticos y adjuntos         |
| `vacuna.interfaces.ts`            | `Vacuna`                           | Registro de vacunación              |
| `diagnostico.interfaces.ts`       | `Diagnostico`                      | Catálogo de códigos diagnósticos    |
| `alergia.interfaces.ts`           | `Alergia`                          | Alergias y condiciones crónicas     |
| `adjunto.interfaces.ts`           | `Adjunto`                          | Archivos adjuntos (imágenes, docs)  |
| `turno.interfaces.ts`             | `Turno`                            | Con seguimiento de estados          |

### Inventario y Ventas

| Archivo                 | Modelos                                   | Notas                                                 |
| ----------------------- | ----------------------------------------- | ----------------------------------------------------- |
| `stock.interfaces.ts`   | `Producto`, `Servicio`, `StockMovimiento` | Categorías, precios, niveles de stock                 |
| `venta.interfaces.ts`   | `Venta`, `DetalleVenta[]`, `Pago[]`       | Con DTOs para creación, actualización y anulación     |
| `reporte.interfaces.ts` | Múltiples tipos de reporte                | Turnos, historiales, ganancias, productos, stock bajo |

### Errores HTTP

**`http-error.interface.ts`** — 3 formatos de error del backend:

1. Array de validación: `{ data: [{ field, message }] }`
2. String de error: `{ error: "message" }`
3. Código HTTP: mapeado a mensaje amigable

---

## Patrones Arquitectónicos

### Standalone Components

Angular 19 sin NgModules. Cada componente es autocontenido con sus propios imports:

```typescript
@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, ...],
  template: `...`
})
export class ExampleComponent { }
```

### Patrón Dialog (Formularios Modales)

Los formularios se abren como dialogs usando `DialogService` de PrimeNG. El componente lista declara `DialogService` como proveedor local:

```typescript
// Lista component
@Component({
  providers: [DialogService, ConfirmationService],
})
export class ExampleListaComponent {
  openForm(item?: Example): void {
    const ref = this.dialogService.open(ExampleFormComponent, {
      header: item ? "Editar" : "Crear",
      width: "50vw",
      data: { item },
    });
    ref.onClose.subscribe((result) => {
      if (result) this.loadData();
    });
  }
}
```

### Patrón CRUD de Lista

Los componentes de lista siguen un patrón consistente:

- Búsqueda con debounce (300ms)
- Filtro por estado activo/inactivo
- Paginación con `PAGINATION_LIMITS`
- DataTable de PrimeNG con selección
- Crear/Editar vía `DialogService`
- Eliminar vía `ConfirmationService` (confirmación antes de borrar)
- Verificación de permisos (`AuthorizationService`) para visibilidad de botones

### Manejo Centralizado de Errores

`HttpErrorHandlerService` provee manejo uniforme en toda la app:

```typescript
// En servicios: pipe para capturar y transformar errores
return this.http.post<Response>(url, body).pipe(this.httpErrorHandler.handleHttpError<Response>());

// En componentes: para mostrar toast de error
this.httpErrorHandler.showErrorToast(error, "Error al guardar");
```

### Constantes de Paginación

`PAGINATION_LIMITS` en `src/app/constants/pagination.constant.ts`:

| Constante       | Valor | Uso                                         |
| --------------- | ----- | ------------------------------------------- |
| `PAGE`          | 100   | Listas paginadas con navegación de usuario  |
| `CATALOG`       | 1000  | Dropdowns y selects con datos de referencia |
| `CATALOG_LARGE` | 10000 | Catálogos completos extensos                |

### Movimientos de Stock Inmutables

Los `StockMovimiento` son de solo creación (sin editar ni eliminar), funcionando como log de auditoría inmutable de transacciones de inventario.

### BehaviorSubject para Estado Reactivo

```typescript
// AuthService mantiene estado reactivo
private authEstado$ = new BehaviorSubject<AuthEstado | null>(null);

// Componentes se suscriben para reaccionar a cambios
this.authService.authEstado$.subscribe(estado => { ... });
```

---

## Integración con PrimeNG

### Configuración del Tema

PrimeNG 19 usa un sistema de diseño basado en design tokens, configurado en `app.config.ts`:

```typescript
providePrimeNG({
  theme: { preset: Aura }, // Opciones: Aura, Material, Lara, Nora
});
```

### Estándares de Tooltips

| Tipo de Tooltip                               | `life` | `showDelay` | Uso                        |
| --------------------------------------------- | ------ | ----------- | -------------------------- |
| Botones de acción (Crear, Editar, Eliminar)   | 3000ms | —           | Referencia rápida          |
| Inputs de formulario (texto, select, fecha)   | 4000ms | 500ms       | Contenido instructivo      |
| Controles de filtro (dropdowns, multiselects) | 3000ms | —           | Referencia rápida          |
| Celdas de tabla (contenido truncado)          | 5000ms | —           | Lectura de contenido largo |

**Implementación por tipo de elemento:**

```html
<!-- PrimeNG p-button (usar tooltipOptions) -->
<p-button pTooltip="Crear" tooltipPosition="bottom" [tooltipOptions]="{ life: 3000 }" />

<!-- HTML nativo input (usar [life] directo) -->
<input pTooltip="Ingrese el valor" tooltipPosition="top" [showDelay]="500" [life]="4000" />

<!-- PrimeNG p-select (usar tooltipOptions) -->
<p-select pTooltip="Filtrar" tooltipPosition="bottom" [tooltipOptions]="{ life: 3000 }" />
```

**Posiciones estándar:**

- Inputs y selects de formulario: `tooltipPosition="top"`
- Botones de acción y filtros: `tooltipPosition="bottom"`
- Celdas de tabla: `tooltipPosition="top"`

### Localización

Configuración de idioma español en `app.config.ts` para PrimeNG (calendario, datepicker, etc.).

---

## Configuración de Entornos

### Desarrollo (`environment.development.ts`)

```typescript
export const environment = {
  apiUrl: "http://localhost:3000",
  production: false,
};
```

### Producción (`environment.ts`)

```typescript
export const environment = {
  apiUrl: window.env?.apiUrl ?? "/api", // Soporte para override en runtime
  production: window.env?.production ?? true,
};
```

El archivo `angular.json` configura el file replacement automático según el build target.

---

## Documentación Adicional

El directorio `docs/` contiene documentación complementaria:

| Directorio       | Contenido                                               |
| ---------------- | ------------------------------------------------------- |
| `docs/database/` | Esquema de la base de datos                             |
| `docs/openapi/`  | Especificaciones OpenAPI 3.0 de la API REST del backend |
| `docs/postman/`  | Colecciones Postman para pruebas de la API              |

---

_Documentación generada para SGV Frontend - Angular 19_
