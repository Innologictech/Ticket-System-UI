import { Component, NgModule, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderService } from 'src/app/core/services/loader.service';
import { GeneralserviceService } from 'src/app/generalservice.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';



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


  constructor(private modalService: NgbModal, private service: GeneralserviceService, private fb: FormBuilder, private loaderservice: LoaderService) {
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
    this.getTickets()
  }


  getTickets(): void {
    this.loaderservice.showLoader();
    this.service.GetTicketDetails().subscribe(
      (response: any) => {
        console.log('Ticket data:', response);
        this.ticketData = response.data;

        // Group tickets based on status (case-insensitive)

        this.inProgressTickets = this.ticketData.filter(ticket => ticket.status.toLowerCase() === 'inprogress');
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
    this.selectedTicket=ticket;
    this.isEditMode = false;
    this.bugTicketForm.patchValue({
      title: ticket.title,
      reportedBy: ticket.reportedBy,
      priority: ticket.priority,
      environment: ticket.environment,
      ticketstatus: ticket.status,
      date: ticket.date.split('T')[0], // format date
      description: ticket.description,
      assignedTo: ticket.assignedTo
    });
    // Disable Priority and Environment
    this.bugTicketForm.get('priority')?.disable();
    this.bugTicketForm.get('environment')?.disable();

    this.modalService.open(content, { size: 'lg', backdrop: 'static' });
  }

  UpdateTicket() {
    console.log('Updated Ticket:', this.bugTicketForm.value);
  }
}






