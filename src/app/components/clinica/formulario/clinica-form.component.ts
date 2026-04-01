import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  ViewChild,
  Input,
  Output,
  EventEmitter,
  Optional,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { MultiSelectModule } from 'primeng/multiselect';
import { TabsModule } from 'primeng/tabs';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CheckboxModule } from 'primeng/checkbox';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ConfirmationService } from 'primeng/api';
import { forkJoin, EMPTY } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { HistorialClinicoService } from '../../../services/historial-clinico.service';
import { MascotaService } from '../../../services/mascota.service';
import { EmpleadoService } from '../../../services/empleado.service';
import { DiagnosticoService } from '../../../services/diagnostico.service';
import { AdjuntoService } from '../../../services/adjunto.service';
import { ToastNotificationService } from '../../../services/toast-notification.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { HttpErrorHandlerService } from '../../../services/http-error-handler.service';
import { environment } from '../../../../environments/environment';
import type {
  CreateHistorialClinicoRequest,
  UpdateHistorialClinicoRequest,
} from '../../../models/historial-clinico.interfaces';
import type {
  UploadAdjuntoRequest,
  Adjunto,
  AdjuntoTipo,
} from '../../../models/adjunto.interfaces';
import type { Diagnostico } from '../../../models/diagnostico.interfaces';
import type { Mascota } from '../../../models/mascota.interfaces';
import type { Empleado } from '../../../models/empleado.interfaces';

