import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { CommonModule } from "@angular/common";
import { DefaultRoutes } from "./default.routing";
import { FlexLayoutModule } from "@angular/flex-layout";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { LandingComponent } from "./Landing/Landing.component";
import { AdminComponent } from "./Admin/Admin.component";
import { IncidentsComponent } from "./Incidents/Incidents.component";
import { IncidentFormComponent, AddMedicationDialogComponent } from "./Incidents/IncidentForm/IncidentForm.component";
import { MethodsComponent } from "./Admin/Methods/Methods.component";
import { FindlocationComponent } from "./Incidents/IncidentForm/findlocation/findlocation.component";
import { LeafletModule } from "@asymmetrik/ngx-leaflet";
import { LeafletDrawModule } from "@asymmetrik/ngx-leaflet-draw";
import { IncidentLegendComponent } from "./Landing/incidentLegend/incidentLegend.component";
import { FindMosaicComponent } from "./Incidents/IncidentForm/findMosaic/findMosaic.component";
import { MainPipe } from "../../../_pipes/main-pipe.module";
import { MaterialComponentsModule } from "../../../material-component/material.module";
import { MaterialModule } from "diu-component-library";
import { SharedModule } from "../../../shared/shared.module";

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(DefaultRoutes),
        ReactiveFormsModule,
        MaterialModule,
        FormsModule,
        MaterialComponentsModule,
        FlexLayoutModule,
        MainPipe,
        LeafletModule,
        LeafletDrawModule,
        SharedModule,
    ],
    declarations: [
        LandingComponent,
        AdminComponent,
        IncidentsComponent,
        IncidentFormComponent,
        MethodsComponent,
        AddMedicationDialogComponent,
        FindlocationComponent,
        IncidentLegendComponent,
        FindMosaicComponent,
    ],
    entryComponents: [AddMedicationDialogComponent],
    exports: [IncidentLegendComponent],
})
export class DefaultModule {}
