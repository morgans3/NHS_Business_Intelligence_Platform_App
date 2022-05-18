import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { FlexLayoutModule } from "@angular/flex-layout";
import { RouterModule } from "@angular/router";
import { ChartistModule } from "ng-chartist";
import { JoyrideModule } from "ngx-joyride";
import { MainPipe } from "../../../../_pipes/main-pipe.module";
import { DemoMaterialModule } from "../../../../demo-material-module";
import { ComponentsModule } from "../../shared/components/components.module";
import { GSIRoutes } from "./gsi.routing";

import { GSIComponent } from "./GSI/GSI.component";
import { MosaicTableComponent } from "./MosaicTable/MosaicTable.component";
import { MosaicProfileComponent } from "./MosaicProfile/MosaicProfile.component";
import { GIGraphComponent } from "./GIGraph/GIGraph.component";
import { MosaicKeyComponent } from "./mosaic-key/mosaic-key.component";
import { PolygonListComponent } from "./GSI/polygonList/polygonList.component";
import { SavingViewsComponent } from "./GSI/savingViews/savingViews.component";
import { CrimeFunctionsComponent } from "./GSI/crimeFunctions/crimeFunctions.component";
import { CrimeLegendComponent } from "./GSI/crimeLegend/crimeLegend.component";

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(GSIRoutes),
        ReactiveFormsModule,
        FormsModule,
        DemoMaterialModule,
        FlexLayoutModule,
        MainPipe,
        ChartistModule,
        JoyrideModule.forRoot(),
        ComponentsModule,
    ],
    declarations: [
        GSIComponent,
        MosaicTableComponent,
        MosaicProfileComponent,
        GIGraphComponent,
        MosaicKeyComponent,
        PolygonListComponent,
        SavingViewsComponent,
        CrimeFunctionsComponent,
        CrimeLegendComponent,
    ],
})
export class GSIModule {}
