import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OperationRoutingModule } from './operation-routing.module';
import { OperationTimeEntryComponent } from './operation-time-entry/operation-time-entry.component';


@NgModule({
  declarations: [
    // OperationTimeEntryComponent
  ],
  imports: [
    CommonModule,
    OperationRoutingModule
  ]
})
export class OperationModule { }
