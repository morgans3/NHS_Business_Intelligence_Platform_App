import { Routes } from "@angular/router";
import { LandingComponent } from "./Landing/Landing.component";
import { AdminComponent } from "./Admin/Admin.component";
import { IncidentsComponent } from "./Incidents/Incidents.component";
import { IncidentFormComponent } from "./Incidents/IncidentForm/IncidentForm.component";
import { PidGuard } from "src/app/_guards/pid.guard";

export const DefaultRoutes: Routes = [
    {
        path: "main",
        component: LandingComponent,
    },
    {
        path: "admin",
        component: AdminComponent,
        canActivate: [PidGuard],
    },
    {
        path: "incidents",
        component: IncidentsComponent,
    },
    {
        path: "incidentform",
        component: IncidentFormComponent,
    },
];
