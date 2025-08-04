import { Component, OnInit } from '@angular/core';
import { GeneralserviceService } from 'src/app/generalservice.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { LoaderService } from 'src/app/core/services/loader.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Status, Ticket } from 'src/app/store/ticketSytem/ticket.model';
import { Store } from '@ngrx/store';
import * as TicketActions from 'src/app/store/ticketSytem/ticket.actions';
import { selectAllStatus, selectAllTickets } from 'src/app/store/ticketSytem/ticket.selectors';
import { Observable } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

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
  selectedFileBase64: string | null = null;
  selectedUploadBase64: string | null = null;
  tickets$: Observable<Ticket[]>;
  loading$: Observable<boolean>;
  status$: Observable<Status[]>;
  allStatus: any[] = [];
  ngOnInit(): void {
    this.loaderservice.showLoader();
    this.bugTicketForm = this.fb.group({
      title: ['', Validators.required],
      reportedBy: ['', Validators.required],
      priority: ['', Validators.required],
      environment: ['', Validators.required],
      ticketstatus: ['Open'], // default status
      date: ['', Validators.required],
      description: ['', Validators.required],
      attachments: [''],
      status: [''],
      assignedTo: [''],
      upload: [''],
      remarks:[''],
    });
    
    this.store.dispatch(TicketActions.loadTickets())
    this.tickets$ = this.store.select(selectAllTickets);
    this.tickets$.subscribe((tickets: any) => {
      this.ticketData = tickets?.data || []; // Ensure it's an array
      this.loaderservice.hideLoader();
      console.log('this.ticketData', this.tickets$)

      this.store.dispatch(TicketActions.loadStatus())
      this.status$ = this.store.select(selectAllStatus);
      this.status$.subscribe((status: any) => {
        this.allStatus = status?.data || []; // Ensure it's an array
        console.log(' this.allStatus', this.allStatus)
      });
    });
    // this.loading$ = this.store.select(selectTicketLoading);
    // this.getTickets();
    this.getAllUserList();

    this.bugTicketForm.get('assignedTo')?.valueChanges.subscribe((assignedUser) => {
  const currentStatus = this.bugTicketForm.get('ticketstatus')?.value;

  // Only auto-update if current status is "New"
  if (assignedUser && currentStatus === 'New') {
    this.bugTicketForm.patchValue({
      ticketstatus: 'Assigned'
    });
  }
});

  
  }
  // statusOptions = ['Open', 'In Progress', 'Hold', 'UAT', 'Resolved', 'Closed', 'Reopen'];

  constructor(private service: GeneralserviceService, private spinner: NgxSpinnerService, private modalService: NgbModal, private fb: FormBuilder, private loaderservice: LoaderService, private store: Store, private sanitizer: DomSanitizer) {

  }
  validateFileType(control: AbstractControl): ValidationErrors | null {
    const file = control.value;
    if (file) {
      if (file instanceof File) {
        if (file.type !== 'application/pdf') {
          return { invalidFileType: true };
        }
      }
    }
    return null;
  }
  onFileSelected(event: any, type: 'attachments' | 'upload'): void {
    const file: File = event.target.files[0];

    // Check if file is PDF
    if (file && file.type !== 'application/pdf') {
      Swal.fire({
        icon: 'error',
        title: 'Invalid File',
        text: 'Please upload only PDF files',
        confirmButtonText: 'OK'
      });
      event.target.value = ''; // Clear the file input
      return;
    }

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        console.log(`Base64 [${type}]:`, base64);

        if (type === 'attachments') {
          this.selectedFileBase64 = base64;
        } else if (type === 'upload') {
          this.selectedUploadBase64 = base64;
        }
      };
      reader.readAsDataURL(file);
    }
  }



  viewTicketModel(ticket: any, templateRef: any): void {
    console.log('ticket', ticket)
    this.isEditMode = false;
    this.selectedTicket = ticket;
    const formattedDate = ticket.date ? ticket.date.split('T')[0] : '';

    console.log("allowedNextStatuses", ticket.allowedNextStatuses)

    this.bugTicketForm.patchValue({
      title: ticket.title,
      reportedBy: ticket.reportedBy,
      priority: ticket.priority,
      environment: ticket.environment,
      ticketstatus: ticket.status,
      // ticketstatus: ticket.allowedNextStatuses?.[0]?.status || '',
      date: formattedDate,
      description: ticket.description,
      assignedTo: ticket.consultant || '',
      // attachments: ticket.attachment,

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
    if (!Array.isArray(this.ticketData)) return [];

    let filtered = [...this.ticketData]; // create a shallow copy to avoid mutation

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
        this.userList = (res?.data || []).filter(user => user.Role === 'CONSULTANT');
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
    console.log("ticketttttttttttttttttttttttttt", ticket);

    this.allStatus = ticket.allowedNextStatuses || [];
    // ✅ If attachment exists from DB (Buffer form), convert it to Base64
    if (ticket.attachment && ticket.attachment.data && ticket.attachment.data.data) {
      const byteArray = new Uint8Array(ticket.attachment.data.data);
      let binary = '';
      for (let i = 0; i < byteArray.length; i++) {
        binary += String.fromCharCode(byteArray[i]);
      }
      this.selectedFileBase64 = `data:${ticket.attachment.contentType};base64,${btoa(binary)}`;
    } else {
      this.selectedFileBase64 = null;
    }

    this.bugTicketForm.patchValue({
      title: ticket.title,
      reportedBy: ticket.reportedBy,
      priority: ticket.priority,
      environment: ticket.environment,
      // ticketstatus: ticket.status,
      ticketstatus: ticket.allowedNextStatuses?.[0]?.status || '',
      date: formattedDate,
      description: ticket.description,
      remarks:ticket.remarks,
      assignedTo: ticket.consultant || '',
      attachments: null
      // attachments: ticket.attachment
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

  UpdateTicket(): void {
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
      status: rawForm.ticketstatus,
      consultant: rawForm.assignedTo,
      date: rawForm.date,
      description: rawForm.description,
      remarks:rawForm.remarks,
      upload: this.selectedUploadBase64,
      attachment: this.selectedFileBase64 || ''
    };

    console.log("attachment", this.selectedFileBase64);

  

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



  // onRejectTicket(ticket: any): void {
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
  //       const reason = result.value;
  //       this.selectedTicket = ticket; // Set ticket to update
  //       // Patch form only if required
  //       this.bugTicketForm.patchValue({
  //         title: ticket.title,
  //         reportedBy: ticket.reportedBy,
  //         priority: ticket.priority,
  //         environment: ticket.environment,
  //         date: ticket.date,
  //         description: ticket.description,
  //         attachments: ticket.attachments,
  //         assignedTo:ticket.consultant

  //       });

  //       // ✅ Call update method with status = 'Rejected' and reason
  //       this.UpdateTicket('Rejected', reason);
  //     }
  //   });
  // }

  isPdfFullScreen = false;
  selectedPdfUrl: SafeResourceUrl | null = null;

  viewPdf(attachment: any): void {
    if (!attachment?.data?.data || !attachment?.contentType) {
      console.error('Invalid attachment');
      return;
    }

    const byteArray = new Uint8Array(attachment.data.data);
    const blob = new Blob([byteArray], { type: attachment.contentType });
    const blobUrl = URL.createObjectURL(blob);

    // Option 1: open in a new tab
    // window.open(blobUrl);

    // Option 2: fullscreen overlay — if you already added it
    // ✅ Sanitize the blob URL
    this.selectedPdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl);
    this.isPdfFullScreen = true;
  }

  closeFullPdf(): void {
    if (this.selectedPdfUrl) {
      URL.revokeObjectURL((this.selectedPdfUrl as any).changingThisBreaksApplicationSecurity);
      this.selectedPdfUrl = null;
    }
    this.isPdfFullScreen = false;
  }

  removeAttachment(): void {
    //debugger;

    // Clone the selectedTicket to avoid direct mutation
    this.selectedTicket = {
      ...this.selectedTicket,
      attachment: null
    };

    this.selectedFileBase64 = null;
    this.bugTicketForm.get('attachments')?.reset();
  }





}