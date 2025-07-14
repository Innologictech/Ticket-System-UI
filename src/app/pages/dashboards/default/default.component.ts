import { CommonModule } from '@angular/common';
import { Component, OnInit,AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Chart } from 'chart.js';
import { NgApexchartsModule } from 'ng-apexcharts';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { GeneralserviceService } from 'src/app/generalservice.service';
import { ViewChild, ElementRef } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideAnimations } from '@angular/platform-browser/animations';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';// ... (Other imports and interfaces remain the same)

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
  public barChartOptions: Partial<ChartOptions> = {};// Initially hidden
  public pieChartOptions: Partial<ChartOptions> = {};
  labels = [{name: "Project A"}, {name: "Project B"}];

  allAssignment: any[] = [];
  filteredAssignments: any[] = []; 
  
  projectNames: string[] = [];



  summaryStats = {
    totalEmployees: 0,
    totalProjects: 0,
    totalHours: 0,
    avgHoursPerEmployee: 0
  };
  selectedProject: string = '';
  barChartInstance: any;
  pieChart: any;
  projectAssignments: any;
  assignments: any;
  projectName: any;
  // statusItems: StatusItem[] = [
  //   {
  //     label: 'Total Employees',
  //     count: 1234,
  //     bgImage: '/assets/images/bg3.jpg'
  //   },
  //   {
  //     label: 'Total Projects',
  //     count: 5678,
  //     bgImage: '/assets/images/bg3.jpg'
  //   },
  //   {
  //     label: 'Avg Hours/Employee',
  //     count: 9012,
  //     bgImage: '/assets/images/bg3.jpg'
  //   }
  // ];
  statusItems: StatusItem[] = []

  displayedItems: StatusItem[] = [];
  currentIndex = 0;
  private carouselSubscription?: Subscription;
  isSlide:boolean=false
 constructor(
      private service: GeneralserviceService,
      private toastr: ToastrService,
      private spinner: NgxSpinnerService,
  ) { }
    ngOnInit() {
    this.getTotalData();
    this.getAllAssignments();
    this.projectName = this.assignments.map(p => p.name);
  
  }
  
  ngOnDestroy() {
    if (this.carouselSubscription) {
      this.carouselSubscription.unsubscribe();
    }
  }
  private startCarousel() {
this. statusItems =[
    {
      label: 'Total Employees',
      count: this.summaryStats.totalEmployees,
      bgImage: '/assets/images/bg1.jpg'
    },
    {
      label: 'Total Projects',
      count: this.summaryStats.totalProjects,
      bgImage: '/assets/images/bg2.jpg'
    },
    {
      label: 'Time Sheet',
      count: this.summaryStats.totalHours,
      bgImage: '/assets/images/bg3.jpg'
    },
    {
      label: 'Avg Hours/Employee',
      count: this.summaryStats.totalHours,
      bgImage: '/assets/images/bg4.jpg'
    }
  ];
    
    this.displayedItems = [this.statusItems[this.currentIndex]];
    this.carouselSubscription = interval(5000).subscribe(() => {
      this.currentIndex = (this.currentIndex + 1) % this.statusItems.length;
      this.displayedItems = [this.statusItems[this.currentIndex]];
    });
    console.log("this.displayedItems",this.displayedItems)
  }
  
  getTotalData() {
    this.spinner.show();
    this.service.dashboardData().subscribe((res: any) => {
      this.allAssignment = res.data;
      this.filteredAssignments = this.allAssignment;
  
      this.summaryStats.totalEmployees = res.totalEmployeeCount;
      this.summaryStats.totalProjects = res.totalProjectCount;
      this.summaryStats.totalHours = 0;
      this.summaryStats.avgHoursPerEmployee = 0;
      this.startCarousel();
      // Prepare bar chart
      this.prepareChartData();
  
      // ✅ Prepare default pie chart
      this.resetView(); // <-- Add this line
  
      this.spinner.hide();
    }, error => {
      console.error("Error fetching assignments:", error);
      this.spinner.hide();
    });
  }
  

  // prepareChartData() {
  //   const projectMap: { [project: string]: Set<string> } = {};
  
  //   this.allAssignment.forEach(item => {
  //     // ✅ Safely extract project name from nested object
  //     const projName = item.projectName?.projectName || 'Unknown';
  
  //     if (!projectMap[projName]) {
  //       projectMap[projName] = new Set();
  //     }
  
  //     projectMap[projName].add(item.employeeID);
  //   });
  
  //   const labels = Object.keys(projectMap);
  //   const data = labels.map(project => projectMap[project].size);
  
  //   this.updateBarChart(labels, data);
  // }
  prepareChartData() {
    const projectMap: { [project: string]: Set<string> } = {};
  
    this.allAssignment.forEach(item => {
      if (Array.isArray(item.projectName)) {
        item.projectName.forEach((proj: any) => {
          const name = proj.projectName?.trim() || 'Unknown';
          if (!projectMap[name]) {
            projectMap[name] = new Set();
          }
          projectMap[name].add(item.employeeID);
        });
      } else if (item.projectName?.projectName) {
        const name = item.projectName.projectName.trim();
        if (!projectMap[name]) {
          projectMap[name] = new Set();
        }
        projectMap[name].add(item.employeeID);
      } else {
        if (!projectMap['Unknown']) {
          projectMap['Unknown'] = new Set();
        }
        projectMap['Unknown'].add(item.employeeID);
      }
    });
  
    const labels = Object.keys(projectMap);
    const data = labels.map(project => projectMap[project].size);
  
    this.updateBarChart(labels, data);
  }
  
  
  
  

