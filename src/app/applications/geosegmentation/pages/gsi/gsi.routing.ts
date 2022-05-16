import { Routes } from "@angular/router";
import { GSIComponent } from "./GSI/GSI.component";

export const GSIRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "gsi",
        component: GSIComponent
      }
    ]
  }
];
