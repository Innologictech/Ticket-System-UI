import { Component, OnInit } from '@angular/core';
import { GeneralserviceService } from 'src/app/generalservice.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule,FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-ticket-list',


  templateUrl: './ticket-list.component.html',
  styleUrl: './ticket-list.component.css',

})
export class TicketListComponent implements OnInit {

  selectedTicket: any = null;
  bugTicketForm!: FormGroup;

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
      this.getTickets()
    }
  
  constructor(private service: GeneralserviceService, private modalService: NgbModal,private fb: FormBuilder) {

  }

  /*pagination part */
  searchText: string = '';
  sortKey: string = 'customerticketId'; // default sort key
  reverse: boolean = false;

  currentPage: number = 1;
  itemsPerPage: number = 5;

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

    editTicketModel(ticket: any, templateRef: any): void {
    this.selectedTicket = ticket; 
    
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


UpdateTicket(status: string = 'InProcess', reason?: string): void {
  // debugger;
  if (this.bugTicketForm.invalid || !this.selectedTicket) {
    this.bugTicketForm.markAllAsTouched();
    return;
  }

  const rawForm = this.bugTicketForm.value;

  const payload: any = {
    customerticketId: this.selectedTicket.customerticketId, // Required for update
    title: rawForm.title,
    reportedBy: rawForm.reportedBy,
    priority: rawForm.priority,
    environment: rawForm.environment,
    status: status,  // Dynamically set status
    
    consultant: rawForm.assignedTo,
    date: rawForm.date,
    description: rawForm.description,
    attachment: rawForm.attachments || ''
  };

  // Add rejection reason only if status is Rejected
  if (status === 'Rejected' && reason) {
    payload.rejectionReason = reason; // adjust key to match backend
  }

  this.service.UpdateTicket(payload).subscribe(
    (response: any) => {
      console.log(`Ticket ${status.toLowerCase()}:`, response);
      alert(`Ticket ${status} successfully.`);
      this.bugTicketForm.reset();
      this.selectedTicket = null;
      this.getTickets(); // refresh list

      if (this.EditmodalRef) {
        this.EditmodalRef.close();
      }
    },
    (error) => {
      console.error('Update failed:', error);
      alert(`Failed to ${status.toLowerCase()} ticket.`);
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