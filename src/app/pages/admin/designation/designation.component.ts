import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {  OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { GeneralserviceService } from 'src/app/generalservice.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-designation',
  templateUrl: './designation.component.html',
  styleUrl: './designation.component.css',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule,NgxSpinnerModule,NgSelectModule],
   
})
export class DesignationComponent {
  @ViewChild('editdesignationTemplate') editdesignationTemplate!: TemplateRef<any>;
  selectedEmployee: any = null;
  isLoading = false;
  designationForm: FormGroup;
  // designationAssignmentId: string | null = null;
  editdesignationForm: FormGroup;
  allProjects: any[] = [];
  EmployeeList: any[] = [];
  designationList: any[] = [];
  // designationDesignation: any[] = [];
  projectForm: FormGroup;
  designationassignedEmployeeIDs: string[] = [];
  modalRef: any;
  designationmappingUniqueId: number;
  selectedDesignation: any = null;
  submit = false;
  isEditing = false;
  
  isNameDisabled = false;
  humanResourceList = [
    { label: 'ADMIN', value: 'ADMIN' },
    { label: 'HUMAN RESOURCE', value: 'HUMAN RESOURCE' },
    { label: 'MD', value: 'MD' },
    { label: 'MANAGER', value: 'MANAGER' },
    { label: 'TEAM LEAD', value: 'TEAM LEAD' },
    { label: 'CONSULTANT', value: 'CONSULTANT' },
    { label: 'ACCOUNTS', value: 'ACCOUNTS' }

];

  
  loginData: any;
  submitted: boolean;
  // designationAssignmentUniqueId: number;
  // form: any;

  constructor( private fb: FormBuilder,private toastr: ToastrService,private service: GeneralserviceService,private spinner: NgxSpinnerService, private modalService: NgbModal) {}
  ngOnInit(): void {
    this.loginData = this.service.getLoginResponse();
    this.designationForm = this.fb.group({
      humanResource: ['', Validators.required],
      SelectedEmployeeName:[, Validators.required],
          employeeFirstName: ['', Validators.required],
          status:['', Validators.required]   
    });
    
    this.getAllEmployeeList();
    this.getAlldesignationmapping();
    // this.getAlldesignations(); // fetch assigned designations
    this.editdesignationForm = this.fb.group({
      humanResource: ['', Validators.required],
      SelectedEmployeeName:[, Validators.required],
      employeeFirstName: ['', Validators.required],
      status:['', Validators.required]   
    });
   
  }
  get f() {
    return this.designationForm.controls;
  }
  // editdesignation(designation: any, template: TemplateRef<any>) {
  //   this.designationmappingUniqueId = designation.designationmappingUniqueId;
  //   this.selectedDesignation = designation;
  //   this.editdesignationForm.patchValue({
  //     designation: designation.humanResource,
  //     employeeID: designation.employeeID,
  //     employeeName: designation.employeeName,
  //     status: designation.status
      
      
  //   });
  //   this.modalService.open(this.editdesignationTemplate, {
  //     centered: true,
  //     backdrop: 'static',
  //     size: 'lg'
  // });
  // this.isEditing = true;
  // this.submit = false;
  // }
  editdesignation(designation: any) {
    this.designationmappingUniqueId = designation.designationmappingUniqueId;
    this.selectedDesignation = designation;
    console.log("this.selectedDesignation",this.selectedDesignation)
    this.editdesignationForm.patchValue({
      humanResource: designation.designation, // Changed from 'designation' to 'humanResource'
      employeeFirstName: designation.employeeID,
      SelectedEmployeeName: designation.employeeName,
      status: designation.status
    });
  
    this.modalRef = this.modalService.open(this.editdesignationTemplate, {
      centered: true,
      backdrop: 'static',
      size: 'lg'
    });
    
    this.isEditing = true;
    this.submit = false;
  }
 
