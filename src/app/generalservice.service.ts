import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Ticket,Status} from './store/ticketSytem/ticket.model';
@Injectable({
  providedIn: 'root'
})
export class GeneralserviceService {
  searchTerm: string = '';
  allInvoices: any[] = []; // Store all invoices
  page: number = 1;
  pageSize: number = 10; // Adjust as needed
  data: any;
  
  getUserDetails: any;
  getMonthYearList: any;
  getWeeksForMonthYear: any;
  getDaysForWeek: any;
  UpdateInvoice: any;
  baseUrl: any;
 
  // deteleGlobal: any;
 
  resetPasswordData(): any {
    throw new Error('Method not implemented.');
  }
 
  setLoginDataList: any;
  userList: any;
  loginResponse: any;
  setTableData: any;
  

  
  constructor(private http: HttpClient) { }

  setLoginResponse(data){
    this.loginResponse = data;
}

getLoginResponse(){
   return this.loginResponse;
}
  // getAllInvoice(obj){
  //   return this.http.post(environment.baseUrl+'invoice/getAllInvoices',obj);
  // }
  getAllInvoice(){
    return this.http.get(environment.baseUrl+'invoice/getAllInvoices');
  }
  CreateInvoice(obj){
    return this.http.post(environment.baseUrl+'invoice/createNewInvoice',obj);
  }
  
  // UpdateInvoice(obj,invoiceRefNo){
  //   return this.http.put(environment.baseUrl+'updateInvoiceByReferenceNo/'+invoiceRefNo,obj);
  // }
  getstateList(){
    return this.http.get(environment.baseUrl+'invoice/stateList');
  }

  invoiceTemplate(obj){
    return this.http.post(environment.baseUrl+'invoice/invoiceTemplate',obj);

  }
  userNewCreation(obj){
    return this.http.post(environment.baseUrl+'invoice/userNewCreation',obj);

  }
  getAllUserList(){
    return this.http.get(environment.baseUrl+'invoice/getAllUserList');
  }

  // submitLogin(obj){
  //   return this.http.post(environment.baseUrl+'/timesheet/authenticationLogin',obj);
  // }
  updateExitUser(obj,userUniqueId){
    return this.http.put(environment.baseUrl+'invoice/updateExitUser/'+userUniqueId,obj);
  }
  invoiceApprovedOrRejected(obj){
    return this.http.post(environment.baseUrl+'invoice/invoiceApprovedOrRejected',obj);
  }
  forgotPassword(obj){
    return this.http.post(environment.baseUrl+'invoice/forgotPassword',obj);
  }
  getAllCustomerList(){
    return this.http.get(environment.baseUrl+'invoice/getAllCustomerList');
  }
  savecustomerCreation(obj){
    return this.http.post(environment.baseUrl+'invoice/SaveCustomerCreation',obj);
 
  }
  
  updateExitCustomer(obj,customerUniqueId){
    return this.http.put(environment.baseUrl+'invoice/updateExitCustomer/'+customerUniqueId,obj);
 
  }
  reviewedUpadte(obj){
    return this.http.post(environment.baseUrl+'invoice/reviewedUpadte',obj);
 
  }
  SaveCharges(data){
    return this.http.post(environment.baseUrl+'invoice/SaveCharges',data)

  }
  UpdateCharges(data){
    return this.http.post(environment.baseUrl+'invoice/UpdateCharges',data)

  }
  getAllCharges(){
    return this.http.get(environment.baseUrl+'invoice/getAllCharges');


  }
  resetpassword(obj){
    return this.http.post(environment.baseUrl+'invoice/resetPassword',obj);
 
  }
 
  verifyedAndUpdated(obj){
    return this.http.post(environment.baseUrl+'invoice/verifyedAndUpdated',obj);
 
  }
  // deteleGlobal(obj){
  //   return this.http.post(environment.baseUrl+'invoice/deteleGlobal',obj);
 
  // }
  getAllCompanyList(){
    return this.http.get(environment.baseUrl+'/invoice/getAllCompanyList');
  }
  SaveCompanyCreation(obj){
    return this.http.post(environment.baseUrl+'invoice/SaveCompanyCreation',obj);
 
  }
  updateExitCompany(obj){
    return this.http.post(environment.baseUrl+'invoice/updateExitCompany',obj);
 
  }
 
  employeeNewCreation(obj){
    return this.http.post(environment.baseUrl+'/timesheet/employeeNewCreation',obj);

  }
  updateExitEmployee(obj){
    return this.http.post(environment.baseUrl+'/timesheet/updateExitEmployee',obj);
  }
  