updateBarChart(labels: string[], data: number[]) {
  this.barChartOptions = {
    series: [{
      name: 'Employee Count',
      data: data
    }],
    chart: {
      type: 'bar',
      height: 350,
      toolbar: { show: true },
      events: {
        dataPointSelection: (event, chartContext, config) => {
          const selectedProject = labels[config.dataPointIndex];
          console.log('Project selected:', selectedProject);
          this.showPieChartForProject(selectedProject);
          const bars = document.querySelectorAll(".apexcharts-bar-area");
          bars.forEach((bar) => {
            (bar as HTMLElement).style.stroke = "none"; // Remove previous borders
            (bar as HTMLElement).style.strokeWidth = "0";
          });
 
          // Highlight the selected bar
          const selectedBar = document.querySelector(
            `.apexcharts-bar-area[j="${config.dataPointIndex}"]`
          );
          if (selectedBar) {
            (selectedBar as HTMLElement).style.stroke = "red"; // Add red border
            (selectedBar as HTMLElement).style.strokeWidth = "2px";
          }
        }
      }
    },
    plotOptions: {
      bar: {
        columnWidth: '40%',
      }
    },
    xaxis: {
      categories: labels,
      
      labels: {
        rotate: -45, // 👈 rotate labels to avoid overlap
        style: {
          fontSize: '12px'
        }
      },
      title: {
        text: 'Project Names'
      }
    },
    yaxis: {
      title: {
        text: 'Employee Count'
      }
    },
    tooltip: {
      enabled: true
    },
    colors: ['#36A2EB'],
    legend: { position: 'bottom' }
  };
  
  
}

// showPieChartForProject(projectName: string) {
//   this.selectedProject = projectName;
//   const data = this.allAssignment.filter(emp => emp.projectName === projectName);

//   // Table filtering
//   this.filteredAssignments = data;

//   // Pie chart data
//   const labels = data.map(emp => emp.employeeName);
//   const values = data.map(emp => emp.workingHours || Math.floor(Math.random() * 10) + 1);

//   const colors = [
//     '#FF6384', '#36A2EB', '#FFCE56', '#66BB6A', '#BA68C8', '#FFA726'
//   ];

//   this.pieChartOptions = {
//     series: values,
//     chart: {
//       type: 'pie',
//       height: 350
//     },
//     labels: labels,
//     colors: colors,
//     legend: {
//       position: 'top'
//     }
//   };
// }
showPieChartForProject(projectName: string) {
  this.selectedProject = projectName;

  // ✅ Filter employees assigned to the selected project
  const data = this.allAssignment.filter(emp => {
    if (Array.isArray(emp.projectName)) {
      return emp.projectName.some((proj: any) => proj.projectName === projectName);
    } else if (emp.projectName?.projectName) {
      return emp.projectName.projectName === projectName;
    }
    return false;
  });

  // ✅ Update table
  this.filteredAssignments = data;

  // ✅ Pie chart data for that project
  const labels = data.map(emp => emp.employeeName);
  const values = data.map(emp => emp.workingHours || Math.floor(Math.random() * 10) + 1);

  const colors = [
    '#FF6384', '#36A2EB', '#FFCE56', '#66BB6A', '#BA68C8', '#FFA726'
  ];

  this.pieChartOptions = {
    series: values,
    chart: {
      type: 'pie',
      height: 350
    },
    labels: labels,
    colors: colors,
    legend: {
      position: 'top'
    }
  };
}


resetView() {
  this.filteredAssignments = this.allAssignment;
  this.selectedProject = '';

  const employeeMap: { [name: string]: number } = {};

  this.allAssignment.forEach(emp => {
    if (!employeeMap[emp.employeeName]) {
      employeeMap[emp.employeeName] = 0;
    }
    employeeMap[emp.employeeName] += emp.workingHours || Math.floor(Math.random() * 10) + 1;
  });

  const labels = Object.keys(employeeMap);
  const values = Object.values(employeeMap);

  this.pieChartOptions = {
    series: values,
    chart: {
      type: 'pie',
      height: 350
    },
    labels: labels,
    colors: ['#FF6384', '#36A2EB', '#FFCE56', '#66BB6A', '#BA68C8', '#FFA726'],
    legend: {
      position: 'top'
    }
  };

  // ✅ Reset bar highlights
  setTimeout(() => {
    const bars = document.querySelectorAll(".apexcharts-bar-area");
    bars.forEach((bar) => {
      (bar as HTMLElement).style.stroke = "none";
      (bar as HTMLElement).style.strokeWidth = "0";
    });
  }, 100);
}
toggleSlide() {
  this.isSlide = !this.isSlide;
}
getAllAssignments() {
  this.spinner.show();

  // Start a timer to hide spinner after 10 seconds no matter what
  // const spinnerTimeout = setTimeout(() => {
  //   this.spinner.hide();
  //   return
  // }, 1000000); 

  this.service.getAllAssignments().subscribe({
    next: (res: any) => {
      this.allAssignment = res.data;
      // Spinner will hide automatically after 10 seconds
      this.spinner.hide();
    },
    error: (error) => {
      console.error("Error fetching assignments:", error);
      // Spinner will hide automatically after 10 seconds
      this.spinner.hide();
    }
  });
}



}