import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { DemoMaterialModule } from "../../../../demo-material-module";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { JoyrideModule } from "ngx-joyride";
import { CohortAllComponent } from "./cohort-all/cohort-all.component";
import { PopslicerComponent } from "./popslicer.component";
import { SharedModule } from "../../../../shared/shared.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        ReactiveFormsModule,
        DemoMaterialModule,
        FlexLayoutModule,
        JoyrideModule.forRoot(),
        RouterModule.forChild([
            {
                path: "",
                component: PopslicerComponent,
            },
        ]),
    ],
    declarations: [PopslicerComponent, CohortAllComponent],
})
export class PopslicerModule {}
