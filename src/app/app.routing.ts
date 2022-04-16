import { Routes } from "@angular/router";
import { AuthGuard } from "./_guards/auth.guard";
import { FullComponent } from "./layouts/full/full.component";
import { FormLayoutComponent } from "./layouts/form/form.component";
import { SupportLayoutComponent } from "./layouts/support/support.component";

export const AppRoutes: Routes = [
  {
    path: "",
    component: FormLayoutComponent,
    children: [
      {
        path: "",
        loadChildren: () => import("./pages/forms/login/login.module").then((m) => m.LoginModule),
      },
      {
        path: "login",
        loadChildren: () => import("./pages/forms/login/login.module").then((m) => m.LoginModule),
      },
      {
        path: "password-reset",
        loadChildren: () => import("./pages/forms/password-reset/password-reset.module").then((m) => m.PasswordResetModule),
      },
    ],
  },
  {
    path: "support",
    component: SupportLayoutComponent,
    children: [
      {
        path: "",
        loadChildren: () => import("./pages/support/support.module").then((m) => m.SupportModule),
      },
    ],
  },
  {
    path: "",
    component: FullComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: "dashboard",
        loadChildren: () => import("./pages/dashboard/dashboard.module").then((m) => m.DashboardModule),
      },
      {
        path: "teams",
        loadChildren: () => import("./pages/teams/teams.module").then((m) => m.TeamsModule),
      },
      {
        path: "profile",
        loadChildren: () => import("./pages/profile/profile.module").then((m) => m.ProfileModule),
      },
      {
        path: "admin",
        loadChildren: () => import("./pages/admin/admin.module").then((m) => m.AdminModule),
      },
      // {
      //   path: "",
      //   loadChildren: () => import("./pages/stores/stores.module").then((m) => m.StoresModule),
      //   canActivate: [AuthGuard],
      // },
      {
        path: "**",
        loadChildren: () => import("./pages/dynamic/dynamic.module").then((m) => m.DynamicPageModule),
        pathMatch: "full",
      },
    ],
  },
  {
    path: "**",
    loadChildren: () => import("./pages/dynamic/dynamic.module").then((m) => m.DynamicPageModule),
    pathMatch: "full",
    canActivate: [AuthGuard],
  },
];
