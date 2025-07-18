import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GeneralserviceService } from 'src/app/generalservice.service';
import Swal from 'sweetalert2';
import { LoaderService } from 'src/app/core/services/loader.service';


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

  constructor(private fb: FormBuilder, private modalService: NgbModal, private service: GeneralserviceService,private loaderservice:LoaderService) { }

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
    this.loaderservice.showLoader();
    this.service.GetTicketDetails().subscribe(
      (response: any) => {
        console.log('Ticket data:', response);
        this.ticketData = response.data;
        this.loaderservice.hideLoader();
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
  this.submit = true; // ✅ Add this line
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

      Swal.fire({
        icon: 'success',
        title: 'Ticket Created',
        text: 'Your ticket was created successfully.',
        confirmButtonText: 'OK'
      }).then(() => {
        this.bugTicketForm.reset();
        this.getTickets(); // refresh list
        if (this.CreatemodalRef) {
          this.CreatemodalRef.close();
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
      status: rawForm.ticketstatus || "Open",
      date: rawForm.date,
      description: rawForm.description,
      attachment: rawForm.attachments || ''
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


  
  viewTicket(ticket: any) {

  }

  TicketCreationModel(createBugTicketTemplate: any): void {
    this.isEditMode=false;
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
