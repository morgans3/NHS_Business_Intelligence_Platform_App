import { Routes } from "@angular/router";
import { PatientListComponent } from "./patient-list/patient-list.component";
import { PatientComponent } from "./patient/patient.component";
import { PidGuard } from "../../../_guards/pid.guard";
import { NeedListComponent } from "./need-list/need-list.component";
import { PopulationselectComponent } from "./populationselect/populationselect.component";
import { CohortcompareComponent } from "./cohortcompare/cohortcompare.component";

export const DefaultRoutes: Routes = [
    { path: "population-list", component: PatientListComponent },
    { path: "person", component: PatientComponent, canActivate: [PidGuard] },
    {
        path: "person/:nhsnumber",
        component: PatientComponent,
        canActivate: [PidGuard],
    },
    {
        path: "populationselect",
        component: PopulationselectComponent,
    },
    {
        path: "cohort-comparator",
        component: CohortcompareComponent,
    },
    {
        path: "need-list",
        component: NeedListComponent,
    },
];
