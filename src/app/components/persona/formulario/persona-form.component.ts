import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  Input,
  Output,
  EventEmitter,
  Optional,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PersonaService } from '../../../services/persona.service';
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
import { CheckboxModule } from 'primeng/checkbox';
import { TooltipModule } from 'primeng/tooltip';
import { DividerModule } from 'primeng/divider';
import {
  Ciudad,
  CreateRequest,
  DocumentoTipo,
  UpdateRequest,
} from '../../../models/persona.interfaces';
import { DireccionService } from '../../../services/direccion.service';
import { ContactoService } from '../../../services/contacto.service';
import { ContactoTipo } from '../../../models/contacto.interfaces';
import { forkJoin } from 'rxjs';
import { DocumentoTipo as DocumentoTipoEnum } from '../../../constants/documento-tipo.enum';

@Component({
  selector: 'app-persona-form',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    SelectModule,
    CheckboxModule,
    TooltipModule,
    DividerModule,
  ],
  providers: [],
  templateUrl: './persona-form.component.html',
  styleUrls: ['./persona-form.component.css'],
})
export class PersonaFormComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  @Input() personaId: number | null = null;
  @Input() modoEmbebido = false;

  @Output() personaGuardada = new EventEmitter<unknown>();
  @Output() formularioCancelado = new EventEmitter<void>();

  formGroupPersona: FormGroup;
  documentoTipos: DocumentoTipo[];
  ciudades: Ciudad[];
  contactoTipos: ContactoTipo[];
  contactoTipoSeleccionado: ContactoTipo | null;
  contactoValor: string;
  contactosAgregados: { tipo: ContactoTipo; valor: string }[];
  formEnviado: boolean;
  puedeToggleActivo = false;

  constructor(
    @Optional() private readonly refDialog?: DynamicDialogRef,
    @Optional() private readonly config?: DynamicDialogConfig,
    private readonly personaService: PersonaService = null!,
    private readonly direccionService: DireccionService = null!,
    private readonly contactoService: ContactoService = null!,
    private readonly toastNotificationService: ToastNotificationService = null!,
    private readonly authorizationService: AuthorizationService = null!,
    private readonly httpErrorHandler: HttpErrorHandlerService = null!,
  ) {
    this.documentoTipos = [];
    this.ciudades = [];
    this.contactoTipos = [];
    this.contactoTipoSeleccionado = null;
    this.contactoValor = '';
    this.contactosAgregados = [];
    this.formEnviado = false;

    this.formGroupPersona = new FormGroup({
      apellido: new FormControl<string>('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(100),
      ]),
      nombre: new FormControl<string>('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(100),
      ]),
      documentoTipo: new FormControl<DocumentoTipo | null>(null, [
        Validators.required,
      ]),
      documento: new FormControl<string>('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(100),
      ]),
      calle: new FormControl<string>('', [Validators.maxLength(100)]),
      numero: new FormControl<string>('', [Validators.maxLength(20)]),
      piso: new FormControl<string>('', [Validators.maxLength(20)]),
      departamento: new FormControl<string>('', [Validators.maxLength(20)]),
      observaciones: new FormControl<string>('', [Validators.maxLength(250)]),
      ciudad: new FormControl<Ciudad | null>(null, []),
      activo: new FormControl<boolean>(true),
    });
  }

  ngOnInit(): void {
    // Priorizar @Input sobre config.data
    if (this.personaId === null && this.config?.data?.personaId) {
      this.personaId = this.config.data.personaId;
    }

    this.puedeToggleActivo = this.authorizationService.canToggleActivo();

    if (!this.personaId) {
      this.formGroupPersona.get('activo')?.disable();
    }

    this.formGroupPersona
      .get('documentoTipo')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (documentoTipo: DocumentoTipo | null) => {
          if (
            documentoTipo &&
            documentoTipo.id === DocumentoTipoEnum.CODIGO_INTERNO
          ) {
            const timestamp = Date.now().toString();
            this.formGroupPersona.patchValue({
              documento: timestamp,
            });
          }
        },
      });

    forkJoin({
      documentoTipos: this.personaService.listDocumentoTipo(),
      ciudades: this.direccionService.list(),
      contactoTipos: this.contactoService.listContactoTipo(),
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (results) => {
          this.documentoTipos = results.documentoTipos.data;
          this.ciudades = results.ciudades.data;
          this.contactoTipos = results.contactoTipos.data;

          if (this.documentoTipos.length > 0) {
            this.formGroupPersona.patchValue({
              documentoTipo: this.documentoTipos[0],
            });
          }
          if (this.ciudades.length > 0) {
            this.formGroupPersona.patchValue({
              ciudad: this.ciudades[0],
            });
          }
          if (this.contactoTipos.length > 0) {
            this.contactoTipoSeleccionado = this.contactoTipos[0];
          }

          if (this.personaId) {
            this.personaService.get(this.personaId).subscribe({
              next: (response) => {
                const direccion = response.data.direcciones?.[0];
                this.formGroupPersona.setValue({
                  apellido: response.data.apellidos,
                  nombre: response.data.nombres,
                  documentoTipo: response.data.documentoTipo,
                  documento: response.data.documento,
                  calle: direccion?.calle || '',
                  numero: direccion?.numero || '',
                  piso: direccion?.piso || '',
                  departamento: direccion?.departamento || '',
                  observaciones: direccion?.observaciones || '',
                  ciudad: direccion?.ciudad || null,
                  activo: response.data.activo,
                });

                // Cargar contactos existentes
                if (
                  response.data.contactos &&
                  response.data.contactos.length > 0
                ) {
                  this.contactosAgregados = response.data.contactos.map(
                    (contacto) => ({
                      tipo: contacto.contactoTipo,
                      valor: contacto.dato,
                    }),
                  );
                }
              },
              error: (error) => {
                console.error(error);
              },
            });
          }
        },
        error: (error) => {
          console.error('Error al cargar catálogos:', error);
        },
      });
  }

  agregarContacto(): void {
    if (this.contactoTipoSeleccionado && this.contactoValor.trim()) {
      this.contactosAgregados.push({
        tipo: this.contactoTipoSeleccionado,
        valor: this.contactoValor.trim(),
      });
      this.contactoValor = '';
    }
  }

  eliminarContacto(index: number): void {
    this.contactosAgregados.splice(index, 1);
  }

  cerrar(): void {
    if (this.modoEmbebido) {
      this.formularioCancelado.emit();
    }

    if (this.refDialog) {
      this.refDialog.close();
    }
  }

  guardar(): void {
    this.formEnviado = true;

    // Check authorization before submitting
    if (this.personaId && !this.authorizationService.canEditPersona()) {
      this.toastNotificationService.showError(
        'No autorizado',
        'No tiene permisos para editar personas',
      );
      this.cerrar();
      return;
    }

    if (!this.personaId && !this.authorizationService.canCreatePersona()) {
      this.toastNotificationService.showError(
        'No autorizado',
        'No tiene permisos para crear personas',
      );
      this.cerrar();
      return;
    }

    if (this.formGroupPersona.invalid) {
      this.formGroupPersona.markAllAsTouched();
      this.toastNotificationService.showError(
        'Por favor, complete todos los campos requeridos correctamente.',
      );
      return;
    }

    const formValue = this.formGroupPersona.value;

    if (this.personaId && this.personaId > 0) {
      // Logic for UPDATE
      const direccionUpdate = formValue.ciudad
        ? {
            calle: formValue.calle?.trim() || '',
            numero: formValue.numero?.trim() || '',
            piso: formValue.piso?.trim() || '',
            departamento: formValue.departamento?.trim() || '',
            observaciones: formValue.observaciones?.trim() || '',
            idCiudad: formValue.ciudad.id,
          }
        : undefined;

      const contactosUpdate = this.contactosAgregados.map((contacto) => ({
        dato: contacto.valor,
        idContactoTipo: contacto.tipo.id,
      }));

      const updatePersonaRequest: UpdateRequest = {
        nombres: formValue.nombre.trim(),
        apellidos: formValue.apellido.trim(),
        documento: formValue.documento.trim(),
        idDocumentoTipo: formValue.documentoTipo.id,
        direccion: direccionUpdate,
        contactos: contactosUpdate,
      };

      this.personaService
        .update(this.personaId, updatePersonaRequest)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (response) => {
            this.toastNotificationService.showSuccess(
              'Persona actualizada exitosamente.',
            );

            if (this.modoEmbebido) {
              this.personaGuardada.emit(response);
            }

            if (this.refDialog) {
              this.refDialog.close(response ?? false);
            }
          },
          error: (error) => {
            console.error('Error al actualizar persona:', error);
            this.httpErrorHandler.showErrorToast(error);
          },
        });
    } else {
      // Logic for CREATE
      const direccionCreate = formValue.ciudad
        ? {
            calle: formValue.calle?.trim() || '',
            numero: formValue.numero?.trim() || '',
            piso: formValue.piso?.trim() || '',
            departamento: formValue.departamento?.trim() || '',
            observaciones: formValue.observaciones?.trim() || '',
            idCiudad: formValue.ciudad.id,
            idPersona: 0,
          }
        : undefined;

      const contactosCreate = this.contactosAgregados.map((contacto) => ({
        dato: contacto.valor,
        idContactoTipo: contacto.tipo.id,
        idPersona: 0,
      }));

      const createPersonaRequest: CreateRequest = {
        nombres: formValue.nombre.trim(),
        apellidos: formValue.apellido.trim(),
        documento: formValue.documento.trim(),
        idDocumentoTipo: formValue.documentoTipo.id,
        direccion: direccionCreate,
        contactos: contactosCreate,
      };

      this.personaService
        .create(createPersonaRequest)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (response) => {
            this.toastNotificationService.showSuccess(
              'Persona creada exitosamente.',
            );

            if (this.modoEmbebido) {
              this.personaGuardada.emit(response);
            }

            if (this.refDialog) {
              this.refDialog.close(response ?? false);
            }
          },
          error: (error) => {
            console.error('Error al crear persona:', error);
            this.httpErrorHandler.showErrorToast(error);
          },
        });
    }
  }
}
