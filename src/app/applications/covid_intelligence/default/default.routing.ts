import { Routes } from "@angular/router";
import { AdminComponent } from "./Admin/Admin.component";
import { LandingComponent } from "./Landing/Landing.component";
import { DisplayReportComponent } from "./DisplayReport/DisplayReport.component";
import { RegionalComponent } from "./Regional/Regional.component";
import { ModellingComponent } from "./Modelling/Modelling.component";
import { PatientListComponent } from "./patient-list/patient-list.component";
import { PatientComponent } from "./patient/patient.component";
import { PidGuard } from "../../../_guards/pid.guard";
import { OutbreaksComponent } from "./outbreaks/outbreaks.component";
import { NeedListComponent } from "./need-list/need-list.component";
import { PopulationselectComponent } from "./populationselect/populationselect.component";
import { CohortcompareComponent } from "./cohortcompare/cohortcompare.component";
import { InterventionAssistantComponent } from "./intervention-assistant/intervention-assistant.component";
import { HeatmapComponent } from "./heatmap/heatmap.component";

export const DefaultRoutes: Routes = [
    {
        path: "landing",
        component: LandingComponent,
    },
    {
        path: "Admin",
        component: AdminComponent,
    },
    {
        path: "Regional",
        component: RegionalComponent,
    },
    {
        path: "Modelling",
        component: ModellingComponent,
    },
    { path: "report/:id", component: DisplayReportComponent },
    { path: "population-list", component: PatientListComponent },
    { path: "person", component: PatientComponent, canActivate: [PidGuard] },
    {
        path: "person/:nhsnumber",
        component: PatientComponent,
        canActivate: [PidGuard],
    },
    {
        path: "outbreaks",
        component: OutbreaksComponent,
        // canActivate: [CapabilityGuard],
        data: { capabilities: ["cvi_outbreakmap"] },
    },
    {
        path: "heatmap",
        component: HeatmapComponent,
        // canActivate: [CapabilityGuard],
        data: { capabilities: ["cvi_outbreakmap"] },
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
        path: "intervention-assistant",
        component: InterventionAssistantComponent,
    },
    {
        path: "need-list",
        component: NeedListComponent,
    },
];
