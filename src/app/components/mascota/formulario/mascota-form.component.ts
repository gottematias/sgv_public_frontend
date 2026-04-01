import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  Optional,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { CheckboxModule } from 'primeng/checkbox';
import { SelectModule } from 'primeng/select';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { MultiSelectModule } from 'primeng/multiselect';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ImageModule } from 'primeng/image';
import { ConfirmationService } from 'primeng/api';
import { forkJoin } from 'rxjs';
import { Sexo } from '../../../constants/sexo.enum';
import { Alergia, CondicionCronica } from '../../../models/alergia.interfaces';
import { Especie, Raza } from '../../../models/especie.interfaces';
import {
  CreateMascotaRequest,
  MascotaEstado,
  UpdateMascotaRequest,
} from '../../../models/mascota.interfaces';
import {
  Adjunto,
  AdjuntoTipo,
  AdjuntoTipoId,
  UploadAdjuntoRequest,
} from '../../../models/adjunto.interfaces';
import { Persona } from '../../../models/persona.interfaces';
import { AlergiaService } from '../../../services/alergia.service';
import { EspecieService } from '../../../services/especie.service';
import { MascotaService } from '../../../services/mascota.service';
import { PersonaService } from '../../../services/persona.service';
import { AdjuntoService } from '../../../services/adjunto.service';
import { ToastNotificationService } from '../../../services/toast-notification.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { environment } from '../../../../environments/environment';

import { HttpErrorHandlerService } from '../../../services/http-error-handler.service';
@Component({
  selector: 'app-mascota-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    SelectModule,
    DatePickerModule,
    CheckboxModule,
    InputNumberModule,
    Textarea,
    MultiSelectModule,
    ButtonModule,
    TooltipModule,
    ConfirmDialogModule,
    ImageModule,
  ],
  templateUrl: './mascota-form.component.html',
  styleUrl: './mascota-form.component.css',
})
export class MascotaFormComponent implements OnInit {
  @Input() mascotaId: number | null = null;
  @Input() modoEdicion = false;
  @Input() modoEmbebido = false;

  @Output() mascotaGuardada = new EventEmitter<unknown>();
  @Output() formularioCancelado = new EventEmitter<void>();

  formGroupMascota: FormGroup;
  formEnviado = false;
  puedeToggleActivo = false;

  especies: Especie[] = [];
  razas: Raza[] = [];
  razasFiltradas: Raza[] = [];
  estados: MascotaEstado[] = [];
  personas: Persona[] = [];
  alergias: Alergia[] = [];
  condicionesCronicas: CondicionCronica[] = [];
  adjuntoTipos: AdjuntoTipo[] = [];

  uploadedImagenPerfil: Adjunto | null = null;
  uploadingImage = false;
  uploadedImagenPerfilUrl: string | null = null;
  readonly idAdjuntoImagenPerfilTipo: number =
    AdjuntoTipoId.MASCOTA_FOTO_PERFIL;

  opcionesSexo = [
    { label: 'Macho', value: Sexo.MACHO },
    { label: 'Hembra', value: Sexo.HEMBRA },
    { label: 'Indefinido', value: Sexo.INDEFINIDO },
  ];

  constructor(
    @Optional() private readonly refDialog?: DynamicDialogRef,
    @Optional() private readonly config?: DynamicDialogConfig,
    private readonly mascotaService: MascotaService = null!,
    private readonly especieService: EspecieService = null!,
    private readonly alergiaService: AlergiaService = null!,
    private readonly personaService: PersonaService = null!,
    private readonly adjuntoService: AdjuntoService = null!,
    private readonly toastNotificationService: ToastNotificationService = null!,
    private readonly confirmationService: ConfirmationService = null!,
    private readonly authorizationService: AuthorizationService = null!,
    private readonly httpErrorHandler: HttpErrorHandlerService = null!,
  ) {
    this.formGroupMascota = new FormGroup({
      nombre: new FormControl<string>('', [
        Validators.required,
        Validators.maxLength(100),
      ]),
      fechaNacimiento: new FormControl<Date | null>(null),
      sexo: new FormControl<string>(Sexo.INDEFINIDO),
      color: new FormControl<string>('', [Validators.maxLength(100)]),
      tamanio: new FormControl<string>('', [Validators.maxLength(50)]),
      pelaje: new FormControl<string>('', [Validators.maxLength(50)]),
      peso: new FormControl<number | null>(null, [Validators.min(1)]),
      esterilizado: new FormControl<boolean>(false, [Validators.required]),
      observaciones: new FormControl<string>(''),
      identificador: new FormControl<string>('', [Validators.maxLength(250)]),
      idEspecie: new FormControl<number | null>(null, [Validators.required]),
      idRaza: new FormControl<number | null>({ value: null, disabled: true }, [
        Validators.required,
      ]),
      idMascotaEstado: new FormControl<number | null>(null, [
        Validators.required,
      ]),
      idPersona: new FormControl<number | null>(null, [Validators.required]),
      idAlergias: new FormControl<number[]>([]),
      idCondicionesCronicas: new FormControl<number[]>([]),
      activo: new FormControl<boolean>(true),
    });
  }

