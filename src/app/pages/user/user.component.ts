import { Component, NgModule, OnInit } from '@angular/core';
import { FormBuilder,FormsModule } from '@angular/forms';
import { LoaderService } from 'src/app/core/services/loader.service';
import { GeneralserviceService } from 'src/app/generalservice.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-user',
  standalone:true,
  imports:[NgxPaginationModule,CommonModule,FormsModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})


export class UserComponent  {
  ticketData: any[] = [];
holdTickets: any[] = [];
uatTickets: any[] = [];
inProgressTickets: any[] = [];
resolvedTickets: any[] = [];

//    currentPage: number = 1;
//   itemsPerPage: number = 10;
//     /*pagination part */
//   searchText: string = '';
//   sortKey: string = 'customerticketId'; // default sort key
//   reverse: boolean = false;

//  get sortedTickets() {
//     let filtered = this.ticketData;

//     // Search filter
//     if (this.searchText) {
//       filtered = filtered.filter(ticket =>
//         Object.values(ticket).some(val =>
//           String(val).toLowerCase().includes(this.searchText.toLowerCase())
//         )
//       );
//     }

//     // Sorting
//     filtered = filtered.sort((a, b) => {
//       const valA = a[this.sortKey];
//       const valB = b[this.sortKey];

//       if (valA < valB) return this.reverse ? 1 : -1;
//       if (valA > valB) return this.reverse ? -1 : 1;
//       return 0;
//     });

//     return filtered;
//   }

//   setSort(key: string) {
//     if (this.sortKey === key) {
//       this.reverse = !this.reverse;
//     } else {
//       this.sortKey = key;
//       this.reverse = false;
//     }
//   }

  constructor(private service: GeneralserviceService, private fb: FormBuilder,private loaderservice:LoaderService) {}
  ngOnInit(): void {
    this. getTickets()
  }

  // getTickets(): void {
  //   this.loaderservice.showLoader();
  //   this.service.GetTicketDetails().subscribe(
      
  //     (response: any) => {
  //       console.log('Ticket data:', response);
  //       this.ticketData = response.data;
  //       this.loaderservice.hideLoader();
  //     },
  //     (error) => {
  //       console.error('Error fetching tickets', error);
  //       this.loaderservice.hideLoader();
  //     }
  //   );
  // }
  getTickets(): void {
  this.loaderservice.showLoader();
  this.service.GetTicketDetails().subscribe(
    (response: any) => {
      console.log('Ticket data:', response);
      this.ticketData = response.data;

      // Group tickets based on status (case-insensitive)
      
      this.inProgressTickets = this.ticketData.filter(ticket => ticket.status.toLowerCase() === 'inprogress');
        this.holdTickets = this.ticketData.filter(ticket => ticket.status.toLowerCase() === 'hold');
          this.uatTickets = this.ticketData.filter(ticket => ticket.status.toLowerCase() === 'uat');
      this.resolvedTickets = this.ticketData.filter(ticket => ticket.status.toLowerCase() === 'resolved');

      this.loaderservice.hideLoader();
    },
    (error) => {
      console.error('Error fetching tickets', error);
      this.loaderservice.hideLoader();
    }
  );
}


tickets = [
    {
      title: 'Bug in Login Screen',
      description: 'User unable to login with correct credentials.',
      status: 'Open'
    },
    {
      title: 'UI Issue in Dashboard',
      description: 'Graphs not aligned in mobile view.',
      status: 'In Progress'
    },
    {
      title: 'Email Notification Failure',
      description: 'Customer not receiving password reset emails.',
      status: 'Resolved'
    }
  ];

  getTicketsByStatus(status: string) {
    return this.tickets.filter(ticket => ticket.status === status);
  }



}
