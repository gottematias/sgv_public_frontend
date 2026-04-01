import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { ToastNotificationService } from '../../../../services/toast-notification.service';
import {
  RoundingService,
  type RoundingOption,
} from '../../../../services/rounding.service';
import { PagoEstadoEnum } from '../../../../constants/pago-estado.enum';
import type { Persona } from '../../../../models/persona.interfaces';
import type {
  MetodoPago,
  PagoEstado,
} from '../../../../models/venta.interfaces';
import type { ItemVenta } from '../venta-items/venta-items.component';

export interface PagoVenta {
  idMetodoPago: number;
  nombreMetodo: string;
  idEstado: number;
  nombreEstado: string;
  monto: number;
  montoBonificado: number | null;
  referencia: string | null;
  requiereReferencia: boolean;
}

@Component({
  selector: 'app-venta-pagos',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputNumberModule,
    SelectModule,
    InputTextModule,
    TooltipModule,
    ButtonModule,
    TagModule,
  ],
  templateUrl: './venta-pagos.component.html',
  styleUrl: './venta-pagos.component.css',
})
export class VentaPagosComponent implements OnInit, OnDestroy, OnChanges {
  @Input() formGroupVenta!: FormGroup;
  @Input() pagos: PagoVenta[] = [];
  @Input() personas: Persona[] = [];
  @Input() metodosPago: MetodoPago[] = [];
  @Input() estadosPago: PagoEstado[] = [];
  @Input() items: ItemVenta[] = [];
  @Input() total = 0;
  @Input() subtotalItems = 0;

  @Output() pagoAdded = new EventEmitter<PagoVenta[]>();

  formulariosPagos: FormGroup[] = [];
  roundingOptions: RoundingOption[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private readonly toastNotificationService: ToastNotificationService,
    private readonly roundingService: RoundingService,
  ) {}

