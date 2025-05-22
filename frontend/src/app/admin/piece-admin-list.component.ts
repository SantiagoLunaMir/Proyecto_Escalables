import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PieceService, Piece } from '../services/piece.service';

@Component({
  selector: 'app-piece-admin-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './piece-admin-list.component.html',
  styleUrls: ['./piece-admin-list.component.css']
})
export class PieceAdminListComponent implements OnInit {
  private svc = inject(PieceService);
  pieces: Piece[] = [];
  loading = false;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.svc.listAll().subscribe({
      next: list => (this.pieces = list),
      complete: () => (this.loading = false)
    });
  }

  togglePublic(p: Piece): void {
    this.svc.update(p._id!, { isPublic: !p.isPublic }).subscribe(() => {
      p.isPublic = !p.isPublic;
    });
  }
}
