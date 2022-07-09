import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { CommonModule } from "@angular/common";
import { DefaultRoutes } from "./default.routing";
import { FlexLayoutModule } from "@angular/flex-layout";
import { DemoMaterialModule } from "../../../demo-material-module";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { MainPipe } from "../../../_pipes/main-pipe.module";
import { PatientListComponent } from "./patient-list/patient-list.component";
import { PatientComponent } from "./patient/patient.component";
import { CohortAllComponent } from "./cohort-all/cohort-all.component";
import { LimitsettingComponent } from "./patient-list/limitsetting/limitsetting.component";
import { NumberDialogComponent } from "./patient-list/limitsetting/dialognumber";
import { PopulationselectComponent } from "./populationselect/populationselect.component";
import { PopslicerComponent } from "./populationselect/popslicer/popslicer.component";
import { JoyrideModule } from "ngx-joyride";
import { CohortcompareComponent } from "./cohortcompare/cohortcompare.component";
import { LeafletMarkerClusterModule } from "@asymmetrik/ngx-leaflet-markercluster";
import { NeedListComponent } from "./need-list/need-list.component";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { LeafletModule } from "@asymmetrik/ngx-leaflet";
import { MaterialModule } from "diu-component-library";
import { SharedModule } from "../../../shared/shared.module";

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
        PatientListComponent,
        PatientComponent,
        CohortAllComponent,
        LimitsettingComponent,
        NumberDialogComponent,
        PopulationselectComponent,
        PopslicerComponent,
        CohortcompareComponent,
        NeedListComponent,
    ],
    entryComponents: [NumberDialogComponent],
})
export class DefaultModule {}
