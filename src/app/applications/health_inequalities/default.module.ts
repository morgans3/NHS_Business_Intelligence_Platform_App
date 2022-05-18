import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { DefaultRoutes } from "./default.routing";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DemoMaterialModule } from "../../demo-material-module";
import { MainPipe } from "../../_pipes/main-pipe.module";

import { HiLandingComponent } from "./pages/landing/landing.component";
import { HiDataComponent } from "./pages/data/data.component";

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(DefaultRoutes),
        ReactiveFormsModule,
        FormsModule,
        DemoMaterialModule,
        FlexLayoutModule,
        MainPipe,
    ],
    declarations: [HiLandingComponent, HiDataComponent],
})
export class DefaultModule {}
