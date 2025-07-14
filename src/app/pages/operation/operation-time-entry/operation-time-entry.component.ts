
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { GeneralserviceService } from 'src/app/generalservice.service';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-operation-time-entry',
  templateUrl: './operation-time-entry.component.html',
  styleUrl: './operation-time-entry.component.css',
  standalone: true,
  imports: [FormsModule, CommonModule, NgSelectModule, ReactiveFormsModule]
})
export class OperationTimeEntryComponent implements OnInit {


  @ViewChild('taskModal') taskModal!: TemplateRef<any>;
  timeSheetForm: FormGroup;
  reportingManagement: any[] = [];
  reportingTo: string = ''; // This will be used in the template
  reportingassignedEmployeeIDs: string[] = [];
  currentUserReportingData: string[] = [];
  isLoading = false;
  submited = false;
  allAssignment: any;
  employeeId: string = '';
  employeeName: string = '';
  projectName: string = '';
  isEditMode: boolean = true;
  selectedEmployee: any;

  // Month/Year dropdown data
  months: string[] = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  years: number[] = [];
  selectedMonth: string = '';
  selectedYear: number = 0;
  enteredHours: { [date: string]: number } = {};
  // Week tabs
  // weeks: any[] = [];
  weeks = [
    { number: 1, label: 'W1' },
    { number: 2, label: 'W2' },
    { number: 3, label: 'W3' },
    { number: 4, label: 'W4' },
  ];

  selectedWeek: number;
  weekDates: any[] = [];
  loginData: any;
  showModal = false;
  status: string = '';
  selectedDay: any = { fullDate: new Date() };
  taskText: string = '';
  taskAssignments: any[] = [];
  taskassignedEmployeeIDs: any[] = [];
  // Define in component
  taskArray: { [key: string]: string } = {}; // Use object with date key
  filteredUserProjects: any;
  selectedProjectPerTask: string = '';
  projectArray: { [key: string]: any } = {}; // maps date -> project
  taskValidationError: boolean = false;
  projectValidationError: boolean = false;
  savedWeekData: any;
  isSavedOrNot: boolean;
  savedUniqueId: any;
  finalButtonDisable: any;
  filteredProjectList: any[] = [];
  updateButtonDisable: any;
  GlobalReportingTeamleadId: any;
  GlobalReportingTeamleadName: any
  readOnlyReportTo: boolean;

  // new code for diable 
  canSave: boolean = false;
  canUpdate: boolean = false;
  canFinalSubmit: boolean = false;
  disableSaveUpdate: boolean = false; // Add this line
  isFutureWeek: boolean = false;
  isCurrentOrPastWeek: boolean = true;
  constructor(private service: GeneralserviceService, private toastr: ToastrService, private spinner: NgxSpinnerService, private modalService: NgbModal, private fb: FormBuilder,) {
    // Initialize years (current year -5 to +5)
    const currentYear = new Date().getFullYear();
    for (let i = currentYear - 5; i <= currentYear + 5; i++) {
      this.years.push(i);
    }
    this.loginData = this.service.getLoginResponse()
    console.log("this.loginData", this.loginData);
  }

  ngOnInit(): void {
    this.loginData = this.service.getLoginResponse();
    // login appudu set cheyyali localStorage/set session storage

    console.log("this.loginData", this.loginData);
    this.timeSheetForm = this.fb.group({
      employeeId: ['', Validators.required],
      employeeName: ['', Validators.required],
      reportingTo: [''],
      status: [''],
      // selectedEmployee: ['', Validators.required],
    });
    if (this.loginData && this.loginData.data) {
      this.timeSheetForm.patchValue({
        employeeId: this.loginData.data.employeeID,
        employeeName: this.loginData.data.employeeFirstName
      });
    }
    const currentDate = new Date();
    this.selectedMonth = this.months[currentDate.getMonth()];
    this.selectedYear = currentDate.getFullYear();

    this.getAllAssignments();
    this.getAllreportingmapping();
    this.getAlltaskAssignments();
    setInterval(() => {
      // this.checkIfFinalSubmitShouldEnable_Friday6pm();
      // this.checkIfFinalSubmitShouldEnable_testing()
      // this.checkFinalSubmitEligibility()
      // this.testfinalsubmit()

    }, 60000); // every 1 minute

  }

