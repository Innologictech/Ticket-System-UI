import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GeneralserviceService } from 'src/app/generalservice.service'; // Adjust path if necessary
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-employee-creation',
  templateUrl: './employee-creation.component.html',
  styleUrl: './employee-creation.component.css',
  imports: [CommonModule, ReactiveFormsModule, FormsModule,],
  standalone: true
})
export class EmployeeCreationComponent implements OnInit {
 @ViewChild('editEmployeeTemplate') editEmployeeTemplate!: TemplateRef<any>;

  employeeCreationForm!: FormGroup;
  EmployeeEditForm!: FormGroup;
  CreateEmployee: any[] = [];
  selectedEmployee: any = null;
  modalRef: any;
  EmployeeEditModal: any;
  

  fieldTextType: boolean = false;
  submitted = false;
confirmFieldTextType: boolean = false;
  EmployeeNewCreation: any[];
  EmployeeList: any[];
  submit: boolean=false;
  employeeUniqueId: any;
  loginData: any;
  c: any;
  EmployeeUniqueId: any;
  
  logoUrl: string | null = null;
  isHoveringLogo: boolean = false;
  isHoveringRemove: boolean = false;

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private service: GeneralserviceService,private toastr: ToastrService,private spinner:NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.employeeCreationForm = this.fb.group({
      employeeID: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      contact: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      activity: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]] ,
      status: [true],
    });
  
    


    this.EmployeeEditForm = this.fb.group({

      employeeID: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      contact: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      activity: ['', Validators.required],
      status: [false]
    }, {
      validator: this.mustMatch('password', 'confirmPassword')
    });
    this.getInvoiceEmployeeDetails(); // Fetch Employees from API
    this.getAllEmployeeLists()
    this.loginData = this.service.getLoginResponse()
  }
  editEmployee(selectedEmployee: any, content: any) {
    console.log('Selected Employee:', selectedEmployee); // Debugging

    if (!selectedEmployee) {
      console.error('No Employee data found');
      return;
    }
  }
  onLogoSelected(event: Event) {
    const input = event.target as HTMLInputElement;
  
    if (input.files && input.files[0]) {
      const reader = new FileReader();
  
      reader.onload = () => {
        this.logoUrl = reader.result as string; // base64 encoded image
      };
  
      reader.readAsDataURL(input.files[0]); // Convert file to base64
    }
  }

  removeLogo(event: Event): void {
    event.preventDefault();
    event.stopPropagation(); // 👈 This prevents the click from reaching the parent div
    this.logoUrl = null;
  }

  openEditModal(Employee: any, editEmployeeTemplate: TemplateRef<any>): void {
    this.submit = false
    console.log('Employee',Employee);
    this.employeeUniqueId =null
    const selectedEmployee = Employee;
    this.employeeUniqueId = Employee.employeeUniqueId
    this.EmployeeEditForm.patchValue({
      employeeID: selectedEmployee.employeeID,
      firstName: selectedEmployee.employeeFirstName,
      lastName: selectedEmployee.employeeLastName,
      email: selectedEmployee.employeeEmail,
      contact: selectedEmployee.employeeContact,
      password: selectedEmployee.employeePassword,
      confirmPassword: selectedEmployee.employeeConfirmPassword,
      activity: selectedEmployee.employeeActivity,
      status: selectedEmployee.employeeStatus 
    });
    this.logoUrl = selectedEmployee.userImageUpload
    this.modalService.open(this.editEmployeeTemplate, {
      backdrop: 'static', 
      keyboard: false ,size:'lg'
    });  }


  mustMatch(password: string, confirmPassword: string) {
    return (formGroup: FormGroup) => {
      const passControl = formGroup.controls[password];
      const confirmPassControl = formGroup.controls[confirmPassword];
  
      if (confirmPassControl.errors && !confirmPassControl.errors['mustMatch']) {
        return;
      }
  
      if (passControl.value !== confirmPassControl.value) {
        confirmPassControl.setErrors({ mustMatch: true });
      } else {
        confirmPassControl.setErrors(null);
      }
    };
  }
  
  
  


  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
  toggleConfirmFieldTextType() {
    this.confirmFieldTextType = !this.confirmFieldTextType;
  }
  toggleStatus(): void {
    this.EmployeeEditForm.patchValue({ status: !this.EmployeeEditForm.value.status });
  }


  
 
  
  // Fetch Employees from API
  getInvoiceEmployeeDetails(): void {
    // this.service.EmployeeList().subscribe({
    //   next: (res: any) => {
    //     this.EmployeeList = res.responseData.data || [];
    //     console.log('Employee List:', this.EmployeeList);
    //   },
    //   error: (error) => {
    //     console.error('Error fetching Employee details:', error);
    //   }
    // });
  }

  // Open Edit Modal
 
  newEmployeeCreation(newEmployeeTemplate: any): void {
    this.submit =false
    this.employeeCreationForm.reset()
    this.employeeCreationForm.patchValue({
      "status": true
    })
    this.modalService.open(newEmployeeTemplate,{  backdrop: 'static', 
      keyboard: false,size:'lg' });
  
  }
  get f() {
     return this.employeeCreationForm.controls;
     }
     

  // Update Employee Information
  updateEmployeeCreation(modal: any): void {
    if (this.EmployeeEditForm.valid) {
      console.log('Updated Data:', this.EmployeeEditForm.value);
      // Here, you would typically send the updated data to the backend
      const now = new Date();
      const formattedDate = now.toLocaleString('en-GB', {
        timeZone: 'Asia/Kolkata', // change based on your timezone
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
  
      
      let updateObj = {
        "employeeUniqueId": this.employeeUniqueId, // Assuming the unique ID is part of the form
        "employeeID": this.EmployeeEditForm.value.employeeID,
      "employeeFirstName": this.EmployeeEditForm.value.firstName,
      "employeelastname": this.EmployeeEditForm.value.lastName,
      "employeeEmail": this.EmployeeEditForm.value.email,
      "employeeContact": this.EmployeeEditForm.value.contact,
      "employeePassword": this.EmployeeEditForm.value.password,
      "employeeConfirmPassword": this.EmployeeEditForm.value.confirmPassword,
      "employeeStatus": this.EmployeeEditForm.value.status,
      "employeeActivity": this.EmployeeEditForm.value.activity,
      "loggedInUser":this.loginData.data?.employeeID,
      createdDate : formattedDate,
      "userImageUpload":this.logoUrl
      };
      
      console.log("updateObj", updateObj);
      this.spinner.show()
      this.service.updateExitEmployee(updateObj).subscribe((res: any) => {
        console.log("updateEmployeeCreation", res);
        this.spinner.hide()
        if (res.status == 400) {
          this.toastr.success(res.message);
        } else {
          this.submit =false
          // Display success toast
          this.modalService.dismissAll(modal);
          Swal.fire({
            title: '',
            text: res.message,
            icon: 'success',
            cancelButtonText: 'Ok',
            timer:5000
          }).then((result) => {
            if (result) {
              // Handle confirmation if needed
            } else {
              // Handle cancel if needed
            }
          });
        }
        this.EmployeeEditForm.reset()
        this.getAllEmployeeLists()
        
        this.submitted = false;
      }, error => {
        this.spinner.hide()
        this.toastr.error(error);
        console.log("error", error);
      });
    } else {
      console.log('Form is invalid');// Ensure all fields are marked as touched
      this.submit =true
    }
  }
  
  // submitNewEmployee() {
  //   this.submitted = true;
  //   if (this.employeeCreationForm.invalid) {
  //     return;
  //   }
  //   // Handle form submission logic
  // }

  submitEmployeeForm(modal: any) {
    console.log('Create Employee:', this.employeeCreationForm.value);
  
    if (this.employeeCreationForm.invalid == true) {
      this.submit = true;
      return;
    } else {
      this.submit = false;

  
    let creatObj = {
      "employeeID": this.employeeCreationForm.value.employeeID,
      "employeeFirstName": this.employeeCreationForm.value.firstName,
      "employeeLastName": this.employeeCreationForm.value.lastName,
      "employeeEmail": this.employeeCreationForm.value.email,
      "employeeContact": this.employeeCreationForm.value.contact,
      "employeePassword": this.employeeCreationForm.value.password,
      "employeeConfirmPassword": this.employeeCreationForm.value.confirmPassword,
      "employeeStatus": this.employeeCreationForm.value.status,
      "employeeActivity": this.employeeCreationForm.value.activity,
      "loggedInUser":this.loginData.data?.employeeID,
      createdDate : "" ,
      "userImageUpload":this.logoUrl
    };
  
    console.log("creatObj", creatObj);
  this.spinner.show()
    this.service.employeeNewCreation(creatObj).subscribe((res: any) => {
      console.log("submitEmployeeForm", res);
      console.log('apiErr', res, res.responseData);
      this.spinner.hide()

      if(res.status == 400){
        this.toastr.success(res.message);

      }else{
         // Display success toast
         this.employeeCreationForm.reset()
         
      this.modalService.dismissAll(modal);
      // this.c('Close click');
      this.getAllEmployeeLists()
      Swal.fire({
        title: '',
        text: res.message,
        icon: 'success',
        cancelButtonText: 'Ok',
        timer:5000
      }).then((result) => {
        if (result) {
  
        } else {
  
        }
      });
      }
      
  
     
  
      this.getAllEmployeeLists();
      // this.modalService.dismissAll(modal);
      this.submitted = true;
      this.submit=false
    }, error => {
        this.toastr.error(error)
      // this.modalService.dismissAll(modal);
      console.log("error", error);
      this.spinner.hide()

    });
  }
  }
 
  delete(data): void {
    console.log("data",data.employeeActivity)
    const adminCount = this.EmployeeList.filter(Employee => Employee.employeeActivity === 'ADMIN').length;
    console.log("Admin Count:", adminCount);
    const accountsCount = this.EmployeeList.filter(Employee => Employee.employeeActivity === 'ACCOUNTS').length;
    console.log("Admin Count:", adminCount);

    // If there is only one admin and we are trying to delete an admin, show error message
    if (adminCount === 1 && data.employeeActivity == 'ADMIN') {
      Swal.fire({
        title: 'Cannot Delete!',
        text: "At least one Admin must remain. Please create another Admin before deleting.",
        icon: 'error',
        confirmButtonText: 'OK',
        timer:10000
      });
      return; // Stop further execution
    }
   else if (accountsCount === 1 && data.employeeActivity == 'ACCOUNTS') {
      Swal.fire({
        title: 'Cannot Delete!',
        text: "At least one Accounts must remain. Please create another Accounts before deleting.",
        icon: 'error',
        confirmButtonText: 'OK',
        timer:10000
      });
      return; // Stop further execution
    }
    else{
      Swal.fire({
        title: 'Are you sure?',
        text: "Do you want to delete this Employee?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
        timer:10000 
      }).then((result) => {
        if (result.isConfirmed) {
          this.spinner.show();
          console.log('Deleting Employee with ID:', data, this.employeeUniqueId);
          this.employeeUniqueId = data.employeeUniqueId;
          let deletePayload = {
            globalId: this.employeeUniqueId,
            screenName: "employee"
          };
         
          console.log("Delete payload:", deletePayload);
          this.service.deteleGlobal(deletePayload).subscribe((res: any) => {
            console.log("deleteGlobal response:", res);
            this.spinner.hide();
            if (res.status === 200) {
              this.getAllEmployeeLists()
              Swal.fire({
                title: 'Success',
                text: res.message,
                icon: 'success',
                confirmButtonText: 'OK',
                timer:5000
              }).then(() => {
                this.modalService.dismissAll();
                
              });
             
            } else {
              this.toastr.error(res.message);
            }
          }, (error) => {
            this.spinner.hide();
            console.error("Error deleting customer:", error);
            this.toastr.error("Failed to delete customer");
          });
        }
      });
    }

  
   
   
   
  }
  
  getAllEmployeeLists(){
    this.EmployeeList = [];
    this.spinner.show()
    this.service.getAllEmployeeLists().subscribe((res:any)=>{
      this.EmployeeList = res.data
      this.spinner.hide()
      console.log("this.EmployeeList",this.EmployeeList)
    },error =>{
      this.spinner.hide()
    console.log("error",error)
    })
  }
}
