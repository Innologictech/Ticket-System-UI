import { Ticket } from "./ticket.model";

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
