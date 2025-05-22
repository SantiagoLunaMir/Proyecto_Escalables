// frontend/src/app/tech/calendar.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

import { CalendarOptions, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { FullCalendarModule } from '@fullcalendar/angular';

import { WorkService, Work } from '../services/work.service';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, RouterModule, FullCalendarModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  private svc = inject(WorkService);
  private router = inject(Router);

  calendarOptions!: CalendarOptions;
  loading = false;

  ngOnInit(): void {
    this.loadEvents();
  }

  private loadEvents(): void {
    this.loading = true;
    this.svc.getWorks().subscribe({
      next: (works: Work[]) => {
        this.calendarOptions = {
          plugins: [dayGridPlugin, interactionPlugin],
          initialView: 'dayGridMonth',
          events: works.map(w => ({
            id: w._id,
            title: w.pieceId.name,
            start: w.deliveryDate,
            color: this.colorFor(w.status)
          })),
          // clic en evento → edición
          eventClick: (arg: EventClickArg) => {
            this.router.navigate(['/tech/works/edit', arg.event.id]);
          },
          // clic en fecha libre → creación
          dateClick: (arg: DateClickArg) => {
            this.router.navigate(['/tech/works/new'], {
              queryParams: { date: arg.dateStr }
            });
          }
        };
      },
      error: err => console.error(err),
      complete: () => (this.loading = false)
    });
  }

    private colorFor(status: Work['status']): string {
    switch (status) {
      case 'completado':    return '#16a34a';  
      case 'enProgreso':    return '#facc15';  
      case 'pendiente':     return '#f87171';  
      default:              return '#f87171';
    }
  }
}
