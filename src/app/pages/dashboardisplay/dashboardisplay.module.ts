import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { CommonModule } from "@angular/common";
import { FlexLayoutModule } from "@angular/flex-layout";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { MaterialModule } from "diu-component-library";
import { DashboardisplayRoutes } from "./dashboardisplay.routing";
import { DemoMaterialModule } from "src/app/demo-material-module";
import { MainPipe } from "src/app/_pipes/main-pipe.module";
import { SharedModule } from "src/app/shared/shared.module";
import { DashboardisplayComponent } from "./dashboardisplay.component";

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(DashboardisplayRoutes),
        ReactiveFormsModule,
        FormsModule,
        MaterialModule,
        DemoMaterialModule,
        FlexLayoutModule,
        MainPipe,
        SharedModule,
    ],
    declarations: [DashboardisplayComponent],
    entryComponents: [],
    exports: [],
})
export class DashboardisplayModule {}
