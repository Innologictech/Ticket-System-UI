import { Status, Ticket } from "./ticket.model";

export interface TicketState {
  tickets: Ticket[];
  loading: boolean;
  error: any;
}

export const initialTicketState: TicketState = {
  tickets: [],
  loading: false,
  error: null,
};

export interface StatusState {
  status: Status[];
  loading: boolean;
  error: any;
}   

export const initialStatusState: StatusState = {
  status: [],
  loading: false,
  error: null,
};

