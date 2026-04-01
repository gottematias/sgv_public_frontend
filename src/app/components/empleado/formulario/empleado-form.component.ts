import { Component, OnInit } from '@angular/core';
import { EmpleadoService } from '../../../services/empleado.service';
import { UsuarioService } from '../../../services/usuario.service';
import { ToastNotificationService } from '../../../services/toast-notification.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { HttpErrorHandlerService } from '../../../services/http-error-handler.service';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TooltipModule } from 'primeng/tooltip';
import { CheckboxModule } from 'primeng/checkbox';
import { DatePickerModule } from 'primeng/datepicker';
import { Usuario } from '../../../models/usuario.interfaces';
import { Persona } from '../../../models/persona.interfaces';
import {
  CreateEmpleadoRequest,
  UpdateEmpleadoRequest,
  Especialidad,
  Puesto,
  AtributoTipo,
  EmpleadoPuestoDto,
  CreateEmpleadoAtributoDto,
} from '../../../models/empleado.interfaces';
import { MultiSelectModule } from 'primeng/multiselect';
import { DividerModule } from 'primeng/divider';

interface PuestoAsignado {
  puesto: Puesto | null;
  fechaInicio: Date | null;
  fechaFin: Date | null;
}

interface AtributoAsignado {
  atributoTipo: AtributoTipo | null;
  valor: string;
}

@Component({
  selector: 'app-empleado-form',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    SelectModule,
    TooltipModule,
    CheckboxModule,
    MultiSelectModule,
    DatePickerModule,
    DividerModule,
  ],
  providers: [],
  templateUrl: './empleado-form.component.html',
  styleUrls: ['./empleado-form.component.css'],
})
export class EmpleadoFormComponent implements OnInit {
  empleadoId: number | null;
  formGroupEmpleado: FormGroup;
  usuarios: Usuario[];
  especialidades: Especialidad[];
  puestos: Puesto[];
  atributoTipos: AtributoTipo[];
  modoEdicion: boolean;

  puestosAsignados: PuestoAsignado[] = [];
  atributosAsignados: AtributoAsignado[] = [];
  formEnviado = false;
  puedeToggleActivo = false;

  constructor(
    private readonly refDialog: DynamicDialogRef,
    private readonly config: DynamicDialogConfig,
    private readonly empleadoService: EmpleadoService,
    private readonly usuarioService: UsuarioService,
    private readonly toastNotificationService: ToastNotificationService,
    private readonly authorizationService: AuthorizationService,
    private readonly httpErrorHandler: HttpErrorHandlerService,
  ) {
    this.empleadoId = null;
    this.usuarios = [];
    this.especialidades = [];
    this.puestos = [];
    this.atributoTipos = [];
    this.modoEdicion = false;

    this.formGroupEmpleado = new FormGroup({
      usuario: new FormControl<Usuario | null>(null, [Validators.required]),
      fechaIngreso: new FormControl<Date | null>(null, [Validators.required]),
      fechaEgreso: new FormControl<Date | null>(null),
      activo: new FormControl<boolean>(true),
      especialidades: new FormControl<number[]>([]),
    });
  }

  ngOnInit(): void {
    if (this.config.data) {
      this.empleadoId = this.config.data.empleadoId;
      this.modoEdicion = this.empleadoId !== null;
    }

    this.puedeToggleActivo = this.authorizationService.canToggleActivo();

    if (!this.modoEdicion) {
      this.formGroupEmpleado.get('fechaEgreso')?.disable();
      this.formGroupEmpleado.get('activo')?.disable();
    }

    this.cargarDatosIniciales();
  }

