import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-ticket-creation',
  templateUrl: './ticket-creation.component.html',
  styleUrl: './ticket-creation.component.css'
})
export class TicketCreationComponent {

  bugTicketForm!: FormGroup;
  submit:boolean=false;
  submitted = false;
  // bugTicketList: any[] = [];
  selectedFile: File | null = null;
 
  bugTicketList  = [
  {
    ticketNumber: 'TCKT001',
    customerName: 'ABC Corp',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@abc.com',
    phone: '9876543210',
    priority: 'High',
    issueType: 'Functional Bug',
    shortDescription: 'Login page error',
    reportedDate: new Date('2025-07-01')
  },
  {
    ticketNumber: 'TCKT002',
    customerName: 'XYZ Ltd',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@xyz.com',
    phone: '9123456780',
    priority: 'Medium',
    issueType: 'Technical Bug',
    shortDescription: 'System crash on submit',
    reportedDate: new Date('2025-07-10')
  },
  {
    ticketNumber: 'TCKT003',
    customerName: 'PQR Enterprises',
    firstName: 'Alan',
    lastName: 'Walker',
    email: 'alan@pqr.com',
    phone: '9012345678',
    priority: 'Critical',
    issueType: 'Enhancement Request',
    shortDescription: 'Need export to Excel',
    reportedDate: new Date('2025-07-14')
  }
];


  constructor(private fb: FormBuilder,private modalService: NgbModal,) {}

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

  submitBugTicket() {
  
  }

  editTicket(ticket: any, templateRef: any) {

  }

  deleteTicket(ticket: any) {
   
  }

  viewTicket(ticket: any) {
   
  }

newTicketCreation(createBugTicketTemplate: any): void {
    this.submit =false
    this.bugTicketForm.reset()
    this.bugTicketForm.patchValue({
      "status": true
    })
    this.modalService.open(createBugTicketTemplate,{  backdrop: 'static', 
      keyboard: false,size:'lg' });
  
  }

}
