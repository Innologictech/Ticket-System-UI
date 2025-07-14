import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { GeneralserviceService } from 'src/app/generalservice.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-task-management',
  templateUrl: './task-management.component.html',
  styleUrl: './task-management.component.css',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NgxSpinnerModule, NgSelectModule],

})
export class TaskManagementComponent {
  @ViewChild('editreportingTemplate') editreportingTemplate!: TemplateRef<any>;
  isLoading = false;
  designationList: any[] = [];
  designationassignedEmployeeIDs: string[] = [];
  reportingassignedEmployeeIDs: string[] = [];
  reportingForm: FormGroup;
  reportingAssignmentId: string | null = null;
  editreportingForm: FormGroup;
  allProjects: any[] = [];
  EmployeeList: any[] = [];
  reportingManagement: any[] = [];
  modalRef: any;
  submit = false;
  isEditing = false;
  loginData: any;
  submitted: boolean;
  selectedreporting: any = null;
  reportingmappingUniqueId: number;

  hrDropdownList: any[] = [];
  mdDropdownList: any[] = [];
  managerDropdownList: any[] = [];
  teamLeadDropdownList: any[] = [];
  teamMemberDropdownList: any[] = [];

  constructor(private fb: FormBuilder, private toastr: ToastrService, private service: GeneralserviceService, private spinner: NgxSpinnerService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.loginData = this.service.getLoginResponse();
    this.reportingForm = this.fb.group({
      HRname: ['', Validators.required],
      ManagerName: ['', Validators.required],
      MD: ['', Validators.required],
      TeamLead: ['', Validators.required],
      TeamMember: ['', Validators.required]
    });

    this.getAllreportingmapping();
    this.getAlldesignationmapping();
    // this.getAllreportings(); // fetch assigned reportings
    this.editreportingForm = this.fb.group({
      HRname: ['', Validators.required],
      ManagerName: ['', Validators.required],
      MD: ['', Validators.required],
      TeamLead: ['', Validators.required],
      TeamMember: ['', Validators.required]
    });

  }
  get f() {
    return this.reportingForm.controls;
  }
  editreporting(reporting: any) {
    this.reportingmappingUniqueId = null
    this.reportingmappingUniqueId = reporting.reportingmappingUniqueId;
    this.selectedreporting = reporting;
console.log("this.selectedreporting",this.selectedreporting)
    this.editreportingForm.patchValue({
      HRname: reporting.HRName+'-' +reporting.HRId, // Changed from 'designation' to 'humanResource'
      ManagerName: reporting.ManagerName+'-' +reporting.ManagerId,
      MD: reporting.MDName+'-' +reporting.MDId,
      TeamLead: reporting.TeamLead+'-' +reporting.TeamId,
      TeamMember: reporting.TeamMemberName+'-' +reporting.TeamMemberId,
      
    });

    this.modalRef = this.modalService.open(this.editreportingTemplate, {
      centered: true,
      backdrop: 'static',
      size: 'lg'
    });

    this.isEditing = true;
    this.submit = false;
  }
  savereporting() {
    if (this.reportingForm.invalid) {
      this.submit = true;
      this.reportingForm.markAllAsTouched();
      return;
    }

    let hrParts = (this.reportingForm.value.HRname || '').split('-');
    let mdParts = (this.reportingForm.value.MD || '').split('-');
    let managerParts = (this.reportingForm.value.ManagerName || '').split('-');
    let teamParts = (this.reportingForm.value.TeamLead || '').split('-');
    let teamMemberParts = (this.reportingForm.value.TeamMember || '').split('-');
    
    let data = {
      HRId: hrParts[1] || '',
      HRName: hrParts[0] || '',
      MDId: mdParts[1] || '',
      MDName: mdParts[0] || '',
      ManagerId: managerParts[1] || '',
      ManagerName: managerParts[0] || '',
      TeamId: teamParts[1] || '',
      TeamLead: teamParts[0] || '',
      TeamMemberId: teamMemberParts[1] || '',
      TeamMemberName: teamMemberParts[0] || '',
      loggedInUser: this.loginData?.data?.employeeID || '',
    };
    


    this.spinner.show();
    this.service.reportingmapping(data).subscribe(
      (res: any) => {
        this.spinner.hide();
        if (res.status === 200 && !res.isExist) {
          // Clear the form
          this.reportingForm.reset();
          this.submit = false;

          // Refresh the table data from server
          this.getAllreportingmapping();

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
  updatereportingMapping() {
    if (this.editreportingForm.invalid) {
      this.submit = true;
      return;
    }
    let hrParts = (this.editreportingForm.value.HRname || '').split('-');
    let mdParts = (this.editreportingForm.value.MD || '').split('-');
    let managerParts = (this.editreportingForm.value.ManagerName || '').split('-');
    let teamParts = (this.editreportingForm.value.TeamLead || '').split('-');
    let teamMemberParts = (this.editreportingForm.value.TeamMember || '').split('-');
    
    let data = {
      HRId: hrParts[1] || '',
      HRName: hrParts[0] || '',
      MDId: mdParts[1] || '',
      MDName: mdParts[0] || '',
      ManagerId: managerParts[1] || '',
      ManagerName: managerParts[0] || '',
      TeamId: teamParts[1] || '',
      TeamLead: teamParts[0] || '',
      TeamMemberId: teamMemberParts[1] || '',
      TeamMemberName: teamMemberParts[0] || '',
      loggedInUser: this.loginData?.data?.employeeID || '',
      reportingmappingUniqueId:this.reportingmappingUniqueId
    };
    // const data = {
    //   reportingmappingUniqueId: this.reportingmappingUniqueId,
    //   HRId: this.editreportingForm.value.HRId,
    //   MDId: this.editreportingForm.value.MDId,
    //   ManagerId: this.editreportingForm.value.ManagerId,
    //   TeamId: this.editreportingForm.value.TeamId,
    //   TeamMemberId: this.editreportingForm.value.TeamMemberId,
    //   loggedInUser: this.loginData.data?.employeeID,
    // };


    this.spinner.show();
    this.service.Updatereporting(data).subscribe(
      (res: any) => {
        this.spinner.hide();
        if (res.status === 200) {
          this.modalRef.close();
          this.getAllreportingmapping();
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
        this.toastr.error(error.message || 'Error updating reporting');
      }
    );
  }
  deletereporting(obj) {
    console.log("obj", obj)
    var data = obj
    // if (!obj || !obj.reportingassignmentUniqueId) {
    //   console.error('Invalid data passed to deletereporting:', obj);
    //   this.toastr.error('Invalid reporting data');
    //   return;
    // }

    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this reporting?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      timer: 10000
    }).then((result) => {

      if (result.isConfirmed) {
        const obj = {
          globalId: data.reportingmappingUniqueId,
          screenName: 'reportingmapping'
        };

        this.spinner.show();
        this.service.deteleGlobal(obj).subscribe(
          (res: any) => {
            this.spinner.hide();
            if (res.status === 200) {
              this.getAllreportingmapping();
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
            console.error('Error deleting reporting:', error);
            this.toastr.error('Failed to delete reporting');
          }
        );
      }
    });
  }
  getAllreportingmapping() {
    this.isLoading = true;
    this.spinner.show();
    this.service.getAllreporting().subscribe((res: any) => {
      this.reportingManagement = res.data || [];
       console.log("this.reportingManagement",this.reportingManagement)
      // collect assigned employeeIDs
      this.reportingassignedEmployeeIDs = this.reportingManagement.map(item => item.employeeID);
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
  // getAlldesignationmapping() {
  //   this.isLoading = true;
  //   this.spinner.show();
  //   this.service.getAlldesignation().subscribe((res: any) => {
  //     this.designationList = res.data || [];

  //     // collect assigned employeeIDs
  //     this.designationassignedEmployeeIDs = this.designationList.map(item => item.employeeID);
  //     this.isLoading = false;
  //     this.spinner.hide();

  //     // now call employee list after assignments are ready
  //     // this.getAllEmployeeList();
  //   }, error => {
  //     this.isLoading = false;
  //     this.spinner.hide();
  //     console.log("Assignment error", error);
  //   });
  // }
  getAlldesignationmapping() {
    this.isLoading = true;
    this.spinner.show();
    this.service.getAlldesignation().subscribe((res: any) => {
      this.designationList = res.data || [];

      this.hrDropdownList = this.designationList
        .filter(employee => employee.status === 'Active' && employee.designation === 'HUMAN RESOURCE')
        .map(employee => ({ name: `${employee.employeeName}-${employee.employeeID}`, employeeID: employee.employeeID }));
      console.log("this.hrDropdownList", this.hrDropdownList)
      this.mdDropdownList = this.designationList
        .filter(employee => employee.status === 'Active' && employee.designation === 'MD') // Assuming you still need 'MD' - adjust if your API has a different value
        .map(employee => ({ name: `${employee.employeeName}-${employee.employeeID}`, employeeID: employee.employeeID }));

      this.managerDropdownList = this.designationList
        .filter(employee => employee.status === 'Active' && employee.designation === 'MANAGER')
        .map(employee => ({ name: `${employee.employeeName}-${employee.employeeID}`, employeeID: employee.employeeID }));

      this.teamLeadDropdownList = this.designationList
        .filter(employee => employee.status === 'Active' && employee.designation === 'TEAM LEAD') // Adjust if your API has a different value for Team Lead
        .map(employee => ({ name: `${employee.employeeName}-${employee.employeeID}`, employeeID: employee.employeeID }));

      this.teamMemberDropdownList = this.designationList
        .filter(employee => employee.status === 'Active' && employee.designation === 'CONSULTANT') // Assuming "Team" maps to "Team Member" - adjust if needed
        .map(employee => ({ name: `${employee.employeeName}-${employee.employeeID}`, employeeID: employee.employeeID }));

      this.designationassignedEmployeeIDs = this.designationList.map(item => item.employeeID);
      this.isLoading = false;
      this.spinner.hide();
    }, error => {
      this.isLoading = false;
      this.spinner.hide();
      console.log("Assignment error", error);
    });
  }

}
