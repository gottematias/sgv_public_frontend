import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface BackupInfo {
  nombre: string;
  fecha: string;
  tamano: number;
}

export interface BackupListResponse {
  data: BackupInfo[];
  code: number;
  error: string | null;
}

export interface BackupActionResponse {
  data: { mensaje: string } | null;
  code: number;
  error: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class BackupService {
  private readonly API_URL: string;

  constructor(private readonly http: HttpClient) {
    this.API_URL = environment.apiUrl.toLowerCase();
  }

  descargarBackup(): Observable<Blob> {
    return this.http.get(`${this.API_URL}/backup`, { responseType: 'blob' });
  }

  restaurarBackup(file: File): Observable<BackupActionResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<BackupActionResponse>(
      `${this.API_URL}/backup/restore`,
      formData,
    );
  }

  listarBackupsProgramados(): Observable<BackupListResponse> {
    return this.http.get<BackupListResponse>(
      `${this.API_URL}/backup/programados`,
    );
  }

  descargarBackupProgramado(nombre: string): Observable<Blob> {
    return this.http.get(
      `${this.API_URL}/backup/programados/${encodeURIComponent(nombre)}`,
      { responseType: 'blob' },
    );
  }

  eliminarBackupProgramado(nombre: string): Observable<BackupActionResponse> {
    return this.http.delete<BackupActionResponse>(
      `${this.API_URL}/backup/programados/${encodeURIComponent(nombre)}`,
    );
  }

  restaurarBackupProgramado(nombre: string): Observable<BackupActionResponse> {
    return this.http.post<BackupActionResponse>(
      `${this.API_URL}/backup/programados/${encodeURIComponent(nombre)}/restaurar`,
      {},
    );
  }
}
