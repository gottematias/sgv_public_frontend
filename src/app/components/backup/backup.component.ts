import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DividerModule } from 'primeng/divider';
import { FileUploadModule } from 'primeng/fileupload';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService } from 'primeng/api';
import { BackupService, BackupInfo } from '../../services/backup.service';
import { HttpErrorHandlerService } from '../../services/http-error-handler.service';
import { ToastNotificationService } from '../../services/toast-notification.service';

@Component({
  selector: 'app-backup',
  imports: [
    ButtonModule,
    CardModule,
    ConfirmDialogModule,
    DatePipe,
    DividerModule,
    FileUploadModule,
    MessageModule,
    ProgressSpinnerModule,
    TableModule,
    TooltipModule,
  ],
  providers: [ConfirmationService],
  templateUrl: './backup.component.html',
})
export class BackupComponent implements OnInit {
  isLoading = false;
  isRestoring = false;
  isLoadingProgramados = false;
  isDescargandoProgramado = '';
  isRestaurandoProgramado = '';
  isEliminandoProgramado = '';
  backupsProgramados: BackupInfo[] = [];

  constructor(
    private readonly backupService: BackupService,
    private readonly confirmationService: ConfirmationService,
    private readonly httpErrorHandler: HttpErrorHandlerService,
    private readonly toastNotificationService: ToastNotificationService,
  ) {}

  ngOnInit(): void {
    this.cargarBackupsProgramados();
  }

  descargarBackup(): void {
    this.isLoading = true;
    this.backupService.descargarBackup().subscribe({
      next: (blob) => {
        const fecha = new Date().toISOString().split('T')[0];
        const filename = `backup_sgv_${fecha}.dump`;
        this.triggerDownload(blob, filename);
        this.isLoading = false;
      },
      error: (error) => {
        this.httpErrorHandler.showErrorToast(
          error,
          'Error al generar el backup',
        );
        this.isLoading = false;
      },
    });
  }

  onArchivoSeleccionado(event: { files: File[] }): void {
    const file = event.files[0];
    if (!file) return;

    this.confirmationService.confirm({
      message:
        '¿Está seguro que desea restaurar la base de datos? Esta operación es <strong>destructiva e irreversible</strong>. Todos los datos actuales serán reemplazados por los del archivo seleccionado.',
      header: 'Confirmar restauración',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, restaurar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.ejecutarRestore(file),
    });
  }

  cargarBackupsProgramados(): void {
    this.isLoadingProgramados = true;
    this.backupService.listarBackupsProgramados().subscribe({
      next: (response) => {
        this.backupsProgramados = response.data ?? [];
        this.isLoadingProgramados = false;
      },
      error: (error) => {
        this.httpErrorHandler.showErrorToast(
          error,
          'Error al cargar los backups programados',
        );
        this.isLoadingProgramados = false;
      },
    });
  }

  descargarBackupProgramado(backup: BackupInfo): void {
    this.isDescargandoProgramado = backup.nombre;
    this.backupService.descargarBackupProgramado(backup.nombre).subscribe({
      next: (blob) => {
        this.triggerDownload(blob, backup.nombre);
        this.isDescargandoProgramado = '';
      },
      error: (error) => {
        this.httpErrorHandler.showErrorToast(
          error,
          'Error al descargar el backup',
        );
        this.isDescargandoProgramado = '';
      },
    });
  }

  eliminarBackupProgramado(backup: BackupInfo): void {
    this.confirmationService.confirm({
      message: `¿Está seguro que desea eliminar el backup <strong>${backup.nombre}</strong>? Esta operación es <strong>irreversible</strong>.`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.ejecutarEliminacion(backup),
    });
  }

  restaurarDesdeBackupProgramado(backup: BackupInfo): void {
    this.confirmationService.confirm({
      message: `¿Está seguro que desea restaurar la base de datos desde <strong>${backup.nombre}</strong>? Esta operación es <strong>destructiva e irreversible</strong>. Todos los datos actuales serán reemplazados.`,
      header: 'Confirmar restauración',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, restaurar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.ejecutarRestoreProgramado(backup),
    });
  }

  formatearTamano(bytes: number): string {
    if (bytes >= 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    }
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  private ejecutarRestore(file: File): void {
    this.isRestoring = true;
    this.backupService.restaurarBackup(file).subscribe({
      next: () => {
        this.toastNotificationService.showSuccess(
          'Base de datos restaurada correctamente',
        );
        this.isRestoring = false;
      },
      error: (error) => {
        this.httpErrorHandler.showErrorToast(
          error,
          'Error al restaurar la base de datos',
        );
        this.isRestoring = false;
      },
    });
  }

  private ejecutarEliminacion(backup: BackupInfo): void {
    this.isEliminandoProgramado = backup.nombre;
    this.backupService.eliminarBackupProgramado(backup.nombre).subscribe({
      next: () => {
        this.toastNotificationService.showSuccess('Backup eliminado correctamente');
        this.isEliminandoProgramado = '';
        this.cargarBackupsProgramados();
      },
      error: (error) => {
        this.httpErrorHandler.showErrorToast(error, 'Error al eliminar el backup');
        this.isEliminandoProgramado = '';
      },
    });
  }

  private ejecutarRestoreProgramado(backup: BackupInfo): void {
    this.isRestaurandoProgramado = backup.nombre;
    this.backupService.restaurarBackupProgramado(backup.nombre).subscribe({
      next: () => {
        this.toastNotificationService.showSuccess(
          'Base de datos restaurada correctamente',
        );
        this.isRestaurandoProgramado = '';
      },
      error: (error) => {
        this.httpErrorHandler.showErrorToast(
          error,
          'Error al restaurar la base de datos',
        );
        this.isRestaurandoProgramado = '';
      },
    });
  }

  private triggerDownload(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }
}
