import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { DemoMaterialModule } from "../../demo-material-module";
import { FlexLayoutModule } from "@angular/flex-layout";
import { TeamsRoutes } from "./teams.routing";
import { TeamAdminComponent } from "./teams/team-admin/team-admin.component";
import { TeamsComponent } from "./teams/teams.component";
import { TeamMembersComponent } from "./teams/team-members/team-members.component";
import { MeetTeamComponent } from "./teams/meet-team/meet-team.component";
import { CreateTeamComponent } from "./teams/create-team/create-team.component";
import { DiuComponentLibraryModule } from "diu-component-library";
import { RoleCapabilityListModule } from "../profile/details/rolecapabilitylist/rolecapabilitylist.component";

@NgModule({
  imports: [CommonModule, DemoMaterialModule, FlexLayoutModule, RouterModule.forChild(TeamsRoutes), RoleCapabilityListModule, DiuComponentLibraryModule, FormsModule, ReactiveFormsModule],
  declarations: [TeamsComponent, TeamAdminComponent, TeamAdminComponent, TeamMembersComponent, MeetTeamComponent, CreateTeamComponent],
})
export class TeamsModule {}