  saveDesignation() {
    if (this.designationForm.invalid) {
        this.submit = true;
        this.designationForm.markAllAsTouched();
        return;
    }

    let employeeName;
    let employeeID;
    
    if (this.designationForm.value.employeeFirstName &&
        typeof this.designationForm.value.employeeFirstName === "object" &&
        "employeeID" in this.designationForm.value.employeeFirstName) {
          employeeName = this.designationForm.value.employeeFirstName.employeeFirstName;
          employeeID = this.designationForm.value.employeeFirstName.employeeID;
    } else {
      employeeName = this.designationForm.value.employeeFirstName;
    }
    
    let data = {
        designation: this.designationForm.value.humanResource,
        employeeName: employeeName,
        employeeID: employeeID,
        loggedInUser: this.loginData.data?.employeeID,
        status: this.designationForm.value.status
    };

    this.spinner.show();
    this.service.designationmapping(data).subscribe(
        (res: any) => {
            this.spinner.hide();
            if (res.status === 200 && !res.isExist) {
                // Clear the form
                this.designationForm.reset();
                this.submit = false;
                
                // Refresh the table data from server
                this.getAlldesignationmapping();
                
                Swal.fire({
                    text: res.message,
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
            } else {
                Swal.fire({
                    text: res.message,
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        },
        error => {
            this.spinner.hide();
            console.error("Save error:", error);
            this.toastr.error(error.message || 'An error occurred while saving the assignment.');
        }
    );
}
updateDesignationMapping() {
  if (this.editdesignationForm.invalid) {
    this.submit = true;
    return;
  }

  const data = {
    designationmappingUniqueId: this.designationmappingUniqueId,
    designation: this.editdesignationForm.value.humanResource,
    employeeID: this.editdesignationForm.value.employeeFirstName,
    employeeName: this.editdesignationForm.value.SelectedEmployeeName,
    status: this.editdesignationForm.value.status,
    loggedInUser: this.loginData.data?.employeeID
  };       


  this.spinner.show();
  this.service.updateDesignation(data).subscribe(
    (res: any) => {
      this.spinner.hide();
      if (res.status === 200) {
        this.modalRef.close();
        this.getAlldesignationmapping();
        Swal.fire({
          text: res.message,
          icon: 'success',
          confirmButtonText: 'OK'
        });
      } else {
        Swal.fire({
          text: res.message,
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    },
    error => {
      this.spinner.hide();
      this.toastr.error(error.message || 'Error updating designation');
    }
  );
}
deletedesignation(obj) {
    console.log("obj",obj)
    var data = obj
    // if (!obj || !obj.taskassignmentUniqueId) {
    //   console.error('Invalid data passed to deleteTask:', obj);
    //   this.toastr.error('Invalid task data');
    //   return;
    // }
  
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this designation?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      timer: 10000
    }).then((result) => {
      
      if (result.isConfirmed) {
        const obj = {
          globalId: data.designationmappingUniqueId,
          screenName: 'designationmapping'
        };
  
        this.spinner.show();
        this.service.deteleGlobal(obj).subscribe(
          (res: any) => {
            this.spinner.hide();
            if (res.status === 200) {
              this.getAlldesignationmapping();
              Swal.fire({
                title: 'Success',
                text: res.message,
                icon: 'success',
                confirmButtonText: 'OK',
                timer: 5000
              }).then(() => {
                this.modalService.dismissAll();
              });
            } else {
              this.toastr.error(res.message);
            }
          },
          (error) => {
            this.spinner.hide();
            console.error('Error deleting designation:', error);
            this.toastr.error('Failed to delete designation');
          }
        );
      }
    });
  }
  getAllEmployeeList() {
    this.EmployeeList = [];
    this.spinner.show();
    this.service.getAllEmployeeLists().subscribe((res: any) => {
      this.EmployeeList = res.data;
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
      console.log("error", error);
    });
  }
  onEmployeeChange(selectedEmployee: any) {
    console.log('Selected Employee:', selectedEmployee);
    this.selectedEmployee = selectedEmployee;
  
    this.designationForm.patchValue({
      SelectedEmployeeName: selectedEmployee.employeeFirstName
    });
  }
  getAlldesignationmapping() {
    this.isLoading = true;
    this.spinner.show();
    this.service.getAlldesignation().subscribe((res: any) => {
      this.designationList = res.data || [];
  
      // collect assigned employeeIDs
      this.designationassignedEmployeeIDs = this.designationList.map(item => item.employeeID);
      this.isLoading = false;
      this.spinner.hide();
  
      // now call employee list after assignments are ready
      // this.getAllEmployeeList();
    }, error => {
      this.isLoading = false;
      this.spinner.hide();
      console.log("Assignment error", error);
    });
  }

}
