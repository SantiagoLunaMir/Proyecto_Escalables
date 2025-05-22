// src/app/tech/delivery-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule }      from '@angular/common';
import { FormsModule }       from '@angular/forms';

import { DeliveryService, Delivery } from '../services/delivery.service';
import { Work }                     from '../services/work.service';

@Component({
  selector: 'app-delivery-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './delivery-list.component.html',
  styleUrls: ['./delivery-list.component.css']
})
export class DeliveryListComponent implements OnInit {
  available: Work[]         = [];
  checked: Record<string,boolean> = {};
  my: Delivery[]            = [];

  constructor(private svc: DeliveryService) {}

  ngOnInit(): void {
    this.load();
    setInterval(() => this.load(), 60_000);  // auto-recarga cada 60s
  }

  load() {
    this.svc.getAvailableWorks().subscribe(a => this.available = a);
    this.svc.myDeliveries().subscribe(d => this.my = d);
    this.checked = {};
  }

  toggle(id: string, ev: Event) {
    this.checked[id] = (ev.target as HTMLInputElement).checked;
  }

  allSelected(): boolean {
    return Object.values(this.checked).some(v => v);
  }

  assign() {
    const ids = Object.keys(this.checked).filter(k => this.checked[k]);
    if (!ids.length) return;
    this.svc.assign(ids).subscribe(() => this.load());
  }

  traducirEstado(estado: string): string {
    return estado === 'pendiente' ? 'Pendiente'
         : estado === 'entregado' ? 'Entregado'
         : estado;
  }

  markDelivered(deliveryId: string) {
    const input  = window.prompt('Monto cobrado (en pesos):');
    const amount = input ? parseFloat(input.replace(',','.')) : 0;
    this.svc.markDelivered(deliveryId, amount)
      .subscribe(() => this.load());
  }

  cancel(deliveryId: string) {
    if (!confirm('¿Seguro que quieres cancelar esta entrega?')) return;
    this.svc.cancelDelivery(deliveryId)
      .subscribe(() => this.load());
  }
}
