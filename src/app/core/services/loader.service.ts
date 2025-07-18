import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  readonly isLoading$: Observable<boolean> = this.isLoadingSubject.asObservable();

  showLoader(): void {
    this.isLoadingSubject.next(true);
  }

  hideLoader(): void {
    this.isLoadingSubject.next(false);
  }
}
