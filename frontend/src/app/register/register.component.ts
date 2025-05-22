//src/app/register/resgister.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  msg = '';
  form = {
    name: '', email: '', password: '',
    phone: '', address: '', roleRequested: 'technician' as 'technician' | 'delivery'
  };

  constructor(private auth: AuthService, private router: Router) {}

  submit() {
    this.auth.register(this.form).subscribe({
      next: r => {
        this.msg = r.message;
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: e => this.msg = e.error?.error || 'Error de registro'
    });
  }
}
