import { createAction, props } from '@ngrx/store';
import { Status, Ticket } from './ticket.model';



export const loadTickets = createAction('[Ticket] Load Tickets');
export const loadTicketsSuccess = createAction('[Ticket] Load Tickets Success', props<{ tickets: Ticket[] }>());
export const loadTicketsFailure = createAction('[Ticket] Load Tickets Failure', props<{ error: any }>());

export const loadStatus = createAction('[Status] Load Status');
export const loadStatusSuccess = createAction('[Status] Load Status Success', props<{ status: Status[] }>());
export const loadStatusFailure = createAction('[Status] Load Status Failure', props<{ error: any }>());