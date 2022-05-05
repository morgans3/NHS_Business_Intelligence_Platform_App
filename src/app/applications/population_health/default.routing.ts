import { Routes } from "@angular/router";
import { SettingsComponent } from "./pages/settings/settings.component";

export const DefaultRoutes: Routes = [
    {
        path: "",
        loadChildren: () => import("./pages/population-slicer/popslicer.module").then((m) => m.PopslicerModule),
    },
    {
        path: "modelled-need",
        loadChildren: () => import("./pages/need-list/need-list.module").then((m) => m.NeedListModule),
    },
    {
        path: "cohort-comparator",
        loadChildren: () => import("./pages/cohortcompare/cohortcompare.module").then((m) => m.CohortCompareModule),
    },
    {
        path: "population-list",
        loadChildren: () => import("./pages/patient-list/patient-list.module").then((m) => m.PatientListModule),
    },
    {
        path: "person",
        loadChildren: () => import("./pages/patient/patient.module").then((m) => m.PatientModule),
    },
    {
        path: "intervention-assistant",
        loadChildren: () => import("./pages/intervention-assistant/intervention-assistant.module").then((m) => m.InterventionAssistantModule),
    },
    {
        path: "settings",
        component: SettingsComponent
    }
];
