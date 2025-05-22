import { Route } from '@angular/router';

/* ---------- Componentes públicos ---------- */
import { HomeComponent }          from './public/home/home.component';
import { CatalogComponent }       from './catalog/catalog.component';
import { PieceDetailComponent }   from './catalog/piece-detail.component';

/* ---------- Administración ---------- */
import { UserManagementComponent }   from './admin/user-management.component';
import { DoctorManagementComponent } from './admin/doctor-management.component';
import { PieceListComponent }        from './admin/piece-list/piece-list.component';
import { PieceFormComponent }        from './admin/piece-form/piece-form.component';

/* ---------- Técnico / Repartidor ---------- */
import { WorkListComponent }      from './tech/work-list.component';
import { WorkFormComponent }      from './tech/work-form.component';
import { CalendarComponent }      from './tech/calendar.component';
import { DeliveryListComponent }  from './tech/delivery-list.component';

/* ---------- Perfil & Auth ---------- */
import { ProfileComponent }       from './profile/profile.component';
import { LoginComponent }         from './login/login.component';
import { RegisterComponent }      from './register/register.component';

/* ---------- Guards ---------- */
import { AuthGuard }              from './guards/auth.guard';
import { RoleGuard }              from './guards/role.guard';

export const routes: Route[] = [
  /* Página inicial con formulario + catálogo simple */
  { path: '', component: HomeComponent },

  /* Catálogo público “bonito” */
  { path: 'catalog', component: CatalogComponent },
  { path: 'catalog/:id', component: PieceDetailComponent },

  /* Autenticación */
  { path: 'login',    component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  /* Administración */
  {
    path: 'admin',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin'] },
    children: [
      { path: 'users',           component: UserManagementComponent },
      { path: 'doctors',         component: DoctorManagementComponent },
      { path: 'pieces',          component: PieceListComponent },
      { path: 'pieces/new',      component: PieceFormComponent },
      { path: 'pieces/edit/:id', component: PieceFormComponent },
      { path: '', redirectTo: 'pieces', pathMatch: 'full' }
    ]
  },

  /* Técnico / Repartidor */
  {
    path: 'tech',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin', 'technician', 'delivery'] },
    children: [
      { path: 'works',      component: WorkListComponent },
      { path: 'works/new',  component: WorkFormComponent },
      { path: 'works/edit/:id', component: WorkFormComponent },
      { path: 'calendar',   component: CalendarComponent },
      { path: 'deliveries', component: DeliveryListComponent },
      { path: '', redirectTo: 'works', pathMatch: 'full' }
    ]
  },

  /* Perfil */
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },

  /* Wildcard */
  { path: '**', redirectTo: '' }  // vuelve a Home
];
