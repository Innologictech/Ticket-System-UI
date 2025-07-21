import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [

    {
        id: 1,
        label: 'Dashboard',
        link: '/dashboard',
        parentId: 1,
        icon: 'bx-grid-alt',
        color: '#99df9cff',
        isTitle: false // Add this line
    },

    {
        id: 2,
        label: 'Ticket-Creation',
        link: '/ticket-creation',
        parentId: 2,
        icon: 'bx bx-note',
        color: '#88a3b9ff',
        isTitle: false
    }

    , {

        id: 3,
        label: 'Ticket-Management',
        link: '/TicketList',
        parentId: 2,
        icon: 'bx bx-task',
        color: '#b09a78ff',  // Orange

        isTitle: false

    }

    , {

        id: 4,
        label: 'user-creation',
        link: '/InvoiceUserCreation',
        parentId: 2,
        icon: 'bx bx-user-plus', // User creation icon
        color: '#97729eff',        // Purple
        isTitle: false

    }




];

