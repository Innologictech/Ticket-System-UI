import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { GeneralserviceService } from 'src/app/generalservice.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-management-task-assignment',
  templateUrl: './management-task-assignment.component.html',
  styleUrl: './management-task-assignment.component.css',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule,NgxSpinnerModule,NgSelectModule]

})
export class ManagementTaskAssignmentComponent implements OnInit  {

   @ViewChild('edittaskTemplate') edittaskTemplate!: TemplateRef<any>;
  
    taskForm: FormGroup;
    taskAssignmentId: string | null = null;
    edittaskForm: FormGroup;
    allProjects: any[] = [];
    EmployeeList: any[] = [];
    taskAssignments: any[] = [];
    taskassignedEmployeeIDs: string[] = [];
    modalRef: any;
    submit = false;
    isEditing = false;
    loginData: any;
    submitted: boolean;
    selectedTask: any = null;
    taskAssignmentUniqueId: number;
  filteredProjects: any[] = [];
  allAssignment: any;
    constructor( private fb: FormBuilder,private toastr: ToastrService,private service: GeneralserviceService,private spinner: NgxSpinnerService, private modalService: NgbModal) {}
  
    ngOnInit(): void {
      this.loginData = this.service.getLoginResponse();
      console.log('this.loginData', this.loginData);
      this.taskForm = this.fb.group({
        SelectedProjectName: ['', Validators.required],
        employeeID: ['', Validators.required],
        description: ['', Validators.required],
        status:[''],
        TaskDate: ['', Validators.required],
      });
      // this.getAllProjects();
      this.getAllEmployeeLists();
      this.getAlltaskAssignments();
     this.getAllAssignments()
      // this.getAllTasks(); // fetch assigned tasks
      this.edittaskForm = this.fb.group({
        SelectedProjectName: ['', Validators.required],
        employeeID: ['', Validators.required],
        description: ['', Validators.required],
          status:[''],
          TaskDate: ['', Validators.required],
  
      });
    }
    onEmployeeSelect(selectedEmployee: any) {
      this.allProjects = []
      console.log('Selected Employee:', selectedEmployee);
    
      this.taskForm.patchValue({
        SelectedProjectName: this.taskForm.value. selectedEmployee?.projectName || ''
      });


      this.allProjects =this.allAssignment.filter(item=>item.employeeID === selectedEmployee.employeeID)

      console.log("allProjects",this.allProjects)
    }
    
    get f() {
      return this.taskForm.controls;
    }
    getAllProjects() {
      this.spinner.show();
      this.service.getAllProjects().subscribe((res: any) => {
        this.allProjects = res.data;
        this.spinner.hide();
      }, error => {
        console.error('Error fetching projects:', error);
        this.spinner.hide();
      });
    }
  
