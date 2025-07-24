import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TicketState } from './ticket.state';

export const selectTicketState = createFeatureSelector<TicketState>('tickets');

export const selectAllTickets = createSelector(
  selectTicketState,
  (state: TicketState) => state.tickets
);
