// frontend/src/app/catalog/piece-detail.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule }    from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { CatalogService, PublicPiece } from '../services/catalog.service';

@Component({
  selector: 'app-piece-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './piece-detail.component.html',
  styleUrls: ['./piece-detail.component.css']
})
export class PieceDetailComponent implements OnInit {
  private svc   = inject(CatalogService);
  private route = inject(ActivatedRoute);

  piece?: PublicPiece;
  loading = false;

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.loading = true;
    this.svc.get(id).subscribe({
      next: p => (this.piece = p),
      error: err => console.error(err),
      complete: () => (this.loading = false)
    });
  }
}
