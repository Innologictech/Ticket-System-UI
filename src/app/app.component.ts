import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

import { NgxSpinnerModule } from 'ngx-spinner';
import { SessionServiceService } from './pages/ui/session-service.service';
import { NotificationService } from './notification.service';
import { GeneralserviceService } from './generalservice.service';
import { LoaderService } from './core/services/loader.service';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [RouterOutlet, CommonModule, NgxSpinnerModule],
})
export class AppComponent implements OnInit {
  isLoading$: Observable<boolean>;


  data: any[] = []
  someProperty: boolean;
  constructor(private sessionService: SessionServiceService, private loaderService: LoaderService, private router: Router, private notificationService: NotificationService, private service: GeneralserviceService, public loaderservice: LoaderService) {
    this.isLoading$ = this.loaderService.isLoading$;
  }


  ngOnInit() {
    const tabId = Math.random().toString(36).substring(2, 7);
    const existing = this.sessionService.getSession();

    if (existing) {
      // Old tab exists → expire it
      localStorage.setItem('expire_tab', existing.tabId);

      // Replace with new session
      this.sessionService.startSession(tabId);
    } else {
      // First time → start new session
      this.sessionService.startSession(tabId);
    }


    // ✅ Logout user if token exists (i.e. on refresh)
    const userName = localStorage.getItem('currentUser');

    const user = JSON.parse(userName);
    const userId = user.data?.userId;
    console.log('userId:', userId);
    
    if (userId) {
      this.service.logout(userId).subscribe({
        next: () => {
          console.log('Logged out on refresh');
          localStorage.clear();
          this.router.navigate(['/auth/login-2']);
        },
        error: (err) => {
          console.error('Logout on refresh failed', err);
        }
      });
    }

    // Listen for expiry signal
    window.addEventListener('storage', (event) => {
      if (event.key === 'expire_tab') {
        const expiredTabId = event.newValue;
        const mySession = this.sessionService.getSession();

        if (mySession && mySession.tabId === expiredTabId) {
          // ❌ No alert → just logout + redirect
          this.sessionService.clearSession();
          this.router.navigate(['/auth/login-2']);  // 👈 login route
        }
      }
    });
  }

  ngAfterViewInit() {
    this.someProperty = true; // This can cause the error
  }

}
