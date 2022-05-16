import { Routes } from "@angular/router";
import { HomeComponent } from "./pages/home/home.component";
import { AdminComponent } from "./pages/admin/admin.component";

export const DefaultRoutes: Routes = [
  {
    path: "home",
    component: HomeComponent
  },
  {
    path: "Admin",
    component: AdminComponent
  },
  {
    path: "",
    loadChildren: () => import("./pages/gsi/gsi.module").then((m) => m.GSIModule),
  }
];
