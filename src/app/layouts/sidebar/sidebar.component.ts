import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, Input, OnChanges, ChangeDetectorRef } from '@angular/core';
import MetisMenu from 'metismenujs';
import { EventService } from '../../core/services/event.service';
import { Router, NavigationEnd, RouterModule } from '@angular/router';

import { HttpClient } from '@angular/common/http';

import { MENU } from './menu';
import { MenuItem } from './menu.model';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SimplebarAngularModule } from 'simplebar-angular';
import { CommonModule } from '@angular/common';
import { GeneralserviceService } from 'src/app/generalservice.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  standalone:true,
  imports:[SimplebarAngularModule,RouterModule,CommonModule,TranslateModule ]
})

/**
 * Sidebar component
 */
export class SidebarComponent implements OnInit, AfterViewInit, OnChanges {
   @Input() menuItems: any[] = [];
  

  @ViewChild('componentRef') scrollRef;
  @Input() isCondensed = false;
  menu: any;
  data: any;

  // menuItems: MenuItem[] = [];

  @ViewChild('sideMenu') sideMenu: ElementRef;
  loginData: any;

  constructor(private eventService: EventService, private router: Router,private cdr: ChangeDetectorRef, public translate: TranslateService, private http: HttpClient,private service:GeneralserviceService) {
    router.events.forEach((event) => {
      if (event instanceof NavigationEnd) {
        this._activateMenuDropdown();
        this._scrollElement();
      }
    });
  }

  ngOnInit() {
    this.loginData = null
    this.loginData= this.service.getLoginResponse()
    console.log("this.loginData",this.loginData);
    this.initialize();
    this._scrollElement();
  }

  ngAfterViewInit() {
    this.menu = new MetisMenu(this.sideMenu.nativeElement);
    this._activateMenuDropdown();
  }

  toggleMenu(event) {
    event.currentTarget.nextElementSibling.classList.toggle('mm-show');
  }

  ngOnChanges() {
    if (!this.isCondensed && this.sideMenu || this.isCondensed) {
      setTimeout(() => {
        this.menu = new MetisMenu(this.sideMenu.nativeElement);
      });
    } else if (this.menu) {
      this.menu.dispose();
    }
  }
  _scrollElement() {
    setTimeout(() => {
      if (document.getElementsByClassName("mm-active").length > 0) {
        const currentPosition = document.getElementsByClassName("mm-active")[0]['offsetTop'];
        if (currentPosition > 500)
          if (this.scrollRef.SimpleBar !== null)
            this.scrollRef.SimpleBar.getScrollElement().scrollTop =
              currentPosition + 300;
      }
    }, 300);
  }

  /**
   * remove active and mm-active class
   */
  _removeAllClass(className) {
    const els = document.getElementsByClassName(className);
    while (els[0]) {
      els[0].classList.remove(className);
    }
  }

  /**
   * Activate the parent dropdown
   */
  _activateMenuDropdown() {
    this._removeAllClass('mm-active');
    this._removeAllClass('mm-show');
    const links = document.getElementsByClassName('side-nav-link-ref');
    let menuItemEl = null;
    // tslint:disable-next-line: prefer-for-of
    const paths = [];
    for (let i = 0; i < links.length; i++) {
      paths.push(links[i]['pathname']);
    }
    var itemIndex = paths.indexOf(window.location.pathname);
    if (itemIndex === -1) {
      const strIndex = window.location.pathname.lastIndexOf('/');
      const item = window.location.pathname.substr(0, strIndex).toString();
      menuItemEl = links[paths.indexOf(item)];
    } else {
      menuItemEl = links[itemIndex];
    }
    if (menuItemEl) {
      menuItemEl.classList.add('active');
      const parentEl = menuItemEl.parentElement;
      if (parentEl) {
        parentEl.classList.add('mm-active');
        const parent2El = parentEl.parentElement.closest('ul');
        if (parent2El && parent2El.id !== 'side-menu') {
          parent2El.classList.add('mm-show');
          const parent3El = parent2El.parentElement;
          if (parent3El && parent3El.id !== 'side-menu') {
            parent3El.classList.add('mm-active');
            const childAnchor = parent3El.querySelector('.has-arrow');
            const childDropdown = parent3El.querySelector('.has-dropdown');
            if (childAnchor) { childAnchor.classList.add('mm-active'); }
            if (childDropdown) { childDropdown.classList.add('mm-active'); }
            const parent4El = parent3El.parentElement;
            if (parent4El && parent4El.id !== 'side-menu') {
              parent4El.classList.add('mm-show');
              const parent5El = parent4El.parentElement;
              if (parent5El && parent5El.id !== 'side-menu') {
                parent5El.classList.add('mm-active');
                const childanchor = parent5El.querySelector('.is-parent');
                if (childanchor && parent5El.id !== 'side-menu') { childanchor.classList.add('mm-active'); }
              }
            }
          }
        }
      }
    }

  }

