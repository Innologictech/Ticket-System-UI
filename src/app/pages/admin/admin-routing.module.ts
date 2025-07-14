import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskManagementComponent } from './task-management/task-management.component';
import { DesignationComponent } from './designation/designation.component';
import { AdminemployeecreationComponent } from './adminemployeecreation/adminemployeecreation.component';
import { AdminEmployeeCalendarComponent } from './admin-employee-calendar/admin-employee-calendar.component';

const routes: Routes = [
  {
    path: 'task-management',
    component:TaskManagementComponent
},
{
    path:'Designation',
    component:DesignationComponent
},
{
    path:'adminemployeeceation',
    component:AdminemployeecreationComponent
},
{
    path:'AdminEmployeeCalendar',
    component:AdminEmployeeCalendarComponent
}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
