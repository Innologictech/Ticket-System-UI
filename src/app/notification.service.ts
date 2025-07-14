import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { GeneralserviceService } from './generalservice.service';


@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private audio = new Audio('assets/Sounds/notification-1-269296.mp3'); 
    loginData: any;

    constructor(private http: HttpClient,private service:GeneralserviceService) {
    
      this.loginData= this.service.getLoginResponse()
      console.log("this.loginData=",this.loginData)
      if(this.loginData){
        // this.audio.load(); // Preload the audio
      }
     
    }

 // In your notification service
 playNotificationSound() {
  const audio = new Audio('assets/Sounds/notification-1-269296.mp3');
  audio.play().catch(error => console.error("Audio error:", error));
}

    // getReviewNotifications(){
    //     return this.http.get(environment.baseUrl+'/timesheet/getReviewNotifications');
     
    //   }
    getTeamLeadList(obj){
      return this.http.post(environment.baseUrl+'/timesheet/getTeamLeadList',obj);
  
    }
  
    getListOf_A_R_Notifications(obj){
      return this.http.post(environment.baseUrl+'/timesheet/getManagersList',obj);

    }
    timesheetApprovedOrRejected(obj){
      return this.http.post(environment.baseUrl+'/timesheet/timesheetApprovedOrRejected',obj);
    }
}