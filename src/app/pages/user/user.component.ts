import { Component, NgModule, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
  bugTicketForm: FormGroup;
  isEditMode = false;
  userList = [];
  selectedTicket:any;
  status$: Observable<Status[]>;
    allStatus: any[]=[];


  constructor(private modalService: NgbModal, private service: GeneralserviceService, private fb: FormBuilder, private loaderservice: LoaderService, private store: Store) {
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
      attachment: [''],
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


  getTickets(): void {
    this.loaderservice.showLoader();
    this.service.GetTicketDetails().subscribe(
      (response: any) => {
        console.log('Ticket data:', response);
        this.ticketData = response.data;

        // Group tickets based on status (case-insensitive)

        this.inProgressTickets = this.ticketData.filter(ticket => ticket.status.toLowerCase() === 'inprocess');
        this.holdTickets = this.ticketData.filter(ticket => ticket.status.toLowerCase() === 'hold');
        this.uatTickets = this.ticketData.filter(ticket => ticket.status.toLowerCase() === 'uat');
        this.resolvedTickets = this.ticketData.filter(ticket => ticket.status.toLowerCase() === 'resolved');

        this.loaderservice.hideLoader();
      },
      (error) => {
        console.error('Error fetching tickets', error);
        this.loaderservice.hideLoader();
      }
    );
  }
  
  getAttachmentUrl(ticket: any): string {
    console.log("ticketttttttttt",ticket);
  if (ticket.attachment && ticket.attachment.data && ticket.attachment.data.data) {
    console.log("ticketttttttttt",ticket);
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

      this.allStatus= ticket.allowedNextStatuses || [];
    this.selectedTicket=ticket;
    this.isEditMode = false;
    this.bugTicketForm.patchValue({
      title: ticket.title,
      reportedBy: ticket.reportedBy,
      priority: ticket.priority,
      environment: ticket.environment,
      ticketstatus: ticket.allowedNextStatuses?.[0]?.status || '',
      date: ticket.date.split('T')[0], // format date
      description: ticket.description,
      assignedTo: ticket.assignedTo
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


}



