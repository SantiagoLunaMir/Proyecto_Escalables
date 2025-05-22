import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService, User } from '../services/auth.service';
import { Observable } from 'rxjs';

interface MenuItem {
  label: string;
  path:  string;
  roles: string[];
  adminOverride?: string;   // ruta alternativa si el usuario es admin
}

@Component({
  selector: 'app-nav-menu',
  standalone: true,
  imports: [ CommonModule, RouterLink ],
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css'],
  host: { class: 'nav-menu' }
})
export class NavMenuComponent {
  user$: Observable<User|null>;
  open = false;

  private menu: MenuItem[] = [
    /* --- público / todos los roles --- */
    { label: 'Home',     path: '/',           roles: ['guest','technician','delivery','admin'] },
    { label: 'Catálogo', path: '/catalog',    roles: ['guest','technician','delivery','admin'],
      adminOverride: '/admin/pieces' },   // para admin redirige a inventario

    /* --- técnico --- */
    { label: 'Trabajos',   path: '/tech/works',    roles: ['technician','admin'] },
    { label: 'Calendario', path: '/tech/calendar', roles: ['technician','admin'] },

    /* --- repartidor --- */
    { label: 'Entregas',   path: '/tech/deliveries', roles: ['delivery','admin'] },

    /* --- administración --- */
    { label: 'Gestionar usuarios',  path: '/admin/users',   roles: ['admin'] },
    { label: 'Gestionar doctores',  path: '/admin/doctors', roles: ['admin'] },

    /* --- perfil --- */
    { label: 'Perfil', path: '/profile', roles: ['technician','delivery','admin'] }
  ];

  constructor(private auth: AuthService) {
    this.user$ = this.auth.user$;
  }

  toggle(): void { this.open = !this.open; }

  /** Devuelve menú filtrado por rol y con rutas ajustadas para admin */
  allowedItems(user: User | null) {
    const role = (user?.role ?? 'guest').toLowerCase();
    return this.menu
      .filter(item => item.roles.some(r => r.toLowerCase() === role))
      .map(item =>
        (role === 'admin' && item.adminOverride)
          ? { ...item, path: item.adminOverride }
          : item
      );
  }

  logout(): void {
    this.auth.logout();
    this.open = false;
  }
}
