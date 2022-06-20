import { Routes } from "@angular/router";
import { AdminComponent } from "./admin.component";
import { RequestsTableComponent } from "./requests/table/table.component";
import { RequestComponent } from "./requests/request/request.component";
import { AppsTableComponent } from "./apps/table/apps-table.component";
import { OrganisationsTableComponent } from "./organisations/table/org-table.component";
import { DashboardsTableComponent } from "./dashboards/table/dashboards-table.component";

export const AdminRoutes: Routes = [
    {
        path: "",
        component: AdminComponent,
        children: [
            {
                path: "users",
                loadChildren: () => import("./users/user.module").then((m) => m.UsersAdminModule),
            },
            {
                path: "requests",
                component: RequestsTableComponent,
                data: { awsTrackable: true },
            },
            {
                path: "requests/:id",
                component: RequestComponent,
            },
            {
                path: "apps",
                component: AppsTableComponent,
            },
            {
                path: "organisations",
                component: OrganisationsTableComponent,
            },
            {
                path: "dashboards",
                component: DashboardsTableComponent,
            },
            {
                path: "capabilities",
                loadChildren: () => import("./capabilities/capabilities.module").then((m) => m.CapabilitiesAdminModule),
            },
            {
                path: "roles",
                loadChildren: () => import("./roles/roles.module").then((m) => m.RolesAdminModule),
            },
            {
                path: "teams",
                loadChildren: () => import("./teams/team.module").then((m) => m.TeamsAdminModule),
            },
            {
                path: "access-logs",
                loadChildren: () => import("./access-logs/access-logs.module").then((m) => m.AccessLogsAdminModule),
            },
            {
                path: "**",
                loadChildren: () => import("../dynamic/dynamic.module").then((m) => m.DynamicPageModule),
                pathMatch: "full",
            },
        ],
    },
];