  private cargarDatosIniciales(): void {
    this.empleadoService.listEspecialidades().subscribe({
      next: (resEspecialidades) => {
        this.especialidades = resEspecialidades.data;
      },
      error: (error) => {
        console.error('Error al cargar especialidades:', error);
        this.toastNotificationService.showError(
          'Error al cargar especialidades',
        );
      },
    });

    this.empleadoService.listPuestos().subscribe({
      next: (resPuestos) => {
        this.puestos = resPuestos.data;
      },
      error: (error) => {
        console.error('Error al cargar puestos:', error);
        this.toastNotificationService.showError('Error al cargar puestos');
      },
    });

    this.empleadoService.listAtributoTipos().subscribe({
      next: (resAtributoTipos) => {
        this.atributoTipos = resAtributoTipos.data;
      },
      error: (error) => {
        console.error('Error al cargar tipos de atributo:', error);
        this.toastNotificationService.showError(
          'Error al cargar tipos de atributo',
        );
      },
    });

    this.usuarioService.list().subscribe({
      next: (resUsuarios) => {
        this.usuarios = resUsuarios.data;

        if (this.empleadoId) {
          this.cargarEmpleadoExistente();
        }
      },
      error: (error) => {
        console.error('Error al cargar usuarios:', error);
        this.toastNotificationService.showError('Error al cargar usuarios');
      },
    });
  }

  private cargarEmpleadoExistente(): void {
    if (!this.empleadoId) return;

    this.formGroupEmpleado.get('usuario')?.disable();

    this.empleadoService.getEmpleado(this.empleadoId).subscribe({
      next: (resEmpleado) => {
        const empleado = resEmpleado.data;
        const usuarioEncontrado = this.usuarios.find(
          (u) => u.id === empleado.usuario?.id,
        );

        this.formGroupEmpleado.patchValue({
          usuario: usuarioEncontrado || null,
          fechaIngreso: empleado.fechaIngreso
            ? new Date(empleado.fechaIngreso)
            : null,
          fechaEgreso: empleado.fechaEgreso
            ? new Date(empleado.fechaEgreso)
            : null,
          activo: empleado.activo,
          especialidades:
            empleado.empleadosEspecialidades?.map((ee) => ee.idEspecialidad) ??
            [],
        });

        this.puestosAsignados = [];
        if (empleado.empleadosPuestos && empleado.empleadosPuestos.length > 0) {
          empleado.empleadosPuestos.forEach((ep) => {
            const puestoEncontrado = this.puestos.find(
              (p) => p.id === ep.idPuesto,
            );
            this.puestosAsignados.push({
              puesto: puestoEncontrado || null,
              fechaInicio: ep.fechaInicio ? new Date(ep.fechaInicio) : null,
              fechaFin: ep.fechaFin ? new Date(ep.fechaFin) : null,
            });
          });
        }

        this.atributosAsignados = [];
        if (
          empleado.empleadosAtributos &&
          empleado.empleadosAtributos.length > 0
        ) {
          empleado.empleadosAtributos.forEach((ea) => {
            const atributoTipoEncontrado = this.atributoTipos.find(
              (at) => at.id === ea.idAtributoTipo,
            );
            this.atributosAsignados.push({
              atributoTipo: atributoTipoEncontrado || null,
              valor: ea.valor,
            });
          });
        }
      },
      error: (error) => {
        console.error(error);
        this.toastNotificationService.showError('Error al cargar el empleado');
      },
    });
  }

  agregarPuesto(): void {
    this.puestosAsignados.push({
      puesto: null,
      fechaInicio: null,
      fechaFin: null,
    });
  }

  eliminarPuesto(index: number): void {
    this.puestosAsignados.splice(index, 1);
  }

  agregarAtributo(): void {
    this.atributosAsignados.push({
      atributoTipo: null,
      valor: '',
    });
  }

  eliminarAtributo(index: number): void {
    this.atributosAsignados.splice(index, 1);
  }

  cerrar(): void {
    this.refDialog.close();
  }

