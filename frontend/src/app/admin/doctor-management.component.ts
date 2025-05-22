import { Component, OnInit } from '@angular/core';
import { CommonModule }      from '@angular/common';
import { FormsModule }       from '@angular/forms';
import { Doctor, DoctorService } from '../services/doctor.service';
import { RouterModule }      from '@angular/router';

@Component({
  selector: 'app-doctor-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './doctor-management.component.html',
  styleUrls: ['./doctor-management.component.css']
})
export class DoctorManagementComponent implements OnInit {
  doctors: Doctor[] = [];
  form: Doctor = {
    name: '',
    specialty: '',
    contactInfo: '',
    address: '',
    notes: ''
  };
  editMode = false;
  editId?: string;

  constructor(private svc: DoctorService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.svc.list().subscribe(data => this.doctors = data);
  }

  submit(): void {
    if (this.editMode && this.editId) {
      this.svc.update(this.editId, this.form)
        .subscribe(() => { this.resetForm(); this.load(); });
    } else {
      this.svc.create(this.form)
        .subscribe(() => { this.resetForm(); this.load(); });
    }
  }

  edit(doc: Doctor): void {
    this.editMode = true;
    this.editId = doc._id;
    this.form = { ...doc };
  }

  delete(id: string): void {
    if (!confirm('¿Eliminar doctor?')) return;
    this.svc.delete(id).subscribe(() => this.load());
  }

  resetForm(): void {
    this.editMode = false;
    this.editId = undefined;
    this.form = {
      name: '',
      specialty: '',
      contactInfo: '',
      address: '',
      notes: ''
    };
  }
}