  ngOnInit(): void {
    if (this.mascotaId === null && this.config?.data?.mascotaId) {
      this.mascotaId = this.config.data.mascotaId;
    }

    if (!this.modoEdicion) {
      this.modoEdicion = this.mascotaId !== null;
    }

    this.puedeToggleActivo = this.authorizationService.canToggleActivo();

    if (!this.modoEdicion) {
      this.formGroupMascota.get('activo')?.disable();
    }

    this.cargarCatalogos();

    this.formGroupMascota
      .get('idEspecie')
      ?.valueChanges.subscribe((idEspecie) => {
        this.onEspecieChange(idEspecie);
      });
  }

  cargarCatalogos(): void {
    forkJoin({
      especies: this.especieService.list(),
      razas: this.especieService.listRazas(),
      estados: this.mascotaService.listMascotaEstados(),
      personas: this.personaService.list(),
      alergias: this.alergiaService.list(),
      condicionesCronicas: this.alergiaService.listCondicionesCronicas(),
      adjuntoTipos: this.adjuntoService.listAdjuntoTipos(),
    }).subscribe({
      next: (response) => {
        this.especies = response.especies.data;
        this.razas = response.razas.data;
        this.razasFiltradas = this.razas;
        this.estados = response.estados.data;
        this.personas = response.personas.data;
        this.alergias = response.alergias.data;
        this.condicionesCronicas = response.condicionesCronicas.data;
        this.adjuntoTipos = response.adjuntoTipos.data;

        if (this.modoEdicion && this.mascotaId) {
          this.cargarDatosMascota();
        } else {
          const estadoActivo = this.estados.find(
            (e) => e.nombre.toLowerCase() === 'activo',
          );
          if (estadoActivo) {
            this.formGroupMascota.patchValue({
              idMascotaEstado: estadoActivo.id,
              fechaNacimiento: new Date(),
            });
          }
        }
      },
      error: (error) => {
        console.error('Error al cargar catálogos:', error);
        this.toastNotificationService.showError(
          `Error al cargar catálogos: ${error.message}`,
        );
      },
    });
  }

  cargarDatosMascota(): void {
    if (!this.mascotaId) return;

    this.mascotaService.get(this.mascotaId).subscribe({
      next: (response) => {
        const mascota = response.data;

        const raza = this.razas.find((r) => r.id === mascota.raza?.id);
        const idEspecie = raza?.idEspecie || null;

        this.formGroupMascota.patchValue({
          nombre: mascota.nombre,
          fechaNacimiento: mascota.fechaNacimiento
            ? new Date(mascota.fechaNacimiento)
            : null,
          sexo: mascota.sexo,
          color: mascota.color,
          tamanio: mascota.tamanio,
          pelaje: mascota.pelaje,
          peso: mascota.pesoGramos,
          esterilizado: mascota.esterilizado,
          observaciones: mascota.observaciones || '',
          identificador: mascota.identificador || '',
          idEspecie: raza?.idEspecie,
          idRaza: mascota.raza?.id,
          idMascotaEstado: mascota.mascotaEstado?.id,
          idPersona: mascota.persona?.id,
          idAlergias: mascota.mascotasAlergias?.map((a) => a.idAlergia) || [],
          idCondicionesCronicas:
            mascota.mascotasCondicionesCronicas?.map(
              (c) => c.idCondicionCronica,
            ) || [],
          activo: mascota.activo,
        });

        this.formGroupMascota.get('idPersona')?.disable();

        if (idEspecie) {
          this.filtrarRazasPorEspecie(idEspecie);
          this.formGroupMascota.get('idRaza')?.enable();
        }

        if (mascota.idAdjuntoImagenPerfil) {
          this.adjuntoService.get(mascota.idAdjuntoImagenPerfil).subscribe({
            next: (adjuntoResponse) => {
              this.uploadedImagenPerfil = adjuntoResponse.data;
              this.loadImageBlob(mascota.idAdjuntoImagenPerfil!);
            },
            error: (error) => {
              console.error('Error loading profile image:', error);
            },
          });
        }
      },
      error: (error) => {
        this.httpErrorHandler.showErrorToast(error);
      },
    });
  }

