import { Component }      from '@angular/core';
import { CommonModule }   from '@angular/common';
import { RouterOutlet, RouterLink, RouterModule } from '@angular/router';
import { AuthService, User } from './services/auth.service';
import { Router }         from '@angular/router';
import { Observable }     from 'rxjs';
import { NavMenuComponent } from './nav-menu/nav-menu.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    NavMenuComponent,
    RouterModule,    // para routerLink
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  user$: Observable<User|null>;

  constructor(
    private auth: AuthService,
    private router: Router
  ) {
    this.user$ = this.auth.user$;
  }

  // ESTE método debe existir para que el botón funcione
  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
