import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GeneralserviceService } from 'src/app/generalservice.service';
import Swal from 'sweetalert2';
import { LoaderService } from 'src/app/core/services/loader.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { ChangeDetectorRef } from '@angular/core';
import { catchError, finalize, map, Observable, of } from 'rxjs';

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
  statusOptions = ['Open', 'In Progress', 'Hold', 'UAT', 'Resolved', 'Closed', 'Reopen'];

  ticketData: any[] = [];
  currentUser: any;
  client:any;
  EditmodalRef: any;
  CreatemodalRef: any;
  selectedFileBase64: string | null = null;

  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef, private modalService: NgbModal, private service: GeneralserviceService, private loaderService: LoaderService, private authService: AuthenticationService) { }
  tickets$: Observable<any[]>;
  ngOnInit(): void {
    this.currentUser = this.authService.currentUser();
    this.client=this.currentUser?.Client || this.currentUser?.data?.Client || '',
    console.log("client",this.client);
    console.log('Current User:', this.currentUser);
    // Initialize form first
    this.bugTicketForm = this.fb.group({
      title: ['', Validators.required],
      reportedBy: [this.currentUser?.userName || this.currentUser?.data?.userName || '', Validators.required],
      priority: ['', Validators.required],
      environment: ['', Validators.required],
      ticketstatus: ['Open'],
      issueType: [''],
      // date: ['', Validators.required],
      date: [this.formatDate(new Date()), Validators.required],
      // Client:[this.currentUser?.Client || this.currentUser?.data?.Client || '',],
      description: ['', Validators.required],
      attachments: ['']
    });
    this.getTickets();

  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`; // Example: "2025-07-22"


  }


  getTickets(): void {
    this.loaderService.showLoader();
    this.tickets$ = this.service.GetTicketDetails().pipe(
      map((response: any) => {
        const tickets = response?.data ?? (Array.isArray(response) ? response : []);
        return this.filterTickets(tickets);
      }),
      catchError(error => {
        console.error('Error fetching tickets', error);
        return of([]);
      }),
      finalize(() => {
        this.loaderService.hideLoader();
        this.cdr.detectChanges();
      })
    );
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

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedFileBase64 = reader.result as string;  // Base64 string
        console.log('Base64:', this.selectedFileBase64);
      };
      reader.readAsDataURL(file); // Convert to Base64
    }
  }



  CreateTicket(bugTicketForm: any): void {
    this.submit = true; // ✅ Add this line
    if (this.bugTicketForm.invalid) {
      this.bugTicketForm.markAllAsTouched();
      return;
    }
    const formattedDate = this.bugTicketForm.get('date')?.value
      ? this.bugTicketForm.get('date')?.value
        .split('T')[0] : '';
    const rawForm = this.bugTicketForm.value;

    const payload = {
      title: rawForm.title,
      reportedBy: rawForm.reportedBy,
      priority: rawForm.priority,
      environment: rawForm.environment,
      Client:this.client,
      IssueType: rawForm.issueType,
      status: rawForm.ticketstatus || "open",
      date: formattedDate,
      description: rawForm.description,
      attachment: this.selectedFileBase64 // Base64 string
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
      IssueType: rawForm.issueType,
      Client:this.client,
      status: rawForm.ticketstatus || "Open",
      date: rawForm.date,
      description: rawForm.description,
      attachment: rawForm.attachments,
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
    // Patch form with selected ticket data
    this.bugTicketForm.patchValue({
      title: ticket.title,
      reportedBy: ticket.reportedBy,
      priority: ticket.priority,
      IssueType:ticket.issueType,
      environment: environmentMap[ticket.environment] || ticket.environment,
      ticketstatus: statusMap[ticket.status.toLowerCase()] || ticket.status,
      date: formattedDate,
      description: ticket.description,
      attachments: null // Clear file input
    });
    console.log('Editing ticket:', ticket);
    console.log('Environment:', ticket.environment);
    console.log('Status:', ticket.status);
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

    this.isEditMode = false;
    this.submit = false
    // this.bugTicketForm.reset({

    // });

    this.bugTicketForm.reset({
      date: this.formatDate(new Date())  // set current date
    });
    this.bugTicketForm.patchValue({
      reportedBy: this.currentUser?.data?.userName || '', // Correct path
      ticketstatus: 'Open',
      status: true
    });
    this.CreatemodalRef = this.modalService.open(createBugTicketTemplate, {
      backdrop: 'static',
      keyboard: false, size: 'lg'
    });

  }




}
