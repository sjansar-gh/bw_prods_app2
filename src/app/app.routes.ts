import { Routes } from '@angular/router';
import { ProductsComponent } from './products/products.component';
import { EditComponent } from './components/edit/edit.component';
import { NewComponent } from './components/new/new.component';
import { ListComponent } from './components/list/list.component';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './guards/auth/auth.guard';
// import { ProfileComponent } from './components/profile/view/profile.component';
import { AdminComponent } from './components/admin/admin-parent/admin.component';
import { ProfileParentComponent } from './components/profile/profile-parent/profile-parent.component';
import { loginGuard } from './guards/login/login.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path:"login",
        component: LoginComponent,
        canActivate: [loginGuard]
    },
    {
        path:"home",
        component: ProductsComponent,
        canActivate: [authGuard]
    },
    {
        path:"products/:sku",
        component: ProductsComponent,
        canActivate: [authGuard]
    },
    {
        path: "edit/:sku",
        component: EditComponent,
        canActivate: [authGuard]
    },
    {
        path: "new",
        component: NewComponent,
        canActivate: [authGuard]
    },
    {
        path: "list",
        component: ListComponent,
        canActivate: [authGuard]
    },
    {
        path: "profile",
        component: ProfileParentComponent,
        canActivate: [authGuard]
    },
    {
        path: "admin",
        component: AdminComponent,
        canActivate: [authGuard]
    },
    {
        path: '**',
        redirectTo: 'login',
        pathMatch: 'full'
    },
];
