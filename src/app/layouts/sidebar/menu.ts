import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
    
            {
                id: 2,
                label: 'Dashboard',
                link: '/dashboard',
                parentId: 2,
                icon: 'bx-grid-alt',
                isTitle: false // Add this line
            },
            
            
    
   
    // {
    //     id: 3,
    //     label: 'Administration',
    //     icon: 'bx-home-circle',
    //     subItems: [
    //         {
    //             id: 31,
    //             label: 'Employee Creation',
    //             link: '/adminemployeeceation',
    //             parentId: 3,
    //             icon: 'bx-user-plus',
    //             isTitle: false
    //         },
    //         {
    //             id: 32,
    //             label: 'Designation-Mapping',
    //             link: '/Designation',
    //             parentId: 3,
    //             icon: 'bx-map',
    //             isTitle: false
    //         },
    //         {
    //             id: 33,
    //             label: 'Reporting-Mapping',
    //             link: '/task-management',
    //             parentId: 3,
    //             icon: 'bx-sitemap',
    //             isTitle: false
    //         },
    //         {
    //             id: 34,
    //             label: 'Employee Calendar',
    //             link: '/AdminEmployeeCalendar',
    //             parentId: 3,
    //             icon: 'bx-calendar',
    //             isTitle: false
    //         }
    //     ]
    // },
    // {
    //     id: 4,
    //     label: 'Management',
    //     icon: 'bx bx-briefcase',
    //     subItems: [
    //         {
    //             id: 41,
    //             label: 'Project-Creation',
    //             link: '/ManagementProjectCreation',
    //             parentId: 4,
    //             icon: 'bx bx-folder-plus',
    //             isTitle: false
    //         },
    //         {
    //             id: 42,
    //             label: 'Project-Assignment',
    //             link: '/ManagementProjectAssignment',
    //             parentId: 4,
    //             icon: 'bx bx-task',
    //             isTitle: false
    //         },
    //         {
    //             id: 43,
    //             label: 'Task-Assignment',
    //             link: '/ManagementTaskAssignment',
    //             parentId: 4,
    //             icon: 'bx bx-stopwatch',
    //             isTitle: false
    //         },
    //         {
    //             id: 44,
    //             label: 'Employee Calendar',
    //             link: '/ManagementEmployeeCalendar',
    //             parentId: 4,
    //             icon: 'bx bx-calendar',
    //             isTitle: false
    //         }
    //     ]
    // },
    // {
    //     id: 5,
    //     label: 'Operation',
    //     icon: 'bx bx-task',
    //     subItems: [
    //         {
    //             id: 51,
    //             label: 'Time-entry',
    //             link: '/OperationTimeEntry',
    //             parentId: 5,
    //             icon: 'bx bx-stopwatch',
    //             isTitle: false
    //         }
    //     ]
    // }
    , {
        id: 6,
        label: 'Customer-ticket',
        icon: 'bx bx-task',
      subItems: [
            {
                id: 52,
                label: 'Ticket-Creation',
                link: '/ticket-creation',
                parentId: 6,
                icon: 'bx bx-stopwatch',
                isTitle: false
            }
        ]
    },
    , {
        id: 6,
        label: 'Admin',
        icon: 'bx bx-task',
      subItems: [
            {
                id: 52,
                label: 'Ticket-Mnagement',
                link: '/TicketList',
                parentId: 6,
                icon: 'bx bx-stopwatch',
                isTitle: false
            }
        ]
    }
    
];

