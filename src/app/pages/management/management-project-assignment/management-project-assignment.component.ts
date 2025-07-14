import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GeneralserviceService } from 'src/app/generalservice.service'; 
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-management-project-assignment',
  templateUrl: './management-project-assignment.component.html',
  styleUrl: './management-project-assignment.component.css',
  imports: [CommonModule, ReactiveFormsModule, FormsModule,NgxSpinnerModule,NgSelectModule],
  standalone: true
})
export class ManagementProjectAssignmentComponent implements OnInit {

  @ViewChild('editprojectAssignmentTemplate') editprojectAssignmentTemplate!: TemplateRef<any>;
  projectForm: FormGroup;
  editForm:FormGroup;
  EmployeeList: any[];
  allProjects: any[] = [];
  submit = false;
  projectUniqueId: number;
  userRole: string = '';
  projectList: any[] = [];
  employeeList: any[] = [];
  currentAssignmentId: string | null = null;
  isEditing = false;
  submitted: boolean;
    allAssignment: any;
    assignedEmployeeIDs: string[] = [];
  constructor(
      private fb: FormBuilder,
      private http: HttpClient,
      private modalService: NgbModal,
      private service: GeneralserviceService,
      private toastr: ToastrService,
      private spinner: NgxSpinnerService,
      private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
      this.projectForm = this.fb.group({
        projectName: ['', Validators.required],
        SelectedEmployeeName:[, Validators.required],
          employeeFirstName: ['', Validators.required],
          projectStartDate: ['', Validators.required],
          projectEndDate: ['', Validators.required]
      });
      this.getAllProjects();
      this.getAllAssignments();
    //   this.getAllEmployeeLists();
      // this.route.queryParams.subscribe(params => {
      //     this.userRole = params['role'];
      //     console.log('User Role:', this.userRole);
      // });
      this.editForm = this.fb.group({
        employeeId: ['', Validators.required],
        SelectedEmployeeName:[, Validators.required],
        projectName: ['', Validators.required],
          projectStartDate: ['', Validators.required],
          projectEndDate: ['', Validators.required],
          status:['', Validators.required],
      });
  }
  onEmployeeChange(selectedEmployee: any) {
    console.log('Selected Employee:', selectedEmployee);
    this.projectForm.patchValue({
        "SelectedEmployeeName":this.projectForm.value.employeeFirstName.employeeFirstName
    })
  }
  get f() { return this.projectForm.controls; }

  // Save() {
  //     if (this.projectForm.invalid) {
  //         this.submit = true;
  //         this.projectForm.markAllAsTouched();
  //         this.toastr.error('All fields are required');
  //         return;
  //     }
  //   //   let projectNameObj;
  //   //   if (this.projectForm.value.projectName &&
  //   //       typeof this.projectForm.value.projectName === "object" &&
  //   //       "projectName" in this.projectForm.value.projectName) {
  //   //     projectNameObj = this.projectForm.value.projectName.projectName;
  //   //   } else {
  //   //     projectNameObj = this.projectForm.value.projectName;
  //   //   }
    
  //     let employeeName;
  //     let employeeID;
  //     console.log("this.projectForm.value.employeeFirstName",this.projectForm.value.employeeFirstName)
  //     if (this.projectForm.value.employeeFirstName &&
  //         typeof this.projectForm.value.employeeFirstName === "object" &&
  //         "employeeID" in this.projectForm.value.employeeFirstName) {
  //           employeeName = this.projectForm.value.employeeFirstName.employeeFirstName;
  //           employeeID = this.projectForm.value.employeeFirstName.employeeID;
  //     } else {
  //       employeeName = this.projectForm.value.employeeFirstName;
  //     }
  //     const projectNames = this.projectForm.value.projectName.map(project => ({
  //       projectName: project.projectName
  //     }));
      
  //     let data = {
  //         projectName: projectNames,
  //         employeeName: employeeName,
  //         employeeID:employeeID,
  //         projectStartDate: this.projectForm.value.projectStartDate,
  //         projectEndDate: this.projectForm.value.projectEndDate
  //     };

