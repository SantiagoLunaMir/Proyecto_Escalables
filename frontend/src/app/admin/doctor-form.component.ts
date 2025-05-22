import { Component, OnInit, inject } from '@angular/core';
import { CommonModule }         from '@angular/common';
import { FormsModule, NgForm }  from '@angular/forms';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';

import { DoctorService, Doctor } from './doctor.service';

@Component({
  selector: 'app-doctor-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './doctor-form.component.html',
  styleUrls: ['./doctor-form.component.css']
})
export class DoctorFormComponent implements OnInit {
  private svc = inject(DoctorService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  model: Doctor = { name: '', address: '', phone: '', email: '' };
  isNew = true;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isNew = false;
      this.svc.get(id).subscribe(d => (this.model = d));
    }
  }

  submit(f: NgForm): void {
    if (f.invalid) return;
    const obs = this.isNew
      ? this.svc.create(this.model)
      : this.svc.update(this.model._id!, this.model);
    obs.subscribe(() => this.router.navigate(['/admin/doctors']));
  }
}