  ngOnInit(): void {
    this.inicializarFormulariosPago();
    this.updateRoundingOptions();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['subtotalItems']) {
      this.updateRoundingOptions();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  inicializarFormulariosPago(): void {
    // Create first payment form by default
    this.agregarFormularioPago();
  }

  agregarFormularioPago(): void {
    if (this.formulariosPagos.length >= 2) {
      return; // Max 2 payments
    }

    const newForm = new FormGroup({
      metodoPago: new FormControl<MetodoPago | null>(null, [
        Validators.required,
      ]),
      estadoPago: new FormControl<PagoEstado | null>(null, [
        Validators.required,
      ]),
      monto: new FormControl<number | null>(0, [
        Validators.required,
        Validators.min(0.01),
      ]),
      montoBonificado: new FormControl<number | null>(0, [Validators.min(0)]),
      referencia: new FormControl<string>('', [Validators.maxLength(255)]),
    });

    // Pre-select first method and "Aprobado" state
    if (this.metodosPago.length > 0) {
      newForm.patchValue({ metodoPago: this.metodosPago[0] });
    }
    const estadoAprobado = this.estadosPago.find(
      (e) => e.id === PagoEstadoEnum.APROBADO,
    );
    if (estadoAprobado) {
      newForm.patchValue({ estadoPago: estadoAprobado });
    }

    this.formulariosPagos.push(newForm);

    // Subscribe to form valueChanges for automatic emission
    this.subscribeToFormChanges(newForm);
  }

  eliminarFormularioPago(index: number): void {
    if (this.formulariosPagos.length <= 1) {
      // Prevent deleting the last form - always keep at least 1
      this.toastNotificationService.showWarning(
        'Debe mantener al menos un formulario de pago.',
      );
      return;
    }

    if (index < 0 || index >= this.formulariosPagos.length) {
      return; // Invalid index
    }

    // Remove form from array
    this.formulariosPagos.splice(index, 1);

    // Re-emit payments to update parent with remaining valid forms
    this.emitirPagos();

    this.toastNotificationService.showSuccess('Formulario de pago eliminado.');
  }

  private subscribeToFormChanges(form: FormGroup): void {
    form.valueChanges
      .pipe(
        debounceTime(100), // Wait 100ms after user stops typing for faster updates
        distinctUntilChanged(),
        takeUntil(this.destroy$),
      )
      .subscribe(() => {
        this.emitirPagos();
      });
  }

  private emitirPagos(): void {
    const pagosValidos: PagoVenta[] = [];

    for (const form of this.formulariosPagos) {
      if (!form.valid) {
        continue; // Skip invalid forms
      }

      const formValue = form.value;
      const metodoPago = formValue.metodoPago;
      const estadoPago = formValue.estadoPago;
      const monto = Number(formValue.monto || 0);

      if (!metodoPago || !estadoPago || isNaN(monto) || monto <= 0) {
        continue; // Skip incomplete forms
      }

      // Validate reference requirement
      const referencia = formValue.referencia?.trim() || null;
      if (metodoPago.requiereReferencia && !referencia) {
        continue; // Skip if reference required but missing
      }

      const montoBonificado = Number(formValue.montoBonificado ?? 0);

      pagosValidos.push({
        idMetodoPago: metodoPago.id,
        nombreMetodo: metodoPago.nombre,
        idEstado: estadoPago.id,
        nombreEstado: estadoPago.nombre,
        monto,
        montoBonificado,
        referencia,
        requiereReferencia: metodoPago.requiereReferencia,
      });
    }

    // Emit all valid payments as a single array
    this.pagoAdded.emit(pagosValidos);
  }

  puedeAgregarSegundoPago(): boolean {
    if (this.formulariosPagos.length >= 2) {
      return false; // Already have 2 forms
    }

    // First form must have valid data
    const primerForm = this.formulariosPagos[0];
    if (!primerForm) {
      return false;
    }

    const monto = primerForm.value.monto || 0;
    return primerForm.valid && monto > 0;
  }

  onMetodoPagoChange(index: number, metodoPago: MetodoPago | null): void {
    const form = this.formulariosPagos[index];
    if (form && metodoPago && !metodoPago.requiereReferencia) {
      form.patchValue({
        referencia: '',
      });
    }
  }

  getTotalPagado(): number {
    return this.pagos
      .filter((pago) => pago.nombreEstado.toLowerCase() === 'aprobado')
      .reduce((sum, pago) => {
        const monto = Number(pago.monto);
        const bonificado = Number(pago.montoBonificado ?? 0);
        return (
          sum +
          (isNaN(monto) ? 0 : monto) +
          (isNaN(bonificado) ? 0 : bonificado)
        );
      }, 0);
  }

  getSaldoPendiente(): number {
    return Math.max(0, this.total - this.getTotalPagado());
  }

  getMaxAjusteRedondeo(): number {
    return this.getSaldoPendiente();
  }

  getPagosPendientes(): number {
    return this.pagos.filter((p) => p.nombreEstado.toLowerCase() !== 'aprobado')
      .length;
  }

  getPersonaLabel(persona: Persona): string {
    return `${persona.apellidos}, ${persona.nombres}`;
  }

  getMaxMontoPago(index: number): number {
    // Start with total venta amount
    let saldoRestante = Number(this.total);

    // Only subtract montoBonificado from current form (index)
    const currentForm = this.formulariosPagos[index];
    if (currentForm) {
      const montoBonificado = Number(currentForm.value.montoBonificado ?? 0);
      saldoRestante -= isNaN(montoBonificado) ? 0 : montoBonificado;
    }

    // Subtract amounts from OTHER forms (not current index)
    for (let i = 0; i < this.formulariosPagos.length; i++) {
      if (i !== index) {
        const form = this.formulariosPagos[i];
        const estadoPago = form.value.estadoPago;
        if (estadoPago && estadoPago.id === PagoEstadoEnum.APROBADO) {
          const monto = Number(form.value.monto || 0);
          const montoBonificado = Number(form.value.montoBonificado ?? 0);
          saldoRestante -=
            (isNaN(monto) ? 0 : monto) +
            (isNaN(montoBonificado) ? 0 : montoBonificado);
        }
      }
    }

    return Math.max(0, saldoRestante);
  }

  getMaxMontoBonificado(index: number): number {
    // Start with total venta amount
    let saldoRestante = Number(this.total);

    // Only subtract monto from current form (index)
    const currentForm = this.formulariosPagos[index];
    if (currentForm) {
      const monto = Number(currentForm.value.monto || 0);
      saldoRestante -= isNaN(monto) ? 0 : monto;
    }

    // Subtract amounts from OTHER forms (not current index)
    for (let i = 0; i < this.formulariosPagos.length; i++) {
      if (i !== index) {
        const form = this.formulariosPagos[i];
        const estadoPago = form.value.estadoPago;
        if (estadoPago && estadoPago.id === PagoEstadoEnum.APROBADO) {
          const monto = Number(form.value.monto || 0);
          const montoBonificado = Number(form.value.montoBonificado ?? 0);
          saldoRestante -=
            (isNaN(monto) ? 0 : monto) +
            (isNaN(montoBonificado) ? 0 : montoBonificado);
        }
      }
    }

    return Math.max(0, saldoRestante);
  }

  private updateRoundingOptions(): void {
    this.roundingOptions = this.roundingService.calculateRoundingOptions(
      this.subtotalItems,
    );
  }

  aplicarRedondeo(option: RoundingOption): void {
    this.formGroupVenta.patchValue({
      montoAjusteRedondeo: option.adjustment,
    });
    this.toastNotificationService.showSuccess(
      `Ajuste aplicado: ${option.label}`,
    );
  }
}