    getAllEmployeeLists() {
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
  
    getAllAssignments() {
      this.spinner.show();
      this.service.getAllAssignments().subscribe((res: any) => {
        this.allAssignment = res.data || [];

        console.log("allAssignment",this.allAssignment)

      }, error => {
        this.spinner.hide();
        console.log("Assignment error", error);
      });
    }
  
  
    // saveTask() {
    //   this.submit = true; 
    //   // if (!this.taskForm.get('projectName').valid || !this.taskForm.get('employeeID').valid || !this.taskForm.get('description').valid) {
    //   //   this.submit = true;
    //   //   this.taskForm.markAllAsTouched();
    //   //   this.toastr.error('Customer name and service name are required');
    //   //   return;
    //   // }
    //   if (this.taskForm.invalid) {
    //     return;
    //   }
    //     // let employeeID;
    //     console.log("this.taskForm.value.employeeID",this.taskForm.value.employeeID)
        
    //     // if (this.taskForm.value.employeeID &&
    //     //     "employeeID" in this.taskForm.value.employeeID) {
    //     //       employeeID = this.taskForm.value.employeeID.employeeID;
    //     // }
    //     let employeeID = this.taskForm.value.employeeID.employeeID
    //     let projectName = this.taskForm.value.projectName.projectName;
        
    //     let data = {
    //         projectName: projectName,
    //         employeeID:employeeID,
    //         description: this.taskForm.value.description,
    //         status: this.taskForm.value.status,
    //         TaskDate: this.taskForm.value.TaskDate,
    //         assignedBy: this.loginData.data?.employeeID // or however you store current user info
    //     };
    
    //     this.spinner.show();
    //     this.service.SaveTaskAssignment(data).subscribe(
    //         (res: any) => {
    //             this.spinner.hide();
    //             if (res.status === 200) {
    //                 this.getAlltaskAssignments();
    //                 this.taskForm.reset();
    //                 // this.modalService.dismissAll();
    //                 Swal.fire({
    //                     text: res.message,
    //                     icon: 'success',
    //                     confirmButtonText: 'OK'
    //                 });
    //             } else {
    //               Swal.fire({
    //                 text: res.message,
    //                 icon: 'error',
    //                 confirmButtonText: 'OK'
    //             });
    //             }
    //         },
    //         error => {
    //             this.spinner.hide();
    //             console.error("Save error:", error);
    //             this.toastr.error(error.message || 'An error occurred while saving the assignment.');
    //         }
    //     );
    // }
    saveTask() {
      this.submit = true;
  
      if (this.taskForm.invalid) {
          return;
      }
  
      let employeeID;
      console.log("this.taskForm.value.employeeID", this.taskForm.value.employeeID);
  
      if (
          this.taskForm.value.employeeID &&
          typeof this.taskForm.value.employeeID === "object" &&
          "employeeID" in this.taskForm.value.employeeID
      ) {
          employeeID = this.taskForm.value.employeeID.employeeID;
      } else {
          employeeID = this.taskForm.value.employeeID;
      }
     console.log('this.taskForm.value.projectName',this.taskForm.value.SelectedProjectName)
      let projectName;
      if (
          this.taskForm.value.SelectedProjectName &&
          typeof this.taskForm.value.SelectedProjectName === "object" &&
          "projectName" in this.taskForm.value.SelectedProjectName
      ) {
          projectName = this.taskForm.value.SelectedProjectName.projectName;
      } else {
          projectName = this.taskForm.value.SelectedProjectName;
      }
  
      let data = {
          projectName: projectName,
          employeeID: employeeID,
          description: this.taskForm.value.description,
          status: this.taskForm.value.status,
          TaskDate: this.taskForm.value.TaskDate,
          assignedBy: this.loginData.data?.employeeID
      };
  
      this.spinner.show();
      this.service.SaveTaskAssignment(data).subscribe(
          (res: any) => {
              this.spinner.hide();  
              if (res.status === 200) {
                this.submit  = false
                  this.getAlltaskAssignments();
                  this.taskForm.reset();
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
  
  
    editTask(task: any, template: TemplateRef<any>) {
      this.taskAssignmentUniqueId = task.taskassignmentUniqueId;
      this.selectedTask = task;
      this.edittaskForm.patchValue({
        SelectedProjectName: task.projectName,
        employeeID: task.employeeID,
        description: task.description,
        TaskDate: task.TaskDate,
        status: task.status
        
        
      });
      this.modalService.open(this.edittaskTemplate, {
        centered: true,
        backdrop: 'static',
        size: 'lg'
    });
    this.isEditing = true;
    this.submit = false;
    }
  
   
      UpdateAssignments() {
        this.submitted = true;
        if (this.edittaskForm.invalid) {
            return;
        }
     
        let projectName = this.edittaskForm.value.projectName; // Get single project name
    
       
        let updatedata = {
          taskassignmentUniqueId: this.taskAssignmentUniqueId,
          projectName: this.edittaskForm.value.SelectedProjectName,
          employeeID: this.edittaskForm.value.employeeID,
          description: this.edittaskForm.value.description,
          TaskDate: this.edittaskForm.value.TaskDate,
          status:this.edittaskForm.value.status
    
        };
    
        this.spinner.show();
        this.service.UpdateTaskAssignments(updatedata).subscribe({
            next: (res: any) => {
                this.spinner.hide();
                if (res.status === 200) {
                    this.getAlltaskAssignments();
                    
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
    getAlltaskAssignments() {
      this.spinner.show();
      this.service.getAllTaskAssignments().subscribe((res: any) => {
        this.taskAssignments = res.data || [];
        console.log("this.taskAssignments",this.taskAssignments)
    
        // collect assigned employeeIDs
        this.taskassignedEmployeeIDs = this.taskAssignments.map(item => item.employeeID);
    
        this.spinner.hide();
    
        // now call employee list after assignments are ready
        // this.getAllEmployeeLists();
      }, error => {
        this.spinner.hide();
        console.log("Assignment error", error);
      });
    }
   
    // deleteTask(taskId: number) {
    //   if (confirm('Are you sure you want to delete this task assignment?')) {
    //     this.spinner.show();
    //     this.service.deleteTaskAssignment(taskId).subscribe(() => {
    //       this.spinner.hide();
    //       this.loadTaskAssignments();
    //     }, error => {
    //       console.error('Error deleting task:', error);
    //       this.spinner.hide();
    //     });
    //   }
    // }
    deleteTask(obj) {
      console.log("obj",obj)
      var data = obj
      // if (!obj || !obj.taskassignmentUniqueId) {
      //   console.error('Invalid data passed to deleteTask:', obj);
      //   this.toastr.error('Invalid task data');
      //   return;
      // }
    
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to delete this project?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
        timer: 10000
      }).then((result) => {
        
        if (result.isConfirmed) {
          const obj = {
            globalId: data.taskassignmentUniqueId,
            screenName: 'taskassignment'
          };
    
          this.spinner.show();
          this.service.deteleGlobal(obj).subscribe(
            (res: any) => {
              this.spinner.hide();
              if (res.status === 200) {
                this.getAlltaskAssignments();
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
              console.error('Error deleting project:', error);
              this.toastr.error('Failed to delete project');
            }
          );
        }
      });
    }
    
  
    resetForm() {
      this.taskForm.reset();
      this.selectedTask = null;
      this.submit = false;
    }
  
  }
  