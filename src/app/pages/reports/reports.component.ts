import { Component, OnInit } from '@angular/core';

import { Status, Ticket } from 'src/app/store/ticketSytem/ticket.model';
import { Store } from '@ngrx/store';
import * as TicketActions from 'src/app/store/ticketSytem/ticket.actions';
import { selectAllStatus, selectAllTickets } from 'src/app/store/ticketSytem/ticket.selectors';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';

import { GeneralserviceService } from 'src/app/generalservice.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports:[FormsModule,CommonModule,NgxPaginationModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent  implements OnInit{

  tickets$: Observable<Ticket[]>;
  ticketData: any[] = [];
  statusTimes: any[] = [];
  ngOnInit(): void {

    this.fetchStatusTimes();
    this.store.dispatch(TicketActions.loadTickets())
        this.tickets$ = this.store.select(selectAllTickets);
        this.tickets$.subscribe((tickets: any) => {
          this.ticketData = tickets?.data || []; // Ensure it's an array
          console.log('this.ticketData', this.ticketData)
        })
  }
  constructor(private store: Store,private service:GeneralserviceService){

  }

  /*pagination part */
  searchText: string = '';
  sortKey: string = 'customerticketId'; // default sort key
  reverse: boolean = false;

  currentPage: number = 1;
  itemsPerPage: number = 10;

  get sortedTickets() {
    if (!Array.isArray(this.ticketData)) return [];

    let filtered = [...this.ticketData]; // create a shallow copy to avoid mutation

    // Search filter
    if (this.searchText) {
      filtered = filtered.filter(ticket =>
        Object.values(ticket).some(val =>
          String(val).toLowerCase().includes(this.searchText.toLowerCase())
        )
      );
    }

    // Sorting
    filtered = filtered.sort((a, b) => {
      const valA = a[this.sortKey];
      const valB = b[this.sortKey];

      if (valA < valB) return this.reverse ? 1 : -1;
      if (valA > valB) return this.reverse ? -1 : 1;
      return 0;
    });

    return filtered;
  }


  setSort(key: string) {
    if (this.sortKey === key) {
      this.reverse = !this.reverse;
    } else {
      this.sortKey = key;
      this.reverse = false;
    }
  }

  
  fetchStatusTimes(): void {
    this.service.getStatusTimes().subscribe({
      next: (response:any) => {

       this.statusTimes=response.data;
        console.log('Status times:', this.statusTimes);
        // You can assign this response to a variable if needed
      },
      error: (error) => {
        console.error('Error fetching status times:', error);
      }
    });
  }

}