  getAllEmployeeLists(){
    return this.http.get(environment.baseUrl+'/timesheet/getAllEmployeeList');
  }
  deteleGlobal(obj){
    return this.http.post(environment.baseUrl+'/timesheet/deteleGlobal',obj);
 
  }
  SaveProjects(data){
    return this.http.post(environment.baseUrl+'/timesheet/SaveProject',data)

  }
  UpdateProjects(data){
    return this.http.post(environment.baseUrl+'/timesheet/Updateproject',data)

  }
  getAllProjects(){
    return this.http.get(environment.baseUrl+'/timesheet/getAllProject');


  }
  SaveAssignment(data){
    return this.http.post(environment.baseUrl+'/timesheet/SaveAssignment',data)

  }
  UpdateAssignments(data){
    return this.http.post(environment.baseUrl+'/timesheet/UpdateAssignment',data)

  }
  getAllAssignments(){
    return this.http.get(environment.baseUrl+'/timesheet/getAllAssignment');


  }
  dashboardData(){
    return this.http.get(environment.baseUrl+'/timesheet/dashboardData');


  }
  TimeEntrySave(data){
    return this.http.post(environment.baseUrl+'/timesheet/timeEntrySave',data)

  }
  TimeEntryUpdate(data){
    return this.http.post(environment.baseUrl+'/timesheet/timeEntryUpdate',data)

  }
  timeSheetList(data){
    return this.http.post(environment.baseUrl+'/timesheet/combinationOfEmployee',data);


  }
  updateTimeSheet(data){
    return this.http.post(environment.baseUrl+'/timesheet/timeEntryUpdate',data);


  }
  // getReviewNotifications(){
  //   return this.http.get(environment.baseUrl+'/timesheet/getReviewNotifications');


  // }
  getTeamLeadList(obj){
    return this.http.post(environment.baseUrl+'/timesheet/getTeamLeadList',obj);

  }
  getListOf_A_R_Notifications(obj){
    return this.http.post(environment.baseUrl+'/timesheet/getManagersList',obj);


  }
  timesheetApprovedOrRejected(obj){
    return this.http.post(environment.baseUrl+'/timesheet/timesheetApprovedOrRejected',obj);
  }
  VerifyedByTeamLead(obj){
    return this.http.post(environment.baseUrl+'/timesheet/verifyedByTeamLead',obj);
  }
  employeecalendardata(data){
    return this.http.post(environment.baseUrl+'/timesheet/employeecalendardata',data);
  }
  SaveTaskAssignment(data){
    return this.http.post(environment.baseUrl+'/timesheet/taskassignmentdata',data)

  }
  UpdateTaskAssignments(data){
    return this.http.post(environment.baseUrl+'/timesheet/UpdatetaskAssignment',data)

  }
  getAllTaskAssignments(){
    return this.http.get(environment.baseUrl+'/timesheet/getAlltaskAssignment');


  }

 

  //admin module apis//
  designationmapping(data){
    return this.http.post(environment.baseUrl+'/timesheet/designationdata',data);
  }
  getAlldesignation(){
    return this.http.get(environment.baseUrl+'/timesheet/getAlldesignation');
  }
  

  updateDesignation(data){
    return this.http.post(environment.baseUrl+'/timesheet/Updatedesignation',data)

  }

  reportingmapping(data){
    return this.http.post(environment.baseUrl+'/timesheet/reportingdata',data);
  }
  getAllreporting(){
    return this.http.get(environment.baseUrl+'/timesheet/getAllreporting');
  }
  

  Updatereporting(data){
    return this.http.post(environment.baseUrl+'/timesheet/Updatereporting',data)

  }

  /*ticketing tool methods start here*/
  GetTicketDetails() : Observable<Ticket[]>{
    return this.http.get<Ticket[]>(environment.baseUrl+'/ticket/getticket');
  }

    GetAllStatus() : Observable<Status[]>{
    return this.http.get<Status[]>(environment.baseUrl+'/ticket/status-options');
  }

  CreateTicket(data){
    return this.http.post(environment.baseUrl+'/ticket/saveticket',data)
  }

  UpdateTicket(data){
    return this.http.post(environment.baseUrl+'/ticket/Updateticket',data)
  }

createUser(userData: any) {
    return this.http.post(environment.baseUrl+'/ticket/UserCreation',userData);
  }

  getAllUsers() {
  return this.http.get(environment.baseUrl+'/ticket/getAllUserList');
}

updateUser(payload: any) {
  return this.http.post(environment.baseUrl+'/ticket/UpdateExitUser',payload);
}



  submitLogin(payload: any) {
  return this.http.post(environment.baseUrl+'/ticket/authenticationLogin', payload);
}
  DeteleGlobal(obj){
    return this.http.post(environment.baseUrl+'/ticket/deteleGlobal',obj);
 
  }

}
