import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { DemoMaterialModule } from "../../../../demo-material-module";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { JoyrideModule } from "ngx-joyride";
import { CohortAllComponent } from "./cohort-all/cohort-all.component";
import { VerifiyDialogComponent } from "./UserValidation/dialogverifiy";
import { ValidateDialogComponent } from "./UserValidation/dialogvalidate";
import { UserValidationComponent } from "./UserValidation/UserValidation.component";
import { PopslicerComponent } from "./popslicer.component";
import { SharedModule } from "src/app/shared/shared.module";

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
    declarations: [PopslicerComponent, UserValidationComponent, ValidateDialogComponent, VerifiyDialogComponent, CohortAllComponent],
})
export class PopslicerModule {}
