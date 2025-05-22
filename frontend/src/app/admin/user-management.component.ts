import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserService, User, PendingUser } from '../services/user.service';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  pending: PendingUser[] = [];

  form = { name: '', email: '', password: '', role: 'technician' };
  editMode = false;
  editId = '';
  roles = ['admin', 'technician', 'delivery'];

  constructor(private svc: UserService) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.svc.getUsers().subscribe(u => (this.users = u));
    this.svc.getPending().subscribe(p => (this.pending = p));
  }

  createUser() {
    this.svc.createUser(this.form).subscribe(() => {
      this.resetForm();
      this.load();
    });
  }

  updateUser() {
    if (!this.editId) return;
    const data: any = { name: this.form.name, email: this.form.email, role: this.form.role };
    if (this.form.password) data.password = this.form.password;
    this.svc.updateUser(this.editId, data).subscribe(() => {
      this.resetForm();
      this.load();
    });
  }

  approve(id: string) {
    this.svc.approve(id).subscribe(() => this.load());
  }
  reject(id: string) {
    this.svc.reject(id).subscribe(() => this.load());
  }

  edit(u: User) {
    this.editMode = true;
    this.editId = u.id;
    this.form = { name: u.name, email: u.email, password: '', role: u.role };
  }

  delete(id: string) {
    if (!confirm('¿Eliminar usuario?')) return;
    this.svc.deleteUser(id).subscribe(() => this.load());
  }

  resetForm() {
    this.editMode = false;
    this.editId = '';
    this.form = { name: '', email: '', password: '', role: 'technician' };
  }
}
