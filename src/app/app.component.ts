import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

import { NgxSpinnerModule } from 'ngx-spinner';
import { SessionServiceService } from './pages/ui/session-service.service';
import { NotificationService } from './notification.service';
import { GeneralserviceService } from './generalservice.service';
import { LoaderService } from './core/services/loader.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [RouterOutlet,CommonModule,NgxSpinnerModule],
})
export class AppComponent implements OnInit {
  data: any[] = []
  constructor(private sessionService:SessionServiceService,private notificationService: NotificationService,private service:GeneralserviceService,public loaderservice:LoaderService) {}
  ngOnInit() {
    

  
  
  }

  
}
