# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Sistema de Gestión Veterinaria (Veterinary Management System) - An Angular 19 frontend application for managing veterinary clinic operations.

**Tech Stack:**

- Angular 19.2.18 with standalone components
- PrimeNG 19.1.4 (UI component library)
- @primeng/themes (Design token-based theming system)
- PrimeFlex 4.0.0 (CSS utility framework)
- PrimeIcons 7.0.0
- Node.js v20.19.0
- TypeScript 5.8.3 with strict mode enabled

## Development Commands

**Development server:**

```bash
npm start
```

Runs `ng serve` (opens browser manually, not auto-open).

**Build:**

```bash
npm run build
```

Production build with output hashing enabled.

**Watch mode:**

```bash
npm run watch
```

Development build with file watching.

**Testing:**

```bash
npm test              # Run all tests
ng test --include='**/path/to/spec.ts'  # Run single test file
```

**Linting and formatting:**

```bash
npm run lint          # ESLint check
npm run format        # Prettier format all files
```

## Architecture

### Application Structure

**Standalone components architecture:** The application uses Angular 19's standalone components (no NgModules). All components are self-contained with their own imports.

**Main application flow:**

1. [src/main.ts](src/main.ts) bootstraps [AppComponent](src/app/app.component.ts) with [appConfig](src/app/app.config.ts)
2. [app.config.ts](src/app/app.config.ts) provides global configuration including:
   - Router with routes from [app.routes.ts](src/app/app.routes.ts)
   - HTTP client with AuthInterceptor
   - PrimeNG MessageService for toast notifications
3. [AppComponent](src/app/app.component.ts) initializes token refresh on startup

### Authentication System

**JWT-based authentication with automatic token refresh:**

- [AuthService](src/app/services/auth.service.ts) manages authentication state using BehaviorSubject pattern
- Token stored in localStorage with keys defined in [Keys enum](src/app/constants/keys.enum.ts)
- [AuthInterceptor](src/app/interceptors/auth.interceptor.ts) automatically adds Bearer token to HTTP requests and handles 401 errors
- [authGuard](src/app/guards/auth.guard.ts) protects routes (functional guard, not class-based)
- Token refresh runs every 60 seconds via interval subscription when user is authenticated
- On login success, JWT is decoded to extract user info (usuario_id, usuario_nombre, expiration)

**Authentication flow:**

1. User logs in via [LoginComponent](src/app/components/auth/login/login.component.ts)
2. Token saved to localStorage, auth state updated via BehaviorSubject
3. AuthInterceptor adds token to subsequent requests
4. Automatic token refresh every minute
5. On 401 error, user is logged out and redirected to login

### Service Pattern

All data services follow a consistent pattern:

```typescript
export class ExampleService {
  private readonly API_URL: string;
  private readonly SERVICE = "resource-name";

  constructor(private readonly http: HttpClient) {
    this.API_URL = environment.apiUrl.toLowerCase();
  }

  // CRUD operations that return Observable<TypedResponse>
  // Error handling with catchError and throwError
}
```

**Key services:**

- [AuthService](src/app/services/auth.service.ts): JWT auth state, login/logout, token decode, role checks
- [AuthorizationService](src/app/services/authorization.service.ts): UI permission checks (`canCreateX()`, `canEditX()`, `canDeleteX()`, `canAccessX()`)
- [HttpErrorHandlerService](src/app/services/http-error-handler.service.ts): Centralized HTTP error extraction and toast display
- [ToastNotificationService](src/app/services/toast-notification.service.ts): Wrapper for PrimeNG MessageService with convenience methods
- [PersonaService](src/app/services/persona.service.ts): CRUD for personas with nested direcciones and contactos
- [RoundingService](src/app/services/rounding.service.ts): Calculates price rounding options (down/up) for venta totals; used in venta form
- Domain services follow the same pattern: `MascotaService`, `TurnoService`, `VacunaService`, `ClinicaService` (historial clínico), `VentaService`, `PagoService`, `ProductoService`, `ServicioService`, `StockMovimientoService`, `EmpleadoService`, `UsuarioService`, `BackupService`

### Data Models

**Interface organization:**

- [persona.interfaces.ts](src/app/models/persona.interfaces.ts): `Persona` model with nested `Direccion` and `Contacto` arrays
- [direccion.interfaces.ts](src/app/models/direccion.interfaces.ts): `Direccion` with `Ciudad`/`Provincia`/`Pais`
- [contacto.interfaces.ts](src/app/models/contacto.interfaces.ts): `Contacto` with `ContactoTipo`
- [generic-response.interface.ts](src/app/models/generic-response.interface.ts): `BaseResponse` with `code` and `error` fields; all API responses extend this and add a `data` field
- Other domain models follow the same single-file-per-domain pattern in `src/app/models/`

