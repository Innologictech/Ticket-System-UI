import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TicketCreationComponent } from './ticket-creation/ticket-creation.component';
const routes: Routes = [
    {
        path:'ticket-creation',
        component:TicketCreationComponent
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class customerticketroutingmodule { }