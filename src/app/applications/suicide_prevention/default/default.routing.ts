import { Routes } from "@angular/router";
import { LandingComponent } from "./Landing/Landing.component";
import { AdminComponent } from "./Admin/Admin.component";
import { IncidentsComponent } from "./Incidents/Incidents.component";
import { IncidentFormComponent } from "./Incidents/IncidentForm/IncidentForm.component";

export const DefaultRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "main",
        component: LandingComponent,
      },
      {
        path: "admin",
        component: AdminComponent,
      },
      {
        path: "incidents",
        component: IncidentsComponent,
      },
      {
        path: "incidentform",
        component: IncidentFormComponent,
      },
    ],
  },
];
