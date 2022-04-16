import { Routes } from "@angular/router";
import { TeamsComponent } from "./teams/teams.component";
import { CreateTeamComponent } from "./teams/create-team/create-team.component";

export const TeamsRoutes: Routes = [
  {
    path: "",
    component: TeamsComponent,
  },
  {
    path: "create-team",
    component: CreateTeamComponent,
  },
  {
    path: ":teamcode",
    component: TeamsComponent,
  }
];
