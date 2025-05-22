import { Component, OnInit }      from '@angular/core';
import { CommonModule }            from '@angular/common';
import { FormsModule, NgForm }     from '@angular/forms';
import { RouterModule, Router }    from '@angular/router';
import { Piece, PieceService }     from '../services/piece.service';
import { AuthService, User }       from '../services/auth.service';
import { Observable }              from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  pieces: Piece[] = [];
  user$: Observable<User | null>;

  form = {
    name: '',
    description: '',
    estimatedTime: '',
    technicianContact: ''
  };
  selectedFiles: File[] = [];

  constructor(
    private pieceSvc: PieceService,
    private auth: AuthService,
    private router: Router
  ) {
    this.user$ = this.auth.user$;
  }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.pieceSvc.getPieces().subscribe({
      next: data => this.pieces = data,
      error: err  => console.error('Error al cargar piezas:', err)
    });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFiles = Array.from(input.files).slice(0, 8);
    }
  }

  submit(form: NgForm): void {
    if (form.invalid) return;

    const data = new FormData();
    data.append('name', this.form.name);
    data.append('description', this.form.description);
    data.append('estimatedTime', this.form.estimatedTime);
    data.append('technicianContact', this.form.technicianContact);
    this.selectedFiles.forEach(f => data.append('images', f));

    this.pieceSvc.createPiece(data).subscribe({
      next: () => {
        form.resetForm();
        this.selectedFiles = [];
        this.load();
      },
      error: err => alert('No se pudo crear la pieza: ' + (err.error?.error || err.message))
    });
  }

  edit(id: string): void {
    this.router.navigate(['/admin/pieces/edit', id]);
  }

  canEdit(p: Piece, user: User | null): boolean {
    if (!user) return false;
    if (user.role === 'admin') return true;
    return user.role === 'technician' && user.email === p.technicianContact;
  }
}
