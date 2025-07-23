import { Component, OnInit } from '@angular/core';
import { GeneralserviceService } from 'src/app/generalservice.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule,FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { LoaderService } from 'src/app/core/services/loader.service';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-ticket-list',


  templateUrl: './ticket-list.component.html',
  styleUrl: './ticket-list.component.css',

})
export class TicketListComponent implements OnInit {
userList: any[] = [];
  selectedTicket: any = null;
  bugTicketForm!: FormGroup;
isEditMode: boolean = false;
  ticketData: any[] = [];
  EditmodalRef: any;

  ngOnInit(): void {
      this.bugTicketForm = this.fb.group({
        title: ['', Validators.required],
        reportedBy: ['', Validators.required],
        priority: ['', Validators.required],
        environment: ['', Validators.required],
        ticketstatus: ['Open'], // default status
        date: ['', Validators.required],
        description: ['', Validators.required],
        attachments: [null],
        status:[''],
        assignedTo:['']
      });
      this.getTickets();
        this.getAllUserList();
    }
   statusOptions = ['Open', 'In Progress', 'Hold', 'UAT', 'Resolved', 'Closed', 'Reopen'];

  constructor(private service: GeneralserviceService,private spinner:NgxSpinnerService, private modalService: NgbModal,private fb: FormBuilder,private loaderservice:LoaderService) {

  }
  viewTicketModel(ticket: any, templateRef: any): void {
    this.isEditMode = false;
    this.selectedTicket = ticket; 
    const formattedDate = ticket.date ? ticket.date.split('T')[0] : '';
    
    // Disable all fields
     const environmentMap: any = {
  QA: 'Quality',
  Dev: 'Development',
  Prod: 'Production'
};

const statusMap: any = {
  open: 'Open',
  inprogress: 'In Progress',
  hold: 'Hold',
  uat: 'UAT',
  resolved: 'Resolved',
  closed: 'Closed',
  reopen: 'Reopen'
};
    this.bugTicketForm.patchValue({
      title: ticket.title,
      reportedBy: ticket.reportedBy,
      priority: ticket.priority,
environment: environmentMap[ticket.environment] || ticket.environment,
      ticketstatus: statusMap[ticket.status.toLowerCase()] || ticket.status,
      date: formattedDate,
      description: ticket.description,
      assignedTo: ticket.consultant || '',
      attachments: ticket.attachment
    });
 
    this.EditmodalRef = this.modalService.open(templateRef, {
      backdrop: 'static',
      keyboard: false,
      size: 'lg'
    });
  }

  /*pagination part */
  searchText: string = '';
  sortKey: string = 'customerticketId'; // default sort key
  reverse: boolean = false;

  currentPage: number = 1;
  itemsPerPage: number = 10;

  get sortedTickets() {
    let filtered = this.ticketData;

    // Search filter
    if (this.searchText) {
      filtered = filtered.filter(ticket =>
        Object.values(ticket).some(val =>
          String(val).toLowerCase().includes(this.searchText.toLowerCase())
        )
      );
    }

    // Sorting
    filtered = filtered.sort((a, b) => {
      const valA = a[this.sortKey];
      const valB = b[this.sortKey];

      if (valA < valB) return this.reverse ? 1 : -1;
      if (valA > valB) return this.reverse ? -1 : 1;
      return 0;
    });

    return filtered;
  }

  setSort(key: string) {
    if (this.sortKey === key) {
      this.reverse = !this.reverse;
    } else {
      this.sortKey = key;
      this.reverse = false;
    }
  }


