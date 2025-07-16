import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { DesignationComponent } from './designation/designation.component';
import { AdminemployeecreationComponent } from './adminemployeecreation/adminemployeecreation.component';
import { AdminEmployeeCalendarComponent } from './admin-employee-calendar/admin-employee-calendar.component';
import { TicketListComponent } from './ticket-list/ticket-list.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    // DesignationComponent
  
    // AdminemployeecreationComponent
  
    // AdminEmployeeCalendarComponent
  
    TicketListComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,NgxPaginationModule,FormsModule
  ]
})
export class AdminModule { }
