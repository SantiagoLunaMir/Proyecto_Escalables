// src/app/services/delivery.service.ts
import { Injectable } from '@angular/core';
import { HttpClient }   from '@angular/common/http';
import { Observable }   from 'rxjs';
import { Work }         from './work.service';

export interface Delivery {
  _id:             string;
  driverId:        string;
  workId:          Work;
  status:          'pendiente' | 'entregado';
  amountCollected: number;
}

@Injectable({ providedIn: 'root' })
export class DeliveryService {
  private api = '/api';

  constructor(private http: HttpClient) {}

  /** Trabajos aún sin entrega */
  getAvailableWorks(): Observable<Work[]> {
    return this.http.get<Work[]>(`${this.api}/works/available`);
  }

  /** Asignar trabajos seleccionados a mi ruta */
  assign(workIds: string[]): Observable<Delivery[]> {
    return this.http.post<Delivery[]>(
      `${this.api}/deliveries/assign`,
      { workIds }
    );
  }

  /** Mis entregas del día (pendientes) */
  myDeliveries(): Observable<Delivery[]> {
    return this.http.get<Delivery[]>(`${this.api}/deliveries/today`);
  }

  /** Marcar entrega y registrar cobro */
  markDelivered(deliveryId: string, amount: number = 0): Observable<any> {
    return this.http.put(
      `${this.api}/deliveries/${deliveryId}/delivered`,
      { amountCollected: amount }
    );
  }

  /** Cancelar una entrega pendiente */
  cancelDelivery(deliveryId: string): Observable<any> {
    return this.http.delete(
      `${this.api}/deliveries/${deliveryId}`
    );
  }
}
