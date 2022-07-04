import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { DiuComponentLibraryModule } from "diu-component-library";
import { DemoMaterialModule } from "../../demo-material-module";
import { FlexLayoutModule } from "@angular/flex-layout";
import { TeamsRoutes } from "./teams.routing";

import { TeamsComponent } from "./teams/teams.component";
import { TeamMembersComponent } from "./teams/team-members/team-members.component";
import { MeetTeamComponent } from "./teams/meet-team/meet-team.component";
import { CreateTeamComponent } from "./teams/create-team/create-team.component";

import { TeamAdminComponent } from "./teams/team-admin/team-admin.component";
import { TeamAccessComponent } from "./teams/team-admin/team-access/access.component";
import { CapabilitiesSelectModule } from "../../shared/components/capabilities-select/capabilities-select.module";
import { RolesSelectModule } from "../../shared/components/roles-select/roles-select.module";

@NgModule({
    imports: [
        CommonModule,
        DemoMaterialModule,
        FlexLayoutModule,
        RouterModule.forChild(TeamsRoutes),
        RolesSelectModule,
        CapabilitiesSelectModule,
        DiuComponentLibraryModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    declarations: [
        TeamsComponent,
        TeamAdminComponent,
        TeamMembersComponent,
        MeetTeamComponent,
        CreateTeamComponent,
        TeamAccessComponent,
    ],
})
export class TeamsModule {}