**Response pattern:**

```typescript
interface ExampleResponse extends BaseResponse {
  data: ExampleType | ExampleType[] | number | null;
}
```

Response code 0 indicates success, non-zero indicates error.

### Role-Based Authorization

The application uses two layers of authorization:

1. **Route guards:** `authGuard` (authentication) and `roleGuard` (role check) in [app.routes.ts](src/app/app.routes.ts)
2. **UI permission checks:** [AuthorizationService](src/app/services/authorization.service.ts) for showing/hiding buttons and actions

**User roles** (defined in [rol.enum.ts](src/app/constants/rol.enum.ts)):

| Enum                    | ID  | Description            |
| ----------------------- | --- | ---------------------- |
| `VETERINARIO`           | 1   | Clinical access        |
| `RECEPCIONISTA`         | 2   | Reception/appointments |
| `CAJERO`                | 3   | Sales/payments         |
| `GESTOR_INVENTARIO`     | 4   | Stock management       |
| `ADMINISTRADOR`         | 5   | Admin (users, reports) |
| `AUDITOR`               | 6   | Read-only audit        |
| `ADMINISTRADOR_SISTEMA` | 7   | Full access            |

**Route guard usage:**

```typescript
canActivate: [authGuard, roleGuard([Rol.VETERINARIO, Rol.ADMINISTRADOR_SISTEMA])];
```

**UI permission usage:**

```typescript
// Inject AuthorizationService and call the relevant canXxx() method
this.authorizationService.canCreatePersona(); // boolean
```

Unauthorized route access redirects to `/home` (not `/login`).

### Dialog Pattern

Forms and actions that open in dialogs use PrimeNG's `DialogService` with `DynamicDialogRef`. The component that opens the dialog declares `DialogService` as a local `providers` entry (not global), opens a form component, and subscribes to `ref.onClose` for result handling:

```typescript
// List component
providers: [DialogService, ConfirmationService]
// ...
const ref = this.refDialog.open(FormComponent, { header: 'Crear', width: '50vw', data: { ... } });
ref.onClose.subscribe(result => { if (result) this.loadData(); });
```

### Error Handling Pattern

[HttpErrorHandlerService](src/app/services/http-error-handler.service.ts) centralizes HTTP error handling. It extracts error messages from three backend formats (validation array, error string, HTTP status code) and shows toast notifications.

**Usage in services:**

```typescript
return this.http.post<Response>(url, body).pipe(this.httpErrorHandler.handleHttpError<Response>());
```

**Usage in components (for toast display):**

```typescript
this.httpErrorHandler.showErrorToast(error, "Error al guardar");
```

### Routing

Routes defined in [app.routes.ts](src/app/app.routes.ts):

- Default redirects to `/home`
- `/home` requires `authGuard` and redirects to role-appropriate dashboard
- Protected routes use `canActivate: [authGuard, roleGuard([...])]`
- Wildcard redirects to `/login`

### Environment Configuration

- [environment.ts](src/environments/environment.ts): Production config
- [environment.development.ts](src/environments/environment.development.ts): Development config
- File replacement configured in [angular.json](angular.json) for development builds
- API URL: `http://localhost:3000` (backend)

### Component Prefix

All components use `app` prefix (enforced by ESLint):

- Component selectors: kebab-case (`app-example-component`)
- Directive selectors: camelCase with `app` prefix

### Application Modules

The app is organized around these domain modules (each with `lista/` and `formulario/` subcomponents):

| Module path                        | Domain                  | Key entities                                                                          |
| ---------------------------------- | ----------------------- | ------------------------------------------------------------------------------------- |
| `components/persona`               | People                  | `Persona`, `Direccion`, `Contacto`                                                    |
| `components/mascota`               | Pets                    | `Mascota`, `Especie`                                                                  |
| `components/clinica`               | Clinical records        | `HistorialClinico`, `ExamenFisico`, `Diagnostico`                                     |
| `components/vacuna`                | Vaccines                | `Vacuna`                                                                              |
| `components/turno`                 | Appointments            | `Turno`                                                                               |
| `components/stock`                 | Inventory               | `Producto`, `Servicio`, `StockMovimiento`                                             |
| `components/venta`                 | Sales                   | `Venta`, `Pago`                                                                       |
| `components/empleado`              | Staff                   | `Empleado`                                                                            |
| `components/usuario`               | User accounts           | `Usuario`                                                                             |
| `components/reporte`               | Reports                 | Turnos, historiales, ganancias, productos, stock                                      |
| `components/dashboard-recepcion`   | Recepcionista dashboard | Quick access, turnos día, vacunas próximas                                            |
| `components/dashboard-veterinario` | Veterinario dashboard   | Turnos, búsqueda rápida, vacunas                                                      |
| `components/backup`                | Database backup/restore | Download/upload `.dump` file; manage scheduled server backups (ADMINISTRADOR_SISTEMA) |
| `components/ayuda`                 | Help module             | Interactive help with role-filtered tabs, GIF images, and navigation breadcrumbs. Route `/ayuda`, accessible to all authenticated users. |

