import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { DesignationComponent } from './designation/designation.component';
import { AdminemployeecreationComponent } from './adminemployeecreation/adminemployeecreation.component';
import { AdminEmployeeCalendarComponent } from './admin-employee-calendar/admin-employee-calendar.component';


@NgModule({
  declarations: [
    // DesignationComponent
  
    // AdminemployeecreationComponent
  
    // AdminEmployeeCalendarComponent
  ],
  imports: [
    // CommonModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