  guardar(): void {
    this.formEnviado = true;

    // Check authorization before submitting
    if (this.modoEdicion && !this.authorizationService.canEditEmpleado()) {
      this.toastNotificationService.showError(
        'No autorizado',
        'No tiene permisos para editar empleados',
      );
      this.cerrar();
      return;
    }

    if (!this.modoEdicion && !this.authorizationService.canCreateEmpleado()) {
      this.toastNotificationService.showError(
        'No autorizado',
        'No tiene permisos para crear empleados',
      );
      this.cerrar();
      return;
    }

    if (this.formGroupEmpleado.invalid) {
      this.formGroupEmpleado.markAllAsTouched();
      this.toastNotificationService.showError(
        'Por favor, complete todos los campos requeridos correctamente.',
      );
      return;
    }

    const puestosValidos = this.puestosAsignados.filter(
      (p) => p.puesto !== null && p.fechaInicio !== null,
    );

    const puestosDto: EmpleadoPuestoDto[] = puestosValidos.map((p) => ({
      id: p.puesto!.id,
      fechaInicio: this.formatDate(p.fechaInicio!),
      fechaFin: p.fechaFin ? this.formatDate(p.fechaFin) : null,
    }));

    const atributosDto: CreateEmpleadoAtributoDto[] = this.atributosAsignados
      .filter((a) => a.atributoTipo !== null && a.valor.trim() !== '')
      .map((a) => ({
        idAtributoTipo: a.atributoTipo!.id,
        valor: a.valor.trim(),
      }));

    if (this.modoEdicion && this.empleadoId) {
      const updateRequest: UpdateEmpleadoRequest = {
        fechaIngreso: this.formatDate(
          this.formGroupEmpleado.value.fechaIngreso,
        ),
        fechaEgreso: this.formGroupEmpleado.value.fechaEgreso
          ? this.formatDate(this.formGroupEmpleado.value.fechaEgreso)
          : undefined,
        activo: this.formGroupEmpleado.value.activo,
        puestos: puestosDto,
        atributos: atributosDto,
        idEspecialidades: this.formGroupEmpleado.value.especialidades,
      };

      this.empleadoService
        .updateEmpleado(this.empleadoId, updateRequest)
        .subscribe({
          next: (response) => {
            this.toastNotificationService.showSuccess(
              'Empleado actualizado exitosamente.',
            );
            this.refDialog.close(response ?? false);
          },
          error: (error) => {
            console.error('Error al actualizar empleado:', error);
            this.httpErrorHandler.showErrorToast(error);
          },
        });
    } else {
      const createRequest: CreateEmpleadoRequest = {
        idUsuario: this.formGroupEmpleado.value.usuario.id,
        fechaIngreso: this.formatDate(
          this.formGroupEmpleado.value.fechaIngreso,
        ),
        puestos: puestosDto,
        atributos: atributosDto.length > 0 ? atributosDto : undefined,
        idEspecialidades:
          this.formGroupEmpleado.value.especialidades.length > 0
            ? this.formGroupEmpleado.value.especialidades
            : undefined,
      };

      this.empleadoService.createEmpleado(createRequest).subscribe({
        next: (response) => {
          this.toastNotificationService.showSuccess(
            'Empleado creado exitosamente.',
          );
          this.refDialog.close(response ?? false);
        },
        error: (error) => {
          console.error('Error al crear empleado:', error);
          this.httpErrorHandler.showErrorToast(error);
        },
      });
    }
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getTituloModal(): string {
    return this.modoEdicion ? 'Editar Empleado' : 'Crear nuevo Empleado';
  }

  getPersonaAsociada(): Persona | null {
    const usuario = this.formGroupEmpleado.get('usuario')?.value as Usuario;
    return usuario?.persona ?? null;
  }

  getPersonaAsociadaTexto(): string {
    const persona = this.getPersonaAsociada();
    if (!persona) {
      return '';
    }
    const documento = persona.documento
      ? ` (${persona.documentoTipo?.nombre || 'Doc'} ${persona.documento})`
      : '';
    return `${persona.apellidos}, ${persona.nombres}${documento}`;
  }
}
