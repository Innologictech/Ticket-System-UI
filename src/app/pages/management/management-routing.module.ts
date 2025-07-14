import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ManagementProjectAssignmentComponent } from './management-project-assignment/management-project-assignment.component';
import { ManagementProjectCreationComponent } from './management-project-creation/management-project-creation.component';
import { ManagementTaskAssignmentComponent } from './management-task-assignment/management-task-assignment.component';
import { ManangementEmployeeCalendarComponent } from './manangement-employee-calendar/manangement-employee-calendar.component';

const routes: Routes = [
    {
        path:'ManagementProjectAssignment',
        component:ManagementProjectAssignmentComponent
    },{
        path:'ManagementProjectCreation',
        component:ManagementProjectCreationComponent
    },{
        path:'ManagementTaskAssignment',
        component:ManagementTaskAssignmentComponent
    },{
        path:'ManangementEmployeeCalendar',
        component:ManangementEmployeeCalendarComponent
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagementRoutingModule { }
