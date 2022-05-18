import "hammerjs";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";
import { CommonModule } from "@angular/common";

import { DemoMaterialModule } from "../demo-material-module";
import { CdkTableModule } from "@angular/cdk/table";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FlexLayoutModule } from "@angular/flex-layout";

import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatMomentDatetimeModule } from "@mat-datetimepicker/moment";
import { MatDatetimepickerModule } from "@mat-datetimepicker/core";

@NgModule({
    imports: [
        CommonModule,
        DemoMaterialModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        FlexLayoutModule,
        CdkTableModule,
        MatDatepickerModule,
        MatMomentDatetimeModule,
        MatDatetimepickerModule,
    ],
})
export class MaterialComponentsModule {}
