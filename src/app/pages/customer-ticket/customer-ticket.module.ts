import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { customerticketroutingmodule } from './customer-ticket-routing.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { TicketCreationComponent } from './ticket-creation/ticket-creation.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [TicketCreationComponent],
  imports: [
    CommonModule,
    FormsModule,
        ReactiveFormsModule,
    customerticketroutingmodule,
     NgxPaginationModule,
  ]
})
export class CustomerTicketModule { }
