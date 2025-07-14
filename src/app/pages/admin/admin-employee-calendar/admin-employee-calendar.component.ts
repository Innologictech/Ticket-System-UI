import { Component, OnInit, ViewChild, ViewEncapsulation, TemplateRef, ElementRef } from '@angular/core';
import { UntypedFormBuilder, Validators, UntypedFormGroup, ReactiveFormsModule } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi } from '@fullcalendar/core';;
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { NgxSpinnerService } from 'ngx-spinner';

import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { category, calendarEvents, createEventId } from 'src/app/pages/calendar/data';

import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { LoaderComponent } from 'src/app/shared/ui/loader/loader.component';
import { PagetitleComponent } from 'src/app/shared/ui/pagetitle/pagetitle.component';
import { FormsModule } from '@angular/forms';
import { GeneralserviceService } from 'src/app/generalservice.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-admin-employee-calendar',
  templateUrl: './admin-employee-calendar.component.html',
  styleUrl: './admin-employee-calendar.component.css',
  standalone:true,
  imports:[PagetitleComponent,FormsModule, NgSelectModule,LoaderComponent,CommonModule,FullCalendarModule,ReactiveFormsModule]

})
export class AdminEmployeeCalendarComponent {


    modalRef?: BsModalRef;
    @ViewChild('fullcalendar', { static: false }) calendarComponent: any;
    // bread crumb items
    breadCrumbItems: Array<{}>;
  
    @ViewChild('modalShow') modalShow: TemplateRef<any>;
    @ViewChild('editmodalShow') editmodalShow: TemplateRef<any>;
  
    formEditData: UntypedFormGroup;
    submitted = false;
    category: any[];
    newEventDate: any;
    editEvent: any;
    // employeeId: string = '';
    // EmployeeList: any[] = [];
    calendarEvents: any[];
    // event form
    formData: UntypedFormGroup;
  
    calendarOptions: CalendarOptions = {
      plugins: [
        interactionPlugin,
        dayGridPlugin,
        timeGridPlugin,
        listPlugin,
      ],
      headerToolbar: {
        left: 'dayGridMonth,dayGridWeek,dayGridDay',
        center: 'title',
        right: 'prevYear,prev,next,nextYear'
      },
      initialView: "dayGridMonth",
      themeSystem: "bootstrap",
      initialEvents: calendarEvents,
      weekends: true,
      editable: true,
      selectable: true,
      selectMirror: true,
      dayMaxEvents: true,
      dateClick: this.openModal.bind(this),
      eventClick: this.handleEventClick.bind(this),
      eventsSet: this.handleEvents.bind(this),
      eventTimeFormat: { // like '14:30:00'
        hour: '2-digit',
        minute: '2-digit',
        meridiem: false,
        hour12: true
      }
    };
    
    currentEvents: EventApi[] = [];
  // assignedEmployeeIDs: any;
  EmployeeList: any[] = [];
  employeeID: string = '';
assignedEmployeeIDs: string[] = [];
  selectedYear: number = 0;
  selectedMonth: string = '';
  employeeList: any;
  loginData: any;

 
  
    ngOnInit(): void {
      this.loginData= this.service.getLoginResponse()
   console.log("this.loginData",this.loginData);
      console.log('test');
      this.getAllEmployeeList();
      this.breadCrumbItems = [{ label: 'Skote' }, { label: 'Calendar', active: true }];
  
      this.formData = this.formBuilder.group({
        title: ['', [Validators.required]],
        category: ['', [Validators.required]],
      });
  
      this.formEditData = this.formBuilder.group({
        editTitle: ['', [Validators.required]],
        editCategory: [],
      });
      this._fetchData();
      this.loadEmployeeList();
      
  
    }
    ngAfterViewInit(): void {
      // ✅ MOVE IT HERE
      // this.getEmployeeData();
    }
  
    /**
     * Event click modal show
     */
    
    
  
    /**
     * Events bind in calander
     * @param events events
     */
    handleEvents(events: EventApi[]) {
      console.log("handleEvents",events)
      this.currentEvents = events;
  
    }
  
    constructor(
      private modalService: BsModalService,
      private service: GeneralserviceService,
      private formBuilder: UntypedFormBuilder,private spinner:NgxSpinnerService,private toaster: ToastrService
    ) { }
  
    get form() {
      return this.formData.controls;
    }
  
    /**
     * Delete-confirm
     */
    confirm() {
      Swal.fire({
        title: 'Are you sure?',
        text: 'You won\'t be able to revert this!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#34c38f',
        cancelButtonColor: '#f46a6a',
        confirmButtonText: 'Yes, delete it!',
      }).then((result) => {
        if (result.value) {
          this.deleteEventData();
          Swal.fire('Deleted!', 'Event has been deleted.', 'success');
        }
      });
    }
  