  getTickets(): void {
    this.loaderservice.showLoader();
    this.service.GetTicketDetails().subscribe(
      
      (response: any) => {
        console.log('Ticket data:', response);
        this.ticketData = response.data;
        this.loaderservice.hideLoader();
      },
      (error) => {
        console.error('Error fetching tickets', error);
        this.loaderservice.hideLoader();
      }
    );
  }
 getAllUserList() {
  console.log('Filtered Users:', this.userList);
  this.spinner.show();
  this.service.getAllUsers().subscribe({
    next: (res: any) => {
      // ✅ Filter only users with Role === 'User'
      this.userList = (res?.data || []).filter(user => user.Role === 'USER');
      this.spinner.hide();
    },
    error: (err) => {
      this.spinner.hide();
      console.error("Error fetching users:", err);
    }
  });
}

getAttachmentUrl(ticket: any): string {
  if (ticket.attachment && ticket.attachment.data && ticket.attachment.data.data) {
    const byteArray = new Uint8Array(ticket.attachment.data.data);
    let binary = '';
    for (let i = 0; i < byteArray.length; i++) {
      binary += String.fromCharCode(byteArray[i]);
    }
    return `data:${ticket.attachment.contentType};base64,${btoa(binary)}`;
  }
  return '';
}


//     editTicketModel(ticket: any, templateRef: any): void {
      
//     this.selectedTicket = ticket; 
//     const formattedDate = ticket.date ? ticket.date.split('T')[0] : '';
//     this.bugTicketForm.patchValue({
//       title: ticket.title,
//       reportedBy: ticket.reportedBy,
//       priority: ticket.priority,
//       environment: ticket.environment,
//       ticketstatus: ticket.status,
//       date: formattedDate,
//       description: ticket.description,
      
//       attachments: null // Clear file input
//     });
//     this.bugTicketForm.get('ticketstatus')?.enable();
//   this.bugTicketForm.get('description')?.enable();
//     // Open modal
//     this.EditmodalRef = this.modalService.open(templateRef, {
//       backdrop: 'static',
//       keyboard: false,
//       size: 'lg'
//     });
// }
 editTicketModel(ticket: any, templateRef: any): void {
    this.isEditMode = true;
    this.selectedTicket = ticket; 
    const formattedDate = ticket.date ? ticket.date.split('T')[0] : '';
     const environmentMap: any = {
  QA: 'Quality',
  Dev: 'Development',
  Prod: 'Production'
};

const statusMap: any = {
  open: 'Open',
  inprogress: 'In Progress',
  hold: 'Hold',
  uat: 'UAT',
  resolved: 'Resolved',
  closed: 'Closed',
  reopen: 'Reopen'
};
   
    
    this.bugTicketForm.patchValue({
      title: ticket.title,
      reportedBy: ticket.reportedBy,
      priority: ticket.priority,
       environment: environmentMap[ticket.environment] || ticket.environment,
      ticketstatus: statusMap[ticket.status.toLowerCase()] || ticket.status,
      date: formattedDate,
      description: ticket.description,
      assignedTo: ticket.consultant || '',
      attachments: null
    });

    this.EditmodalRef = this.modalService.open(templateRef, {
      backdrop: 'static',
      keyboard: false,
      size: 'lg'
    });
  }

//  UpdateTicket(): void {
//   debugger;
//     if (this.bugTicketForm.invalid || !this.selectedTicket) {
//       this.bugTicketForm.markAllAsTouched();
//       return;
//     }

//     const rawForm = this.bugTicketForm.value;

//     const payload = {
//       customerticketId: this.selectedTicket.customerticketId, // Required for update
//       title: rawForm.title,
//       reportedBy: rawForm.reportedBy,
//       priority: rawForm.priority,
//       environment: rawForm.environment,
//       status:  "InProcess",
//       consultant:rawForm.assignedTo,
//       Rejectreason:"",
//       date: rawForm.date,
//       description: rawForm.description,
//       attachment: rawForm.attachments || ''
//     };

//     this.service.UpdateTicket(payload).subscribe(
//       (response: any) => {
//         console.log('Ticket updated:', response);
//         alert('Ticket updated successfully.');
//         this.bugTicketForm.reset();
//         this.selectedTicket = null;
//         this.getTickets(); // refresh list
        

//         // Close modal
//         if (this.EditmodalRef) {
//           this.EditmodalRef.close();
//         }

//       },
//       (error) => {
//         console.error('Update failed:', error);
//         alert('Failed to update ticket.');
//       }
//     );
//   }

//   onRejectTicket(ticket: any): void {
//   Swal.fire({
//     title: 'Are you sure to reject?',
//     text: 'Please provide a reason for rejection',
//     input: 'textarea',
//     inputPlaceholder: 'Enter reason for rejection...',
//     icon: 'warning',
//     showCancelButton: true,
//     confirmButtonText: 'Reject',
//     cancelButtonText: 'Cancel',
//     confirmButtonColor: '#d33',
//     cancelButtonColor: '#3085d6',
//     inputValidator: (value) => {
//       if (!value) {
//         return 'You need to write a reason!';
//       }
//       return null;
//     }
//   }).then((result) => {
//     if (result.isConfirmed) {
//       const reason = result.value; // Reason entered by user
//        this.selectedTicket = ticket; 
    
//     this.bugTicketForm.patchValue({
//       title: ticket.title,
//       reportedBy: ticket.reportedBy,
//       priority: ticket.priority,
//       environment: ticket.environment,
//       ticketstatus: ticket.status,
//       date: ticket.date,
//       description: ticket.description,
//       attachments: null // Clear file input
//     });

//       // ✅ Call API or handle logic here
//       console.log('Ticket Rejected:', ticket);
//       console.log('Reason:', reason);

//       // Show Success message
//       Swal.fire('Rejected!', 'The ticket has been rejected.', 'success');
//     }
//   });
// }


// UpdateTicket(status: string = 'InProcess', reason?: string): void {
//   // debugger;
//   if (this.bugTicketForm.invalid || !this.selectedTicket) {
//     this.bugTicketForm.markAllAsTouched();
//     return;
//   }

//   const rawForm = this.bugTicketForm.value;

//   const payload: any = {
//     customerticketId: this.selectedTicket.customerticketId, // Required for update
//     title: rawForm.title,
//     reportedBy: rawForm.reportedBy,
//     priority: rawForm.priority,
//     environment: rawForm.environment,
//     status: status,  // Dynamically set status
    
//     consultant: rawForm.assignedTo,
//     date: rawForm.date,
//     description: rawForm.description,
//     attachment: rawForm.attachments || ''
//   };

//   // Add rejection reason only if status is Rejected
//   if (status === 'Rejected' && reason) {
//     payload.rejectionReason = reason; // adjust key to match backend
//   }

//   this.service.UpdateTicket(payload).subscribe(
//     (response: any) => {
//       console.log(`Ticket ${status.toLowerCase()}:`, response);
//       alert(`Ticket ${status} successfully.`);
//       this.bugTicketForm.reset();
//       this.selectedTicket = null;
//       this.getTickets(); // refresh list

//       if (this.EditmodalRef) {
//         this.EditmodalRef.close();
//       }
//     },
//     (error) => {
//       console.error('Update failed:', error);
//       alert(`Failed to ${status.toLowerCase()} ticket.`);
//     }
//   );
// }

UpdateTicket(status: string = 'InProcess', reason?: string): void {
  if (this.bugTicketForm.invalid || !this.selectedTicket) {
    this.bugTicketForm.markAllAsTouched();
    return;
  }

  const rawForm = this.bugTicketForm.value;

  const payload: any = {
    customerticketId: this.selectedTicket.customerticketId,
    title: rawForm.title,
    reportedBy: rawForm.reportedBy,
    priority: rawForm.priority,
    environment: rawForm.environment,
    status: status,
    consultant: rawForm.assignedTo,
    date: rawForm.date,
    description: rawForm.description,
    attachment: rawForm.attachments || ''
  };
  // ✅ Add assigned date & days only when assigning
if (status === 'InProcess' && rawForm.assignedTo) {
  payload.assignedDate = new Date();
  payload.assignedDays = 0;
}
console.log("status",status)

  if (status === 'Rejected' && reason) {
    payload.rejectionReason = reason;
  }

  this.service.UpdateTicket(payload).subscribe(
    (response: any) => {
      const assignedToName = rawForm.assignedTo || 'consultant';

      Swal.fire({
        icon: 'success',
        title: `Ticket ${status} Successfully`,
        text: `Ticket has been assigned to ${assignedToName}`,
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK'
      });

      this.bugTicketForm.reset();
      this.selectedTicket = null;
      this.getTickets();

      if (this.EditmodalRef) {
        this.EditmodalRef.close();
      }
    },
    (error) => {
      console.error('Update failed:', error);
      Swal.fire({
        icon: 'error',
        title: 'Failed',
        text: `Failed to ${status.toLowerCase()} ticket.`,
        confirmButtonColor: '#d33',
        confirmButtonText: 'OK'
      });
    }
  );
}



onRejectTicket(ticket: any): void {
  Swal.fire({
    title: 'Are you sure to reject?',
    text: 'Please provide a reason for rejection',
    input: 'textarea',
    inputPlaceholder: 'Enter reason for rejection...',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Reject',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    inputValidator: (value) => {
      if (!value) {
        return 'You need to write a reason!';
      }
      return null;
    }
  }).then((result) => {
    if (result.isConfirmed) {
      const reason = result.value;
      this.selectedTicket = ticket; // Set ticket to update
      // Patch form only if required
      this.bugTicketForm.patchValue({
        title: ticket.title,
        reportedBy: ticket.reportedBy,
        priority: ticket.priority,
        environment: ticket.environment,
        date: ticket.date,
        description: ticket.description,
        attachments: ticket.attachments,
        assignedTo:ticket.consultant

      });

      // ✅ Call update method with status = 'Rejected' and reason
      this.UpdateTicket('Rejected', reason);
    }
  });
}




}