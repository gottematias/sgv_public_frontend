# OpenAPI Modules

This directory contains modular OpenAPI specification files for the SGV backend API.

## Module Files

### Core Modules

- **openapi-auth.yaml** - Authentication endpoints (login, logout)
- **openapi-usuario.yaml** - User management endpoints and schemas
- **openapi-persona.yaml** - Person management (clients, contacts, addresses)

### Employee & Staff

- **openapi-empleado.yaml** - Employee management, positions, specialties, and attributes
  - Paths: `/empleado/*`, `/empleado/puesto/*`, `/empleado/especialidad/*`, `/empleado/atributo-tipo/*`
  - Schemas: Empleado, Puesto, Especialidad, AtributoTipo, EmpleadoPuesto, EmpleadoAtributo

### Pets & Animals

- **openapi-mascota.yaml** - Pet management, species, breeds, allergies, and chronic conditions
  - Paths: `/mascota/*`, `/especie/*`, `/alergia/*`
  - Schemas: Mascota, Especie, Raza, MascotaEstado, Alergia, CondicionCronica

### Clinical Records

- **openapi-clinica.yaml** - Clinical histories, diagnoses, and physical exams
  - Paths: `/historial-clinico/*`, `/diagnostico/*`
  - Schemas: HistorialClinico, Diagnostico, ExamenFisico, HistorialClinicoDiagnostico

### Other Modules

- **openapi-vacuna.yaml** - Vaccination records management
- **openapi-turno.yaml** - Appointment scheduling and management
- **openapi-inventario.yaml** - Inventory management

### Shared Components

- **openapi-shared.yaml** - Shared schemas, responses, parameters, and enums

## Reference Patterns

### Internal References

References within the same module use relative paths:

```yaml
$ref: "#/components/schemas/SchemaName"
```

### Cross-Module References

References to other modules use file paths:

```yaml
$ref: "openapi-usuario.yaml#/components/schemas/Usuario"
$ref: "openapi-persona.yaml#/components/schemas/Persona"
$ref: "openapi-mascota.yaml#/components/schemas/Mascota"
$ref: "openapi-empleado.yaml#/components/schemas/Empleado"
```

### Shared Component References

References to shared components use parent directory path:

```yaml
$ref: "../openapi-shared.yaml#/components/schemas/ResponseDTOId"
$ref: "../openapi-shared.yaml#/components/responses/BadRequest"
$ref: "../openapi-shared.yaml#/components/parameters/IdParam"
```

## Usage

These modular files can be:

1. Used independently for focused API documentation
2. Combined into a single specification using tools like `swagger-cli` or `redocly`
3. Referenced in API clients and code generators

## File Statistics

| Module                | Lines | Size |
| --------------------- | ----- | ---- |
| openapi-empleado.yaml | 480   | 13K  |
| openapi-mascota.yaml  | 720   | 20K  |
| openapi-clinica.yaml  | 434   | 12K  |
| openapi-persona.yaml  | ~565  | 14K  |
| openapi-usuario.yaml  | ~240  | 7.6K |
| openapi-auth.yaml     | ~95   | 3.0K |

## Module Dependencies

```
openapi-clinica.yaml
├── depends on: openapi-mascota.yaml
├── depends on: openapi-empleado.yaml
└── depends on: openapi-shared.yaml

openapi-mascota.yaml
├── depends on: openapi-persona.yaml
└── depends on: openapi-shared.yaml

openapi-empleado.yaml
├── depends on: openapi-usuario.yaml
└── depends on: openapi-shared.yaml

openapi-persona.yaml
└── depends on: openapi-shared.yaml

openapi-usuario.yaml
└── depends on: openapi-shared.yaml
```
