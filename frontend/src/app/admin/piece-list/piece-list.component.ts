// frontend/src/app/admin/pieces/piece-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule }      from '@angular/common';
import { RouterModule, Router } from '@angular/router';

import { Piece, PieceService } from '../../services/piece.service';

@Component({
  selector: 'app-piece-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './piece-list.component.html',
  styleUrls: ['./piece-list.component.css']
})
export class PieceListComponent implements OnInit {
  pieces: Piece[] = [];
  loading = false;

  constructor(
    private pieceSvc: PieceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPieces();
  }

  loadPieces(): void {
    this.loading = true;
    this.pieceSvc.getPieces().subscribe({
      next: data => (this.pieces = data),
      error: err => console.error('Error al cargar piezas:', err),
      complete: () => (this.loading = false)
    });
  }

  /** Navegar a la vista de detalle público/admin */
  viewDetail(id: string): void {
    this.router.navigate(['/admin/pieces/edit', id]);
  }

  edit(id: string): void {
    this.router.navigate(['/admin/pieces/edit', id]);
  }

  delete(id: string): void {
    if (!confirm('¿Eliminar pieza?')) return;
    this.pieceSvc.deletePiece(id).subscribe(() => this.loadPieces());
  }

  onTogglePublish(piece: Piece): void {
    const target = !piece.isPublic;
    this.pieceSvc.togglePublish(piece._id!, target).subscribe({
      next: () => (piece.isPublic = target),
      error: err => console.error(err)
    });
  }
}