    position() {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Event has been saved',
        showConfirmButton: false,
        timer: 1000,
      });
    }
  
    /**
     * Event add modal
     */
    openModal(event?: any) {
      console.log("openModal",event)
      this.newEventDate = event;
      // this.modalRef = this.modalService.show(this.modalShow);
    }
  
    /**
     * save edit event data
     */
    editEventSave() {
      const editTitle = this.formEditData.get('editTitle').value;
      const editCategory = this.formEditData.get('editCategory').value;
  
      const editId = this.calendarEvents.findIndex(
        (x) => x.id + '' === this.editEvent.id + ''
      );
  
      this.editEvent.setProp('title', editTitle);
      this.editEvent.setProp('classNames', editCategory);
  
      this.calendarEvents[editId] = {
        ...this.editEvent,
        title: editTitle,
        id: this.editEvent.id,
        classNames: editCategory + ' ' + 'text-white',
      };
  
      this.position();
      this.formEditData = this.formBuilder.group({
        editTitle: '',
        editCategory: '',
      });
      this.modalService.hide();
    }
  
    /**
     * Delete event
     */
    deleteEventData() {
      this.editEvent.remove();
      this.modalService.hide();
    }
  
    /**
     * Close event modal
     */
    closeEventModal() {
      this.formData = this.formBuilder.group({
        title: '',
        category: '',
      });
      this.modalService.hide();
    }
  
    /**
     * Save the event
     */
    saveEvent() {
      if (this.formData.valid) {
        const title = this.formData.get('title').value;
        const className = this.formData.get('category').value;
        const calendarApi = this.newEventDate.view.calendar;
        calendarApi.addEvent({
          id: createEventId(),
          title,
          start: this.newEventDate.date,
          end: this.newEventDate.date,
          className: className + ' ' + 'text-white'
        });
        this.position();
        this.formData = this.formBuilder.group({
          title: '',
          category: '',
        });
        this.modalService.hide();
      }
      this.submitted = true;
    }
  
    /**
     * Fetches the data
     */
    private _fetchData() {
      // Event category
      this.category = category;
      // Calender Event Data
      this.calendarEvents = calendarEvents;
      // form submit
      this.submitted = false;
    }
  
    dropList(event: CdkDragDrop<string[]>): void {
      moveItemInArray(this.listItems, event.previousIndex, event.currentIndex);
    }
    listItems = ['Event 1', 'Event 2', 'Event 3'];
    handleDrop(event: any): void {
      console.log("event",event)
      // this.calendarEvents.push({
      //   title: event.item.data,
      //   date: event.dateStr,
      // });
    }
    getAllEmployeeList() {

      this.service.getAllEmployeeLists().subscribe(
        (res: any) => {
          const allEmployees = res.data || [];
          this.EmployeeList = allEmployees.filter(emp =>
            !this.assignedEmployeeIDs.includes(emp.employeeID)
          );
          console.log('EmployeeList:', this.EmployeeList);
        },
        error => {
          console.error('Error fetching employee list:', error);
        }
      );
    }
    loadEmployeeList() {
      this.spinner.show();
      this.service.getAllEmployeeLists().subscribe((res: any) => {
        const allEmployees = res.data || [];
        console.log("Assigned Employee IDs", this.assignedEmployeeIDs);
        
        // Filter out already assigned employees
        this.EmployeeList = allEmployees.filter(emp => 
          !this.assignedEmployeeIDs.includes(emp.employeeID)
        );
        
        this.spinner.hide();
        console.log("Filtered EmployeeList", this.EmployeeList);
      }, error => {
        this.spinner.hide();
        console.log("Employee list error", error);
      });
    }
   
    
    
    onEmployeeChange(empId: string) {
      this.employeeID = empId;
      console.log('Selected Employee ID:', this.employeeID);
    }
  

    getEmployeeData(): void {

      // if(!this.loginData){
      //    return      
      // }

      if(this.employeeID == ''){
       this.toaster.info('Please Select Employee ID');
       return
      }
      const calendarApi = this.calendarComponent?.getApi();
      const currentDate = calendarApi?.getDate(); // Date object
    
      const selectedMonth = currentDate.toLocaleString('default', { month: 'long' });
      const selectedYear = currentDate.getFullYear();
    
      const data = {
        employeeId: this.employeeID,
        year: selectedYear,
        month: selectedMonth
      };
      console.log("Sending data to API:", data);
      this.spinner.show()
      this.service.employeecalendardata(data).subscribe(
        (res: any) => {
          console.log("API Result:", res);
          this.employeeList = res
          console.log("this.employeeList", this.employeeList);
          this.spinner.hide();

          this.calenderDataDisplay()
          this.submitted = true;
        },
        error => {
          console.error("API Error:", error.message || error);
          this.spinner.hide();
        }
      );
    }
    
    calenderDataDisplay(){
      this.calendarEvents = this.employeeList.entries.map(entry => {
        const hasData = entry.task || entry.project || entry.hours > 0;
    
        const title = hasData
          ? `Project: ${entry.project || '-'}\nTask: ${entry.task || '-'}\nHours: ${entry.hours}`
          : `No Task\nHours: ${entry.hours}`;
    
        return {
          title: title,
          start: entry.date,
          allDay: true,
          backgroundColor: hasData ? '#28a745' : '#f39c12',
          textColor: '#fff',
        };
      });
    
      const calendarApi = this.calendarComponent?.getApi();
      calendarApi?.removeAllEvents();
      this.calendarEvents.forEach(event => calendarApi?.addEvent(event));
    }
    handleEventClick(clickInfo: EventClickArg) {
      console.log("clickInfo", clickInfo);
      this.editEvent = clickInfo.event;
    
      // Extract lines from title
      const lines = clickInfo.event.title.split('\n');
      const project = lines[0]?.replace('Project: ', '').trim();
      const task = lines[1]?.replace('Task: ', '').trim();
      const hours = lines[2]?.replace('Hours: ', '').trim();
    
      this.formEditData = this.formBuilder.group({
        editProject: [project],
        editTask: [task],
        editHours: [hours]
      });
    
      this.modalRef = this.modalService.show(this.editmodalShow);
    }
}
