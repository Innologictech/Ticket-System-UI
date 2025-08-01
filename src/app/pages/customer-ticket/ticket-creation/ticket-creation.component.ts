import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators,  AbstractControl, 
  ValidationErrors  } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GeneralserviceService } from 'src/app/generalservice.service';
import Swal from 'sweetalert2';
import { LoaderService } from 'src/app/core/services/loader.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { ChangeDetectorRef } from '@angular/core';
import { catchError, finalize, map, Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';
import * as TicketActions from 'src/app/store/ticketSytem/ticket.actions';
import { selectAllStatus } from 'src/app/store/ticketSytem/ticket.selectors';
import { Status } from 'src/app/store/ticketSytem/ticket.model';
import {  selectAllTickets } from 'src/app/store/ticketSytem/ticket.selectors';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-ticket-creation',
  templateUrl: './ticket-creation.component.html',
  styleUrl: './ticket-creation.component.css'
})
export class TicketCreationComponent {


  bugTicketForm!: FormGroup;
  submit: boolean = false;
  submitted = false;
  isEditMode = false;
  isViewMode = false;
  selectedFile: File | null = null;
  selectedTicket: any = null;
  statusOptions = ['New', 'In Progress', 'Hold', 'UAT', 'Resolved', 'Closed', 'Reopen'];
  modalTitle: string = '';
  ticketData: any[] = [];
  currentUser: any;
  client: any;
  EditmodalRef: any;
  CreatemodalRef: any;
  selectedFileBase64: string | null = null;
  selectedUploadBase64: string | null = null;
  tickets$: Observable<any[]>;
  status$: Observable<Status[]>;
  allStatus: any[] = [];
  allowedNextStatuses: any[] = [];