@Component({
  selector: 'app-clinica-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    Textarea,
    InputNumberModule,
    SelectModule,
    DatePickerModule,
    MultiSelectModule,
    TabsModule,
    FileUploadModule,
    TableModule,
    TooltipModule,
    ConfirmDialogModule,
    CheckboxModule,
  ],
  templateUrl: './clinica-form.component.html',
})
export class ClinicaFormComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  @ViewChild('fileUpload') fileUpload!: FileUpload;

  @Input() historialId: number | null = null;
  @Input() mascotaId: number | null = null;
  @Input() modoVista = false;
  @Input() modoEmbebido = false;

  @Output() historialGuardado = new EventEmitter<unknown>();
  @Output() formularioCancelado = new EventEmitter<void>();

  formGroupHistorial!: FormGroup;

  mascotas: Mascota[] = [];
  veterinarios: Empleado[] = [];
  diagnosticos: Diagnostico[] = [];
  adjuntoTipos: AdjuntoTipo[] = [];

  uploadedAdjuntos: Adjunto[] = [];
  selectedAdjuntoTipo: number | null = null;
  uploadingFiles = new Map<string, boolean>();

  modoEdicion = false;
  formEnviado = false;
  puedeToggleActivo = false;
  puedeModificarVeterinario = false;

  constructor(
    @Optional() public readonly refDialog?: DynamicDialogRef,
    @Optional() private readonly config?: DynamicDialogConfig,
    private readonly historialClinicoService: HistorialClinicoService = null!,
    private readonly mascotaService: MascotaService = null!,
    private readonly empleadoService: EmpleadoService = null!,
    private readonly diagnosticoService: DiagnosticoService = null!,
    private readonly adjuntoService: AdjuntoService = null!,
    private readonly toastNotificationService: ToastNotificationService = null!,
    private readonly confirmationService: ConfirmationService = null!,
    private readonly authorizationService: AuthorizationService = null!,
    private readonly httpErrorHandler: HttpErrorHandlerService = null!,
  ) {}

  ngOnInit(): void {
    this.crearFormulario();

    // Priorizar inputs
    if (this.historialId === null && this.config?.data?.historialId) {
      this.historialId = this.config.data.historialId;
    }
    if (this.mascotaId === null && this.config?.data?.mascotaId) {
      this.mascotaId = this.config.data.mascotaId;
    }
    if (!this.modoVista && this.config?.data?.modoVista) {
      this.modoVista = this.config.data.modoVista;
    }

    this.modoEdicion = this.historialId !== null;
    this.puedeToggleActivo = this.authorizationService.canToggleActivo();
    this.puedeModificarVeterinario =
      this.authorizationService.canChangeVeterinarioClinica();

    if (!this.modoEdicion) {
      this.formGroupHistorial.get('activo')?.disable();
    }

    if (this.modoEdicion && !this.puedeModificarVeterinario) {
      this.formGroupHistorial.get('idEmpleadoAsignado')?.disable();
    }

    this.cargarCatalogos();
  }

  crearFormulario(): void {
    this.formGroupHistorial = new FormGroup({
      motivoConsulta: new FormControl('', [
        Validators.required,
        Validators.maxLength(200),
      ]),
      fechaConsulta: new FormControl(new Date()),
      tratamiento: new FormControl(''),
      observaciones: new FormControl(''),
      idMascota: new FormControl(null, [Validators.required]),
      idEmpleadoAsignado: new FormControl(null, [Validators.required]),
      idDiagnosticos: new FormControl<number[]>([]),
      activo: new FormControl<boolean>(true),
      examenFisico: new FormGroup({
        pesoGramos: new FormControl<number | null>(null, [Validators.min(0)]),
        temperaturaCorporal: new FormControl('', [Validators.maxLength(100)]),
        frecuenciaCardiaca: new FormControl('', [Validators.maxLength(100)]),
        frecuenciaRespiratoria: new FormControl('', [
          Validators.maxLength(100),
        ]),
        estadoHidratacion: new FormControl('', [Validators.maxLength(100)]),
        general: new FormControl(''),
      }),
    });
  }

  cargarCatalogos(): void {
    forkJoin({
      mascotas: this.mascotaService.list(),
      empleados: this.empleadoService.listVeterinarios(),
      diagnosticos: this.diagnosticoService.list(),
      adjuntoTipos: this.adjuntoService.listAdjuntoTipos(1),
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.mascotas = response.mascotas.data;
          this.veterinarios = response.empleados.data;
          this.diagnosticos = response.diagnosticos.data;
          this.adjuntoTipos = response.adjuntoTipos.data;

          // Pre-cargar mascota si viene por input
          if (this.mascotaId && !this.modoEdicion) {
            this.formGroupHistorial.patchValue({ idMascota: this.mascotaId });
          }

          if (this.modoEdicion && this.historialId) {
            this.cargarDatosHistorial();
          }
        },
        error: (error) => {
          this.httpErrorHandler.showErrorToast(error);
        },
      });
  }

  cargarDatosHistorial(): void {
    if (!this.historialId) return;

    this.historialClinicoService
      .get(this.historialId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          const historial = response.data;

          this.formGroupHistorial.patchValue({
            motivoConsulta: historial.motivoConsulta,
            fechaConsulta: new Date(historial.fechaConsulta),
            tratamiento: historial.tratamiento || '',
            observaciones: historial.observaciones || '',
            idMascota: historial.idMascota,
            idEmpleadoAsignado: historial.idEmpleadoAsignado,
            idDiagnosticos:
              historial.historialesDiagnosticos?.map((d) => d.idDiagnostico) ||
              [],
            activo: historial.activo,
          });

          if (historial.examenFisico) {
            this.formGroupHistorial.get('examenFisico')?.patchValue({
              pesoGramos: historial.examenFisico.pesoGramos,
              temperaturaCorporal:
                historial.examenFisico.temperaturaCorporal || '',
              frecuenciaCardiaca:
                historial.examenFisico.frecuenciaCardiaca || '',
              frecuenciaRespiratoria:
                historial.examenFisico.frecuenciaRespiratoria || '',
              estadoHidratacion: historial.examenFisico.estadoHidratacion || '',
              general: historial.examenFisico.general || '',
            });
          }

          this.uploadedAdjuntos = historial.adjuntos || [];
        },
        error: (error) => {
          this.httpErrorHandler.showErrorToast(error);
        },
      });
  }

  onFileSelect(event: { files: File[] }): void {
    const files: File[] = event.files;

    if (!this.selectedAdjuntoTipo) {
      this.toastNotificationService.showError(
        'Seleccione el tipo de adjunto antes de cargar archivos',
      );
      this.fileUpload.clear();
      return;
    }

    files.forEach((file) => this.uploadFile(file));
    this.fileUpload.clear();
  }

  uploadFile(file: File): void {
    if (!this.selectedAdjuntoTipo) return;

    this.uploadingFiles.set(file.name, true);

    const request: UploadAdjuntoRequest = {
      file: file,
      descripcion: file.name,
      idAdjuntoTipo: this.selectedAdjuntoTipo,
    };

    this.adjuntoService
      .upload(request)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap((response) =>
          response.data ? this.adjuntoService.get(response.data) : EMPTY,
        ),
      )
      .subscribe({
        next: (adjuntoResponse) => {
          this.uploadedAdjuntos.push(adjuntoResponse.data);
          this.toastNotificationService.showSuccess(
            `Archivo ${file.name} cargado exitosamente`,
          );
          this.uploadingFiles.delete(file.name);
        },
        error: (error) => {
          this.httpErrorHandler.showErrorToast(error);
          this.uploadingFiles.delete(file.name);
        },
      });
  }

  downloadFile(adjuntoId: number, filename: string): void {
    this.adjuntoService
      .download(adjuntoId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = filename;
          link.click();
          window.URL.revokeObjectURL(url);
        },
        error: () => {
          this.toastNotificationService.showError('Error al descargar archivo');
        },
      });
  }

  viewFile(adjuntoId: number): void {
    this.adjuntoService
      .view(adjuntoId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          window.open(url, '_blank');
          setTimeout(() => window.URL.revokeObjectURL(url), 100);
        },
        error: () => {
          this.toastNotificationService.showError(
            'Error al visualizar archivo',
          );
        },
      });
  }

  removeUploadedFile(adjuntoId: number): void {
    if (this.modoEdicion) {
      this.confirmationService.confirm({
        key: 'clinicaForm',
        message: '¿Está seguro de que desea eliminar este archivo?',
        header: 'Confirmar eliminación',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sí, eliminar',
        rejectLabel: 'Cancelar',
        acceptButtonStyleClass: 'p-button-danger',
        accept: () => {
          this.deleteFile(adjuntoId);
        },
      });
      return;
    }

    this.deleteFile(adjuntoId);
  }

  private deleteFile(adjuntoId: number): void {
    this.adjuntoService
      .delete(adjuntoId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.uploadedAdjuntos = this.uploadedAdjuntos.filter(
            (a) => a.id !== adjuntoId,
          );
          this.toastNotificationService.showSuccess('Archivo eliminado');
        },
        error: (error) => {
          this.httpErrorHandler.showErrorToast(error);
        },
      });
  }

  isImage(mime: string): boolean {
    return mime.startsWith('image/');
  }

  getImagePreviewUrl(adjuntoId: number): string {
    return `${environment.apiUrl}/adjunto/download/${adjuntoId}`;
  }

  getFileIcon(extension: string): string {
    const ext = extension.toLowerCase();

    if (['pdf'].includes(ext)) return 'pi pi-file-pdf';
    if (['doc', 'docx'].includes(ext)) return 'pi pi-file-word';
    if (['xls', 'xlsx'].includes(ext)) return 'pi pi-file-excel';
    if (['txt'].includes(ext)) return 'pi pi-file';

    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'].includes(ext))
      return 'pi pi-image';

    return 'pi pi-file';
  }

  formatFileSize(bytes: string | number): string {
    const numBytes = typeof bytes === 'string' ? parseInt(bytes, 10) : bytes;
    if (numBytes < 1024) return numBytes + ' bytes';
    if (numBytes < 1024 * 1024) return (numBytes / 1024).toFixed(2) + ' KB';
    return (numBytes / (1024 * 1024)).toFixed(2) + ' MB';
  }

  get mascotaSeleccionada(): Mascota | undefined {
    const idMascota = this.formGroupHistorial.get('idMascota')?.value;
    return this.mascotas.find((m) => m.id === idMascota);
  }

  get nombreDuenio(): string {
    const mascota = this.mascotaSeleccionada;
    if (mascota?.persona) {
      return `${mascota.persona.apellidos}, ${mascota.persona.nombres}`;
    }
    return '';
  }

  guardar(): void {
    this.formEnviado = true;

    // Check authorization before submitting
    if (this.modoEdicion && !this.authorizationService.canEditClinica()) {
      this.toastNotificationService.showError(
        'No autorizado',
        'No tiene permisos para editar historias clínicas',
      );
      this.cancelar();
      return;
    }

    if (!this.modoEdicion && !this.authorizationService.canCreateClinica()) {
      this.toastNotificationService.showError(
        'No autorizado',
        'No tiene permisos para crear historias clínicas',
      );
      this.cancelar();
      return;
    }

    if (this.formGroupHistorial.invalid) {
      this.formGroupHistorial.markAllAsTouched();
      this.toastNotificationService.showError(
        'Complete todos los campos requeridos',
      );
      return;
    }

    const formValue = this.formGroupHistorial.getRawValue();

    const fechaConsulta = formValue.fechaConsulta
      ? new Date(formValue.fechaConsulta).toISOString()
      : undefined;

    const examenFisicoValue = formValue.examenFisico;
    const hasExamenFisico = Object.values(examenFisicoValue).some(
      (v) => v !== null && v !== '',
    );
    const examenFisico = hasExamenFisico ? examenFisicoValue : undefined;

    const idAdjuntos = this.uploadedAdjuntos.map((a) => a.id);

    if (this.modoEdicion && this.historialId) {
      const updateRequest: UpdateHistorialClinicoRequest = {
        motivoConsulta: formValue.motivoConsulta,
        fechaConsulta,
        tratamiento: formValue.tratamiento || null,
        observaciones: formValue.observaciones || null,
        examenFisico,
        idDiagnosticos: formValue.idDiagnosticos || [],
        idAdjuntos,
        activo: formValue.activo,
      };

      this.historialClinicoService
        .update(this.historialId, updateRequest)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (response) => {
            this.toastNotificationService.showSuccess(
              'Historial clínico actualizado exitosamente',
            );

            if (this.modoEmbebido) {
              this.historialGuardado.emit(response);
            }

            if (this.refDialog) {
              this.refDialog.close(response);
            }
          },
          error: (error) => {
            this.httpErrorHandler.showErrorToast(error);
          },
        });
    } else {
      const createRequest: CreateHistorialClinicoRequest = {
        motivoConsulta: formValue.motivoConsulta,
        fechaConsulta,
        tratamiento: formValue.tratamiento || null,
        observaciones: formValue.observaciones || null,
        idMascota: formValue.idMascota!,
        idEmpleadoAsignado: formValue.idEmpleadoAsignado!,
        examenFisico,
        idDiagnosticos: formValue.idDiagnosticos || [],
        idAdjuntos,
      };

      this.historialClinicoService
        .create(createRequest)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (response) => {
            this.toastNotificationService.showSuccess(
              'Historial clínico creado exitosamente',
            );

            if (this.modoEmbebido) {
              this.historialGuardado.emit(response);
            }

            if (this.refDialog) {
              this.refDialog.close(response);
            }
          },
          error: (error) => {
            this.httpErrorHandler.showErrorToast(error);
          },
        });
    }
  }

  cancelar(): void {
    if (this.modoEmbebido) {
      this.formularioCancelado.emit();
    }

    if (this.refDialog) {
      this.refDialog.close();
    }
  }
}
