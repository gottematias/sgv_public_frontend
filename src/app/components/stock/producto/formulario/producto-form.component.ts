import { Component, OnInit, Optional } from '@angular/core';
import { ProductoService } from '../../../../services/producto.service';
import { ToastNotificationService } from '../../../../services/toast-notification.service';
import { AuthorizationService } from '../../../../services/authorization.service';
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
import { Textarea } from 'primeng/textarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import { TooltipModule } from 'primeng/tooltip';
import { DatePickerModule } from 'primeng/datepicker';
import {
  CreateProductoRequest,
  ProductoCategoria,
  UpdateProductoRequest,
} from '../../../../models/stock.interfaces';

import { HttpErrorHandlerService } from '../../../../services/http-error-handler.service';
@Component({
  selector: 'app-producto-form',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    Textarea,
    InputNumberModule,
    ButtonModule,
    SelectModule,
    CheckboxModule,
    TooltipModule,
    DatePickerModule,
  ],
  providers: [],
  templateUrl: './producto-form.component.html',
  styleUrls: ['./producto-form.component.css'],
})
export class ProductoFormComponent implements OnInit {
  productoId: number | null = null;

  formGroupProducto: FormGroup;
  categorias: ProductoCategoria[];
  formEnviado: boolean;
  puedeToggleActivo = false;

  constructor(
    @Optional() private readonly refDialog?: DynamicDialogRef,
    @Optional() private readonly config?: DynamicDialogConfig,
    private readonly productoService: ProductoService = null!,
    private readonly toastNotificationService: ToastNotificationService = null!,
    private readonly authorizationService: AuthorizationService = null!,
    private readonly httpErrorHandler: HttpErrorHandlerService = null!,
  ) {
    this.categorias = [];
    this.formEnviado = false;

    this.formGroupProducto = new FormGroup({
      nombre: new FormControl<string>('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(250),
      ]),
      descripcion: new FormControl<string>('', [Validators.maxLength(500)]),
      codigo: new FormControl<string>('', [Validators.maxLength(100)]),
      codigoInterno: new FormControl<string>('', [
        Validators.required,
        Validators.maxLength(100),
      ]),
      precioVenta: new FormControl<number | null>(null, [
        Validators.required,
        Validators.min(0),
      ]),
      precioCosto: new FormControl<number | null>(null, [
        Validators.required,
        Validators.min(0),
      ]),
      fechaVencimiento: new FormControl<Date | null>(null),
      stockActual: new FormControl<number | null>(null, [
        Validators.required,
        Validators.min(0),
      ]),
      stockMinimo: new FormControl<number | null>(null, [Validators.min(0)]),
      categoria: new FormControl<ProductoCategoria | null>(null, [
        Validators.required,
      ]),
      activo: new FormControl<boolean>(true),
    });
  }

  ngOnInit(): void {
    if (this.productoId === null && this.config?.data?.productoId) {
      this.productoId = this.config.data.productoId;
    }

    this.puedeToggleActivo = this.authorizationService.canToggleActivo();

    if (!this.productoId) {
      this.formGroupProducto.get('activo')?.disable();
    } else {
      // Campos que no se pueden editar en modo actualización
      this.formGroupProducto.get('codigo')?.disable();
      this.formGroupProducto.get('codigoInterno')?.disable();
      this.formGroupProducto.get('stockActual')?.disable();
    }

    this.productoService.listCategorias().subscribe({
      next: (response) => {
        this.categorias = response.data;

        if (this.categorias.length > 0) {
          this.formGroupProducto.patchValue({
            categoria: this.categorias[0],
          });
        }

        if (this.productoId) {
          this.productoService.get(this.productoId).subscribe({
            next: (response) => {
              this.formGroupProducto.setValue({
                nombre: response.data.nombre,
                descripcion: response.data.descripcion || '',
                codigo: response.data.codigo || '',
                codigoInterno: response.data.codigoInterno,
                precioVenta: response.data.precioVenta,
                precioCosto: response.data.precioCosto,
                fechaVencimiento: response.data.fechaVencimiento
                  ? new Date(response.data.fechaVencimiento)
                  : null,
                stockActual: response.data.stockActual,
                stockMinimo: response.data.stockMinimo,
                categoria: response.data.categoria,
                activo: response.data.activo,
              });
            },
            error: (error) => {
              console.error(error);
              this.httpErrorHandler.showErrorToast(error);
            },
          });
        }
      },
      error: (error) => {
        console.error('Error al cargar categorías:', error);
        this.httpErrorHandler.showErrorToast(error);
      },
    });
  }

  cerrar(): void {
    if (this.refDialog) {
      this.refDialog.close();
    }
  }

  guardar(): void {
    this.formEnviado = true;

    // Check authorization before submitting
    if (this.productoId && !this.authorizationService.canEditProducto()) {
      this.toastNotificationService.showError(
        'No autorizado',
        'No tiene permisos para editar productos',
      );
      this.cerrar();
      return;
    }

    if (!this.productoId && !this.authorizationService.canCreateProducto()) {
      this.toastNotificationService.showError(
        'No autorizado',
        'No tiene permisos para crear productos',
      );
      this.cerrar();
      return;
    }

    if (this.formGroupProducto.invalid) {
      this.formGroupProducto.markAllAsTouched();
      this.toastNotificationService.showError(
        'Por favor, complete todos los campos requeridos correctamente.',
      );
      return;
    }

    const formValue = this.formGroupProducto.value;

    if (this.productoId && this.productoId > 0) {
      const updateProductoRequest: UpdateProductoRequest = {
        nombre: formValue.nombre.trim(),
        descripcion: formValue.descripcion?.trim() || null,
        precioVenta: formValue.precioVenta,
        precioCosto: formValue.precioCosto,
        fechaVencimiento: formValue.fechaVencimiento,
        stockMinimo: formValue.stockMinimo,
        idCategoria: formValue.categoria.id,
        activo: formValue.activo,
      };

      this.productoService
        .update(this.productoId, updateProductoRequest)
        .subscribe({
          next: () => {
            this.toastNotificationService.showSuccess(
              'Producto actualizado exitosamente.',
            );

            if (this.refDialog) {
              this.refDialog.close();
            }
          },
          error: (error) => {
            console.error('Error al actualizar producto:', error);
            this.httpErrorHandler.showErrorToast(error);
          },
        });
    } else {
      const createProductoRequest: CreateProductoRequest = {
        nombre: formValue.nombre.trim(),
        descripcion: formValue.descripcion?.trim() || null,
        codigo: formValue.codigo?.trim() || null,
        codigoInterno: formValue.codigoInterno.trim(),
        precioVenta: formValue.precioVenta,
        precioCosto: formValue.precioCosto,
        fechaVencimiento: formValue.fechaVencimiento,
        stockActual: formValue.stockActual,
        stockMinimo: formValue.stockMinimo,
        idCategoria: formValue.categoria.id,
      };

      this.productoService.create(createProductoRequest).subscribe({
        next: (response) => {
          this.toastNotificationService.showSuccess(
            'Producto creado exitosamente.',
          );

          if (this.refDialog) {
            this.refDialog.close(response);
          }
        },
        error: (error) => {
          console.error('Error al crear producto:', error);
          this.httpErrorHandler.showErrorToast(error);
        },
      });
    }
  }
}
