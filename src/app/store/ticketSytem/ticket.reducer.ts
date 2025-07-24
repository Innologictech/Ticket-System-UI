import { createReducer, on } from '@ngrx/store';
import { initialTicketState } from './ticket.state';
import * as TicketActions from './ticket.actions';

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
