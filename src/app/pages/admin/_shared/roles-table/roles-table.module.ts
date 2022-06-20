import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { DemoMaterialModule } from "../../../../demo-material-module";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DiuComponentLibraryModule } from "diu-component-library";

import { SharedRolesTableComponent } from "./roles-table.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        ReactiveFormsModule,
        DemoMaterialModule,
        FlexLayoutModule,
        DiuComponentLibraryModule,
    ],
    declarations: [SharedRolesTableComponent],
    exports: [SharedRolesTableComponent]
})
export class SharedRolesTableModule {}
