import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import * as TicketActions from './ticket.actions';
import { GeneralserviceService } from 'src/app/generalservice.service';

@Injectable()
export class TicketEffects {
  constructor(private actions$: Actions, private service:GeneralserviceService ) {}

  loadTickets$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TicketActions.loadTickets),
      mergeMap(() =>
        this.service.GetTicketDetails().pipe(
          map(tickets => TicketActions.loadTicketsSuccess({ tickets })),
          catchError(error => of(TicketActions.loadTicketsFailure({ error })))
        )
      )
    )
  );
}
