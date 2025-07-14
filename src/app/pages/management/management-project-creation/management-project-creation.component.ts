import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GeneralserviceService } from 'src/app/generalservice.service'; 
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-management-project-creation',
  templateUrl: './management-project-creation.component.html',
  styleUrl: './management-project-creation.component.css',
  imports: [CommonModule, ReactiveFormsModule, FormsModule,NgxSpinnerModule,NgSelectModule],
  standalone: true
})
export class ManagementProjectCreationComponent implements OnInit{

  @ViewChild('editProjectTemplate') editProjectTemplate!: TemplateRef<any>;

  projectForm: FormGroup;
  allProjects: any[] = [];
  submit = false;
  projectUniqueId: number;
  userRole: string = '';
  costCenterList: any[] = []; // Assuming you have a list of cost centers
  statusOptions = [
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' }
  ];
  servicesEditForm: FormGroup;
  currentProjectId: string | null = null;
  isEditing = false;
  submitted: boolean;
  loginData: any;

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
      costCenter: ['', Validators.required],
      status: ['', Validators.required]
    });
    this.getAllProjects();
    // this.getAllCostCenterList(); // Fetch cost centers
    // this.route.queryParams.subscribe(params => {
    //   this.userRole = params['role'];
    //   console.log('User Role:', this.userRole);
    // });
    this.loginData = this.service.getLoginResponse()

  }

  get f() { return this.projectForm.controls; }

  Save() {
    if (this.projectForm.invalid) {
      this.submit = true;
      this.projectForm.markAllAsTouched();
      // this.toastr.error('Please fill in all required fields.');
      return;
    }

    const data = {
      projectName: this.projectForm.value.projectName,
      costCenter: this.projectForm.value.costCenter,
      status: this.projectForm.value.status,
      loggedInUser:this.loginData.data?.employeeID,
      createdDate : ""

    };

    this.spinner.show();
    this.service.SaveProjects(data).subscribe(
      (res: any) => {
        this.spinner.hide();
        if (res.status === 200) {
          this.getAllProjects();
          this.projectForm.reset();
          Swal.fire({
            text: res.message,
            icon: 'success',
            confirmButtonText: 'OK'
          });
        } else {
          this.toastr.error(res.message || 'Failed to save project.');
        }
      },
      error => {
        this.spinner.hide();
        console.error('Error saving project:', error);
        this.toastr.error('An error occurred while saving the project.');
      }
    );
  }

  editProject(project: any) {
    this.currentProjectId = project.projectUniqueId;
    this.projectForm.patchValue({
      projectName: project.projectName,
      costCenter: project.costCenter,
      status: project.status
    });

    this.modalService.open(this.editProjectTemplate, {
      centered: true,
      backdrop: 'static',
      size: 'lg'
    });

    this.isEditing = true;
    this.submit = false;
  }

  updateProject() {
    this.submitted = true;
    if (this.projectForm.invalid) {
      return;
    }
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
    const updateData = {
      projectUniqueId: this.currentProjectId,
      projectName: this.projectForm.value.projectName,
      costCenter: this.projectForm.value.costCenter,
      status: this.projectForm.value.status,
       loggedInUser:this.loginData.data?.employeeID,
      createdDate :formattedDate
    };

    this.spinner.show();
    this.service.UpdateProjects(updateData).subscribe({
      next: (res: any) => {
        this.spinner.hide();
        if (res.status === 200) {
          this.getAllProjects();
          this.modalService.dismissAll();
          Swal.fire({
            text: res.message,
            icon: 'success',
            confirmButtonText: 'OK'
          });
        } else {
          this.toastr.error(res.message || 'Failed to update project');
        }
      },
      error: (err) => {
        this.spinner.hide();
        this.toastr.error(err.error?.message || 'Error updating project');
      }
    });
  }

  delete(data): void {
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
        this.projectUniqueId = data.projectUniqueId;

        const deletePayload = {
          globalId: this.projectUniqueId,
          screenName: 'project'
        };

        this.spinner.show();
        this.service.deteleGlobal(deletePayload).subscribe(
          (res: any) => {
            this.spinner.hide();
            if (res.status === 200) {
              this.getAllProjects();
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

 
}
