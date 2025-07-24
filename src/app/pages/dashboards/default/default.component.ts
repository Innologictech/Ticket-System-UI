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
import { interval, Observable, Subscription } from 'rxjs';
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
  client: string;
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
  role: string;
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
  ticketData: any[]=[];
    tickets$: Observable<Ticket[]>;
  loading$: Observable<boolean>;
  constructor(private service: GeneralserviceService,private spinner:NgxSpinnerService, private modalService: NgbModal,private fb: FormBuilder,private loaderservice:LoaderService,private store: Store){

  }
  ngOnInit(): void {
    this.store.dispatch(TicketActions.loadTickets())
      this.tickets$ = this.store.select(selectAllTickets);
          this.loading$ = this.store.select(selectTicketLoading);

// this.getTickets();
  }
   isSlide = false;

  // Dummy Summary Stats
  summaryStats = {
    totalTickets: 120,
    openTickets: 40,
    inProgressTickets: 30,
    closedTickets: 50
  };

  // Bar chart for yearly ticket status
  barChartOptions: any = {
    series: [
      {
        name: "Open",
        data: [10, 20, 15, 25, 30] // 2020 to 2024
      },
      {
        name: "Closed",
        data: [5, 15, 25, 20, 35]
      }
    ],
    chart: {
      type: "bar",
      height: 350
    },
    xaxis: {
      categories: ["2020", "2021", "2022", "2023", "2024"]
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
    colors: ["#f39c12", "#2ecc71"]
  };

  // Pie chart for current year ticket distribution
  pieChartOptions: any = {
    series: [40, 30, 50], // open, in-progress, closed
    chart: {
      type: "pie",
       width: "550px", // 👈 reduce width here
    height: "800px"
    },
    labels: ["Open", "In Progress", "Closed"],
    colors: ["#f39c12", "#3498db", "#2ecc71"]
  };

  getTickets(): void {
    this.loaderservice.showLoader();
    this.service.GetTicketDetails().subscribe(
      
      (response: any) => {
        console.log('Ticket data:', response);
        this.ticketData = response.data;
        this.loaderservice.hideLoader();
      },
      (error) => {
        console.error('Error fetching tickets', error);
        this.loaderservice.hideLoader();
      }
    );
  }

  resetView() {
    // Reset logic if needed
  }


}

function selectTicketLoading(state: object): boolean {
  throw new Error('Function not implemented.');
}
