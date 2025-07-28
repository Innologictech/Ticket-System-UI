import { CommonModule } from '@angular/common';
import { Component, OnInit,AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormsModule } from '@angular/forms';
import { Chart } from 'chart.js';
import { NgApexchartsModule } from 'ng-apexcharts';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { GeneralserviceService } from 'src/app/generalservice.service';
import { ViewChild, ElementRef } from '@angular/core';
import { catchError, finalize, interval, map, Observable, of, Subscription } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideAnimations } from '@angular/platform-browser/animations';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';// ... (Other imports and interfaces remain the same)
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoaderService } from 'src/app/core/services/loader.service';
import { Ticket } from 'src/app/store/ticketSytem/ticket.model';
import { Store } from '@ngrx/store';
import * as TicketActions from 'src/app/store/ticketSytem/ticket.actions';
import { selectAllTickets } from 'src/app/store/ticketSytem/ticket.selectors';

export interface Employee {
  id: number;
  name: string;
  department: string;
}

export interface Project {
  id: number;
  name: string;
  Client: string;
  budget: number;
}

export interface TimeEntry {
  id: number;
  employeeId: number;
  projectId: number;
  date: Date;
  hours: number;
  description: string;
}

export interface ProjectAssignment {
  id: number;
  employeeId: number;
  projectId: number;
  Role: string;
}
export type ChartOptions = {
  series: any;
  chart: any;
  xaxis: any;
  yaxis: any;
  dataLabels: ApexDataLabels;
  stroke: any;
  grid: any;
  plotOptions: any;
  legend: any;
  labels: any;
  fill: any;
  tooltip: any;
  responsive: ApexResponsive[];
  colors: any;
};
interface StatusItem {
  label: string;
  count: number;
  bgImage: string;
}
@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss'],
  standalone:true,
  providers: [
    provideAnimations()
  ],
  animations: [
    trigger('slideAnimation', [
      transition(':enter', [
        style({ transform: 'translateY(100%)' }),
        animate('500ms ease-out', style({ transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('500ms ease-in', style({ transform: 'translateY(-100%)' }))
      ])
    ])
  ],
  imports: [CommonModule, FormsModule, NgApexchartsModule, BsDatepickerModule,NgxSpinnerModule], 
  // providers: [NgxSpinnerService] // ✅ Provide NgxSpinnerService

})


export class DefaultComponent implements OnInit {
   tickets: any[] = [];
  filteredTickets: any[] = [];
 isSlide = false;
  summaryStats = {
    totalTickets: 0,
    openTickets: 0,
    inProgressTickets: 0,
    closedTickets: 0
  };


 searchText: string = '';
  loginData : any = {};
  Client: string = '';
  Role: string = '';
barChartOptions: any = {
  series: [],
  chart: {},
  xaxis: {},
  yaxis: {},
  plotOptions: {},
  colors: []
};

pieChartOptions: any = {
  series: [],
  chart: {},
  labels: [],
  colors: []
};
  user: any;
  loggedInUser: any;

  constructor(
    private service: GeneralserviceService,
    private loader: LoaderService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    
    this.getUserFromLocalStorage();
    
  }
getUserFromLocalStorage() {
  const userData = localStorage.getItem('currentUser'); // ✅ Correct key
  if (userData) {
    const parsedData = JSON.parse(userData);
    this.loggedInUser = parsedData?.data; // assuming user info is inside res.data

    this.Role = this.loggedInUser?.Role;
    this.Client = this.loggedInUser?.Client;

    this.getTickets(); // ✅ Call only after setting Role & Client
  } else {
    console.error('User not found in localStorage');
  }
}


  getTickets(): void {
    this.loader.showLoader();
    this.service.GetTicketDetails().pipe(
      map((response: any) => {
        const tickets = response?.data || [];
        this.tickets = tickets;
        // this.filteredTickets = this.filterTickets(tickets);
        this.applySearchFilter();
        
        console.log('Fetched Tickets:', tickets); // Check all tickets
console.log('Filtered Tickets:', this.filteredTickets); // Check what passes filter

        this.generateSummary();
        this.prepareCharts();
      }),
      catchError(error => {
        console.error('Error fetching tickets', error);
        return of([]);
      }),
      finalize(() => {
        this.loader.hideLoader();
        this.cdr.detectChanges();
      })
    ).subscribe();
  }

  // filterTickets(tickets: any[]): any[] {
  //   if (this.role === 'ADMIN') {
  //     return tickets.filter(ticket => ticket.Client === this.Client);
  //   }else if (this.role === 'CONSULTANT'){
  //     return tickets.filter(ticket =>
  //       ticket.Client === this.Client &&
  //       ticket.reportedBy === this.loginData .userName
  //     );
  //   } else if (this.role === 'CUSTOMER') {
  //     return tickets.filter(ticket =>
  //       ticket.Client === this.Client &&
  //       ticket.reportedBy === this.loginData .userName
  //     );
  //   } else {
  //     return [];
  //   }
    
  // }
filterTickets(tickets: any[]): any[] {
  console.log('Filtering tickets for Role:', this.Role);
  console.log('Filtering by Client:', this.Client);

  if (this.Role === 'ADMIN') {
    // return tickets.filter(ticket => ticket.Client === this.Client);
    return tickets;
  } else if (this.Role === 'CONSULTANT' || this.Role === 'CUSTOMER') {
    return tickets.filter(ticket =>
      ticket.Client === this.Client &&
      ticket.reportedBy === this.loggedInUser.userName
    );
  } else {
    return [];
  }
}
applySearchFilter(): void {
  if (!Array.isArray(this.tickets)) return;

  let filtered = [...this.filterTickets(this.tickets)];

  if (this.searchText) {
    const searchTextLower = this.searchText.toLowerCase();
    filtered = filtered.filter(ticket =>
      Object.values(ticket).some(val =>
        String(val).toLowerCase().includes(searchTextLower)
      )
    );
  }

  this.filteredTickets = filtered;
  this.generateSummary();
  this.prepareCharts();
}



  // generateSummary() {
  //   const stats = {
  //     totalTickets: this.filteredTickets.length,
  //     openTickets: this.filteredTickets.filter(t => t.status === 'Open').length,
  //     inProgressTickets: this.filteredTickets.filter(t => t.status === 'In Progress').length,
  //     closedTickets: this.filteredTickets.filter(t => t.status === 'Closed').length
  //   };
  //   this.summaryStats = stats;
  // }
  generateSummary() {
  const openStatuses = ['New', 'Assigned', 'ReOpen']; // Considered open
  const inProgressStatuses = ['InProcess', 'Hold-Cust', 'Hold-ILT', 'ClientAction', 'SoftwareChange', 'UAT', 'Rework'];
  const closedStatuses = ['Resolved', 'Completed'];

  const stats = {
    totalTickets: this.filteredTickets.length,
    openTickets: this.filteredTickets.filter(t => openStatuses.includes(t.status)).length,
    inProgressTickets: this.filteredTickets.filter(t => inProgressStatuses.includes(t.status)).length,
    closedTickets: this.filteredTickets.filter(t => closedStatuses.includes(t.status)).length
  };

  this.summaryStats = stats;
}


  // prepareCharts() {
  //   this.barChartOptions = {
  //     series: [
  //       {
  //         name: "Open",
  //         data: this.getYearlyStatusCount("Open")
  //       },
  //       {
  //         name: "Closed",
  //         data: this.getYearlyStatusCount("Closed")
  //       }
  //     ],
  //     chart: {
  //       type: "bar",
  //       height: 350
  //     },
  //     xaxis: {
  //       categories: this.getYears()
  //     },
  //     yaxis: {
  //       title: {
  //         text: "Tickets"
  //       }
  //     },
  //     plotOptions: {
  //       bar: {
  //         horizontal: false,
  //         columnWidth: "55%"
  //       }
  //     },
  //     colors: ["#f39c12", "#2ecc71"]
  //   };

  //   this.pieChartOptions = {
  //     series: [
  //       this.summaryStats.openTickets,
  //       this.summaryStats.inProgressTickets,
  //       this.summaryStats.closedTickets
  //     ],
  //     chart: {
  //       type: "pie",
  //       width: "450px",
  //       height: "400px"
  //     },
  //     labels: ["Open", "In Progress", "Closed"],
  //     colors: ["#f39c12", "#3498db", "#2ecc71"]
  //   };
  // }
  prepareCharts() {
  this.barChartOptions = {
    series: [
      {
        name: "Open",
        data: this.getYearlyStatusCount(["New", "Assigned", "ReOpen"])
      },
      {
        name: "In Progress",
        data: this.getYearlyStatusCount([
          "InProcess", "Hold-Cust", "Hold-ILT", "ClientAction", "SoftwareChange", "UAT", "Rework"
        ])
      },
      {
        name: "Closed",
        data: this.getYearlyStatusCount(["Resolved", "Completed"])
      }
    ],
    chart: {
      type: "bar",
      height: 350
    },
    xaxis: {
      categories: this.getYears()
    },
    yaxis: {
      title: {
        text: "Tickets"
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%"
      }
    },
    colors: ["#ebc07aff", "#89c5edff", "#80ebacff"]
  };

  this.pieChartOptions = {
    series: [
      this.summaryStats.openTickets,
      this.summaryStats.inProgressTickets,
      this.summaryStats.closedTickets
    ],
    chart: {
      type: "pie",
      width: "450px",
      height: "400px"
    },
    labels: ["Open", "In Progress", "Closed"],
    colors: ["#efc98dff", "#7fc6f6ff", "#90ebb6ff"]
  };
}


  getYears(): string[] {
    const years = this.filteredTickets.map(t => new Date(t.createdAt).getFullYear());
    return [...new Set(years)].sort().map(y => y.toString());
  }

  // getYearlyStatusCount(status: string): number[] {
  //   const years = this.getYears();
  //   return years.map(year =>
  //     this.filteredTickets.filter(t =>
  //       new Date(t.createdAt).getFullYear().toString() === year && t.status === status
  //     ).length
  //   );
  // }
  getYearlyStatusCount(statusList: string[]): number[] {
  const years = this.getYears();
  return years.map(year =>
    this.filteredTickets.filter(t =>
      new Date(t.createdAt).getFullYear().toString() === year &&
      statusList.includes(t.status)
    ).length
  );
}


  resetView() {
    this.getTickets();
  }
}