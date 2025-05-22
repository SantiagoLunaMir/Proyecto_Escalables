// frontend/src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'technician' | 'delivery' | 'pending';
  createdAt?: string;
  phone?: string;
  address?: string;
}

export interface PendingUser {
  _id: string;
  name: string;
  email: string;
  roleRequested: 'technician' | 'delivery';
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private api = '/api/users';

  constructor(private http: HttpClient) {}

  /* --------- CRUD clásico (ya lo tenías) ------------------- */
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.api);
  }

  createUser(body: { name: string; email: string; password: string; role: string }): Observable<User> {
    return this.http.post<User>(this.api, body);
  }

  updateUser(id: string, body: { name: string; email: string; role: string; password?: string }) {
    return this.http.put<{ message: string }>(`${this.api}/${id}`, body);
  }

  deleteUser(id: string) {
    return this.http.delete<{ message: string }>(`${this.api}/${id}`);
  }

  /* --------- NUEVO: flujo de aprobación -------------------- */
  /** Lista de usuarios pendientes de aprobación */
  getPending(): Observable<PendingUser[]> {
    return this.http.get<PendingUser[]>(`${this.api}/pending`);
  }

  /** Aprobar usuario pendiente (pasa a su rol solicitado) */
  approve(id: string) {
    // El endpoint en backend usa router.patch, así que aquí usamos PATCH
    return this.http.patch<{ message: string }>(`${this.api}/${id}/approve`, {});
  }

  /** Rechazar usuario pendiente */
  reject(id: string) {
    // Mismo caso: PATCH en lugar de PUT
    return this.http.patch<{ message: string }>(`${this.api}/${id}/reject`, {});
  }

  /* -------- PERFIL -------- */
  getMe(): Observable<User> {
    return this.http.get<User>(`${this.api}/me`);
  }

  updateMe(body: { name?: string; phone?: string; address?: string; password?: string }) {
    return this.http.put<{ message: string; user: User }>(`${this.api}/me`, body);
  }
}