  //pagination//
  currentPage: number = 1;
itemsPerPage: number = 10;
  searchText: string = '';
 ticketList: any[] = []; // ✅ Safe default
 reverse: boolean = false;
sortKey: string = 'customerticketId';
  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef, private modalService: NgbModal, private service: GeneralserviceService, private loaderService: LoaderService, private authService: AuthenticationService, private store: Store,private sanitizer: DomSanitizer) { }


  ngOnInit(): void {
    this.currentUser = this.authService.currentUser();
    this.client = this.currentUser?.Client || this.currentUser?.data?.Client || '',
      console.log("client", this.client);
    console.log('Current User:', this.currentUser);
    // Initialize form first
    this.bugTicketForm = this.fb.group({
      title: ['', Validators.required],
      reportedBy: [this.currentUser?.userName || this.currentUser?.data?.userName || '', Validators.required],
      priority: ['', Validators.required],
      environment: ['Production', Validators.required],
      ticketstatus: ['New'],
      issueType: [''],
      // date: ['', Validators.required],
      date: [this.formatDate(new Date()), Validators.required],
      // Client:[this.currentUser?.Client || this.currentUser?.data?.Client || '',],
      description: ['', Validators.required],
      attachments: ['',[this.validateFileType.bind(this)]],
      upload: [''],
    });
    this.getTickets();
      this.store.dispatch(TicketActions.loadTickets())
                  this.tickets$ = this.store.select(selectAllTickets);
                  this.tickets$.subscribe((tickets:any) => {
          this.ticketData =  tickets?.data || []; // Ensure it's an array
          console.log('this.ticketData',this.tickets$) 
          
           this.store.dispatch(TicketActions.loadStatus())
              this.status$ = this.store.select(selectAllStatus);
              this.status$.subscribe((status: any) => {
                this.allStatus = status?.data || []; // Ensure it's an array
                console.log(' this.allStatus', this.allStatus)
              });
        });
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

  // formatDate(date: Date): string {
  //   const year = date.getFullYear();
  //   const month = (date.getMonth() + 1).toString().padStart(2, '0');
  //   const day = date.getDate().toString().padStart(2, '0');
  //   return `${year}-${month}-${day}`; // Example: "2025-07-22"
  // }
applySearchFilter(): void {
  if (!this.ticketData || !Array.isArray(this.ticketData)) return;

  let filtered = [...this.filterTickets(this.ticketData)];

  if (this.searchText) {
    const searchTextLower = this.searchText.toLowerCase();
    filtered = filtered.filter(ticket =>
      Object.values(ticket).some(val =>
        val && String(val).toLowerCase().includes(searchTextLower)
      )
    );
  }

  this.ticketList = filtered;
  // If you need to maintain filteredTickets for other purposes

}

  // formatDate(date: Date): string {
   
  //   const istOffset = 5.5 * 60 * 60 * 1000; 
  //   const istDate = new Date(date.getTime() + istOffset);

  //   const year = istDate.getFullYear();
  //   const month = (istDate.getMonth() + 1).toString().padStart(2, '0');
  //   const day = istDate.getDate().toString().padStart(2, '0');
  //   const hours = istDate.getHours().toString().padStart(2, '0');
  //   const minutes = istDate.getMinutes().toString().padStart(2, '0');
  //   const seconds = istDate.getSeconds().toString().padStart(2, '0');

  //   return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
   
  // }
  formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}




  // getTickets(): void {
  //   this.loaderService.showLoader();
  //   // this.tickets$ = this.service.GetTicketDetails().pipe(
  //     this.service.GetTicketDetails().pipe(
  //     map((response: any) => {
  //       // const tickets = response?.data ?? (Array.isArray(response) ? response : []);
  //          this.ticketData = response?.data || [];
  //     this.applySearchFilter(); 
  //       // return this.filterTickets(tickets);
  //     }),
  //     catchError(error => {
  //       console.error('Error fetching tickets', error);
  //       return of([]);
  //     }),
  //     finalize(() => {
  //       this.loaderService.hideLoader();
  //       this.cdr.detectChanges();
  //     })
  //   );
  // }
  getTickets(): void {
  this.loaderService.showLoader();
  this.service.GetTicketDetails().pipe(
    map((response: any) => {
      this.ticketData = response?.data || [];
      this.applySearchFilter(); 
    }),
    catchError(error => {
      console.error('Error fetching tickets', error);
      return of([]);
    }),
    finalize(() => {
      this.loaderService.hideLoader();
      this.cdr.detectChanges();
    })
  ).subscribe(); // 🔥 Required to trigger the pipe!
}
get paginatedTickets() {
  const start = (this.currentPage - 1) * this.itemsPerPage;
  return this.ticketList.slice(start, start + this.itemsPerPage);
}

setSort(key: string) {
    if (this.sortKey === key) {
      this.reverse = !this.reverse;
    } else {
      this.sortKey = key;
      this.reverse = false;
    }
  }


  filterTickets(tickets: any[]): any[] {
    // Get the username consistently
    const currentUserName = this.currentUser?.userName || this.currentUser?.data?.userName;

    if (this.currentUser?.Role === 'Admin') {
      return tickets;
    } else {
      return tickets.filter(ticket =>
        ticket.reportedBy === currentUserName
      );
    }
  }



  // Easy access to form controls
  get f() {
    return this.bugTicketForm.controls;
  }

  // onFileSelected(event: any): void {
  //   const file: File = event.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       this.selectedFileBase64 = reader.result as string;  // Base64 string
  //       console.log('Base64:', this.selectedFileBase64);
  //     };
  //     reader.readAsDataURL(file); // Convert to Base64
  //   }
  // }
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


