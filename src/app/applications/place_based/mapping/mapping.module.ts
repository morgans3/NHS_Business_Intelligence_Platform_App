import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { CommonModule } from "@angular/common";
import { MappingRoutes } from "./mapping.routing";
import { FlexLayoutModule } from "@angular/flex-layout";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { LeafletModule } from "@asymmetrik/ngx-leaflet";
import { LeafletDrawModule } from "@asymmetrik/ngx-leaflet-draw";
import { MappingComponent } from "./mapping/mapping.component";
import { WorksheetComponent } from "./mapping/worksheet/worksheet.component";
import { MaterialModule } from "diu-component-library";
import { MainPipe } from "src/app/_pipes/main-pipe.module";
import { MapComponent } from "../_components/map.component";
import { IncidentLegendComponent } from "../Landing/incidentLegend/incidentLegend.component";
import { HomepanelComponent } from "./mapping/panels/homepanel/homepanel.component";
import { MapdatasetsComponent } from "./mapping/panels/mapdatasets/mapdatasets.component";
import { MapsettingsComponent } from "./mapping/panels/mapsettings/mapsettings.component";
import { MapfiltersComponent } from "./mapping/panels/mapfilters/mapfilters.component";
import { SavedviewsComponent } from "./mapping/panels/savedviews/savedviews.component";
import { MarkeroptionsComponent } from "./mapping/panels/mapfilters/markeroptions/markeroptions.component";

@NgModule({
  imports: [CommonModule, RouterModule.forChild(MappingRoutes), ReactiveFormsModule, FormsModule, MaterialModule, FlexLayoutModule, MainPipe, LeafletModule, LeafletDrawModule],
  declarations: [MappingComponent, WorksheetComponent, MapComponent, IncidentLegendComponent, HomepanelComponent, MapdatasetsComponent, MapsettingsComponent, MapfiltersComponent, SavedviewsComponent, MarkeroptionsComponent],
  entryComponents: [],
  exports: [],
})
export class MappingModule {}