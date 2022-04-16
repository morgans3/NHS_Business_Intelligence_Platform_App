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
import { ExpandTextDialogComponent } from "./modals/dialogexpand";
import { MainPipe } from "src/app/_pipes/main-pipe.module";
import { MapComponent } from "../_components/map.component";
import { StatCardComponent } from "../_components/stat-card.component";
import { MaterialComponentsModule } from "src/app/material-component/material.module";
import { MaterialModule } from "diu-component-library";

@NgModule({
  imports: [CommonModule, RouterModule.forChild(DefaultRoutes), ReactiveFormsModule, MaterialModule, FormsModule, MaterialComponentsModule, FlexLayoutModule, MainPipe, LeafletModule, LeafletDrawModule],
  declarations: [LandingComponent, AdminComponent, IncidentsComponent, IncidentFormComponent, MethodsComponent, AddMedicationDialogComponent, FindlocationComponent, IncidentLegendComponent, ExpandTextDialogComponent, FindMosaicComponent, MapComponent, StatCardComponent],
  entryComponents: [AddMedicationDialogComponent, ExpandTextDialogComponent],
  exports: [IncidentLegendComponent, MapComponent],
})
export class DefaultModule {}
