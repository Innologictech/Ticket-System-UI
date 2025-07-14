import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OperationTimeEntryComponent } from './operation-time-entry/operation-time-entry.component';

const routes: Routes = [
  {
    path: '',
    component: OperationTimeEntryComponent,
  },

  
{
    path: 'OperationTimeEntry',
    component:OperationTimeEntryComponent
},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OperationRoutingModule { }
