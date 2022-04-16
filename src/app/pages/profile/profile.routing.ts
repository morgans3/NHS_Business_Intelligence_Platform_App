import { Routes } from "@angular/router";
import { ProfileComponent } from "./profile.component";

export const ProfileRoutes: Routes = [
  {
    path: "",
    component: ProfileComponent,
  },
  {
    path: ":tab",
    component: ProfileComponent,
  },
];
