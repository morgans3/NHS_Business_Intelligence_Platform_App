import { Routes } from "@angular/router";
import { MappingComponent } from "./mapping/mapping.component";

export const MappingRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "mapping",
        component: MappingComponent,
      },
    ],
  },
];
