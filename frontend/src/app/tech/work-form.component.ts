// frontend/src/app/tech/work-form.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule }       from '@angular/common';
import { FormsModule }        from '@angular/forms';
import {
  RouterModule,
  ActivatedRoute,
  Router
} from '@angular/router';
import { Piece, PieceService }   from '../services/piece.service';
import { Doctor, DoctorService } from '../services/doctor.service';
import {
  WorkRequest,
  WorkService,
  Work
} from '../services/work.service';

@Component({
  selector: 'app-work-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './work-form.component.html',
  styleUrls: ['./work-form.component.css']
})
export class WorkFormComponent implements OnInit {
  form: WorkRequest = {
    pieceId: '',
    doctorId: '',
    productionTime: '',
    deliveryDate: '',
    cost: 0,
    status: 'pendiente'
  };
  pieces: Piece[] = [];
  doctors: Doctor[] = [];
  editMode = false;
  id?: string;

  constructor(
    private svc: WorkService,
    private pieceSvc: PieceService,
    private docSvc: DoctorService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.pieceSvc.getPieces().subscribe(d => (this.pieces = d));
    this.docSvc.list().subscribe(d => (this.doctors = d));

    this.route.queryParams.subscribe(q => {
      if (q['date']) {
        this.form.deliveryDate = q['date'];
      }
    });

    this.route.params.subscribe(p => {
      if (p['id']) {
        this.editMode = true;
        this.id = p['id'];
        this.svc.getWorks().subscribe((ws: Work[]) => {
          const w = ws.find(x => x._id === this.id)!;
          const raw = new Date(w.deliveryDate || '');
          const yyyy = raw.getFullYear();
          const mm = String(raw.getMonth() + 1).padStart(2, '0');
          const dd = String(raw.getDate()).padStart(2, '0');
          this.form = {
            pieceId: w.pieceId._id,
            doctorId: w.doctorId._id,
            productionTime: w.productionTime || '',
            deliveryDate: `${yyyy}-${mm}-${dd}`,
            cost: w.cost || 0,
            status: w.status    // ya en español
          };
        });
      }
    });
  }

  submit(): void {
    const [y, m, d] = (this.form.deliveryDate || '')
      .split('-')
      .map(n => +n);
    const localMidnight = new Date(y, m - 1, d);
    const payload: WorkRequest = {
      ...this.form,
      deliveryDate: localMidnight.toISOString()
    };

    const obs = this.editMode && this.id
      ? this.svc.updateWork(this.id, payload)
      : this.svc.createWork(payload);

    obs.subscribe(() => this.router.navigate(['/tech/works']));
  }
}
