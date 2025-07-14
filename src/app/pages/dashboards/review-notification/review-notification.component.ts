import { GeneralserviceService } from 'src/app/generalservice.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { NotificationService } from 'src/app/notification.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { GlobalReviewEditComponent } from '../../dashboards/global-review-edit/global-review-edit.component';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, TemplateRef, ViewChild } from '@angular/core';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { CdkStepperModule } from "@angular/cdk/stepper";
import { NgStepperModule } from "angular-ng-stepper";
interface ApiResponse {
  status: number;
  message: string;
  data?: any; // Optional if your response contains data
}
@Component({
  selector: 'app-review-notification',
  templateUrl: './review-notification.component.html',
  styleUrl: './review-notification.component.css',
   imports: [CommonModule, ReactiveFormsModule, FormsModule, NgStepperModule,CdkStepperModule,],
   standalone: true
})

export class ReviewNotificationComponent {
  @ViewChild('approvalModal') approvalModal: any;  private notificationSubscription!: Subscription;
  @ViewChild('entriesModal') entriesModal!: TemplateRef<any>;
  @ViewChild('verifiedModal') verifiedModal: any;  


  private previousNotificationCount = 0; // Store previous count
  reviewedNotificationADMINList: any=[];
  reviewedNotificationMDList:any=[]
  loginData: any;
  selectedInvoice: any = null;
  modalRef: NgbModalRef;
  notificationCard:any;
  reviewedNotificationList: any[];
  data: any;
  
  selectedEntries = [];
  // showModal = false;
  filteredAssignments: any[] = []; 
  summaryStats = {
    totalEmployees: 0,
    totalProjects: 0,
    totalHours: 0,
    avgHoursPerEmployee: 0
  };
  allAssignment: any[] = [];
  notifications: any[] = []; // Stores the notifications
  notificationCount: number = 0; // Tracks new notification count
  reviewedSheets:[];
  selectedItem: any;
  selectedAction: 'approve' | 'reject';
  approvalForm: FormGroup;
  showModal: boolean;
  isVerifyedreason:any
  reviewedData: { [teamLeadId: string]: any[] } = {};
teamLeadIds: string[] = [];
expandedLeadId: string | null = null;
  // teamLeadNamesMap: {};
  teamLeadNamesMap: { [id: string]: string } = {};
  selectedVerifyedItem: any;

 constructor(private fb: FormBuilder, private router: Router, private modalService: NgbModal,
    private toaster: ToastrService,private spinner: NgxSpinnerService,
   private service:GeneralserviceService,private notificationService: NotificationService,
   private cdr: ChangeDetectorRef ) {

  }
  ngOnInit() {
    this.loginData = this.service.getLoginResponse();
    console.log('this.loginData', this.loginData);
    this.approvalForm = this.fb.group({
      remark: ['']
    });
    // Fetch data initially
    // this.fetchData();
    // this.getTotalData();

    if(this.loginData?.data.employeeActivity == 'TEAM LEAD'){
      // this.loadReviewNotifications(); 
      this.getTeamLeadData()
    }else if(this.loginData?.data.employeeActivity == 'MANAGER'){
   this.teamLeadDataSubmitedListMethod()

    }
   
  }
  // fetchData() {

  //   this.reviewedNotificationADMINList = []
  //   this.spinner.show();  
  //   this.service.getAllNotification().subscribe((response: any) => {
  //     console.log("topbar", response,response.adminList,response.mdList);
      
  //     if(this.loginData?.data.userActivity == 'ADMIN'){
  //       this.notificationCard = "ADMIN"
  //       this.reviewedNotificationADMINList = response.adminList
  //       console.log("adminList this.reviewedNotificationList",this.reviewedNotificationADMINList)   
  //       this.spinner.hide();     
  //     }else{
  //       this.notificationCard = "MD"
  //     this.reviewedNotificationMDList = response.mdList
  //     console.log("this.reviewedNotificationList",this.reviewedNotificationMDList)
  //     this.spinner.hide();
  //     }
  //     console.log("this.reviewedNotificationADMINList",this.reviewedNotificationADMINList)
  //     console.log("this.reviewedNotificationMDList",this.reviewedNotificationMDList)

      
  //   }, error => {
  //     this.spinner.hide();
  //     console.error("Error fetching notifications:", error);
  //   });
  // }


  // private previousNotificationCount = 0; // Store previous count

  // fetchData() {
  //   this.notificationService.getAllNotification().subscribe(
  //     (response: any) => {
  //       console.log('topbar', response);

  //       if (this.loginData?.data.userActivity === 'ADMIN') {
  //         this.notificationCard = 'ADMIN';
  //         this.handleNotificationUpdate(response.adminNotificationCount, response.adminList);
  //       } else {
  //         this.notificationCard = 'MD';
  //         this.handleNotificationUpdate(response.mdNotificationCount, response.mdList);
  //       }
  //     },
  //     (error) => {
  //       console.error('Error fetching notifications:', error);
  //     }
  //   );
  // }