  /**
   * Initialize
   */
  // initialize(): void {
  //   console.log("this.menuItems",MENU)
  //   this.menuItems = MENU;
  //   console.log("this.menuItems",this.menuItems)
  // }


//   initialize(): void {
//     console.log("Original MENU:", MENU);
//     this.menuItems = MENU;
//     console.log("Filtered menuItems:", this.menuItems);
// }
// initialize(): void {
//   console.log("Original MENU:", MENU, this.loginData);

//   if (!this.loginData?.data?.Role) {
//     console.log("No user role found!");
//     return;
//   }

//   const userRole  = this.loginData.data.Role; // Ensure uppercase
//   console.log("userRole ", userRole );

//   // Define access rules
//   const accessMap = {
//     'ADMIN': [
//       {
//         id: 1,
//         label: 'Dashboard',
//         link: '/dashboard',
//         parentId: null,
//         icon: 'bx-grid-alt',
//         color: '#99df9cff',
//         isTitle: false
//       },
//       {
//         id: 3,
//         label: 'Ticket-Management',
//         link: '/TicketList',
//         parentId: null,
//         icon: 'bx bx-task',
//         color: '#b09a78ff',
//         isTitle: false
//       },
//       {
//         id: 4,
//         label: 'user-creation',
//         link: '/InvoiceUserCreation',
//        parentId: null,
//         icon: 'bx bx-user-plus',
//         color: '#97729eff',
//         isTitle: false
//       }
//     ],
//     'CUSTOMER': [
//       {
//         id: 1,
//         label: 'Dashboard',
//         link: '/dashboard',
//         parentId: null,
//         icon: 'bx-grid-alt',
//         color: '#99df9cff',
//         isTitle: false
//       },
//       {
//         id: 2,
//         label: 'Ticket-Creation',
//         link: '/ticket-creation',
//        parentId: null,
//         icon: 'bx bx-note',
//         color: '#88a3b9ff',
//         isTitle: false
//       }
//     ],
//     'User': [
//       // {
//       //   id: 3,
//       //   label: 'Ticket-Management',
//       //   link: '/TicketList',
//       //  parentId: null,
//       //   icon: 'bx bx-task',
//       //   color: '#b09a78ff',
//       //   isTitle: false
//       // }

//        {
//         id: 5,
//         label: 'user',
//         link: '/user',
//        parentId: null,
//         icon: 'bx bx-task',
//         color: '#b09a78ff',
//         isTitle: false
//       }
//     ],
//   };

//   // Assign the allowed menu items
//   this.menuItems = accessMap[userRole] || [];
//   console.log("Filtered menuItems:", this.menuItems);
  
//   // If using Angular
//   this.cdr.detectChanges();
// }
// initialize(): void {
//     const loginResponse = JSON.parse(localStorage.getItem('currentUser') || '{}');
//     // console.log("loginResponse1122",loginResponse)
    
//     if (loginResponse && loginResponse[0].Activity) {
//       const authorizedIds: string[] = Object.values(loginResponse[0].Activity).filter((id): id is string => typeof id === 'string' && id.trim() !== "");
//       console.log("authorizedIds",authorizedIds)
//       this.menuItems = this.filterMenuItems(MENU, authorizedIds);
//     } else {
//       this.menuItems = []; // Fallback if no loginResponse or ZGRNACT
//     }
//   }
initialize(): void {
  console.log('loginResponse from localStorage:', this.loginData);

  if (this.loginData.data.Activity && this.loginData.data.Activity.length > 0) {
    // Combine all activity entries into one array of trimmed strings
    const authorizedLabels: string[] = this.loginData.data.Activity
      .map((item: string) => item.split(','))
      .flat()
      .map((item: string) => item.trim())
      .filter((item: string) => item !== '');

    console.log('authorizedLabels:', authorizedLabels);

    this.menuItems = this.filterMenuItems(MENU, authorizedLabels);
  } else {
    this.menuItems = [];
  }

  console.log("menuItems", this.menuItems);
  this.cdr.detectChanges();
}

//  initialize(): void {  
//     console.log('loginResponse from localStorage:', this.loginData);

//     // ✅ UPDATED CONDITION
//     // if (this.loginData.data.Activity) {
//     //   const authorizedIds: string[] = Object.values(this.loginData.data.Activity).filter(
//     //     (id): id is string => typeof id === 'string' && id.trim() !== ''
//     //   );
//     //   console.log('authorizedIds', authorizedIds);
//     //   this.menuItems = this.filterMenuItems(MENU, authorizedIds);
//     // } else {
//     //   this.menuItems = [];
//     // }
//     if (this.loginData.data.Activity && this.loginData.data.Activity.length > 0) {
//   const activityString = this.loginData.data.Activity[0]; // taking first string
//   const authorizedLabels: string[] = activityString.split(',').map(item => item.trim());

//   console.log('authorizedLabels:', authorizedLabels);
//   this.menuItems = this.filterMenuItems(MENU, authorizedLabels);
// } else {
//   this.menuItems = [];
// }

//     console.log("menuitems",this.menuItems)

//     this.cdr.detectChanges();
//   }
  
 
  // private filterMenuItems(menuItems: MenuItem[], authorizedIds: string[]): MenuItem[] {
  //   console.log('menuItems',menuItems,'authorizedIds',authorizedIds)
  //   return menuItems.filter((item) => {
  //     if (item.subItems) {
  //       item.subItems = this.filterMenuItems(item.subItems, authorizedIds);
  //     }
  //     return authorizedIds.includes(String(item.id)) || (item.subItems && item.subItems.length > 0);
  //   });
  // }
  private filterMenuItems(menuItems: MenuItem[], authorizedLabels: string[]): MenuItem[] {
  return menuItems.filter((item) => {
    if (item.subItems) {
      item.subItems = this.filterMenuItems(item.subItems, authorizedLabels);
    }

    return (
      authorizedLabels.includes(item.label) ||
      (item.subItems && item.subItems.length > 0)
    );
  });
}




// 30-04-2025

//  initialize(): void {
//    console.log("this.menuItems",MENU)

//   const fullMenu = MENU; // Your full menu array with Dashboard, Admin, etc.
//   const userActivity = this.loginData?.data?.Activity;
//   console.log("User Activity:", userActivity);

//   if (!userActivity) {
//     this.menuItems = [];
//     return;
//   }

//   // Define allowed top-level menu IDs per role
//   const roleAccess = {
//      'ADMIN': [1, 3,4], //Dashboard + ticket-management+user-creation
//     'CUSTOMER': [1,2], // Dashboard + ticket-creation
//     'User': [1]
//   };

//   const allowedIds = roleAccess[userActivity.toUpperCase()] || [];

//   // Filter the full menu
//   this.menuItems = fullMenu.filter(menu => allowedIds.includes(menu.id));

//   console.log("Filtered Menu:", this.menuItems);
// }


// initialize(): void {
//   console.log("this.menuItems", MENU);

//   const fullMenu = MENU; // Your full menu array with Dashboard, Admin, etc.
//   const userActivity = this.loginData?.data?.employeeActivity;
//   console.log("User Activity:", userActivity);

//   // Give access to all menu items regardless of user role
//   this.menuItems = fullMenu;

//   console.log("Full Menu Access Granted:", this.menuItems);
// }



  /**
   * Returns true or false if given menu item has child or not
   * @param item menuItem
   */
  hasItems(item: MenuItem) {
    // console.log('item',item)
    return item?.subItems !== undefined ? item?.subItems.length > 0 : false;
  }
}
