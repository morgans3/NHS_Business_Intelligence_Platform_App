import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { DemoMaterialModule } from "../../../demo-material-module";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { Routes } from "./team.routing";
import { DiuComponentLibraryModule } from "diu-component-library";

import { SharedCapabilitiesTableModule } from "../_shared/capabilities-table/capabilties-table.module";
import { SharedRolesTableModule } from "../_shared/roles-table/roles-table.module";
import { TeamsTableComponent } from "./table/teams-table.component";
import { TeamComponent } from "./team/team.component";

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
    declarations: [TeamsTableComponent, TeamComponent],
})
export class TeamsAdminModule {}
