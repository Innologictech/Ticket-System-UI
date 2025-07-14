import { RouterModule, Routes } from '@angular/router';
import { Page404Component } from './extrapages/page404/page404.component';
import { CyptolandingComponent } from './cyptolanding/cyptolanding.component';
import { AuthGuard } from './core/guards/auth.guard';
import { LayoutComponent } from './layouts/layout.component';
// import { TicketCreationComponent } from './pages/ticket-creation/ticket-creation.component';


export const routes: Routes = [
    {
        path: "auth",
        loadChildren: () =>
            import("./account/account.module").then((m) => m.AccountModule),
    },
    {
        path: "",
        component: LayoutComponent,
        loadChildren: () =>
            import("./pages/pages.module").then((m) => m.PagesModule),
        // canActivate: [AuthGuard],
    },

    {
        path: "pages",
        loadChildren: () =>
            import("./extrapages/extrapages.module").then((m) => m.ExtrapagesModule),
        canActivate: [AuthGuard],
    },
    {
        path: 'admin',
        loadChildren: () => import('src/app/pages/admin/admin.module').then((m) => m.AdminModule)

    },
    {
        path: 'management',
        loadChildren: () => import('src/app/pages/management/management.module').then((m) => m.ManagementModule)
    },
    // {
    //     path: 'ticket-creation',
    //     component: TicketCreationComponent
    // },


     {
        path: 'operation',
        loadChildren: () => import('src/app/pages/operation/operation.module').then((m) => m.OperationModule)
    }
    ,
    { path: "crypto-ico-landing", component: CyptolandingComponent },
    { path: "**", component: Page404Component },

];
