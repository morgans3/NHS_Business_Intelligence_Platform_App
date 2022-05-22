import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { CommonModule } from "@angular/common";
import { MappingRoutes } from "./mapping.routing";
import { FlexLayoutModule } from "@angular/flex-layout";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { LeafletModule } from "@asymmetrik/ngx-leaflet";
import { LeafletDrawModule } from "@asymmetrik/ngx-leaflet-draw";
import { DefaultModule } from "../default.module";
import { MappingComponent } from "./mapping/mapping.component";
import { WorksheetComponent } from "./mapping/worksheet/worksheet.component";
import { MaterialModule } from "diu-component-library";
import { MainPipe } from "src/app/_pipes/main-pipe.module";
import { SharedModule } from "src/app/shared/shared.module";

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(MappingRoutes),
        ReactiveFormsModule,
        FormsModule,
        MaterialModule,
        FlexLayoutModule,
        MainPipe,
        LeafletModule,
        LeafletDrawModule,
        DefaultModule,
        SharedModule,
    ],
    declarations: [MappingComponent, WorksheetComponent],
    entryComponents: [],
    exports: [],
})
export class MappingModule {}
