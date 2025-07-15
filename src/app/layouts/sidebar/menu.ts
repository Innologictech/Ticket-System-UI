import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
    // {
    //     id: 2,
    //     label: 'MENUITEMS.DASHBOARDS.TEXT',
    //     icon: 'bx-home-circle',
    //     subItems: [
            {
                id: 2,
                label: 'Dashboard',
                link: '/dashboard',
                parentId: 2,
                icon: 'bx-grid-alt',
                isTitle: false // Add this line
            },
            
            // {
            //     id:4 ,
            //     label: 'Invoice Layout',
            //     link: '/InvoiceLayout',
            //     parentId: 1,
            //     icon: 'bx bx-layout',
            // },
            // {
            //     id:5,
            //     label: 'Invoice',
            //     link: '/Invoice',
            //     parentId: 1,
            //     icon: 'bx bx-plus',
            // },
            
            // {
            //     id: 6,
            //     label: 'Invoice Decision',
            //     link: '/InvoiceDecision',
            //     parentId: 1,
            //     icon: 'bx-sync', // Represents invoice approval/decision
            // },
            // {
            //     id:7 ,
            //     label: 'Invoice Reports',
            //     link: '/InvoiceReports',
            //     parentId: 1,
            //     icon: 'bx bx-spreadsheet',
            // },
            // {
            //     id: 3,
            //     label: 'Customer Creation',
            //     link: '/CustomerCreation',
            //     parentId: 1,
            //     icon: 'bx-user-check', // Represents invoice approval/decision
            // },
            // {
            //     id: 10,
            //     label: 'Company Creation',
            //     link: '/CompanyCreation',
            //     parentId: 1,
            //     icon: 'bx-home-circle',
            // },
            // {
            //     id: 8,
            //     label: 'User Creation',
            //     link: '/InvoiceUserCreation',
            //     parentId: 1,
            //     icon: 'bx bx-user-check',
            // },
            // {
            //     id: 9,
            //     label: 'Services',
            //     link: '/ServiceCharges',
            //     parentId: 1,
            //     icon: 'bx bx-receipt',
            // },
            // {
            //     id: 3,
            //     label: 'Employee Creation',
            //     link: '/EmployeeCreation',
            //     parentId: 1,
            //     icon: 'bx bx-user-plus',
            //     isTitle: false // Add this line
            // },
            // {
            //     id: 4,
            //     label: 'Project Creation',
            //     link: '/ProjectCreation',
            //     parentId: 1,
            //     icon: 'bx bx-folder-plus',
            //     isTitle: false // Add this line
            // },
            // {
            //     id: 5,
            //     label: 'Project Assignment',
            //     link: '/ProjectAssignment',
            //     parentId: 1,
            //     icon: 'bx bx-task',
            //     isTitle: false // Add this line
            // },
        //     {
            // id: 7,
            // label: 'Employee Calendar',
            // link: '/EmployeeCalendar',
            // parentId: 1,
            // icon: 'bx bx-calendar',
        // },
            // {
            //     id: 6,
            //     label: 'Time Entry',
            //     link: '/TimeEntry',
            //     parentId: 1,
            //     icon: 'bx bx-stopwatch',
            //     isTitle: false // Add this line
            // },
            // {
            //     id: 7,
            //     label: 'Task Assignment',
            //     link: '/TaskAssignment',
            //     parentId: 1,
            //     icon: 'bx bx-stopwatch',
            //     isTitle: false // Add this line
            // },
            // {
            //     id: 10,
            //     label: 'Company_Creation',
            //     link: '/CompanyCreation',
            //     parentId: 1,
            //     icon: 'bx-home-circle',
            // },

            // <i class="bx bx-user-plus"></i>  
            // <i class="bx bx-user-check"></i> 
            // <i class="bx bx-user-pin"></i>  

           
    //     ]
    // },
    // {
    //     id: 66,
    //     label: 'MENUITEMS.PAGES.TEXT',
    //     isTitle: true
    // },
    // {
    //     id: 67,
    //     label: 'MENUITEMS.AUTHENTICATION.TEXT',
    //     icon: 'bx-user-circle',
    //     subItems: [
    //         {
    //             id: 68,
    //             label: 'MENUITEMS.AUTHENTICATION.LIST.LOGIN',
    //             link: '/auth/login',
    //             parentId: 67
    //         },
    //         {
    //             id: 69,
    //             label: 'MENUITEMS.AUTHENTICATION.LIST.LOGIN2',
    //             link: '/auth/login-2',
    //             parentId: 67
    //         },
    //         {
    //             id: 70,
    //             label: 'MENUITEMS.AUTHENTICATION.LIST.REGISTER',
    //             link: '/auth/signup',
    //             parentId: 67
    //         },
    //         {
    //             id: 71,
    //             label: 'MENUITEMS.AUTHENTICATION.LIST.REGISTER2',
    //             link: '/auth/signup-2',
    //             parentId: 67
    //         },
    //         {
    //             id: 72,
    //             label: 'MENUITEMS.AUTHENTICATION.LIST.RECOVERPWD',
    //             link: '/auth/reset-password',
    //             parentId: 67
    //         },
    //         {
    //             id: 73,
    //             label: 'MENUITEMS.AUTHENTICATION.LIST.RECOVERPWD2',
    //             link: '/auth/recoverpwd-2',
    //             parentId: 67
    //         },
    //         {
    //             id: 74,
    //             label: 'MENUITEMS.AUTHENTICATION.LIST.LOCKSCREEN',
    //             link: '/pages/lock-screen-1',
    //             parentId: 67
    //         },
    //         {
    //             id: 75,
    //             label: 'MENUITEMS.AUTHENTICATION.LIST.LOCKSCREEN2',
    //             link: '/pages/lock-screen-2',
    //             parentId: 67
    //         },
    //         {
    //             id: 76,
    //             label: 'MENUITEMS.AUTHENTICATION.LIST.CONFIRMMAIL',
    //             link: '/pages/confirm-mail',
    //             parentId: 67
    //         },
    //         {
    //             id: 77,
    //             label: 'MENUITEMS.AUTHENTICATION.LIST.CONFIRMMAIL2',
    //             link: '/pages/confirm-mail-2',
    //             parentId: 67
    //         },
    //         {
    //             id: 78,
    //             label: 'MENUITEMS.AUTHENTICATION.LIST.EMAILVERIFICATION',
    //             link: '/pages/email-verification',
    //             parentId: 67
    //         },
    //         {
    //             id: 79,
    //             label: 'MENUITEMS.AUTHENTICATION.LIST.EMAILVERIFICATION2',
    //             link: '/pages/email-verification-2',
    //             parentId: 67
    //         },
    //         {
    //             id: 80,
    //             label: 'MENUITEMS.AUTHENTICATION.LIST.TWOSTEPVERIFICATION',
    //             link: '/pages/two-step-verification',
    //             parentId: 67
    //         },
    //         {
    //             id: 81,
    //             label: 'MENUITEMS.AUTHENTICATION.LIST.TWOSTEPVERIFICATION2',
    //             link: '/pages/two-step-verification-2',
    //             parentId: 67
    //         }
    //     ]
    // },
    // {
    //     id: 82,
    //     label: 'MENUITEMS.UTILITY.TEXT',
    //     icon: 'bx-file',
    //     subItems: [
    //         {
    //             id: 83,
    //             label: 'MENUITEMS.UTILITY.LIST.STARTER',
    //             link: '/pages/starter',
    //             parentId: 82
    //         },
    //         {
    //             id: 84,
    //             label: 'MENUITEMS.UTILITY.LIST.MAINTENANCE',
    //             link: '/pages/maintenance',
    //             parentId: 82
    //         },
    //         {
    //             id: 85,
    //             label: 'Coming Soon',
    //             link: '/pages/coming-soon',
    //             parentId: 82
    //         },
    //         {
    //             id: 86,
    //             label: 'MENUITEMS.UTILITY.LIST.TIMELINE',
    //             link: '/pages/timeline',
    //             parentId: 82
    //         },
    //         {
    //             id: 87,
    //             label: 'MENUITEMS.UTILITY.LIST.FAQS',
    //             link: '/pages/faqs',
    //             parentId: 82
    //         },
    //         {
    //             id: 88,
    //             label: 'MENUITEMS.UTILITY.LIST.PRICING',
    //             link: '/pages/pricing',
    //             parentId: 82
    //         },
    //         {
    //             id: 89,
    //             label: 'MENUITEMS.UTILITY.LIST.ERROR404',
    //             link: '/pages/404',
    //             parentId: 82
    //         },
    //         {
    //             id: 90,
    //             label: 'MENUITEMS.UTILITY.LIST.ERROR500',
    //             link: '/pages/500',
    //             parentId: 82
    //         },
    //     ]
    // },
    // {
    //     id: 143,
    //     label: 'MENUITEMS.MULTILEVEL.TEXT',
    //     icon: 'bx-share-alt',
    //     subItems: [
    //         {
    //             id: 144,
    //             label: 'MENUITEMS.MULTILEVEL.LIST.LEVEL1.1',
    //             parentId: 143
    //         },
    //         {
    //             id: 145,
    //             label: 'MENUITEMS.MULTILEVEL.LIST.LEVEL1.2',
    //             parentId: 143,
    //             subItems: [
    //                 {
    //                     id: 146,
    //                     label: 'MENUITEMS.MULTILEVEL.LIST.LEVEL1.LEVEL2.1',
    //                     parentId: 145,
    //                 },
    //                 {
    //                     id: 147,
    //                     label: 'MENUITEMS.MULTILEVEL.LIST.LEVEL1.LEVEL2.2',
    //                     parentId: 145,
    //                 }
    //             ]
    //         },
    //     ]
    // }
    {
        id: 3,
        label: 'Administration',
        icon: 'bx-home-circle',
        subItems: [
            {
                id: 31,
                label: 'Employee Creation',
                link: '/adminemployeeceation',
                parentId: 3,
                icon: 'bx-user-plus',
                isTitle: false
            },
            {
                id: 32,
                label: 'Designation-Mapping',
                link: '/Designation',
                parentId: 3,
                icon: 'bx-map',
                isTitle: false
            },
            {
                id: 33,
                label: 'Reporting-Mapping',
                link: '/task-management',
                parentId: 3,
                icon: 'bx-sitemap',
                isTitle: false
            },
            {
                id: 34,
                label: 'Employee Calendar',
                link: '/AdminEmployeeCalendar',
                parentId: 3,
                icon: 'bx-calendar',
                isTitle: false
            }
        ]
    },
    {
        id: 4,
        label: 'Management',
        icon: 'bx bx-briefcase',
        subItems: [
            {
                id: 41,
                label: 'Project-Creation',
                link: '/ManagementProjectCreation',
                parentId: 4,
                icon: 'bx bx-folder-plus',
                isTitle: false
            },
            {
                id: 42,
                label: 'Project-Assignment',
                link: '/ManagementProjectAssignment',
                parentId: 4,
                icon: 'bx bx-task',
                isTitle: false
            },
            {
                id: 43,
                label: 'Task-Assignment',
                link: '/ManagementTaskAssignment',
                parentId: 4,
                icon: 'bx bx-stopwatch',
                isTitle: false
            },
            {
                id: 44,
                label: 'Employee Calendar',
                link: '/ManagementEmployeeCalendar',
                parentId: 4,
                icon: 'bx bx-calendar',
                isTitle: false
            }
        ]
    },
    {
        id: 5,
        label: 'Operation',
        icon: 'bx bx-task',
        subItems: [
            {
                id: 51,
                label: 'Time-entry',
                link: '/OperationTimeEntry',
                parentId: 5,
                icon: 'bx bx-stopwatch',
                isTitle: false
            }
        ]
    }
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
                label: 'Ticket-list',
                link: '/ticket-list',
                parentId: 6,
                icon: 'bx bx-stopwatch',
                isTitle: false
            }
        ]
    }
    
];

