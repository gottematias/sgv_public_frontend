import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'primeng/tabs';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';

interface AyudaContenidoBloque {
  subtitulo: string;
  texto: string;
  imagen?: string;
  imagenAlt?: string;
  ruta?: string[];
}

interface AyudaSeccion {
  id: string;
  titulo: string;
  icono: string;
  descripcion: string;
  rolesConAcceso: string[];
  contenido: AyudaContenidoBloque[];
}

@Component({
  selector: 'app-ayuda',
  imports: [CommonModule, TabsModule, DividerModule, TagModule],
  templateUrl: './ayuda.component.html',
  styleUrls: ['./ayuda.component.css'],
})
export class AyudaComponent {
  activeTab = 0;

  readonly secciones: AyudaSeccion[] = [
    {
      id: 'dashboard',
      titulo: 'Dashboard',
      icono: 'pi pi-home',
      descripcion:
        'Paneles de inicio personalizados que muestran información relevante según el rol del usuario al ingresar al sistema.',
      rolesConAcceso: ['Veterinario', 'Recepcionista', 'Administrador Sistema'],
      contenido: [
        {
          subtitulo: 'Dashboard de Recepción',
          texto:
            'El dashboard de recepción está diseñado para que la recepcionista tenga una visión rápida del día. Muestra los turnos programados para hoy con sus estados (pendiente, confirmado, en curso, finalizado), accesos rápidos para buscar mascotas y personas, y vacunas próximas a vencer. Desde aquí podés navegar directamente a un turno o a la ficha completa de una mascota sin tener que ir al listado.',
          imagen: 'assets/ayuda/dashboard_recepcion.gif',
          imagenAlt: 'Panel de inicio de recepción',
          ruta: ['Dashboard', 'Recepción'],
        },
        {
          subtitulo: 'Dashboard Veterinario',
          texto:
            'El dashboard veterinario muestra los turnos asignados al veterinario para el día actual, ordenados por horario. Incluye una búsqueda rápida de mascotas para acceder a su ficha completa (historial clínico, vacunas, datos del propietario). También muestra las vacunas que próximamente van a vencer para que el veterinario pueda planificar los recordatorios.',
          imagen: 'assets/ayuda/dashboard_veterinario.gif',
          imagenAlt: 'Panel de inicio del veterinario',
          ruta: ['Dashboard', 'Veterinario'],
        },
      ],
    },
    {
      id: 'personas',
      titulo: 'Personas',
      icono: 'pi pi-user',
      descripcion:
        'Gestión de las personas registradas en el sistema: propietarios de mascotas, clientes y contactos.',
      rolesConAcceso: ['Veterinario', 'Recepcionista', 'Administrador Sistema'],
      contenido: [
        {
          subtitulo: 'Lista de Personas',
          texto:
            'La pantalla principal muestra todas las personas registradas en el sistema. Podés buscar por nombre, apellido o número de documento. La tabla muestra apellido, nombre, tipo y número de documento, y estado (activo/inactivo). Hacé clic en una fila para seleccionar a la persona y habilitar las opciones de editar o eliminar.',
          imagen: 'assets/ayuda/persona_lista.gif',
          imagenAlt: 'Lista de personas registradas',
          ruta: ['Gestión de Personas', 'Personas'],
        },
        {
          subtitulo: 'Crear una Persona',
          texto:
            'Hacé clic en el botón "Nueva Persona" para abrir el formulario. Completá los datos obligatorios: apellidos, nombres, tipo de documento y número. Opcionalmente podés agregar direcciones (con calle, número, ciudad, provincia y país) y datos de contacto (teléfono, email, etc.). Una persona puede tener múltiples direcciones y múltiples contactos. Guardá con el botón "Guardar".',
          imagen: 'assets/ayuda/persona_alta.gif',
          imagenAlt: 'Formulario de alta de persona',
          ruta: ['Gestión de Personas', 'Personas', 'Nueva Persona'],
        },
        {
          subtitulo: 'Editar o Desactivar una Persona',
          texto:
            'Seleccioná una persona de la lista y hacé clic en "Editar" para modificar sus datos. Podés actualizar cualquier campo, agregar o quitar direcciones y contactos. También podés activar o desactivar la persona usando el interruptor de estado. Una persona inactiva no aparece en las búsquedas de mascotas o turnos.',
          ruta: ['Gestión de Personas', 'Personas', 'Lista', 'Editar'],
        },
      ],
    },
    {
      id: 'usuarios',
      titulo: 'Usuarios',
      icono: 'pi pi-id-card',
      descripcion:
        'Gestión de las cuentas de acceso al sistema: creación, edición y asignación de roles.',
      rolesConAcceso: ['Administrador', 'Administrador Sistema'],
      contenido: [
        {
          subtitulo: 'Lista de Usuarios',
          texto:
            'La tabla muestra todos los usuarios del sistema con su nombre de usuario, nombre completo (vinculado a una persona), rol asignado y estado. Podés filtrar por rol o por estado activo/inactivo para encontrar rápidamente un usuario.',
          imagen: 'assets/ayuda/usuario_lista.gif',
          imagenAlt: 'Lista de usuarios del sistema',
          ruta: ['Gestión de Personas', 'Usuarios'],
        },
        {
          subtitulo: 'Crear un Usuario',
          texto:
            'Al crear un usuario se debe vincular con una persona ya registrada en el sistema (que aún no tenga usuario asignado). Luego se elige el nombre de usuario, la contraseña inicial y el rol que tendrá en el sistema. El rol determina a qué módulos puede acceder y qué acciones puede realizar. Una vez creado, el usuario puede cambiar su contraseña desde el menú de su perfil.',
          imagen: 'assets/ayuda/usuario_alta.gif',
          imagenAlt: 'Alta de usuario',
          ruta: ['Gestión de Personas', 'Usuarios', 'Nuevo Usuario'],
        },
        {
          subtitulo: 'Roles disponibles',
          texto:
            'Los roles del sistema son: Veterinario (acceso clínico: mascotas, historial, vacunas, turnos), Recepcionista (turnos, personas, mascotas), Cajero (ventas y pagos), Gestor de Inventario (productos y servicios), Administrador (usuarios, empleados, reportes, ventas), Auditor (acceso de solo lectura) y Administrador Sistema (acceso total). Cada usuario tiene un único rol.',
        },
      ],
    },
    {
      id: 'empleados',
      titulo: 'Empleados',
      icono: 'pi pi-briefcase',
      descripcion:
        'Registro del personal de la clínica veterinaria con sus datos laborales.',
      rolesConAcceso: ['Administrador', 'Administrador Sistema'],
      contenido: [
        {
          subtitulo: 'Lista de Empleados',
          texto:
            'Muestra el listado de empleados registrados, incluyendo nombre completo, cargo y estado. Los empleados son la base para asignar turnos y registrar actividades clínicas como vacunaciones. Filtrá por estado para ver solo los activos.',
          ruta: ['Gestión de Personas', 'Empleados'],
        },
        {
          subtitulo: 'Crear o Editar un Empleado',
          texto:
            'Al crear un empleado se lo vincula con una persona ya registrada en el sistema. Se completa el cargo y la fecha de ingreso. Un empleado puede ser luego asignado como veterinario en los turnos o como responsable de vacunas. Para editar, seleccioná el empleado de la lista y hacé clic en "Editar".',
          imagen: 'assets/ayuda/empleado_alta.gif',
          imagenAlt: 'Alta de empleado',
          ruta: ['Gestión de Personas', 'Empleados', 'Nuevo Empleado'],
        },
      ],
    },
    {
      id: 'mascotas',
      titulo: 'Mascotas',
      icono: 'pi pi-github',
      descripcion:
        'Registro y gestión de las mascotas de los clientes, incluyendo acceso a su ficha médica completa.',
      rolesConAcceso: ['Veterinario', 'Recepcionista', 'Administrador Sistema'],
      contenido: [
        {
          subtitulo: 'Lista de Mascotas',
          texto:
            'La tabla muestra todas las mascotas registradas con nombre, especie, raza, propietario y estado. Podés filtrar por especie, por propietario o por estado activo/inactivo. Seleccioná una mascota para acceder a las opciones de editar o ver su ficha completa.',
          imagen: 'assets/ayuda/mascota_lista.gif',
          imagenAlt: 'Lista de mascotas',
          ruta: ['Gestión Clínica', 'Mascotas'],
        },
        {
          subtitulo: 'Registrar una Mascota',
          texto:
            'Al crear una mascota se asocia con su propietario (una persona registrada en el sistema). Se completan los datos básicos: nombre, especie, raza, fecha de nacimiento, sexo, color y peso aproximado. Una vez registrada, la mascota puede tener historial clínico, vacunas y turnos asociados.',
          imagen: 'assets/ayuda/mascota_alta.gif',
          imagenAlt: 'Alta de mascota',
          ruta: ['Gestión Clínica', 'Mascotas', 'Nueva Mascota'],
        },
        {
          subtitulo: 'Ficha Completa de la Mascota',
          texto:
            'La ficha completa es una vista detallada que agrupa toda la información de la mascota en pestañas: datos generales, historial clínico, vacunas aplicadas y turnos. Se puede abrir desde la lista de mascotas haciendo clic en el ícono de ficha, o directamente desde el dashboard. Desde la ficha es posible agregar nuevos registros clínicos o vacunas sin salir de la vista.',
          ruta: ['Gestión Clínica', 'Mascotas', 'Lista', 'Ver Ficha'],
        },
      ],
    },
    {
      id: 'clinica',
      titulo: 'Historial Clínico',
      icono: 'pi pi-building',
      descripcion:
        'Registro de las consultas veterinarias: examen físico, diagnóstico y evolución de cada mascota.',
      rolesConAcceso: ['Veterinario', 'Administrador Sistema'],
      contenido: [
        {
          subtitulo: 'Lista de Historiales Clínicos',
          texto:
            'Muestra todos los registros clínicos del sistema. Podés filtrar por mascota, por fecha o por veterinario para encontrar rápidamente un historial específico. Cada fila representa una consulta e incluye la fecha, la mascota atendida, el veterinario y el motivo de consulta.',
          imagen: 'assets/ayuda/clinica_lista.gif',
          imagenAlt: 'Lista de historiales clínicos',
          ruta: ['Gestión Clínica', 'Clínicas'],
        },
        {
          subtitulo: 'Registrar una Consulta',
          texto:
            'Al crear un historial clínico se selecciona la mascota y se completa el examen físico (peso, temperatura, frecuencia cardíaca, frecuencia respiratoria) junto con el motivo de consulta, los síntomas observados y el diagnóstico. También se puede registrar el tratamiento indicado y las observaciones adicionales. Cada consulta queda guardada con fecha, hora y el veterinario que la realizó.',
          imagen: 'assets/ayuda/clinica_alta.gif',
          imagenAlt: 'Formulario de historial clínico',
          ruta: ['Gestión Clínica', 'Clínicas', 'Nueva Consulta'],
        },
        {
          subtitulo: 'Ver el Detalle de una Consulta',
          texto:
            'Seleccioná un historial de la lista para ver el detalle completo. Podés ver todos los datos del examen físico, el diagnóstico, el tratamiento y las observaciones. Los historiales no se eliminan para mantener la trazabilidad médica completa de cada mascota.',
          ruta: ['Gestión Clínica', 'Clínicas', 'Lista', 'Detalle'],
        },
      ],
    },
    {
      id: 'vacunas',
      titulo: 'Vacunas',
      icono: 'pi pi-shield',
      descripcion:
        'Registro de las vacunas aplicadas a las mascotas con seguimiento de vencimientos.',
      rolesConAcceso: ['Veterinario', 'Administrador Sistema'],
      contenido: [
        {
          subtitulo: 'Lista de Vacunas',
          texto:
            'Muestra el historial de vacunaciones del sistema. Podés filtrar por mascota, por empleado que aplicó la vacuna o por rango de fechas. Cada registro muestra el nombre de la vacuna, la mascota, la fecha de aplicación y la fecha de próximo refuerzo.',
          ruta: ['Gestión Clínica', 'Vacunas'],
        },
        {
          subtitulo: 'Registrar una Vacuna',
          texto:
            'Hacé clic en "Registrar Vacuna" para abrir el formulario. Seleccioná la mascota, ingresá el nombre de la vacuna, la dosis, la fecha de aplicación y la fecha estimada del próximo refuerzo. También se registra qué empleado aplicó la vacuna. Esta información aparece en la ficha completa de la mascota y en el dashboard para alertas de vacunas próximas.',
          imagen: 'assets/ayuda/vacuna_alta.gif',
          imagenAlt: 'Formulario de registro de vacuna',
          ruta: ['Gestión Clínica', 'Vacunas', 'Registrar Vacuna'],
        },
      ],
    },
    {
      id: 'turnos',
      titulo: 'Turnos',
      icono: 'pi pi-calendar',
      descripcion:
        'Gestión de los turnos o citas de las mascotas con el veterinario.',
      rolesConAcceso: ['Veterinario', 'Recepcionista', 'Administrador Sistema'],
      contenido: [
        {
          subtitulo: 'Lista de Turnos',
          texto:
            'Muestra todos los turnos del sistema. Podés filtrar por mascota, por veterinario, por estado del turno (pendiente, confirmado, en curso, finalizado, cancelado) o por rango de fechas. La tabla muestra la fecha y hora, la mascota, el propietario y el estado actual.',
          ruta: ['Gestión Clínica', 'Turnos'],
        },
        {
          subtitulo: 'Crear un Turno',
          texto:
            'Hacé clic en "Nuevo Turno" e ingresá la fecha y hora, la mascota, el veterinario asignado y el motivo de la consulta. Una vez creado, el turno queda en estado "Pendiente". El veterinario o la recepcionista pueden actualizar el estado a medida que avanza la atención.',
          imagen: 'assets/ayuda/turno_alta.gif',
          imagenAlt: 'Formulario de nuevo turno',
          ruta: ['Gestión Clínica', 'Turnos', 'Nuevo Turno'],
        },
        {
          subtitulo: 'Estados de un Turno',
          texto:
            'Los turnos pasan por los siguientes estados: Pendiente (recién creado), Confirmado (confirmado con el cliente), En Curso (la mascota ya está siendo atendida), Finalizado (atención completada) y Cancelado (turno cancelado). Actualizá el estado seleccionando el turno y usando la opción de editar.',
          ruta: ['Gestión Clínica', 'Turnos', 'Lista', 'Editar'],
        },
      ],
    },
    {
      id: 'stock',
      titulo: 'Stock',
      icono: 'pi pi-box',
      descripcion:
        'Gestión del inventario de productos y el catálogo de servicios de la clínica.',
      rolesConAcceso: ['Gestor de Inventario', 'Administrador Sistema'],
      contenido: [
        {
          subtitulo: 'Productos',
          texto:
            'La lista de productos muestra todos los artículos del inventario: medicamentos, insumos, alimentos, etc. Podés filtrar por nombre o por estado. Cada producto tiene un precio de costo, un precio de venta y un stock actual. El stock se actualiza automáticamente cuando se realizan ventas o movimientos de stock.',
          ruta: ['Stock', 'Productos'],
        },
        {
          subtitulo: 'Crear un Producto',
          texto:
            'Hacé clic en "Nuevo Producto" para abrir el formulario. Completá el nombre, descripción, precio de costo, precio de venta y el stock inicial. Una vez guardado, el producto queda disponible para incluir en ventas y movimientos de stock.',
          imagen: 'assets/ayuda/stock_producto_alta.gif',
          imagenAlt: 'Alta de producto',
          ruta: ['Stock', 'Productos', 'Nuevo Producto'],
        },
        {
          subtitulo: 'Servicios',
          texto:
            'Los servicios son prestaciones de la clínica que se pueden incluir en una venta (consulta, baño, cirugía, análisis, etc.). La lista muestra todos los servicios disponibles con su precio. Los servicios no tienen stock ya que son intangibles.',
          imagen: 'assets/ayuda/stock_servicio_alta.gif',
          imagenAlt: 'Alta de servicio',
          ruta: ['Stock', 'Servicios'],
        },
        {
          subtitulo: 'Movimientos de Stock',
          texto:
            'Los movimientos de stock registran las entradas y salidas de productos del inventario. Para registrar una entrada de stock (compra, reposición), hacé clic en "Nuevo Movimiento" en la lista de productos. Cada movimiento tiene un tipo (entrada o salida), la cantidad y el motivo. Los movimientos son permanentes y no se pueden eliminar para mantener la trazabilidad del inventario.',
          imagen: 'assets/ayuda/stock_producto_movimiento.gif',
          imagenAlt: 'Movimiento de stock',
          ruta: ['Stock', 'Productos', 'Movimientos'],
        },
      ],
    },
    {
      id: 'ventas',
      titulo: 'Ventas',
      icono: 'pi pi-shopping-cart',
      descripcion:
        'Registro de las ventas de productos y servicios realizadas en la clínica.',
      rolesConAcceso: ['Cajero', 'Administrador', 'Administrador Sistema'],
      contenido: [
        {
          subtitulo: 'Lista de Ventas',
          texto:
            'Muestra todas las ventas realizadas con su fecha, cliente (persona), total y estado (pendiente de pago, pagada parcialmente, pagada, anulada). Podés filtrar por fecha o por estado. Hacé clic en una venta para ver el detalle completo.',
          ruta: ['Ventas', 'Ventas'],
        },
        {
          subtitulo: 'Crear una Venta',
          texto:
            'Hacé clic en "Nueva Venta" para abrir el formulario. Seleccioná el cliente (persona registrada), luego agregá los ítems de la venta: podés combinar productos del inventario y servicios de la clínica. El sistema calcula automáticamente el subtotal y el total. Al guardar, la venta queda registrada con estado "Pendiente de pago".',
          imagen: 'assets/ayuda/venta_alta.gif',
          imagenAlt: 'Formulario de nueva venta',
          ruta: ['Ventas', 'Ventas', 'Nueva Venta'],
        },
        {
          subtitulo: 'Detalle de una Venta',
          texto:
            'Desde la lista, hacé clic en el ícono de detalle para ver la venta completa con todos sus ítems, precios, subtotales y el total. En el detalle también podés ver el historial de pagos realizados y acceder a las acciones de pago.',
          ruta: ['Ventas', 'Ventas', 'Lista', 'Detalle'],
        },
      ],
    },
    {
      id: 'pagos',
      titulo: 'Pagos',
      icono: 'pi pi-dollar',
      descripcion:
        'Registro de los pagos asociados a una venta. Los pagos se gestionan desde el detalle de la venta.',
      rolesConAcceso: ['Cajero', 'Administrador', 'Administrador Sistema'],
      contenido: [
        {
          subtitulo: 'Agregar un Pago',
          texto:
            'Para registrar un pago, abrí el detalle de la venta correspondiente y hacé clic en "Agregar Pago". Ingresá el monto, el método de pago (efectivo, tarjeta, transferencia, etc.) y la fecha. Una venta puede tener múltiples pagos parciales hasta completar el total.',
          imagen: 'assets/ayuda/venta_pagos.gif',
          imagenAlt: 'Registro de pago en una venta',
          ruta: ['Ventas', 'Ventas', 'Lista', 'Detalle', 'Agregar Pago'],
        },
        {
          subtitulo: 'Anular una Venta',
          texto:
            'Si necesitás anular una venta, abrí su detalle y usá la opción "Anular". Una venta anulada no puede recibir nuevos pagos. Esta acción es irreversible, por lo que el sistema solicita confirmación antes de proceder.',
          imagen: 'assets/ayuda/venta_anular.gif',
          imagenAlt: 'Anulación de venta',
          ruta: ['Ventas', 'Ventas', 'Lista', 'Detalle', 'Anular'],
        },
        {
          subtitulo: 'Estado de Pago',
          texto:
            'El estado de la venta se actualiza automáticamente según los pagos registrados: "Pendiente de pago" cuando no hay pagos, "Pagada Parcialmente" cuando los pagos no cubren el total y "Pagada" cuando los pagos cubren el total de la venta.',
        },
      ],
    },
    {
      id: 'reportes',
      titulo: 'Reportes',
      icono: 'pi pi-chart-bar',
      descripcion:
        'Informes y estadísticas del sistema para la toma de decisiones.',
      rolesConAcceso: ['Administrador', 'Administrador Sistema'],
      contenido: [
        {
          subtitulo: 'Reporte de Turnos',
          texto:
            'Muestra estadísticas de los turnos en un período seleccionado: cantidad por estado, por veterinario y por mes. Útil para analizar la carga de trabajo y la demanda del servicio.',
          imagen: 'assets/ayuda/reportes_turnos.gif',
          imagenAlt: 'Reporte de turnos',
          ruta: ['Reportes', 'Reportes'],
        },
        {
          subtitulo: 'Reporte de Historiales Clínicos',
          texto:
            'Listado de consultas realizadas con filtros por fecha, mascota o veterinario. Permite ver la actividad clínica de la clínica en un período determinado.',
          imagen: 'assets/ayuda/reportes_historial_clinico.gif',
          imagenAlt: 'Reporte de historiales clínicos',
          ruta: ['Reportes', 'Reportes'],
        },
        {
          subtitulo: 'Reporte de Productos Más Vendidos',
          texto:
            'Muestra los productos y servicios con mayor volumen de ventas, ordenados por cantidad vendida. Útil para decidir qué artículos reponer con mayor frecuencia.',
          imagen: 'assets/ayuda/reportes_productos_mas_vendidos.gif',
          imagenAlt: 'Reporte de productos más vendidos',
          ruta: ['Reportes', 'Reportes'],
        },
        {
          subtitulo: 'Reporte de Ganancias',
          texto:
            'Muestra el total de ventas y pagos recibidos agrupados por período (día, mes). Incluye el desglose por método de pago. Útil para el seguimiento financiero de la clínica.',
          imagen: 'assets/ayuda/reportes_ganancia.gif',
          imagenAlt: 'Reporte de ganancias',
          ruta: ['Reportes', 'Reportes'],
        },
        {
          subtitulo: 'Reporte de Stock Bajo',
          texto:
            'Lista los productos cuyo stock actual está por debajo del mínimo configurado. Permite identificar rápidamente qué artículos necesitan reposición urgente.',
          imagen: 'assets/ayuda/reportes_stock_bajo.gif',
          imagenAlt: 'Reporte de stock bajo',
          ruta: ['Reportes', 'Reportes'],
        },
      ],
    },
    {
      id: 'backup',
      titulo: 'Backup',
      icono: 'pi pi-download',
      descripcion:
        'Herramientas para respaldar y restaurar la base de datos del sistema. Solo disponible para administradores del sistema.',
      rolesConAcceso: ['Administrador Sistema'],
      contenido: [
        {
          subtitulo: 'Descargar Backup',
          texto:
            'Hacé clic en "Descargar Backup" para generar y descargar una copia de seguridad completa de la base de datos en formato .dump. El archivo se descarga automáticamente con la fecha y hora en el nombre. Se recomienda realizar backups periódicos y guardarlos en un lugar seguro fuera del servidor.',
          imagen: 'assets/ayuda/backup_crear_manual.gif',
          imagenAlt: 'Descarga manual de backup',
          ruta: ['Sistema', 'Backup'],
        },
        {
          subtitulo: 'Restaurar Base de Datos',
          texto:
            'ATENCIÓN: Restaurar la base de datos reemplaza TODOS los datos actuales con los del archivo de backup. Esta acción es irreversible. Para restaurar, hacé clic en "Restaurar Base de Datos", seleccioná el archivo .dump y confirmá la operación cuando el sistema lo solicite. Usá esta función solo en casos de emergencia o cuando lo indique el soporte técnico.',
          imagen: 'assets/ayuda/backup_restaurar_manual.gif',
          imagenAlt: 'Restauración manual de base de datos',
          ruta: ['Sistema', 'Backup'],
        },
        {
          subtitulo: 'Backups Programados',
          texto:
            'Esta sección muestra la lista de backups generados automáticamente por el servidor. La tabla incluye el nombre del archivo, la fecha de creación y el tamaño. Por cada backup disponés de tres acciones: Descargar (descarga el archivo .dump al equipo), Restaurar (reemplaza la base de datos actual con ese backup — acción irreversible que requiere confirmación) y Eliminar (borra el archivo del servidor — también requiere confirmación). Usá el botón "Refrescar" para actualizar la lista si acabás de generar un backup programado.',
          imagen: 'assets/ayuda/backup_programados.gif',
          imagenAlt: 'Gestión de backups programados',
          ruta: ['Sistema', 'Backup'],
        },
      ],
    },
  ];
}
