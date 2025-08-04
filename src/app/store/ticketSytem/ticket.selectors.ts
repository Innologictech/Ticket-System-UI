import { createFeatureSelector, createSelector } from '@ngrx/store';
import {StatusState, TicketState } from './ticket.state';

export const selectTicketState = createFeatureSelector<TicketState>('tickets');
export const selectStatusState = createFeatureSelector<StatusState>('status');


export const selectAllTickets = createSelector(
  selectTicketState,
  (state: TicketState) => state.tickets
);

export const selectAllStatus = createSelector(
  selectStatusState,
  (state: StatusState) => state.status
);

//  selector for loading flag
export const selectTicketLoading = createSelector(
  selectTicketState,
  (state: TicketState) => state.loading
);