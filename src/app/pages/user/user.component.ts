import { Component, NgModule, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { LoaderService } from 'src/app/core/services/loader.service';
import { GeneralserviceService } from 'src/app/generalservice.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { selectAllStatus } from 'src/app/store/ticketSytem/ticket.selectors';
import { Status } from 'src/app/store/ticketSytem/ticket.model';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as TicketActions from 'src/app/store/ticketSytem/ticket.actions';
import Swal from 'sweetalert2';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';




@Component({
  selector: 'app-user',
  standalone: true,
  imports: [NgxPaginationModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})


export class UserComponent {
  ticketData: any[] = [];
  holdTickets: any[] = [];
  uatTickets: any[] = [];
  inProgressTickets: any[] = [];
  resolvedTickets: any[] = [];
  assignedTickets: any[] = [];
  completedTickets: any[] = [];
  bugTicketForm: FormGroup;
  isEditMode = false;
  userList = [];
  selectedFileBase64: string | null = null;
  selectedUploadBase64: string | null = null;
  selectedUpload2Base64: string | null = null;
  selectedTicket: any;
  status$: Observable<Status[]>;
  allStatus: any[] = [];
  EditmodalRef: any;

  constructor(private modalService: NgbModal, private service: GeneralserviceService, private fb: FormBuilder, private loaderservice: LoaderService, private store: Store, private sanitizer: DomSanitizer) {
    this.bugTicketForm = this.fb.group({
      title: [''],
      reportedBy: [''],
      priority: [''],
      environment: [''],
      ticketstatus: [''],
      date: [''],
      description: [''],
      assignedTo: [''],
      remarks: [''],
      attachments: [''],
      upload: [''],
    });
  }
  ngOnInit(): void {
    this.getTickets();
    this.store.dispatch(TicketActions.loadStatus())
    this.status$ = this.store.select(selectAllStatus);
    this.status$.subscribe((status: any) => {
      this.allStatus = status?.data || []; // Ensure it's an array
      console.log(' this.allStatus', this.allStatus)
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
        else {
          this.selectedUpload2Base64 = base64;
        }
      };
      reader.readAsDataURL(file);
    }
  }

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


  // Modify the removeAttachment method
  removeAttachment(): void {
    this.selectedTicket.attachment = null;
    this.selectedFileBase64 = null;
    this.bugTicketForm.get('attachments')?.reset();
  }
  getTickets(): void {
    this.loaderservice.showLoader();
    this.service.GetTicketDetails().subscribe(
      (response: any) => {
        console.log('Ticket data:', response);
        this.ticketData = response.data;

        // Group tickets based on status (case-insensitive)
        this.assignedTickets = this.ticketData.filter(ticket => ticket.status.toLowerCase() === 'assigned');
        this.inProgressTickets = this.ticketData.filter(ticket => ticket.status.toLowerCase() === 'inprocess');
        this.holdTickets = this.ticketData.filter(ticket => ticket.status.toLowerCase() === 'hold');
        this.uatTickets = this.ticketData.filter(ticket => ticket.status.toLowerCase() === 'uat');
        this.resolvedTickets = this.ticketData.filter(ticket => ticket.status.toLowerCase() === 'resolved');
        this.completedTickets = this.ticketData.filter(ticket => ticket.status.toLowerCase() === 'completed');

        this.loaderservice.hideLoader();
      },
      (error) => {
        console.error('Error fetching tickets', error);
        this.loaderservice.hideLoader();
      }
    );
  }

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
  openTicketModal(ticket: any, content: any) {

    this.allStatus = ticket.allowedNextStatuses || [];
    this.selectedTicket = ticket;
    this.isEditMode = false;
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

    // ✅ Convert upload (from buffer) to Base64
    if (ticket.upload && ticket.upload.data && ticket.upload.data.data) {
      const uploadByteArray = new Uint8Array(ticket.upload.data.data);
      let uploadBinary = '';
      for (let i = 0; i < uploadByteArray.length; i++) {
        uploadBinary += String.fromCharCode(uploadByteArray[i]);
      }
      this.selectedUploadBase64 = `data:${ticket.upload.contentType};base64,${btoa(uploadBinary)}`;
    } else {
      this.selectedUploadBase64 = null;
    }

    this.bugTicketForm.patchValue({
      title: ticket.title,
      reportedBy: ticket.reportedBy,
      priority: ticket.priority,
      environment: ticket.environment,
      ticketstatus: ticket.allowedNextStatuses?.[0]?.status || '',
      date: ticket.date.split('T')[0], // format date
      description: ticket.description,
      assignedTo: ticket.assignedTo,
      attachments: ticket.attachment,
      upload: ticket.upload,
      remarks: ticket.remarks

    });
    // Disable Priority and Environment
    this.bugTicketForm.get('priority')?.disable();
    this.bugTicketForm.get('environment')?.disable();

    this.modalService.open(content, { size: 'lg', backdrop: 'static' });
  }

  //   UpdateTicket() {
  //    if (this.bugTicketForm.invalid || !this.selectedTicket) {
  //       this.bugTicketForm.markAllAsTouched();
  //       return;
  //     }

  //      const rawForm = this.bugTicketForm.value;

  //     const payload = {
  //       customerticketId: this.selectedTicket.customerticketId, // Required for update
  //       title: rawForm.title,
  //       reportedBy: rawForm.reportedBy,
  //       priority: rawForm.priority,
  //       environment: rawForm.environment,
  //       IssueType: rawForm.issueType,
  //       Client: this.client,
  //       status: rawForm.ticketstatus,
  //       date: rawForm.date,
  //       description: rawForm.description,
  //       attachment: this.selectedFileBase64,
  //       upload: this.selectedUploadBase64,
  //     };
  //     this.service.UpdateTicket(payload).subscribe(
  //          (response: any) => {
  //            console.log('Ticket updated:', response);

  //            Swal.fire({
  //              icon: 'success',
  //              title: 'Ticket Updated',
  //              text: 'The ticket was updated successfully.',
  //              confirmButtonText: 'OK'
  //            }).then(() => {
  //              this.bugTicketForm.reset();
  //              this.selectedTicket = null;
  //              this.getTickets(); // refresh

  //              if (this.EditmodalRef) {
  //                this.EditmodalRef.close();
  //              }
  //            });
  //          },
  //          (error) => {
  //            console.error('Update failed:', error);

  //            Swal.fire({
  //              icon: 'error',
  //              title: 'Update Failed',
  //              text: 'Sorry, we could not update the ticket. Please try again.',
  //              confirmButtonText: 'OK'
  //            });
  //          }
  //        );
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
      attachment: this.selectedFileBase64 || '',
      upload: this.selectedUploadBase64 || '',
      upload2: this.selectedUpload2Base64 || '',
      remarks: rawForm.remarks
      // upload:
    };
    // ✅ Add assigned date & days only when assigning
    // y

    // if (status === 'Rejected' && reason) {
    //   payload.rejectionReason = reason;
    // }

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


}



