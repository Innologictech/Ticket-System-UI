import { createReducer, on } from '@ngrx/store';
import { initialStatusState, initialTicketState } from './ticket.state';
import * as TicketActions from './ticket.actions';
import * as StatusActions from './ticket.actions';

export const ticketReducer = createReducer(
  initialTicketState,
  on(TicketActions.loadTickets, state => ({ ...state, loading: true })),
  on(TicketActions.loadTicketsSuccess, (state, { tickets }) => ({
    ...state,
    tickets,
    loading: false
  })),
  on(TicketActions.loadTicketsFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  }))

   
);

export const statusReducer = createReducer(
 initialStatusState,
  on(StatusActions.loadStatus, state => ({ ...state, loading: true })),
  on(StatusActions.loadStatusSuccess, (state, { status }) => ({
    ...state,
    status,
    loading: false
  })),
  on(StatusActions.loadStatusFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  }))
)
