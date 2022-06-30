import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FlexLayoutModule } from "@angular/flex-layout";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { DemoMaterialModule } from "../../../demo-material-module";
import { SharedModule } from "../../shared.module";

import { RolesSelectComponent } from "./roles-select.component";

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
        FormsModule,
        FlexLayoutModule,
        DemoMaterialModule,
        SharedModule
    ],
    declarations: [RolesSelectComponent],
    exports: [RolesSelectComponent]
})
export class RolesSelectModule {}