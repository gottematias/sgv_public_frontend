import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { ProductoService } from '../../../../services/producto.service';
import { ServicioService } from '../../../../services/servicio.service';
import { ToastNotificationService } from '../../../../services/toast-notification.service';
import {
  Subject,
  debounceTime,
  distinctUntilChanged,
  of,
  switchMap,
  forkJoin,
} from 'rxjs';

interface UnifiedItem {
  tipo: 'producto' | 'servicio';
  id: number;
  nombre: string;
  codigoInterno: string;
  precio: number;
  stockActual?: number;
  descripcion?: string;
}

export interface ItemVenta {
  tipo: 'producto' | 'servicio';
  id: number;
  nombre: string;
  codigoInterno: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  stockDisponible?: number;
}

@Component({
  selector: 'app-venta-items',
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    InputNumberModule,
    ButtonModule,
    DataViewModule,
    IconFieldModule,
    InputIconModule,
    TooltipModule,
  ],
  templateUrl: './venta-items.component.html',
  styleUrl: './venta-items.component.css',
})
export class VentaItemsComponent implements OnInit, OnDestroy {
  @Input() items: ItemVenta[] = [];

  @Output() itemSeleccionado = new EventEmitter<UnifiedItem>();
  @Output() itemRemoved = new EventEmitter<number>();
  @Output() cantidadActualizada = new EventEmitter<{
    index: number;
    cantidad: number;
  }>();

  searchQuery = '';
  searchSubject = new Subject<string>();
  searchResults: UnifiedItem[] = [];
  isSearching = false;

  constructor(
    private readonly productoService: ProductoService,
    private readonly servicioService: ServicioService,
    private readonly toastNotificationService: ToastNotificationService,
  ) {}

  ngOnInit(): void {
    this.setupSearchDebounce();
  }

  ngOnDestroy(): void {
    this.searchSubject.complete();
  }

  private setupSearchDebounce(): void {
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((query: string) => {
          if (!query || query.trim().length < 2) {
            this.searchResults = [];
            return of(null);
          }

          this.isSearching = true;

          return forkJoin({
            productos: this.productoService.list(query, undefined, 20, 0, true),
            servicios: this.servicioService.list(query, 20, 0, true),
          });
        }),
      )
      .subscribe({
        next: (response) => {
          this.isSearching = false;

          if (!response) {
            this.searchResults = [];
            return;
          }

          this.searchResults = [
            ...response.productos.data.map((p) => ({
              tipo: 'producto' as const,
              id: p.id,
              nombre: p.nombre,
              codigoInterno: p.codigoInterno,
              precio: p.precioVenta,
              stockActual: p.stockActual,
              descripcion: p.descripcion ?? undefined,
            })),
            ...response.servicios.data.map((s) => ({
              tipo: 'servicio' as const,
              id: s.id,
              nombre: s.nombre,
              codigoInterno: s.codigoInterno,
              precio: s.precio,
              descripcion: s.descripcion ?? undefined,
            })),
          ];
        },
        error: (error) => {
          this.isSearching = false;
          console.error('Error searching items:', error);
          this.toastNotificationService.showError('Error al buscar items');
          this.searchResults = [];
        },
      });
  }

  onSearchQueryChange(query: string): void {
    this.searchQuery = query;
    this.searchSubject.next(query);
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.searchResults = [];
  }

  onItemClick(item: UnifiedItem): void {
    this.itemSeleccionado.emit(item);
  }

  onEliminarItem(index: number): void {
    this.itemRemoved.emit(index);
  }

  onCantidadChange(index: number, cantidad: number): void {
    this.cantidadActualizada.emit({ index, cantidad });
  }

  getMaxCantidad(item: ItemVenta): number {
    if (item.tipo === 'producto' && item.stockDisponible !== undefined) {
      return Math.min(item.stockDisponible, 999);
    }
    return 999;
  }

  getSubtotalItems(): number {
    return this.items.reduce((sum, item) => {
      const subtotal = Number(item.subtotal);
      return sum + (isNaN(subtotal) ? 0 : subtotal);
    }, 0);
  }
}