  //     this.spinner.show();
  //     this.service.SaveAssignment(data).subscribe(
  //         (res: any) => {
  //             this.spinner.hide();
  //             if (res.status === 200) {
  //                 this.getAllAssignments();
  //                 this.projectForm.reset();
  //                 Swal.fire({
  //                     text: res.message,
  //                     icon: 'success',
  //                     confirmButtonText: 'OK'
  //                 });
  //             } else {
  //                 this.toastr.error(res.message || 'Failed to save assignment.');
  //             }
  //         },
  //         error => {
  //             this.spinner.hide();
  //             console.error("Save error:", error);
  //             this.toastr.error(error.message || 'An error occurred while saving the assignment.');
  //         }
  //     );
  // }
  Save() {
    if (this.projectForm.invalid) {
        this.submit = true;
        this.projectForm.markAllAsTouched();
        // this.toastr.error('All fields are required');
        return;
    }
  //   let projectNameObj;
  //   if (this.projectForm.value.projectName &&
  //       typeof this.projectForm.value.projectName === "object" &&
  //       "projectName" in this.projectForm.value.projectName) {
  //     projectNameObj = this.projectForm.value.projectName.projectName;
  //   } else {
  //     projectNameObj = this.projectForm.value.projectName;
  //   }
  
    let employeeName;
    let employeeID;
    console.log("this.projectForm.value.employeeFirstName",this.projectForm.value.employeeFirstName)
    if (this.projectForm.value.employeeFirstName &&
        typeof this.projectForm.value.employeeFirstName === "object" &&
        "employeeID" in this.projectForm.value.employeeFirstName) {
          employeeName = this.projectForm.value.employeeFirstName.employeeFirstName;
          employeeID = this.projectForm.value.employeeFirstName.employeeID;
    } else {
      employeeName = this.projectForm.value.employeeFirstName;
    }
    let projectName = this.projectForm.value.projectName.projectName;
    
    let data = {
        projectName: projectName,
        employeeName: employeeName,
        employeeID:employeeID,
        projectStartDate: this.projectForm.value.projectStartDate,
        projectEndDate: this.projectForm.value.projectEndDate,
        status:"pending"
    };

    this.spinner.show();
    this.service.SaveAssignment(data).subscribe(
        (res: any) => {
            this.spinner.hide();
            if (res.status === 200 &&  res.isExit===false) {
                this.getAllAssignments();
                this.projectForm.reset();
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


  editprojectAssignment(assignment: any) {
      this.currentAssignmentId = assignment.assignmentUniqueId;
      console.log("assignment",assignment)
     
      this.editForm.patchValue({
        projectName: assignment.projectName,
        employeeId: assignment.employeeID,
          projectStartDate: assignment.projectStartDate,
          projectEndDate: assignment.projectEndDate,
          SelectedEmployeeName:assignment.employeeName,
          status:assignment.status
      });
      this.modalService.open(this.editprojectAssignmentTemplate, {
          centered: true,
          backdrop: 'static',
          size: 'lg'
      });
      this.isEditing = true;
      this.submit = false;
  }

  // UpdateAssignments() {
  //     this.submitted = true;
  //     if (this.editForm.invalid) {
  //         return;
  //     }
  //     let projectNameObj;
  //     if (this.editForm.value.projectName &&
  //         typeof this.editForm.value.projectName === "object" &&
  //         "projectName" in this.editForm.value.projectName) {
  //       projectNameObj = this.editForm.value.projectName.projectName;
  //     } else {
  //       projectNameObj = this.editForm.value.projectName;
  //     }
     
  //     let updatedata = {
  //       assignmentUniqueId: this.currentAssignmentId,
  //       projectName: projectNameObj,
  //       employeeID: this.editForm.value.employeeId,
  //         projectStartDate: this.editForm.value.projectStartDate,
  //         projectEndDate: this.editForm.value.projectEndDate,
  //         employeeName:this.editForm.value.SelectedEmployeeName

  //     };

  //     this.spinner.show();
  //     this.service.UpdateAssignments(updatedata).subscribe({
  //         next: (res: any) => {
  //             this.spinner.hide();
  //             if (res.status === 200) {
  //                 this.getAllAssignments();
  //                 this.modalService.dismissAll();
  //                 Swal.fire({
  //                     text: res.message,
  //                     icon: 'success',
  //                     confirmButtonText: 'OK'
  //                 });
  //             } else {
  //                 this.toastr.error(res.message || 'Failed to update assignment');
  //             }
  //         },
  //         error: (err) => {
  //             this.spinner.hide();
  //             this.toastr.error(err.error?.message || 'Error updating assignment');
  //         }
  //     });
  // }
  UpdateAssignments() {
    this.submitted = true;
    if (this.editForm.invalid) {
        return;
    }
    // let projectNameObj;
    // if (this.editForm.value.projectName &&
    //     typeof this.editForm.value.projectName === "object" &&
    //     "projectName" in this.editForm.value.projectName) {
    //   projectNameObj = this.editForm.value.projectName.projectName;
    // } else {
    //   projectNameObj = this.editForm.value.projectName;
    // }
    let projectName = this.editForm.value.projectName.projectName; // Get single project name

   
    let updatedata = {
      assignmentUniqueId: this.currentAssignmentId,
      projectName: projectName,
      employeeID: this.editForm.value.employeeId,
        projectStartDate: this.editForm.value.projectStartDate,
        projectEndDate: this.editForm.value.projectEndDate,
        employeeName:this.editForm.value.SelectedEmployeeName,
        status:this.editForm.value.status

    };

    this.spinner.show();
    this.service.UpdateAssignments(updatedata).subscribe({
        next: (res: any) => {
            this.spinner.hide();
            if (res.status === 200) {
                this.getAllAssignments();
                this.modalService.dismissAll();
                Swal.fire({
                    text: res.message,
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
            } else {
                this.toastr.error(res.message || 'Failed to update assignment');
            }
        },
        error: (err) => {
            this.spinner.hide();
            this.toastr.error(err.error?.message || 'Error updating assignment');
        }
    });
}


  // delete(data): void {
  //     Swal.fire({
  //         title: 'Are you sure?',
  //         text: "Do you want to delete this service assignment?",
  //         icon: 'warning',
  //         showCancelButton: true,
  //         confirmButtonColor: '#3085d6',
  //         cancelButtonColor: '#d33',
  //         confirmButtonText: 'Yes, delete it!',
  //         timer: 10000
  //     }).then((result) => {
  //         if (result.isConfirmed) {
  //             this.projectUniqueId = data.assignmentUniqueId;
  //             let deletePayload = {
  //                 globalId: this.projectUniqueId,
  //                 screenName: "assignment"
  //             };

  //             this.spinner.show();
  //             this.service.deteleGlobal(deletePayload).subscribe(
  //                 (res: any) => {
  //                     this.spinner.hide();
  //                     if (res.status === 200) {
  //                         Swal.fire({
  //                             title: 'Success',
  //                             text: res.message,
  //                             icon: 'success',
  //                             confirmButtonText: 'OK',
  //                             timer: 5000
  //                         }).then(() => {
  //                             this.modalService.dismissAll();
  //                         });
  //                         this.getAllAssignments();
  //                     } else {
  //                         this.toastr.error(res.message);
  //                     }
  //                 },
  //                 (error) => {
  //                     this.spinner.hide();
  //                     console.error("Error deleting service assignment:", error);
  //                     this.toastr.error("Failed to delete service assignment");
  //                 }
  //             );
  //         }
  //     });
  // }

//   getAllAssignments() {
//       this.spinner.show();
//       this.service.getAllAssignments().subscribe((res: any) => {
//           this.allAssignment = res.data;
//           this.spinner.hide();
//       }, error => {
//           console.error("Error fetching assignments:", error);
//           this.spinner.hide();
//       });
//   }

getAllAssignments() {
    this.spinner.show();
    this.service.getAllAssignments().subscribe((res: any) => {
      this.allAssignment = res.data || [];
  
      // collect assigned employeeIDs
      this.assignedEmployeeIDs = this.allAssignment.map(item => item.employeeID);
  
      this.spinner.hide();
  
      // now call employee list after assignments are ready
      this.getAllEmployeeLists();
    }, error => {
      this.spinner.hide();
      console.log("Assignment error", error);
    });
  }

  getAllProjects() {
    this.spinner.show();
    this.service.getAllProjects().subscribe((res: any) => {
        console.log("res.data",res.data)
      this.allProjects = res.data;
      console.log("this.allProjects",this.allProjects)
      this.spinner.hide();
    }, error => {
      console.error('Error fetching projects:', error);
      this.spinner.hide();
    });
  }
//   getAllEmployeeLists(){
//     this.EmployeeList = [];
//     this.spinner.show()
//     this.service.getAllEmployeeLists().subscribe((res:any)=>{
//       this.EmployeeList = res.data
//       this.spinner.hide()
//       console.log("this.EmployeeList",this.EmployeeList)
//     },error =>{
//       this.spinner.hide()
//     console.log("error",error)
//     })
//   }
getAllEmployeeLists() {
    this.spinner.show();
    this.service.getAllEmployeeLists().subscribe((res: any) => {
      this.EmployeeList = res.data || [];
  console.log("this.assignedEmployeeIDs",this.assignedEmployeeIDs)
      // filter out already assigned employees
      // this.EmployeeList = allEmployees.filter(emp =>
      //   !this.assignedEmployeeIDs.includes(emp.employeeID)
      // );
  
      this.spinner.hide();
      console.log("Filtered EmployeeList", this.EmployeeList);
    }, error => {
      this.spinner.hide();
      console.log("Employee list error", error);
    });
  }

}
