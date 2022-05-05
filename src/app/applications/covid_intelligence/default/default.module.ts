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
import { LocalComponent } from "./Local/Local.component";
import { BedDataComponent } from "./Local/BedData/BedData.component";
import { TestDataComponent } from "./Local/TestData/TestData.component";
import { EquipmentDataComponent } from "./Local/EquipmentData/EquipmentData.component";
import { MortalityDataComponent } from "./Local/MortalityData/MortalityData.component";
import { ModellingComponent } from "./Modelling/Modelling.component";
import { UserValidationComponent } from "./UserValidation/UserValidation.component";
import { VerifiyDialogComponent } from "./UserValidation/dialogverifiy";
import { ValidateDialogComponent } from "./UserValidation/dialogvalidate";
import { PatientListComponent } from "./patient-list/patient-list.component";
import { PatientComponent } from "./patient/patient.component";
import { TheographComponent } from "./patient/theograph/theograph.component";
import { StatCardComponent } from "./Regional/stat-card.component";
import { CohortAllComponent } from "./Regional/cohort-all/cohort-all.component";
import { ConfirmTextDialogComponent } from "./Regional/dialogtextconfirm";
import { ConfirmDialogComponent } from "./Regional/dialogconfirm";
import { VirusTestsComponent } from "./virus-tests/virus-tests.component";
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
import { MapComponent } from "./patient/minimap/map.component";
import { LeafletModule } from "@asymmetrik/ngx-leaflet";
import { CviCohortService } from "../_services/cvicohort-service";

@NgModule({
  imports: [DragDropModule, CommonModule, RouterModule.forChild(DefaultRoutes), ReactiveFormsModule, FormsModule, DemoMaterialModule, FlexLayoutModule, MainPipe, JoyrideModule.forRoot(), LeafletMarkerClusterModule, LeafletModule],
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
    LocalComponent,
    BedDataComponent,
    TestDataComponent,
    EquipmentDataComponent,
    MortalityDataComponent,
    ModellingComponent,
    UserValidationComponent,
    VerifiyDialogComponent,
    ValidateDialogComponent,
    PatientListComponent,
    PatientComponent,
    TheographComponent,
    StatCardComponent,
    ExpandTextDialogComponent,
    CohortAllComponent,
    ConfirmDialogComponent,
    ConfirmTextDialogComponent,
    VirusTestsComponent,
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
    MapComponent,
  ],
  entryComponents: [VerifiyDialogComponent, ValidateDialogComponent, StatCardComponent, ExpandTextDialogComponent, ConfirmDialogComponent, ConfirmTextDialogComponent, NumberDialogComponent, MapComponent],
  exports: [StatCardComponent, ValidateDialogComponent, UserValidationComponent, VerifiyDialogComponent, MapComponent],
  providers: [CviCohortService]
})
export class DefaultModule {}
