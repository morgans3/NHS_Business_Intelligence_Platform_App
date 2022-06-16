import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { DemoMaterialModule } from "../../../demo-material-module";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { Routes } from "./user.routing";
import { DiuComponentLibraryModule } from "diu-component-library";

import { SharedCapabilitiesTableModule } from "../_shared/capabilities-table/capabilties-table.module";
import { SharedRolesTableModule } from "../_shared/roles-table/roles-table.module";
import { UsersTableComponent } from "./table/users-table.component";
import { UserComponent } from "./user/user.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        DemoMaterialModule,
        FlexLayoutModule,
        RouterModule.forChild(Routes),
        DiuComponentLibraryModule,
        SharedCapabilitiesTableModule,
        SharedRolesTableModule
    ],
    declarations: [UsersTableComponent, UserComponent],
})
export class UsersAdminModule {}
