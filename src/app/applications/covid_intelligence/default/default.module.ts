import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { CommonModule } from "@angular/common";
import { DefaultRoutes } from "./default.routing";
import { FlexLayoutModule } from "@angular/flex-layout";
import { DemoMaterialModule } from "../../../demo-material-module";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { MainPipe } from "../../../_pipes/main-pipe.module";
import { AdminComponent } from "./Admin/Admin.component";
import { LandingComponent } from "./Landing/Landing.component";
import { DisplayReportComponent, CachedSrcDirective } from "./DisplayReport/DisplayReport.component";
import { ReportNotesComponent } from "./DisplayReport/ReportNotes/ReportNotes.component";
import { PublisherNotesComponent } from "./DisplayReport/PublisherNotes/PublisherNotes.component";
import { ReportAnalysisComponent } from "./DisplayReport/ReportAnalysis/ReportAnalysis.component";
import { ReportSettingsComponent } from "./DisplayReport/ReportSettings/ReportSettings.component";
import { RegionalComponent } from "./Regional/Regional.component";
import { ModellingComponent } from "./Modelling/Modelling.component";
import { PatientListComponent } from "./patient-list/patient-list.component";
import { PatientComponent } from "./patient/patient.component";
import { TheographComponent } from "./patient/theograph/theograph.component";
import { CohortAllComponent } from "./Regional/cohort-all/cohort-all.component";
import { ConfirmTextDialogComponent } from "./Regional/dialogtextconfirm";
import { ConfirmDialogComponent } from "./Regional/dialogconfirm";
import { OutbreaksComponent } from "./outbreaks/outbreaks.component";
import { LimitsettingComponent } from "./patient-list/limitsetting/limitsetting.component";
import { NumberDialogComponent } from "./patient-list/limitsetting/dialognumber";
import { PopulationselectComponent } from "./populationselect/populationselect.component";
import { CovidtestsComponent } from "./patient/covidtests/covidtests.component";
import { ConditionsComponent } from "./patient/conditions/conditions.component";
import { CitizenlistsComponent } from "./patient/citizenlists/citizenlists.component";
import { LpresviewerComponent } from "./patient/lpresviewer/lpresviewer.component";
import { EmishighlightsComponent } from "./patient/emishighlights/emishighlights.component";
import { MosaictileComponent } from "./patient/mosaictile/mosaictile.component";
import { DatasetdifferencesComponent } from "./patient/datasetdifferences/datasetdifferences.component";
import { PopslicerComponent } from "./populationselect/popslicer/popslicer.component";
import { JoyrideModule } from "ngx-joyride";
import { ExpandTextDialogComponent } from "../_modals/dialogexpand";
import { InterventionAssistantComponent } from "./intervention-assistant/intervention-assistant.component";
import { CohortcompareComponent } from "./cohortcompare/cohortcompare.component";
import { HeatmapComponent } from "./heatmap/heatmap.component";
import { LeafletMarkerClusterModule } from "@asymmetrik/ngx-leaflet-markercluster";
import { NSSSComponent } from "./nsss/nsss.component";
import { NeedListComponent } from "./need-list/need-list.component";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { MinimapComponent } from "./patient/minimap/minimap.component";
import { LeafletModule } from "@asymmetrik/ngx-leaflet";
import { CviCohortService } from "../_services/cvicohort-service";
import { MaterialModule } from "diu-component-library";
import { SharedModule } from "src/app/shared/shared.module";

@NgModule({
    imports: [
        DragDropModule,
        CommonModule,
        RouterModule.forChild(DefaultRoutes),
        ReactiveFormsModule,
        FormsModule,
        DemoMaterialModule,
        MaterialModule,
        FlexLayoutModule,
        MainPipe,
        JoyrideModule.forRoot(),
        SharedModule,
        LeafletMarkerClusterModule,
        LeafletModule,
    ],
    declarations: [
        AdminComponent,
        LandingComponent,
        DisplayReportComponent,
        CachedSrcDirective,
        ReportNotesComponent,
        PublisherNotesComponent,
        ReportAnalysisComponent,
        ReportSettingsComponent,
        RegionalComponent,
        ModellingComponent,
        PatientListComponent,
        PatientComponent,
        TheographComponent,
        ExpandTextDialogComponent,
        CohortAllComponent,
        ConfirmDialogComponent,
        ConfirmTextDialogComponent,
        OutbreaksComponent,
        LimitsettingComponent,
        NumberDialogComponent,
        PopulationselectComponent,
        CovidtestsComponent,
        ConditionsComponent,
        CitizenlistsComponent,
        LpresviewerComponent,
        EmishighlightsComponent,
        MosaictileComponent,
        DatasetdifferencesComponent,
        PopslicerComponent,
        InterventionAssistantComponent,
        CohortcompareComponent,
        NeedListComponent,
        HeatmapComponent,
        NSSSComponent,
        MinimapComponent,
    ],
    entryComponents: [ExpandTextDialogComponent, ConfirmDialogComponent, ConfirmTextDialogComponent, NumberDialogComponent],
    providers: [CviCohortService],
})
export class DefaultModule {}