  getAllAssignments() {
    this.spinner.show();
    this.filteredUserProjects = [];
    this.selectedEmployee = null;

    this.service.getAllAssignments().subscribe((res: any) => {
      this.allAssignment = res.data;
      console.log("this.allAssignment", this.allAssignment, this.loginData.data)
      this.filteredProjectList = []; // Reset the filteredProjectList on each call
      // No need to filter again if we already have login data
      if (this.loginData && this.loginData.data) {
        this.filteredProjectList = this.allAssignment.filter(item =>
          item.employeeID === this.loginData.data.employeeID
        );
        console.log("filteredProjectList", this.filteredProjectList)


        // if (filterobj.projectName) {
        //   if (Array.isArray(filterobj.projectName)) {

        //     this.filteredProjectList = [...filterobj.projectName];
        //   } else if (typeof filterobj.projectName === 'object') {

        //     this.filteredProjectList.push(filterobj.projectName);
        //   } else {
        //     console.warn('Unexpected format for projectName:', filterobj.projectName);
        //   }
        // }
      }

      console.log("filtered projects", this.filteredProjectList);

      this.spinner.hide();
      this.generateWeeks();
      this.updateWeekDates();
    }, error => {
      console.error("Error fetching assignments:", error);
      this.spinner.hide();
    });
  }
  get f() { return this.timeSheetForm.controls; }
  onEmployeeChange() {
    this.projectName = null
    console.log('Selected Employee:', this.selectedEmployee);

    if (this.timeSheetForm.value.selectedEmployee &&
      typeof this.timeSheetForm.value.selectedEmployee === "object" &&
      "projectName" in this.timeSheetForm.value.selectedEmployee) {
      this.projectName = this.timeSheetForm.value.selectedEmployee.projectName;
    } else {
      this.projectName = this.timeSheetForm.value.selectedEmployee;
    }
    console.log("projectName", this.projectName)
  }



  generateWeeks() {
    this.weeks = [];
    const monthIndex = this.months.indexOf(this.selectedMonth);
    const year = this.selectedYear;
    const firstOfMonth = new Date(year, monthIndex, 1);
  
    // Find first Monday on or before 1st of the month
    const dayOfWeek = firstOfMonth.getDay(); // Sunday=0 ... Saturday=6
    // Calculate offset to previous Monday (or same day if Monday)
    const offset = (dayOfWeek === 0) ? -6 : 1 - dayOfWeek; // Sunday=0 means go back 6 days, else go back to Monday
    const firstMonday = new Date(year, monthIndex, 1 + offset);
  
    let currentStart = new Date(firstMonday);
    let weekCount = 1;
  
    while (currentStart.getMonth() <= monthIndex) {
      this.weeks.push({ number: weekCount, label: `W${weekCount}` });
      weekCount++;
  
      // Move to next Monday
      currentStart.setDate(currentStart.getDate() + 7);
  
      // Stop if start date is next month
      if (currentStart.getMonth() > monthIndex) break;
    }
  
    // Select week based on today
    const today = new Date();
    if (today.getFullYear() === year && today.getMonth() === monthIndex) {
      this.selectedWeek = this.getWeekNumber(today, firstMonday);
    } else {
      this.selectedWeek = 1;
    }
  
    this.updateWeekDates();
  }
  



  updateWeekDates() {
    this.weekDates = [];
    const monthIndex = this.months.indexOf(this.selectedMonth);
    const year = this.selectedYear;
  
    // Find first Monday on or before 1st of month (reuse same logic)
    const firstOfMonth = new Date(year, monthIndex, 1);
    const dayOfWeek = firstOfMonth.getDay();
    const offset = (dayOfWeek === 0) ? -6 : 1 - dayOfWeek;
    const firstMonday = new Date(year, monthIndex, 1 + offset);
  
    // Calculate start date of selected week
    const startDate = new Date(firstMonday);
    startDate.setDate(startDate.getDate() + (this.selectedWeek - 1) * 7);
  
    // Build 7 days of week
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
  
      // Show date only if belongs to current month
      if (currentDate.getMonth() === monthIndex) {
        this.weekDates.push({
          day: this.getDayName(currentDate.getDay()),
          date: currentDate.getDate(),
          fullDate: currentDate,
        });
      } else {
        this.weekDates.push({
          day: this.getDayName(currentDate.getDay()),
          date: '',
          fullDate: null,
        });
      }
    }
  
