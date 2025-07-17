import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
    
            {
                id: 1,
                label: 'Dashboard',
                link: '/dashboard',
                parentId: 1,
                icon: 'bx-grid-alt',
                isTitle: false // Add this line
            },
            
             {
                id: 2,
                label: 'Ticket-Creation',
                link: '/ticket-creation',
                parentId: 2,
                icon: 'bx bx-note',
                isTitle: false
            }
    
            , {
       
                id: 3,
                label: 'Ticket-Management',
                link: '/TicketList',
                parentId: 2,
                icon: 'bx bx-note',
                isTitle: false
            
            }
            
            , {
       
                id: 3,
                label: 'user-creation',
                link: '/EmployeeCreation',
                parentId: 2,
                icon: 'bx bx-note',
                isTitle: false
            
            }
    

    
    
];

