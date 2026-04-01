import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class ToastNotificationService {
  constructor(private readonly messageService: MessageService) {}

  showSuccess(summary: string, detail = '', life = 3000): void {
    this.messageService.add({
      severity: 'success',
      summary,
      detail,
      life,
    });
  }

  showError(summary: string, detail = '', life = 5000): void {
    this.messageService.add({
      severity: 'error',
      summary,
      detail,
      life,
    });
  }

  showInfo(summary: string, detail = '', life = 3000): void {
    this.messageService.add({
      severity: 'info',
      summary,
      detail,
      life,
    });
  }

  showWarning(summary: string, detail = '', life = 3000): void {
    this.messageService.add({
      severity: 'warn',
      summary,
      detail,
      life,
    });
  }

  clear(): void {
    this.messageService.clear();
  }
}