  // checkForNewNotifications() {
  //   this.notificationService.getAllNotification().subscribe(
  //     (response: any) => {
  //       const newCount =
  //         this.loginData?.data.userActivity === 'ADMIN'
  //           ? response.adminNotificationCount || 0
  //           : response.mdNotificationCount || 0;

  //       if (newCount !== this.previousNotificationCount) {
  //         console.log('Notification count changed! Fetching data...');
  //         // this.fetchData(); // Fetch updated data if count changes
  //       } else {
  //         console.log('No change in notifications.');
  //       }
  //     },
  //     (error) => {
  //       console.error('Error checking new notifications:', error);
  //     }
  //   );
  // }
 
  handleNotificationUpdate(newCount: number, notificationList: any[]) {
    console.log('New count:', newCount, 'Previous count:', this.previousNotificationCount);

    if (newCount > this.previousNotificationCount) {
      // this.notificationService.playNotificationSound();
      this.notifications.unshift({
        title: 'New Invoice Reviewed',
        message: 'A new invoice has been added successfully.',
        time: new Date().toLocaleTimeString(),
      });
    }

    // Always update count even if it decreases
    this.notificationCount = newCount;
    this.previousNotificationCount = newCount;
    this.reviewedNotificationList = notificationList || [];

    console.log('Updated notification list:', this.reviewedNotificationList);

    // Ensure UI refresh
    this.cdr.detectChanges();
  }
  openGlobalReviewPopup(invoice: any) {
    this.selectedInvoice = invoice;
  
    // Open GlobalReviewEditComponent in a modal
    this.modalRef = this.modalService.open(GlobalReviewEditComponent, {  backdrop: 'static', 
      keyboard: false,size:'lg' });
   
  
    // Pass data to the component
    this.modalRef.componentInstance.invoiceData = this.selectedInvoice;
  
    // Handle modal close
    this.modalRef.componentInstance.closeModal.subscribe(() => {
      this.modalRef.close();
    });
  }
verifyedInvoice(invoice){
  let obj={
      "originalUniqueId": invoice.originalUniqueId,
      "reviewed":false,
      "reviewedReSubmited":true
     }
   this.spinner.show()
  this.service.verifyedAndUpdated(obj).subscribe(
        (response: any) => {
          console.log('Response:', response); 
          this.spinner.hide()
          this.modalService.dismissAll(); 
        },
        (error) => {
          // Handle API errors
          Swal.fire('Error!', 'Failed to update status. Please try again.', 'error');
          console.error('Approval error:', error);
          this.spinner.hide()
        }
      );
  
  

}

// loadReviewNotifications() {

//   this.service.getReviewNotifications().subscribe({
//     next: (res: any) => {
//       this.reviewedSheets = res.data || [];
//     },
//     error: (err) => {
//       console.error("Error fetching review notifications:", err);
//       this.reviewedSheets = [];
//     }
//   });
// }

getTeamLeadData() {
  const obj = {
    employeeActivity: this.loginData?.data.employeeActivity,
    employeeID: this.loginData?.data.employeeID
  };
  this.reviewedSheets  = []
  this.spinner.show();

  this.service.getTeamLeadList(obj).subscribe(
    (res: any) => {
      this.spinner.hide();

      this.reviewedSheets = res.data || [];
    },
    (err) => {
      this.spinner.hide();
      console.error("Error fetching reviewed timesheets", err);
    }
  );
}

teamLeadDataSubmitedListMethod() {
  const obj = {
    employeeActivity: this.loginData?.data.employeeActivity,
    employeeID: this.loginData?.data.employeeID
  };

  this.spinner.show();
  this.reviewedData = null
  this.service.getListOf_A_R_Notifications(obj).subscribe(
    (res: any) => {
      this.spinner.hide();

      const rawData = res?.data || [];
      this.reviewedData = {};  // grouped result
      this.teamLeadIds = [];
      this.reviewedData = {};  // grouped result
      this.teamLeadIds = [];
      this.teamLeadNamesMap = {}; 

      // Grouping timesheets by Teamlead ID
      rawData.forEach((item: any) => {
        const leadId = item.GlobalReportingTeamleadId;
        const leadName = item.GlobalReportingTeamleadName;
      
        if (!this.reviewedData[leadId]) {
          this.reviewedData[leadId] = [];
          this.teamLeadNamesMap[leadId] = leadName; // Store the name
        }
      
        this.reviewedData[leadId].push(item);
      });

      // this.teamLeadIds = Object.keys(this.reviewedData);
      this.teamLeadIds = Object.keys(this.reviewedData);

      console.log("Grouped Reviewed Timesheets:", this.reviewedData);
    },
    (err) => {
      this.spinner.hide();
      console.error("Error fetching reviewed timesheets", err);
    }
  );
}
toggleExpand(teamLeadId: string) {
  this.expandedLeadId = this.expandedLeadId === teamLeadId ? null : teamLeadId;
}
openEntriesModal(entries: any[]) {
  this.selectedEntries = entries;
  this.modalService.open(this.entriesModal, { 
    size: 'lg', 
    centered: true,
    backdrop: 'static'
  });
}


closeModal() {
  this.showModal = false;  // Close the modal
}
openApprovalDialog(item: any, action: 'approve' | 'reject'): void {
  console.log("item",item)
  if (!item) {
    Swal.fire('Error!', 'No timesheet selected', 'error');
    return;
  }

  this.selectedItem = item;
  this.selectedAction = action;

  // Reset form and validation
  this.approvalForm.reset();
  this.approvalForm.get('remark')?.clearValidators();

  if (action === 'reject') {
    this.approvalForm.get('remark')?.setValidators([Validators.required]);
  }

  this.approvalForm.get('remark')?.updateValueAndValidity();

  // Open the modal
  setTimeout(() => {
    this.modalService.open(this.approvalModal, { centered: true });
  }, 0);
}
openVerifyedDialog(item: any): void {
  if (!item) {
    Swal.fire('Error!', 'No timesheet selected', 'error');
    return;
  }
  this.selectedVerifyedItem = item;

  setTimeout(() => {
    this.modalService.open(this.verifiedModal, { centered: true });
  }, 0);
}

verifyedSubmit(){
  const reqBody = {
    timeSheetUniqueId: this.selectedVerifyedItem.timeSheetUniqueId || this.selectedVerifyedItem.id,
    isStatusVerifyed: 'Verifyed',
    reason: this.isVerifyedreason,
    decisionTakenByUser: this.loginData?.data.employeeID,
    saveDecision:false,
    finalDecision:this.selectedVerifyedItem.finalDecision
    // ...(remark && { reason: remark })
  };

  console.log('Submitting:', reqBody);
  this.service.VerifyedByTeamLead(reqBody).subscribe({
    next: (response: ApiResponse) => { // Add type here
      this.modalService.dismissAll();
      this.isVerifyedreason = ''
      if (response.status === 200) {
        Swal.fire('Success!', response.message, 'success');
        if(this.loginData?.data.employeeActivity == 'TEAM LEAD'){
          // this.loadReviewNotifications(); 
          this.getTeamLeadData()
        }else if(this.loginData?.data.employeeActivity == 'MANAGER'){
       this.teamLeadDataSubmitedListMethod()
    
        }
      } else {
        Swal.fire('Error!', response.message, 'error');
      }
    },
    error: (err) => {
      Swal.fire('Error!', 'Failed to update status', 'error');
      console.error('API error:', err);
    }
  });
}
submitApproval(): void {
  if (this.approvalForm.invalid && this.selectedAction === 'reject') {
    return;
  }

  const remark = this.approvalForm.value.remark || '';
  this.approveOrRejectTimesheet(this.selectedItem, this.selectedAction, remark);
  this.modalService.dismissAll();
}

private approveOrRejectTimesheet(item: any,  action: string, remark?: string): void {
  const status = action === 'approve' ? 'Approved' : 'Rejected';
  // First verify we have the required data
  if (!item || (!item.timeSheetUniqueId && !item.id)) {
    console.error('Invalid timesheet data:', item);
    Swal.fire('Error!', 'Invalid timesheet data', 'error');
    return;
  }

  const reqBody = {
    timeSheetUniqueId: item.timeSheetUniqueId || item.id,
    status: status,
    reason: remark,
    decisionTakenByUser: this.loginData?.data.employeeID,
    saveDecision:false,
    finalDecision:item.finalDecision
    // ...(remark && { reason: remark })
  };

  console.log('Submitting:', reqBody);
  this.service.timesheetApprovedOrRejected(reqBody).subscribe({
    next: (response: ApiResponse) => { // Add type here
      if (response.status === 200) {
        Swal.fire('Success!', response.message, 'success');
        if(this.loginData?.data.employeeActivity == 'TEAM LEAD'){
          // this.loadReviewNotifications(); 
          this.getTeamLeadData()
        }else if(this.loginData?.data.employeeActivity == 'MANAGER'){
       this.teamLeadDataSubmitedListMethod()
    
        }
      } else {
        Swal.fire('Error!', response.message, 'error');
      }
    },
    error: (err) => {
      Swal.fire('Error!', 'Failed to update status', 'error');
      console.error('API error:', err);
    }
  });
}

approve(item: any): void {
  if (!item) {
    Swal.fire('Error!', 'No timesheet selected', 'error');
    return;
  }
  
  // Debug: Check what the item contains
  console.log('Timesheet being approved:', item);
  
  this.approveOrRejectTimesheet(item, 'Approved');
}

reject(item: any): void {
  if (!item) {
    Swal.fire('Error!', 'No timesheet selected', 'error');
    return;
  }

  Swal.fire({
    title: 'Enter Rejection Reason',
    input: 'text',
    inputAttributes: {
      autocapitalize: 'off'
    },
    showCancelButton: true,
    confirmButtonText: 'Submit',
    showLoaderOnConfirm: true,
    preConfirm: (reason) => {
      if (!reason) {
        Swal.showValidationMessage('Reason is required');
      }
      return reason;
    },
    allowOutsideClick: () => !Swal.isLoading()
  }).then((result) => {
    if (result.isConfirmed) {
      this.approveOrRejectTimesheet(item, 'Rejected', result.value);
    }
  });
}

}