// Modify the removeAttachment method
removeAttachment(): void {
  this.selectedTicket.attachment = null;
  this.selectedFileBase64 = null;
  this.bugTicketForm.get('attachments')?.reset();
}

 



  CreateTicket(bugTicketForm: any): void {
    this.submit = true; // ✅ Add this line
    if (this.bugTicketForm.invalid) {
      this.bugTicketForm.markAllAsTouched();
      return;
    }
    // const formattedDate = this.bugTicketForm.get('date')?.value
    //   ? this.bugTicketForm.get('date')?.value
    //     .split('T')[0] : '';

    const rawDateValue = this.bugTicketForm.get('date')?.value;

    const formattedDate = rawDateValue
      ? this.formatDate(new Date(rawDateValue))
      : '';
    console.log("formatted date", formattedDate);
    const rawForm = this.bugTicketForm.value;

    const payload = {
      title: rawForm.title,
      reportedBy: rawForm.reportedBy,
      priority: rawForm.priority,
      environment: rawForm.environment,
      Client: this.client,
      IssueType: rawForm.issueType,
      status: rawForm.ticketstatus || "New",
      date: formattedDate,
      description: rawForm.description,
      attachment: this.selectedFileBase64,// Base64 string
      upload: '',
      upload2:'',
      assignedTo: '',
      remarks:''
    };

    this.service.CreateTicket(payload).subscribe(
      (response: any) => {
        console.log('Ticket created:', response);

        Swal.fire({
          icon: 'success',
          title: 'Ticket Created',
          text: `${response.customerticketId} was created successfully.`,
          confirmButtonText: 'OK'
        }).then(() => {
          this.bugTicketForm.reset();
          this.getTickets(); // refresh list
          if (this.EditmodalRef) {
            this.EditmodalRef.close();
          }
        });
      },
      (error) => {
        console.error('Ticket creation failed:', error);

        Swal.fire({
          icon: 'error',
          title: 'Creation Failed',
          text: 'Sorry, we could not create the ticket. Please try again.',
          confirmButtonText: 'OK'
        });
      }
    );

  }


  updateTicket(): void {
    if (this.bugTicketForm.invalid || !this.selectedTicket) {
      this.bugTicketForm.markAllAsTouched();
      return;
    }

    const rawForm = this.bugTicketForm.value;

    const payload = {
      customerticketId: this.selectedTicket.customerticketId, // Required for update
      title: rawForm.title,
      reportedBy: rawForm.reportedBy,
      priority: rawForm.priority,
      environment: rawForm.environment,
      IssueType: rawForm.issueType,
      Client: this.client,
      status: rawForm.ticketstatus,
      date: rawForm.date,
      description: rawForm.description,
      attachment: this.selectedFileBase64,
      upload: this.selectedUploadBase64,
    };

    this.service.UpdateTicket(payload).subscribe(
      (response: any) => {
        console.log('Ticket updated:', response);

        Swal.fire({
          icon: 'success',
          title: 'Ticket Updated',
          text: 'The ticket was updated successfully.',
          confirmButtonText: 'OK'
        }).then(() => {
          this.bugTicketForm.reset();
          this.selectedTicket = null;
          this.getTickets(); // refresh

          if (this.EditmodalRef) {
            this.EditmodalRef.close();
          }
        });
      },
      (error) => {
        console.error('Update failed:', error);

        Swal.fire({
          icon: 'error',
          title: 'Update Failed',
          text: 'Sorry, we could not update the ticket. Please try again.',
          confirmButtonText: 'OK'
        });
      }
    );
  }


  editTicketModel(ticket: any, templateRef: any): void {
    this.modalTitle = 'Edit Ticket';
    this.selectedTicket = ticket; // Store ticket for updating
    console.log("selected tkttttttttt", this.selectedTicket);
    this.submit = false;
    this.resetModeFlags(); // Clear previous mode
    this.isEditMode = true;
    // const formattedDate = ticket.date ? ticket.date.split('T')[0] : '';
    const formattedDate = ticket.date ? this.formatDateForInput(ticket.date) : '';

    this.allStatus = ticket.allowedNextStatuses || [];
    this.allowedNextStatuses = ticket.allowedNextStatuses || [];


    this.bugTicketForm.patchValue({
      title: ticket.title,
      reportedBy: ticket.reportedBy,
      priority: ticket.priority,
      issueType: ticket.IssueType,
      environment: ticket.environment,
      // ticketstatus:  ticket.allowedNextStatuses || '',
      ticketstatus: ticket.allowedNextStatuses?.[0]?.status || '',
      date: formattedDate,
      description: ticket.description,
      attachments: ticket.attachment
    });
    console.log('Editing ticket:', ticket);
    console.log('Environment:', ticket.environment);
    console.log('Status:', ticket.status);
    console.log("issuetype:", ticket.IssueType);
    console.log("ticketstatus", ticket.allowedNextStatuses);
    // Open modal
    this.EditmodalRef = this.modalService.open(templateRef, {
      backdrop: 'static',
      keyboard: false,
      size: 'lg'
    });
  }