    this.onCombinatinnSaved();
  }
  





  getDayName(dayIndex: number): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayIndex];
  }

  onMonthYearChange() {
    this.isEditMode = false
    this.generateWeeks();
    this.updateWeekDates();
  }

  selectWeek(week: number) {
    this.selectedWeek = week;
    this.updateWeekDates();
    this.isEditMode = false
  }

  rowData() {
    console.log("weekDates", this.weekDates, this.enteredHours)
  }


  tasksByDate: { [date: string]: string } = {};



  getYear(date: any): number {
    if (date instanceof Date && !isNaN(date.getTime())) {
      return date.getFullYear();
    }
    console.error('Invalid date passed to getYear:', date);
    return 0;
  }

  getMonthName(date: any): string {
    if (date instanceof Date && !isNaN(date.getTime())) {
      return date.toLocaleString('default', { month: 'long' });
    }
    console.error('Invalid date passed to getMonthName:', date);
    return '';
  }


  formatDateKey(date: Date | string): string {
    const d = new Date(date);
    // Use getFullYear, getMonth, getDate to preserve local date
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }



  getWeekNumber(date: Date, firstMonday: Date): number {
    // Calculate difference in days from firstMonday
    const diff = Math.floor((date.getTime() - firstMonday.getTime()) / (1000 * 60 * 60 * 24));
    if (diff < 0) return 1; // dates before firstMonday count as week 1
  
    return Math.floor(diff / 7) + 1;
  }
  

 
  getWeekDates(month: number, year: number, weekNumber: number): Date[] {
    const firstOfMonth = new Date(year, month, 1);
    const firstDayOfWeek = firstOfMonth.getDay(); // 0 (Sun) to 6 (Sat)

    // Calculate first Monday in the month
    const offset = (firstDayOfWeek === 0) ? 1 : (8 - firstDayOfWeek);
    let firstMonday = new Date(year, month, 1 + offset - 1);

    // Add (weekNumber - 1) * 7 days
    const weekStart = new Date(firstMonday);
    weekStart.setDate(firstMonday.getDate() + (weekNumber - 1) * 7);

    // Generate 7 days for the selected week
    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);
      days.push(d);
    }

    return days;
  }




  openTaskModal(day: any) {
    this.selectedDay = day;

    this.getAllreportingmapping();

    const dateKey = this.formatDateKey(day.date);
    this.selectedDay.fullDate = dateKey;
    this.selectedDay.task = this.tasksByDate[dateKey] || '';
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedDay = null;
  }

  // saveTask() {
  //   const dateKey = this.selectedDay.fullDate;
  //   const taskDescription = this.selectedDay.task?.trim();

  //   if (taskDescription) {
  //     this.tasksByDate[dateKey] = taskDescription;
  //     console.log('Saved task:', this.tasksByDate);
  //   }

  //   this.closeModal();
  // }

  onDoubleClick(day: any, enteredHours: any): void {
    const key = this.formatDateKey(day.fullDate);
    const hours = enteredHours[key];

    if (hours && !isNaN(Number(hours))) {
      this.selectedDay = day;

      // Reset fields first
      this.taskText = '';
      this.selectedProjectPerTask = null;
      this.status = '';
      this.reportingTo = '';

      // 1. First try to get data from savedWeekData (if already saved)
      if (this.savedWeekData?.entries) {
        const savedEntry = this.savedWeekData.entries.find((e: any) =>
          this.formatDateKey(e.date) === key
        );

        if (savedEntry) {
          this.taskText = savedEntry.task || '';
          this.status = savedEntry.status || '';

          // Find matching project in filteredProjectList
          if (savedEntry.project) {
            this.selectedProjectPerTask = this.filteredProjectList.find(
              p => p.projectName === savedEntry.project
            ) || savedEntry.project;
          }
        }
      }

      // 2. If no saved data, check taskArray (for unsaved but entered tasks)
      if (!this.taskText && this.taskArray[key]) {
        this.taskText = this.taskArray[key];
      }

      // 3. If still no task text, check task assignments
      // 3. If still no task text, check task assignments
      if (!this.taskText) {
        const taskAssignment = this.taskAssignments.find(
          task =>
            task.employeeID === this.loginData?.data?.employeeID &&
            this.formatDateKey(task.TaskDate) === key
        );
        console.log("taskAssignment", taskAssignment)
        if (taskAssignment) {
          this.taskText = taskAssignment.description || '';
          this.status = taskAssignment.status || '';
          this.reportingTo = taskAssignment.reportingTo || '';

          if (!this.selectedProjectPerTask && taskAssignment.projectName) {
            this.selectedProjectPerTask = this.filteredProjectList.find(
              p => p.projectName === taskAssignment.projectName
            ) || taskAssignment.projectName;
          }
        }
      }


      // Get reporting manager
      this.getAllreportingmapping();

      setTimeout(() => {
        this.modalService.open(this.taskModal, { centered: true });
      }, 0);
    } else {
      console.log(`No hours entered for ${key}, popup will not open.`);
    }
  }


  onTaskTextChange(): void {
    if (this.taskText && this.taskText.trim() !== '') {
      this.taskValidationError = false;
    }
  }

  onProjectSelectChange(): void {
    if (this.selectedProjectPerTask) {
      this.projectValidationError = false;
    }
  }
  saveTask(): void {
    const key = this.formatDateKey(this.selectedDay.fullDate);

    // Trim and validate task
    const trimmedTask = this.taskText?.trim();
    const project = this.selectedProjectPerTask;

    this.taskValidationError = false;
    this.projectValidationError = false;

    if (!trimmedTask) {
      this.taskValidationError = true;
    }

    if (!project) {
      this.projectValidationError = true;
    }

    if (this.taskValidationError || this.projectValidationError) {
      return; // Don't save if validation fails
    }

    this.taskArray[key] = trimmedTask;
    this.projectArray[key] = project;

    this.modalService.dismissAll();
  }

  blockNegative(event: KeyboardEvent): void {
    if (event.key === '-' || event.key === 'e') {
      event.preventDefault();
    }
  }
  onHourChange(value: any, day: any): void {
    const key = this.formatDateKey(day.fullDate);
    const numValue = Number(value);

    if (isNaN(numValue) || numValue < 0 || numValue > 24) {
      this.enteredHours[key] = null;
    } else {
      this.enteredHours[key] = numValue;
    }
  }






  getStartDateOfWeek(weekNumber: number, year: number): Date {
    const jan1 = new Date(year, 0, 1);
    const dayOfWeek = jan1.getDay(); // 0 (Sun) to 6 (Sat)
    const dayOffset = (dayOfWeek <= 4 ? dayOfWeek - 1 : dayOfWeek - 8);
    const mondayOfWeek1 = new Date(jan1);
    mondayOfWeek1.setDate(jan1.getDate() - dayOffset);

    const startDate = new Date(mondayOfWeek1);
    startDate.setDate(mondayOfWeek1.getDate() + (weekNumber - 1) * 7);
    return startDate;
  }

  preparePayload() {
    let weekHoursTotal = 0;

    const entries = this.weekDates
      .filter(day => day.fullDate && !isNaN(new Date(day.fullDate).getTime()))
      .map(day => {
        const dateKey = this.formatDateKey(day.fullDate);
        const hours = this.enteredHours[dateKey];

        // Add only if hours is a number
        if (typeof hours === 'number' && !isNaN(hours)) {
          weekHoursTotal += hours;
        }
        // Get project name correctly whether projectArray stores object or name
        let projectName = '';
        if (this.projectArray[dateKey]) {
          projectName = typeof this.projectArray[dateKey] === 'object'
            ? this.projectArray[dateKey].projectName
            : this.projectArray[dateKey];
        }
        return {
          date: dateKey,
          day: day.day,
          hours: hours ?? '',
          task: this.taskArray[dateKey] ?? '',
          project: projectName,
          reportingTo: this.reportingTo,
          status: this.status
        };
      });

    const firstValidDateObj = this.weekDates.find(day => day.fullDate);
    const firstDate = new Date(firstValidDateObj?.fullDate);

    const payload = {
      employeeId: this.timeSheetForm.value.employeeId,
      projectName: this.timeSheetForm.value.projectName,
      month: this.getMonthName(firstDate),
      year: firstDate.getFullYear(),
      weekNumber: this.selectedWeek,
      weekHoursTotal,
      entries,
      saveDecision: true,
      finalDecision: false,
      status: this.timeSheetForm.value.status,
      employeeName: this.timeSheetForm.value.employeeName,
      decisionTakenByUser: '',
      isStatusVerifyed: '',
      isVerifyedreason: '',
      loggedInUser: '',
      reason: '',
      GlobalReportingTeamleadId: this.GlobalReportingTeamleadId,
      GlobalReportingTeamleadName: this.GlobalReportingTeamleadName
    };

    console.log("Final Payload: ", payload);
    return payload;
  }
  finalPayload() {
    let weekHoursTotal = 0;

    const entries = this.weekDates
      .filter(day => day.fullDate && !isNaN(new Date(day.fullDate).getTime()))
      .map(day => {
        const dateKey = this.formatDateKey(day.fullDate);
        const hours = this.enteredHours[dateKey];

        // Add only if hours is a number
        if (typeof hours === 'number' && !isNaN(hours)) {
          weekHoursTotal += hours;
        }

        return {
          date: dateKey,
          day: day.day,
          hours: hours ?? '',
          task: this.taskArray[dateKey] ?? '',
          project: this.projectArray[dateKey]?.projectName || '',
          reportingTo: this.reportingTo,
          status: this.status
        };
      });

    const firstValidDateObj = this.weekDates.find(day => day.fullDate);
    const firstDate = new Date(firstValidDateObj?.fullDate);

    const payload = {
      timeSheetUniqueId: this.savedUniqueId,
      employeeId: this.timeSheetForm.value.employeeId,
      projectName: this.timeSheetForm.value.projectName,
      month: this.getMonthName(firstDate),
      year: firstDate.getFullYear(),
      weekNumber: this.selectedWeek,
      weekHoursTotal,
      entries,
      saveDecision: false,
      finalDecision: true,
      status: this.timeSheetForm.value.status,
      employeeName: this.timeSheetForm.value.employeeName,
      decisionTakenByUser: '',
      isStatusVerifyed: '',
      isVerifyedreason: '',
      loggedInUser: '',
      reason: '',
      GlobalReportingTeamleadId: this.GlobalReportingTeamleadId,
      GlobalReportingTeamleadName: this.GlobalReportingTeamleadName
    };

    console.log("Final Payload: ", payload);
    return payload;
  }
  updatePayload() {
    let weekHoursTotal = 0;

    const entries = this.weekDates
      .filter(day => day.fullDate && !isNaN(new Date(day.fullDate).getTime()))
      .map(day => {
        const dateKey = this.formatDateKey(day.fullDate);
        const hours = this.enteredHours[dateKey];

        // Add only if hours is a number
        if (typeof hours === 'number' && !isNaN(hours)) {
          weekHoursTotal += hours;
        }

        return {
          date: dateKey,
          day: day.day,
          hours: hours ?? '',
          task: this.taskArray[dateKey] ?? '',
          project: this.projectArray[dateKey]?.projectName || '',
          reportingTo: this.reportingTo,
          status: this.status
        };
      });

    const firstValidDateObj = this.weekDates.find(day => day.fullDate);
    const firstDate = new Date(firstValidDateObj?.fullDate);

    const payload = {
      timeSheetUniqueId: this.savedUniqueId,
      employeeId: this.timeSheetForm.value.employeeId,
      projectName: this.timeSheetForm.value.projectName,
      month: this.getMonthName(firstDate),
      year: firstDate.getFullYear(),
      weekNumber: this.selectedWeek,
      weekHoursTotal,
      entries,
      saveDecision: true,
      finalDecision: false,
      status: this.timeSheetForm.value.status,
      employeeName: this.timeSheetForm.value.employeeName,
      decisionTakenByUser: '',
      isStatusVerifyed: '',
      isVerifyedreason: '',
      loggedInUser: '',
      reason: '',
      GlobalReportingTeamleadId: this.GlobalReportingTeamleadId,
      GlobalReportingTeamleadName: this.GlobalReportingTeamleadName
    };

    console.log("Final Payload: ", payload);
    return payload;
  }

  submit() {
    if (this.timeSheetForm.invalid) {
      this.submited = true;
      return;
    }

    const payload = this.preparePayload();

    // ✅ Check if all hours are empty
    const allEmpty = payload.entries.every(entry => entry.hours === '' || entry.hours === null || entry.hours === undefined);

    if (allEmpty) {
      Swal.fire({
        icon: 'warning',
        title: 'No Data Entered',
        text: 'Please enter hours for at least one day before submitting.'
      });
      return;
    }

    // ✅ Proceed with API call if valid
    console.log("Final Payload: ", payload);
    this.spinner.show()
    this.service.TimeEntrySave(payload).subscribe((res: any) => {
      console.log("submit", res);
      console.log('apiErr', res, res.responseData);
      this.spinner.hide()

      if (res.status == 400) {
        this.toastr.success(res.message);

      } else {
        // Display success toast
        //  this.timeSheetForm.reset()

        // this.getAllUserList()
        this.savedUniqueId = res.timeSheetUniqueId
        this.onCombinatinnSaved()
        this.isEditMode = false
        Swal.fire({
          title: '',
          text: res.message,
          icon: 'success',
          cancelButtonText: 'Ok',
          timer: 5000
        }).then((result) => {
          if (result) {

          } else {

          }
        });
      }




      // this.getAllUserList();
      // this.modalService.dismissAll(modal);
      // this.submitted = true;
      // this.submit=false
    }, error => {
      this.toastr.error(error)
      // this.modalService.dismissAll(modal);
      console.log("error", error);
      this.spinner.hide()

    });
  }
  Update() {
    if (this.timeSheetForm.invalid) {
      this.submited = true;
      return;
    }

    const payload = this.updatePayload();

    // ✅ Check if all hours are empty
    const allEmpty = payload.entries.every(entry => entry.hours === '' || entry.hours === null || entry.hours === undefined);

    if (allEmpty) {
      Swal.fire({
        icon: 'warning',
        title: 'No Data Entered',
        text: 'Please enter hours for at least one day before submitting.'
      });
      return;
    }

    // ✅ Proceed with API call if valid
    console.log("Final Payload: ", payload);
    this.spinner.show()
    this.service.updateTimeSheet(payload).subscribe((res: any) => {
      console.log("submit", res);
      console.log('apiErr', res, res.responseData);
      this.spinner.hide()

      if (res.status == 400) {
        this.toastr.success(res.message);

      } else {
        // Display success toast
        //  this.timeSheetForm.reset()

        // this.getAllUserList()
        this.isEditMode = false

        // this.savedUniqueId = null
        Swal.fire({
          title: '',
          text: res.message,
          icon: 'success',
          cancelButtonText: 'Ok',
          timer: 5000
        }).then((result) => {
          if (result) {

          } else {

          }
        });
      }




      // this.getAllUserList();
      // this.modalService.dismissAll(modal);
      // this.submitted = true;
      // this.submit=false
    }, error => {
      this.toastr.error(error)
      // this.modalService.dismissAll(modal);
      console.log("error", error);
      this.spinner.hide()

    });
  }


  FinalSubmit() {
    if (this.timeSheetForm.invalid) {
      this.submited = true;
      return;
    }

    const payload = this.finalPayload();

    // ✅ Check if all hours are empty
    const allEmpty = payload.entries.every(entry => entry.hours === '' || entry.hours === null || entry.hours === undefined);

    if (allEmpty) {
      Swal.fire({
        icon: 'warning',
        title: 'No Data Entered',
        text: 'Please enter hours for at least one day before submitting.'
      });
      return;
    }

    // ✅ Proceed with API call if valid
    console.log("Final Payload: ", payload);
    this.spinner.show()
    this.service.updateTimeSheet(payload).subscribe((res: any) => {
      console.log("submit", res);
      console.log('apiErr', res, res.responseData);
      this.spinner.hide()

      if (res.status == 400) {
        this.toastr.success(res.message);

      } else {
        // Display success toast
        //  this.timeSheetForm.reset()

        // this.getAllUserList()
        this.getAllAssignments();
        this.isEditMode = false
        Swal.fire({
          title: '',
          text: res.message,
          icon: 'success',
          cancelButtonText: 'Ok',
          timer: 5000
        }).then((result) => {
          if (result) {

          } else {

          }
        });
      }




      // this.getAllUserList();
      // this.modalService.dismissAll(modal);
      // this.submitted = true;
      // this.submit=false
    }, error => {
      this.toastr.error(error)
      // this.modalService.dismissAll(modal);
      console.log("error", error);
      this.spinner.hide()

    });
  }

  onEditWeek() {
    this.isEditMode = true;
  }


  onCombinatinnSaved() {
    this.isEditMode = false;
  
    const payload = {
      employeeId: this.timeSheetForm.value.employeeId,
      month: this.selectedMonth,
      year: this.selectedYear,
      weekNumber: this.selectedWeek,
    };
  
    this.isSavedOrNot = null;
    this.savedUniqueId = null;
    this.finalButtonDisable = null;
    this.updateButtonDisable = null;
    this.GlobalReportingTeamleadId = null;
    this.GlobalReportingTeamleadName = null;
  
    this.service.timeSheetList(payload).subscribe((res: any) => {
      console.log("submit", res);
  
      this.isSavedOrNot = res.isSaved;
      this.savedUniqueId = res.data?.timeSheetUniqueId;
      this.finalButtonDisable = res.data?.finalDecision;  // true/false
      this.updateButtonDisable = res.data?.saveDecision;  // true/false
      this.GlobalReportingTeamleadId = res.data?.GlobalReportingTeamleadId;
      this.GlobalReportingTeamleadName = res.data?.GlobalReportingTeamleadName;
  
      this.spinner.hide();
  
      if (res.status === 400) {
        this.toastr.success(res.message);
      } else {
        this.savedWeekData = res.data;
  
        // Reset input data stores
        this.enteredHours = {};
        this.taskArray = {};
        this.projectArray = {};
  
        // Populate saved data if present
        if (this.savedWeekData?.entries?.length) {
          this.savedWeekData.entries.forEach(entry => {
            const dateKey = this.formatDateKey(entry.date);
            if (entry.hours) this.enteredHours[dateKey] = entry.hours;
            if (entry.task) this.taskArray[dateKey] = entry.task;
            if (entry.project) {
              const matchedProject = this.filteredProjectList.find(p => p.projectName === entry.project);
              this.projectArray[dateKey] = matchedProject || entry.project;
            }
          });
        }
  
        // If timesheet is finalized (finalDecision === true), disable all buttons
        if (this.finalButtonDisable === true) {
          this.disableSaveUpdate = true;  // Disable Save & Update buttons
          this.canFinalSubmit = false;    // Disable Final Submit button
          return; // Exit early since no other checks needed
        }
  
        // Otherwise, determine Final Submit eligibility
  
        const today = new Date();
        const currentHour = today.getHours();
  
        // Filter only weekdays (Mon-Fri) in weekDates
        const workingDays = this.weekDates.filter(wd =>
          ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].includes(wd.day)
        );
  
        const lastWorkingDay = workingDays.length ? workingDays[workingDays.length - 1].fullDate : null;
  
        const isFinalSubmitTime = lastWorkingDay &&
          today.toDateString() === new Date(lastWorkingDay).toDateString() &&
          currentHour >= 18;
  
        this.canFinalSubmit = isFinalSubmitTime && this.updateButtonDisable; // saveDecision true
  
        this.disableSaveUpdate = false;  // Enable Save & Update as timesheet not finalized
      }
  
    }, error => {
      this.toastr.error('Failed to fetch timesheet');
      this.spinner.hide();
    });
  }
  
  checkFinalSubmitEligibility() {
    const selectedWeek = this.selectedWeek; // week number (e.g., 1–5)
    const year = this.selectedYear;
    const month = Number(this.selectedMonth) - 1;

    const firstDayOfMonth = new Date(year, month, 1);
    let currentWeek = 0;
    const weekDates = [];

    for (let d = new Date(firstDayOfMonth); d.getMonth() === month; d.setDate(d.getDate() + 1)) {
      const day = d.getDay();
      if (day === 1) currentWeek++; // count Mondays as week starts

      if (currentWeek === selectedWeek) {
        weekDates.push(new Date(d));
      }
    }

    // Filter only working days (Mon–Fri)
    const workingDays = weekDates.filter(d => d.getDay() >= 1 && d.getDay() <= 5);
    if (workingDays.length === 0) {
      this.finalButtonDisable = true;
      return;
    }

    const lastWorkingDay = workingDays[workingDays.length - 1];
    const now = new Date();

    const isSameDay =
      now.getDate() === lastWorkingDay.getDate() &&
      now.getMonth() === lastWorkingDay.getMonth() &&
      now.getFullYear() === lastWorkingDay.getFullYear();

    const isAfter6PM = now.getHours() >= 18;

    // Final condition
    this.finalButtonDisable = !(isSameDay && isAfter6PM);
  }
  // testfinalsubmit() {
  //   const now = new Date();

  //   const hours = now.getHours();
  //   const minutes = now.getMinutes();

  //   const isAfter1PM = hours > 14 || (hours === 14 && minutes >= 0);

  //   if (isAfter1PM) {
  //     console.log('✅ It is after 1 PM (13:00). Time:', now.toLocaleTimeString());
  //   } else {
  //     console.log('❌ It is before 1 PM. Time:', now.toLocaleTimeString());
  //   }

  //   // You can use this flag like in your real condition
  //   this.finalButtonDisable = !isAfter1PM;
  // }



  checkIfFinalSubmitShouldEnable_Friday6pm() {
    const now = new Date();
    const today = now.getDay(); // 0 = Sunday, 5 = Friday
    const currentHour = now.getHours();

    const currentMonthIndex = now.getMonth();
    const selectedMonthIndex = this.months.indexOf(this.selectedMonth);

    const currentWeek = Math.ceil(now.getDate() / 7);

    const isSameMonth = now.getFullYear() === this.selectedYear && selectedMonthIndex === currentMonthIndex;
    const isSameWeek = this.selectedWeek === currentWeek;
    const isFriday = today === 5;
    const isAfter6PM = currentHour >= 18;

    console.log("isSameMonth", isSameMonth, "isSameWeek", isSameWeek, "isFriday", isFriday, "isAfter6PM", isAfter6PM);

    // 💼 PRODUCTION CONDITION ONLY
    this.finalButtonDisable = !(isSameMonth && isSameWeek && isFriday && isAfter6PM);
    console.log("this.finalButtonDisable", this.finalButtonDisable);
  }
  checkIfFinalSubmitShouldEnable_testing() {
    const now = new Date(); // Real current date/time
    const today = now.getDay(); // 3 = Wednesday
    const currentHour = now.getHours();

    const currentMonthIndex = now.getMonth();
    const selectedMonthIndex = this.months.indexOf(this.selectedMonth);
    const currentWeek = Math.ceil(now.getDate() / 7);

    const isSameMonth = now.getFullYear() === this.selectedYear && selectedMonthIndex === currentMonthIndex;
    const isSameWeek = this.selectedWeek === currentWeek;

    const isFriday = today === 5;
    const isAfter6PM = currentHour >= 18;

    // ✅ Special condition just for testing (Wednesday after 2 PM)
    const isWednesdayTest = today === 3 && currentHour >= 12;

    console.log("isSameMonth", isSameMonth, "isSameWeek", isSameWeek, "isFriday", isFriday, "isAfter6PM", isAfter6PM, "isWednesdayTest", isWednesdayTest);

    // ✅ FIXED condition
    this.finalButtonDisable = !(isSameMonth && isSameWeek && ((isFriday && isAfter6PM) || isWednesdayTest));

    console.log("this.finalButtonDisable", this.finalButtonDisable);
  }
  // getAllreportingmapping() {
  //   this.isLoading = true;
  //   this.spinner.show();
  //   this.service.getAllreporting().subscribe((res: any) => {
  //     this.reportingManagement = res.data || [];

  //     // collect assigned employeeIDs
  //     this.reportingassignedEmployeeIDs = this.reportingManagement.map(item => item.employeeID);

  //     // Find reporting manager for the logged-in user
  //     const loggedInEmployeeId = this.loggedInUserId; // Example: 0049 (you should get from your auth/session service)
  //     const reportingEntry = this.reportingManagement.find(item => item.TeamMemberId === loggedInEmployeeId);

  //     if (reportingEntry) {
  //       this.reportingTo = reportingEntry.ManagerName; // Set Reporting Manager Name
  //     } else {
  //       this.reportingTo = ''; // or 'No Manager Found'
  //     }

  //     this.isLoading = false;
  //     this.spinner.hide();
  //   }, error => {
  //     this.isLoading = false;
  //     this.spinner.hide();
  //     console.log("Assignment error", error);
  //   });
  // }
  getAllreportingmapping() {
    this.isLoading = true;
    this.spinner.show();
    this.GlobalReportingTeamleadId = null
    this.service.getAllreporting().subscribe({
      next: (res: any) => {
        if (res?.data && Array.isArray(res.data)) {
          this.reportingManagement = res.data;

          // collect assigned employeeIDs
          this.reportingassignedEmployeeIDs = this.reportingManagement.map(item => item.employeeID);

          // Find correct reporting entry based on logged-in user
          const reportingEntry = this.reportingManagement.find(item => item.TeamMemberId === this.loginData?.data?.employeeID);
          console.log("Matched reporting entry:", reportingEntry);
          this.GlobalReportingTeamleadId = reportingEntry.TeamId
          this.GlobalReportingTeamleadName = reportingEntry.TeamLead
          if (reportingEntry) {
            this.reportingTo = reportingEntry.TeamLead || '';
          } else {
            this.reportingTo = '';
          }
          if (this.reportingTo) {
            this.readOnlyReportTo = true
          } else {
            this.readOnlyReportTo = false
          }
          console.log("this.readOnlyReportTo", this.readOnlyReportTo)
        } else {
          this.reportingManagement = [];
        }
        this.isLoading = false;
        this.spinner.hide();
      },
      error: (error) => {
        console.error("Error fetching reporting data", error);
        this.isLoading = false;
        this.spinner.hide();
      }
    });
  }

  getAlltaskAssignments() {
    this.spinner.show();
    this.service.getAllTaskAssignments().subscribe((res: any) => {
      this.taskAssignments = res.data || [];
      console.log("getAlltaskAssignments", this.taskAssignments)
      // Collect assigned employee IDs
      // this.taskassignedEmployeeIDs = this.taskAssignments.map(item => item.employeeID);
      this.spinner.hide();
      // After fetching task assignments, fetch the filtered project list
      // this.filteredProjectList = this.taskAssignments.map(task => task.projectName);  // Assuming projectName is in each task
    }, error => {
      this.spinner.hide();
      console.log("Assignment error", error);
    });
  }

  selectTask(taskId: number) {
    const selectedTask = this.taskAssignments.find(task => task.id === taskId);
    if (selectedTask) {
      this.selectedProjectPerTask = selectedTask.projectName;  // Set project name
      this.status = selectedTask.status;  // Set status
      this.taskText = selectedTask.taskDescription;  // Set task description
      this.reportingTo = selectedTask.reportingTo || '';  // Set reporting to (if applicable)
    }
  }

  getCurrentWeekNumber(date: Date): number {
    const start = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor(
      (date.getTime() - start.getTime()) / (24 * 60 * 60 * 1000)
    );
    return Math.ceil((days + start.getDay() + 1) / 7);
  }







}