### Shared Components

[MenubarComponent](src/app/shared/menu/menubar.component.ts) is the global navigation menu imported in AppComponent. It uses `AuthorizationService` to conditionally show menu items based on user role, and opens the change-password dialog via `DialogService`.

### Special Component Patterns

**Ficha completa (full pet profile):** [MascotaFichaCompleta](src/app/components/mascota/ficha-completa/mascota-ficha-completa.component.ts) is a tabbed dialog that aggregates a mascota's data (owner, clinical records, vaccines) and allows opening sub-forms without navigating away. Opened from multiple places (dashboard, mascota list) via `DialogService`.

**Venta detalle:** [VentaDetalle](src/app/components/venta/detalle/venta-detalle.component.ts) is a read-only dialog showing full sale info with nested pago actions (agregar pago, editar estado, anular). Opened from venta lista.

**Pagination constants:** Use `PAGINATION_LIMITS` from [pagination.constant.ts](src/app/constants/pagination.constant.ts) for API `limit` params — `PAGE` (100) for paginated lists, `CATALOG` (1000) for dropdown/select data, `CATALOG_LARGE` (10000) for large catalogs.

## Code Style

**TypeScript strict mode enabled:**

- `strict: true`
- `noImplicitOverride: true`
- `noPropertyAccessFromIndexSignature: true`
- `noImplicitReturns: true`
- `noFallthroughCasesInSwitch: true`

**Angular strict settings:**

- `strictInjectionParameters: true`
- `strictInputAccessModifiers: true`
- `strictTemplates: true`

**Readonly pattern:** Services and injected dependencies are marked `readonly` in constructors.

**ESLint:** Configured with Angular ESLint, TypeScript ESLint recommended and stylistic rules. Prettier integration for formatting.

## PrimeNG Integration

**PrimeNG 19 uses a new design token-based theming system:**

- Theme configured in [app.config.ts](src/app/app.config.ts) using `providePrimeNG()`
- Current theme preset: `Aura` (from `@primeng/themes/aura`)
- Available presets: Aura, Material, Lara, Nora
- PrimeIcons and PrimeFlex loaded globally in [angular.json](angular.json)

**Theme configuration:**

```typescript
providePrimeNG({
  theme: {
    preset: Aura,
  },
});
```

**Usage pattern:** Import PrimeNG components directly in standalone component imports array.

### Tooltip Configuration Standards

All tooltips in the application use PrimeNG's TooltipModule with auto-hide functionality via the `life` property to ensure tooltips automatically disappear after a specified time.

**Configuration by context:**

| Tooltip Type                                          | `life` Value | `showDelay` | Use Case                                                             |
| ----------------------------------------------------- | ------------ | ----------- | -------------------------------------------------------------------- |
| Action buttons (Create, Edit, Delete, Refresh, View)  | 3000ms (3s)  | None        | Quick actions need brief display                                     |
| Form inputs (text, select, date, number, textarea)    | 4000ms (4s)  | 500ms       | Instructional content needs longer display with delay before showing |
| Filter controls (dropdowns, multiselects, checkboxes) | 3000ms (3s)  | None        | Quick reference like action buttons                                  |
| Table cells (truncated content)                       | 5000ms (5s)  | None        | Users need time to read longer content                               |

**Implementation details:**

- **Native HTML elements** (`<input>`, `<textarea>`, `<span>`, `<button>`): Use `[life]="milliseconds"` directly
- **PrimeNG components** (`<p-button>`, `<p-select>`, `<p-datepicker>`, etc.): Use `[tooltipOptions]="{ life: milliseconds }"`

**Examples:**

Action buttons (PrimeNG p-button):

```html
<p-button pTooltip="Crear nueva persona" tooltipPosition="bottom" [tooltipOptions]="{ life: 3000 }" />
```

Form inputs (native HTML):

```html
<input pTooltip="Ingrese el apellido" tooltipPosition="top" [showDelay]="500" [life]="4000" />
```

Filter controls (PrimeNG p-select):

```html
<p-select pTooltip="Filtrar por estado activo/inactivo" tooltipPosition="bottom" [tooltipOptions]="{ life: 3000 }" />
```

Table cells with truncated text (native span):

```html
<span [pTooltip]="fullText" tooltipPosition="top" [life]="5000"> {{ truncatedText }} </span>
```

**Standard tooltip positions:**

- Form inputs and select controls: `tooltipPosition="top"`
- Action buttons and filters: `tooltipPosition="bottom"`
- Table cell content: `tooltipPosition="top"`
