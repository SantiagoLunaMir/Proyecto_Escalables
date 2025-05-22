// frontend/src/app/catalog/catalog.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule }       from '@angular/common';
import { FormsModule }        from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { CatalogService, PublicPiece } from '../services/catalog.service';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})
export class CatalogComponent implements OnInit {
  private svc = inject(CatalogService);
  private router = inject(Router);

  pieces: PublicPiece[] = [];
  search = '';
  page   = 1;
  pages  = 1;
  limit  = 12;
  loading = false;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.svc.list({ page: this.page, limit: this.limit, q: this.search }).subscribe({
      next: r => {
        this.pieces = r.results;
        this.page   = r.page;
        this.pages  = r.pages;
      },
      error: err => console.error(err),
      complete: () => (this.loading = false)
    });
  }

  view(id: string): void {
    this.router.navigate(['/catalog', id]);
  }

  prev(): void { if (this.page > 1) { this.page--; this.load(); } }
  next(): void { if (this.page < this.pages) { this.page++; this.load(); } }
}
