import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { DemoMaterialModule } from "../../../../demo-material-module";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { CohortcompareComponent } from "./cohortcompare.component";
import { SharedModule } from "../../../../shared/shared.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        ReactiveFormsModule,
        DemoMaterialModule,
        FlexLayoutModule,
        RouterModule.forChild([
            {
                path: "",
                component: CohortcompareComponent,
            },
        ]),
    ],
    declarations: [CohortcompareComponent],
})
export class CohortCompareModule {}
