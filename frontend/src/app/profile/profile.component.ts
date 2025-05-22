// frontend/src/app/profile/profile.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';
import { AuthService, User } from '../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-profile',
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user?: User;
  form = { name: '', phone: '', address: '', password: '', confirm: '' };
  msg = '';

  constructor(private userSvc: UserService, private auth: AuthService) {}

  ngOnInit(): void {
    this.userSvc.getMe().subscribe(u => {
      this.user = u;
      this.form.name = u.name;
      this.form.phone = u.phone ?? '';
      this.form.address = u.address ?? '';
    });
  }

  save() {
    if (this.form.password && this.form.password !== this.form.confirm) {
      this.msg = 'Las contraseñas no coinciden';
      return;
    }
    const body: any = {
      name: this.form.name,
      phone: this.form.phone,
      address: this.form.address
    };
    if (this.form.password) {
      body.password = this.form.password;
    }

    this.userSvc.updateMe(body).subscribe({
      next: r => {
        this.msg = r.message;
        const stored = JSON.parse(localStorage.getItem('user') || '{}');
        stored.name = body.name;
        localStorage.setItem('user', JSON.stringify(stored));
        (this.auth as any).userSub.next(stored);
        this.form.password = this.form.confirm = '';
      },
      error: e => (this.msg = e.error?.error || 'Error')
    });
  }
}
