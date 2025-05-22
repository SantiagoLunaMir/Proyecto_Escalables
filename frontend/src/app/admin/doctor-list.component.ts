import { Component, OnInit, inject } from '@angular/core';
import { CommonModule }    from '@angular/common';
import { FormsModule }     from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

import { DoctorService, Doctor } from '../services/doctor.service';

@Component({
  selector: 'app-doctor-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './doctor-list.component.html',
  styleUrls: ['./doctor-list.component.css']
})
export class DoctorListComponent implements OnInit {
  private svc = inject(DoctorService);
  private router = inject(Router);

  doctors: Doctor[] = [];
  loading = false;
  q = '';

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.svc.list(this.q).subscribe({
      next: list => (this.doctors = list),
      complete: () => (this.loading = false)
    });
  }

  edit(id: string): void {
    this.router.navigate(['/admin/doctors/edit', id]);
  }

  create(): void {
    this.router.navigate(['/admin/doctors/new']);
  }

  delete(id: string): void {
    if (!confirm('¿Eliminar doctor?')) return;
    this.svc.delete(id).subscribe(() => this.load());
  }
}
