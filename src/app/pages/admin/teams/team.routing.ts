import { Routes as RouteInterface } from "@angular/router";
import { TeamsTableComponent } from "./table/teams-table.component";
import { TeamComponent } from "./team/team.component";

export const Routes: RouteInterface = [
    {
        path: "",
        component: TeamsTableComponent,
    },
    {
        path: ":id",
        component: TeamComponent,
    }
];
