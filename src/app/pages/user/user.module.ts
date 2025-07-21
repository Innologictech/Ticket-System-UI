import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user/user.component';
import { userRoutingModule } from './user-routing.module';



@NgModule({
  declarations: [
    // UserComponent
  ],
  imports: [
    CommonModule,userRoutingModule
  ]
})
export class UserModule { }
