// frontend/src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'technician' | 'delivery' | 'pending';
  phone?: string;       
  address?: string;     
  createdAt?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSub = new BehaviorSubject<User | null>(null);
  user$ = this.userSub.asObservable();

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('token');
    const usr = localStorage.getItem('user');
    if (token && usr) this.userSub.next(JSON.parse(usr));
  }

  login(email: string, password: string) {
    return this.http
      .post<{ token: string; user: User }>('/api/auth/login', { email, password })
      .pipe(
        tap(res => {
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(res.user));
          this.userSub.next(res.user);
        })
      );
  }

  register(data: {
    name: string;
    email: string;
    password: string;
    phone: string;
    address: string;
    roleRequested: 'technician' | 'delivery';
  }) {
    return this.http.post<{ message: string }>('/api/auth/register', data);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.userSub.next(null);
  }
}
