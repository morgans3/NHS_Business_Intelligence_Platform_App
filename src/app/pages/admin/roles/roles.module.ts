import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { DemoMaterialModule } from "../../../demo-material-module";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { Routes } from "./roles.routing";
import { DiuComponentLibraryModule } from "diu-component-library";

import { RolesTableComponent } from "./table/roles-table.component";
import { RoleComponent } from "./role/role.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        DemoMaterialModule,
        FlexLayoutModule,
        RouterModule.forChild(Routes),
        DiuComponentLibraryModule,
    ],
    declarations: [RolesTableComponent, RoleComponent],
})
export class RolesAdminModule {}
