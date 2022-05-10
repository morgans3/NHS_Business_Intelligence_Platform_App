import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { DemoMaterialModule } from "../../../demo-material-module";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { Routes } from "./user.routing";
import { DiuComponentLibraryModule } from "diu-component-library";

import { UsersTableComponent } from "./table/users-table.component"
import { UserComponent } from "./user/user.component";

@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule, DemoMaterialModule, FlexLayoutModule, RouterModule.forChild(Routes), DiuComponentLibraryModule],
    declarations: [
        UsersTableComponent,
        UserComponent
    ],
})
export class UsersAdminModule { }
