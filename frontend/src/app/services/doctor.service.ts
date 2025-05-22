import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Doctor {
  _id?: string;
  name: string;
  specialty: string;
  contactInfo: string;
  address: string;
  notes: string;
}

@Injectable({ providedIn: 'root' })
export class DoctorService {
  private api = '/api/doctors';

  constructor(private http: HttpClient) {}

  /** Listar (opcionalmente buscando por nombre) */
  list(search: string = ''): Observable<Doctor[]> {
    const params = search
      ? new HttpParams().set('q', search)
      : undefined;
    return this.http.get<Doctor[]>(this.api, { params });
  }

  get(id: string): Observable<Doctor> {
    return this.http.get<Doctor>(`${this.api}/${id}`);
  }

  create(doc: Doctor): Observable<Doctor> {
    return this.http.post<Doctor>(this.api, doc);
  }

  update(id: string, doc: Partial<Doctor>): Observable<Doctor> {
    return this.http.put<Doctor>(`${this.api}/${id}`, doc);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.api}/${id}`);
  }
}