  onEspecieChange(idEspecie: number | null): void {
    const razaControl = this.formGroupMascota.get('idRaza');

    if (idEspecie) {
      this.filtrarRazasPorEspecie(idEspecie);
      razaControl?.enable();
      this.formGroupMascota.patchValue({ idRaza: null });
    } else {
      razaControl?.disable();
      this.formGroupMascota.patchValue({ idRaza: null });
      this.razasFiltradas = [];
    }
  }

  filtrarRazasPorEspecie(idEspecie: number): void {
    this.razasFiltradas = this.razas.filter((r) => r.idEspecie === idEspecie);
  }

  guardar(): void {
    this.formEnviado = true;

    // Check authorization before submitting
    if (this.mascotaId && !this.authorizationService.canEditMascota()) {
      this.toastNotificationService.showError(
        'No autorizado',
        'No tiene permisos para editar mascotas',
      );
      this.cancelar();
      return;
    }

    if (!this.mascotaId && !this.authorizationService.canCreateMascota()) {
      this.toastNotificationService.showError(
        'No autorizado',
        'No tiene permisos para crear mascotas',
      );
      this.cancelar();
      return;
    }

    if (this.formGroupMascota.invalid) {
      this.formGroupMascota.markAllAsTouched();
      this.toastNotificationService.showError(
        'Por favor, complete todos los campos requeridos correctamente.',
      );
      return;
    }

    const formValue = this.formGroupMascota.getRawValue();

    let fechaNacimiento: string | null = null;
    if (formValue.fechaNacimiento) {
      const date = new Date(formValue.fechaNacimiento);
      fechaNacimiento = date.toISOString().split('T')[0];
    }

    if (this.modoEdicion && this.mascotaId) {
      const updateRequest: UpdateMascotaRequest = {
        nombre: formValue.nombre,
        fechaNacimiento: fechaNacimiento,
        sexo: formValue.sexo || null,
        color: formValue.color || null,
        tamanio: formValue.tamanio || null,
        pelaje: formValue.pelaje || null,
        pesoGramos: formValue.peso || null,
        esterilizado: formValue.esterilizado,
        observaciones: formValue.observaciones || null,
        identificador: formValue.identificador || null,
        idRaza: formValue.idRaza,
        idMascotaEstado: formValue.idMascotaEstado,
        idAlergias: formValue.idAlergias || [],
        idCondicionesCronicas: formValue.idCondicionesCronicas || [],
        activo: formValue.activo,
        idAdjuntoImagenPerfil: this.uploadedImagenPerfil?.id || null,
      };

      this.mascotaService.update(this.mascotaId, updateRequest).subscribe({
        next: (response) => {
          this.toastNotificationService.showSuccess(
            'Mascota actualizada exitosamente',
          );

          if (this.modoEmbebido) {
            this.mascotaGuardada.emit(response);
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
      const createRequest: CreateMascotaRequest = {
        nombre: formValue.nombre,
        fechaNacimiento: fechaNacimiento,
        sexo: formValue.sexo || null,
        color: formValue.color || null,
        tamanio: formValue.tamanio || null,
        pelaje: formValue.pelaje || null,
        pesoGramos: formValue.peso || null,
        esterilizado: formValue.esterilizado,
        observaciones: formValue.observaciones || null,
        identificador: formValue.identificador || null,
        idRaza: formValue.idRaza,
        idMascotaEstado: formValue.idMascotaEstado,
        idPersona: formValue.idPersona,
        idAlergias: formValue.idAlergias || [],
        idCondicionesCronicas: formValue.idCondicionesCronicas || [],
        idAdjuntoImagenPerfil: this.uploadedImagenPerfil?.id || null,
      };

      this.mascotaService.create(createRequest).subscribe({
        next: (response) => {
          this.toastNotificationService.showSuccess(
            'Mascota creada exitosamente',
          );

          if (this.modoEmbebido) {
            this.mascotaGuardada.emit(response);
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

  getPersonaLabel(persona: Persona): string {
    return `${persona.apellidos}, ${persona.nombres} - ${persona.documento}`;
  }

  getEdadMascota(): string {
    const fechaNacimiento = this.formGroupMascota.get('fechaNacimiento')?.value;
    if (!fechaNacimiento) {
      return '';
    }

    const hoy = new Date();
    const fechaNac = new Date(fechaNacimiento);

    let años = hoy.getFullYear() - fechaNac.getFullYear();
    let meses = hoy.getMonth() - fechaNac.getMonth();

    if (meses < 0) {
      años--;
      meses += 12;
    }

    if (años > 0 && meses > 0) {
      return `${años} ${años === 1 ? 'año' : 'años'} y ${meses} ${meses === 1 ? 'mes' : 'meses'}`;
    } else if (años > 0) {
      return `${años} ${años === 1 ? 'año' : 'años'}`;
    } else if (meses > 0) {
      return `${meses} ${meses === 1 ? 'mes' : 'meses'}`;
    } else {
      const dias = Math.floor(
        (hoy.getTime() - fechaNac.getTime()) / (1000 * 60 * 60 * 24),
      );
      return `${dias} ${dias === 1 ? 'día' : 'días'}`;
    }
  }

  onImageSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];

    const isImageByMime = file.type.startsWith('image/');
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
    const fileName = file.name.toLowerCase();
    const isImageByExtension = imageExtensions.some((ext) =>
      fileName.endsWith(ext),
    );

    if (!isImageByMime && !isImageByExtension) {
      console.error('Archivo rechazado - no es una imagen válida');
      this.toastNotificationService.showError(
        'Solo se permiten archivos de imagen (JPG, PNG, GIF, BMP, WEBP)',
      );
      input.value = '';
      return;
    }

    if (!this.idAdjuntoImagenPerfilTipo) {
      console.error('Tipo de adjunto no disponible');
      this.toastNotificationService.showError('Tipo de adjunto no disponible');
      input.value = '';
      return;
    }

    this.uploadImage(file);
    input.value = '';
  }

  uploadImage(file: File): void {
    if (!this.idAdjuntoImagenPerfilTipo) return;

    this.uploadingImage = true;

    const request: UploadAdjuntoRequest = {
      file: file,
      descripcion: `Foto de perfil - ${this.formGroupMascota.get('nombre')?.value || 'Mascota'}`,
      idAdjuntoTipo: this.idAdjuntoImagenPerfilTipo,
    };

    this.adjuntoService.upload(request).subscribe({
      next: (response) => {
        if (response.data) {
          this.adjuntoService.get(response.data).subscribe({
            next: (adjuntoResponse) => {
              this.uploadedImagenPerfil = adjuntoResponse.data;
              this.loadImageBlob(response.data!);
              this.toastNotificationService.showSuccess(
                'Imagen cargada exitosamente',
              );
              this.uploadingImage = false;
            },
            error: (error) => {
              this.httpErrorHandler.showErrorToast(error);
              this.uploadingImage = false;
            },
          });
        }
      },
      error: (error) => {
        this.toastNotificationService.showError(
          `Error al cargar imagen: ${error.message}`,
        );
        this.uploadingImage = false;
      },
    });
  }

  deleteImage(): void {
    if (!this.uploadedImagenPerfil) return;

    this.confirmationService.confirm({
      key: 'mascotaForm',
      message: '¿Está seguro de eliminar la imagen de perfil?',
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        this.deleteImageConfirmed();
      },
    });
  }

  deleteImageConfirmed(): void {
    if (!this.uploadedImagenPerfil) return;

    this.adjuntoService.delete(this.uploadedImagenPerfil.id).subscribe({
      next: () => {
        if (this.uploadedImagenPerfilUrl) {
          URL.revokeObjectURL(this.uploadedImagenPerfilUrl);
          this.uploadedImagenPerfilUrl = null;
        }
        this.uploadedImagenPerfil = null;
        this.toastNotificationService.showSuccess('Imagen eliminada');
      },
      error: (error) => {
        this.httpErrorHandler.showErrorToast(error);
      },
    });
  }

  getImageUrl(adjuntoId: number): string {
    return `${environment.apiUrl}/adjunto/view/${adjuntoId}`;
  }

  loadImageBlob(adjuntoId: number): void {
    this.adjuntoService.view(adjuntoId).subscribe({
      next: (blob) => {
        if (this.uploadedImagenPerfilUrl) {
          URL.revokeObjectURL(this.uploadedImagenPerfilUrl);
        }
        this.uploadedImagenPerfilUrl = URL.createObjectURL(blob);
      },
      error: (error) => {
        console.error('Error loading image blob:', error);
        this.toastNotificationService.showError(
          'Error al cargar la imagen de perfil',
        );
      },
    });
  }
}