formatDateForInput(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  // For <input type="datetime-local">
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}


  viewTicket(ticket: any, templateRef: any): void {
    this.modalTitle = 'View Ticket';
    this.resetModeFlags(); // Clear previous mode
    this.selectedTicket = ticket;
    this.submit = false;
    // this.isEditMode = false;
    this.isViewMode = true;




    this.bugTicketForm.patchValue({
      title: ticket.title,
      reportedBy: ticket.reportedBy,
      priority: ticket.priority,
      issueType: ticket.IssueType,
      environment: ticket.environment,
      ticketstatus: ticket.status,
      date: ticket.date,
      description: ticket.description,
      attachments: ticket.attachment
    });

    this.EditmodalRef = this.modalService.open(templateRef, {
      backdrop: 'static',
      keyboard: false,
      size: 'lg'
    });
  }


  TicketCreationModel(createBugTicketTemplate: any): void {
    this.modalTitle = 'Raise New Ticket';
    this.isEditMode = false;
    this.submit = false
    // this.bugTicketForm.reset({

    // });

    this.bugTicketForm.reset({
      date: this.formatDate(new Date())  // set current date
    });
    this.bugTicketForm.patchValue({
      reportedBy: this.currentUser?.data?.userName || '', // Correct path
      ticketstatus: 'New',
      environment: 'Production',
      status: true
    });
    this.EditmodalRef = this.modalService.open(createBugTicketTemplate, {
      backdrop: 'static',
      keyboard: false, size: 'lg'
    });

  }

  //   TicketCreationModel(templateRef: any) {
  //   this.resetModeFlags(); // optional, good practice
  //   this.isEditMode = false;
  //   this.isViewMode = false;
  //   this.submit = false;

  //   this.bugTicketForm.reset({
  //       date: this.formatDate(new Date())  // set current date
  //     });
  //       this.bugTicketForm.patchValue({
  //       reportedBy: this.currentUser?.data?.userName || '', // Correct path
  //       ticketstatus: 'Open',
  //       environment: 'Production',
  //       status: true
  //     });
  //    this.CreatemodalRef = this.modalService.open(templateRef, {
  //       backdrop: 'static',
  //       keyboard: false, size: 'lg'
  //     });

  //   this.CreatemodalRef.result.then(
  //     (result) => this.resetModeFlags(),
  //     (reason) => this.resetModeFlags()
  //   );
  // }


  getAttachmentUrl(ticket: any): string {
    console.log("ticketttttttttt", ticket);
    if (ticket.attachment && ticket.attachment.data && ticket.attachment.data.data) {
      console.log("ticketttttttttt", ticket);
      const byteArray = new Uint8Array(ticket.attachment.data.data);
      let binary = '';
      for (let i = 0; i < byteArray.length; i++) {
        binary += String.fromCharCode(byteArray[i]);
      }
      return `data:${ticket.attachment.contentType};base64,${btoa(binary)}`;
    }
    return '';
  }

  // isImageFullScreen = false;
  // selectedImageUrl = '';

  // viewFullImage(url: string): void {
  //   this.selectedImageUrl = url;
  //   this.isImageFullScreen = true;
  // }

  // closeFullImage(): void {
  //   this.isImageFullScreen = false;
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


  // removeAttachment() {
  //   this.selectedTicket.attachment = null;  // Remove the existing image
  // }


  closeModal(reason: any) {
    this.EditmodalRef.close(reason);
    this.resetModeFlags();
  }

  resetModeFlags() {
    this.isEditMode = false;
    this.isViewMode = false;
  }



}
