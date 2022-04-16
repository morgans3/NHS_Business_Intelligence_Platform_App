import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { DemoMaterialModule } from "../../../demo-material-module";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { Routes } from "./capabilities.routing";
import { DiuComponentLibraryModule } from "diu-component-library";

import { CapabilitiesTableComponent } from "./table/capabilities-table.component";
import { CapabilityComponent } from "./capability/capability.component";

@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule, DemoMaterialModule, FlexLayoutModule, RouterModule.forChild(Routes), DiuComponentLibraryModule],
    declarations: [
        CapabilitiesTableComponent,
        CapabilityComponent
    ],
})
export class CapabilitiesAdminModule { }
