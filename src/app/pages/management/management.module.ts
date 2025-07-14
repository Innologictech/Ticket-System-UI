import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManagementRoutingModule } from './management-routing.module';
import { FormsModule } from '@angular/forms';
import { ManagementProjectCreationComponent } from './management-project-creation/management-project-creation.component';
import { ManagementProjectAssignmentComponent } from './management-project-assignment/management-project-assignment.component';
import { ManagementTaskAssignmentComponent } from './management-task-assignment/management-task-assignment.component';
import { ManangementEmployeeCalendarComponent } from './manangement-employee-calendar/manangement-employee-calendar.component';


@NgModule({
  declarations: [
    // ManagementProjectCreationComponent,
    // ManagementProjectAssignmentComponent,
    // ManagementTaskAssignmentComponent
  
    // ManangementEmployeeCalendarComponent
  ],
  imports: [
    CommonModule,FormsModule,
    ManagementRoutingModule
  ]
})
export class ManagementModule { }
