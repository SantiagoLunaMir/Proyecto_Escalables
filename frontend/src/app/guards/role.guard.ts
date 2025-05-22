import { Injectable }                   from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot,UrlTree } from '@angular/router';
import { AuthService }                  from '../services/auth.service';
import { map }                          from 'rxjs/operators';
import { Observable }                   from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
    const allowedRoles = ((route.data['roles'] as string[]) || []).map(r => r.toLowerCase());

    return this.auth.user$.pipe(
      map(user => {
        const userRole = user?.role?.toLowerCase() ?? 'guest';

        if (allowedRoles.length === 0 || allowedRoles.includes(userRole)) {
          return true;
        }

        return this.router.createUrlTree(['/login']);
      })
    );
  }
}

