import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  

   public isLoading = new BehaviorSubject(false);
   
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();
 
 
  showLoader() {
    this.isLoadingSubject.next(true);
  }
   hideLoader() {
    this.isLoadingSubject.next(false);
  }
 
 
  constructor() { }
}
