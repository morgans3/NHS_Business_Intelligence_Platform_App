import { Routes } from "@angular/router";
import { HiLandingComponent } from "./pages/landing/Landing.component";
import { HiDataComponent } from "./pages/data/Data.component";

export const DefaultRoutes: Routes = [
  {
    path: "main",
    component: HiLandingComponent
  },
  {
    path: "data",
    component: HiDataComponent
  }
];
