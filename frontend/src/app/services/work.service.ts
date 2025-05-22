// frontend/src/app/services/work.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// DTO que enviamos al back
export interface WorkRequest {
  pieceId: string;
  doctorId: string;
  productionTime?: string;
  deliveryDate?: string;
  cost?: number;
  status: 'pendiente' | 'enProgreso' | 'completado';
}

// Modelo que recibimos del back
export interface Work {
  _id?: string;
  pieceId: { _id: string; name: string };
  doctorId: { _id: string; name: string; address?: string };
  technicianId?: string;
  deliveryDate?: string;
  productionTime?: string;
  cost?: number;
  status: 'pendiente' | 'enProgreso' | 'completado';
}

@Injectable({ providedIn: 'root' })
export class WorkService {
  private api = '/api/works';

  constructor(private http: HttpClient) {}

  getWorks(): Observable<Work[]> {
    return this.http.get<Work[]>(this.api);
  }

  createWork(w: WorkRequest): Observable<Work> {
    return this.http.post<Work>(this.api, w);
  }

  updateWork(id: string, w: WorkRequest): Observable<Work> {
    return this.http.put<Work>(`${this.api}/${id}`, w);
  }

  deleteWork(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.api}/${id}`);
  }

  updateStatus(id: string, status: 'enProgreso' | 'completado') {
    
    return this.http.patch<{ message: string; status: string }>(
      `${this.api}/${id}/status`,
      { status }
    );
  }
}
