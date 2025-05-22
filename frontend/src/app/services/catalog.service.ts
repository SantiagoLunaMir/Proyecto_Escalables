import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PublicPiece {
  _id: string;
  name: string;
  description: string;
  price: number;
  estimatedTime: number;
  images: string[];
}

@Injectable({ providedIn: 'root' })
export class CatalogService {
  private api = '/api/public/pieces';

  constructor(private http: HttpClient) {}

  /** Lista paginada */
  list(opts: { page: number; limit: number; q?: string }): Observable<{
    page: number;
    pages: number;
    total: number;
    results: PublicPiece[];
  }> {
    let params = new HttpParams()
      .set('page', opts.page)
      .set('limit', opts.limit);

    if (opts.q) params = params.set('q', opts.q);

    return this.http.get<any>(this.api, { params });
  }

  /** Detalle */
  get(id: string): Observable<PublicPiece> {
    return this.http.get<PublicPiece>(`${this.api}/${id}`);
  }
}
