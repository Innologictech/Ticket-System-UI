import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GeneralserviceService } from 'src/app/generalservice.service';

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
  selectedFile: File | null = null;
  selectedTicket: any = null;


  ticketData: any[] = [];

  EditmodalRef: any;
  CreatemodalRef: any;

  constructor(private fb: FormBuilder, private modalService: NgbModal, private service: GeneralserviceService) { }

  ngOnInit(): void {
    this.bugTicketForm = this.fb.group({
      title: ['', Validators.required],
      reportedBy: ['', Validators.required],
      priority: ['', Validators.required],
      environment: ['', Validators.required],
      ticketstatus: ['Open'], // default status
      date: ['', Validators.required],
      description: ['', Validators.required],
      attachments: [null]
    });
    this.getTickets();
  }

  getTickets(): void {
    this.service.GetTicketDetails().subscribe(
      (response: any) => {
        console.log('Ticket data:', response);
        this.ticketData = response.data;
      },
      (error) => {
        console.error('Error fetching tickets', error);
      }
    );
  }



  // Easy access to form controls
  get f() {
    return this.bugTicketForm.controls;
  }

  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      this.bugTicketForm.patchValue({
        attachment: this.selectedFile
      });
    }
  }



  CreateTicket(): void {
    if (this.bugTicketForm.invalid) {
      this.bugTicketForm.markAllAsTouched();
      return;
    }

    const rawForm = this.bugTicketForm.value;

    const payload = {
      title: rawForm.title,
      reportedBy: rawForm.reportedBy,
      priority: rawForm.priority,
      environment: rawForm.environment,
      status: rawForm.ticketstatus || "open",
      date: rawForm.date,
      description: rawForm.description,
      attachment: rawForm.attachments || ''
    };

    this.service.CreateTicket(payload).subscribe(
      (response: any) => {
        console.log('Ticket created:', response);
        alert('Ticket successfully created.');
        this.bugTicketForm.reset();
        this.getTickets(); // refresh
        // Close modal
        if (this.CreatemodalRef) {
          this.CreatemodalRef.close();
        }
      },
      (error) => {
        console.error('Ticket creation failed:', error);
        alert('Failed to create ticket.');
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
      status: rawForm.ticketstatus || "Open",
      date: rawForm.date,
      description: rawForm.description,
      attachment: rawForm.attachments || ''
    };

    this.service.UpdateTicket(payload).subscribe(
      (response: any) => {
        console.log('Ticket updated:', response);
        alert('Ticket updated successfully.');
        this.bugTicketForm.reset();
        this.selectedTicket = null;
        this.getTickets(); // refresh list
        this.getTickets(); // refresh list

        // Close modal
        if (this.EditmodalRef) {
          this.EditmodalRef.close();
        }

      },
      (error) => {
        console.error('Update failed:', error);
        alert('Failed to update ticket.');
      }
    );
  }


  editTicketModel(ticket: any, templateRef: any): void {
    this.selectedTicket = ticket; // Store ticket for updating
    this.submit = false;
    this.isEditMode = true;
    // Patch form with selected ticket data
    this.bugTicketForm.patchValue({
      title: ticket.title,
      reportedBy: ticket.reportedBy,
      priority: ticket.priority,
      environment: ticket.environment,
      ticketstatus: ticket.status,
      date: ticket.date,
      description: ticket.description,
      attachments: null // Clear file input
    });

    // Open modal
    this.EditmodalRef = this.modalService.open(templateRef, {
      backdrop: 'static',
      keyboard: false,
      size: 'lg'
    });
  }


  deleteTicket(ticket: any) {

  }

  viewTicket(ticket: any) {

  }

  TicketCreationModel(createBugTicketTemplate: any): void {
    this.submit = false
    this.bugTicketForm.reset()
    this.bugTicketForm.patchValue({
      "status": true
    })
    this.CreatemodalRef = this.modalService.open(createBugTicketTemplate, {
      backdrop: 'static',
      keyboard: false, size: 'lg'
    });

  }

}
