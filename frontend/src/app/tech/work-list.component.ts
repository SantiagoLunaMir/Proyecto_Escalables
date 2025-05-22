import { Component, OnInit } from '@angular/core';
import { CommonModule }      from '@angular/common';
import { RouterModule }      from '@angular/router';
import { Work, WorkService } from '../services/work.service';

@Component({
  selector: 'app-work-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './work-list.component.html',
  styleUrls:   ['./work-list.component.css']
})
export class WorkListComponent implements OnInit {
  works: Work[] = [];
  constructor(private svc: WorkService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.svc.getWorks().subscribe(data => (this.works = data));
  }

  delete(id: string): void {
    if (!confirm('Eliminar trabajo?')) return;
    this.svc.deleteWork(id).subscribe(() => this.load());
  }
}
