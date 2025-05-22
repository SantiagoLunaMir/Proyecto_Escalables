import { Component, OnInit } from '@angular/core';
import { CommonModule }       from '@angular/common';
import { FormsModule }        from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { Piece, PieceService } from '../../services/piece.service';

@Component({
  selector: 'app-piece-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './piece-form.component.html',
  styleUrls:   ['./piece-form.component.css']
})
export class PieceFormComponent implements OnInit {
  form = {
    name: '',
    description: '',
    estimatedTime: 1,
    technicianContact: ''
  };
  existingImages: string[] = [];
  selectedFiles: File[] = [];
  editMode = false;
  id!: string;

  constructor(
    private svc: PieceService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.editMode = true;
        this.id = params['id'];
        this.svc.getPiece(this.id).subscribe(piece => {
          this.form.name               = piece.name;
          const days                   = parseInt(piece.estimatedTime, 10);
          this.form.estimatedTime      = isNaN(days) ? 1 : days;
          this.form.description        = piece.description;
          this.form.technicianContact  = piece.technicianContact;
          this.existingImages          = piece.images ?? [];
        });
      }
    });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFiles = Array.from(input.files).slice(0, 8);
    }
  }

  submit(): void {
    const data = new FormData();
    data.append('name', this.form.name);
    data.append('estimatedTime', String(this.form.estimatedTime));
    data.append('description', this.form.description);
    data.append('technicianContact', this.form.technicianContact);
    this.selectedFiles.forEach(file => data.append('images', file));

    const obs = this.editMode
      ? this.svc.updatePiece(this.id, data)
      : this.svc.createPiece(data);

    obs.subscribe(() => this.router.navigate(['/admin/pieces']));
  }
}
