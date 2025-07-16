import { Component, OnInit } from '@angular/core';
import { GeneralserviceService } from 'src/app/generalservice.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ticket-list',


  templateUrl: './ticket-list.component.html',
  styleUrl: './ticket-list.component.css',

})
export class TicketListComponent implements OnInit {
  ticketData: any[] = [];
  constructor(private service: GeneralserviceService) {

  }

  /*pagination part */
  searchText: string = '';
  sortKey: string = 'customerticketId'; // default sort key
  reverse: boolean = false;

  currentPage: number = 1;
  itemsPerPage: number = 5;

  get sortedTickets() {
    let filtered = this.ticketData;

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


  ngOnInit(): void {
    this.getTickets()
  }
  getTickets(): void {
    this.service.GetTicketDetails().subscribe(
      (response: any) => {
        console.log('Ticket data:', response);
        this.ticketData = response.data;
      },
      (error) => {
        console.error('Error fetching tickets', error);
      }
    );
  }
}
