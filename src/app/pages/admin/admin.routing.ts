import { Routes } from "@angular/router";
import { CapabilityGuard } from "../../_guards/capability.guard";
import { AdminComponent } from "./admin.component";
import { RequestsTableComponent } from "./requests/table/table.component";
import { RequestComponent } from "./requests/request/request.component";
import { AppsTableComponent } from "./apps/table/apps-table.component";
import { OrganisationsTableComponent } from "./organisations/table/org-table.component";
import { DashboardsTableComponent } from "./dashboards/table/dashboards-table.component";
import { AlertsTableComponent } from "./alerts/table/alerts-table.component";
import { NewsfeedsTableComponent } from "./newsfeeds/table/newsfeeds-table.component";

export const AdminRoutes: Routes = [
    {
        path: "",
        component: AdminComponent,
        children: [
            {
                path: "users",
                loadChildren: () => import("./users/user.module").then((m) => m.UsersAdminModule),
                data: { capabilities: ["Inspection"] },
                canActivate: [CapabilityGuard]
            },
            {
                path: "requests",
                component: RequestsTableComponent,
                data: { awsTrackable: true, capabilities: ["Hall Monitor"] },
                canActivate: [CapabilityGuard]
            },
            {
                path: "requests/:id",
                component: RequestComponent,
                data: { capabilities: ["Hall Monitor"] },
                canActivate: [CapabilityGuard]
            },
            {
                path: "apps",
                component: AppsTableComponent,
                data: { capabilities: ["Hall Monitor"] },
                canActivate: [CapabilityGuard]
            },
            {
                path: "organisations",
                component: OrganisationsTableComponent,
                data: { capabilities: ["Hall Monitor"] },
                canActivate: [CapabilityGuard]
            },
            {
                path: "alerts",
                component: AlertsTableComponent,
            },
            {
                path: "newsfeeds",
                component: NewsfeedsTableComponent,
            },
            {
                path: "dashboards",
                component: DashboardsTableComponent,
                data: { capabilities: ["Hall Monitor"] },
                canActivate: [CapabilityGuard]
            },
            {
                path: "capabilities",
                loadChildren: () => import("./capabilities/capabilities.module").then((m) => m.CapabilitiesAdminModule),
                data: { capabilities: ["Hall Monitor"] },
                canActivate: [CapabilityGuard]
            },
            {
                path: "roles",
                loadChildren: () => import("./roles/roles.module").then((m) => m.RolesAdminModule),
                data: { capabilities: ["Hall Monitor"] },
                canActivate: [CapabilityGuard]
            },
            {
                path: "teams",
                loadChildren: () => import("./teams/team.module").then((m) => m.TeamsAdminModule),
                data: { capabilities: ["Hall Monitor"] },
                canActivate: [CapabilityGuard]
            },
            {
                path: "access-logs",
                loadChildren: () => import("./access-logs/access-logs.module").then((m) => m.AccessLogsAdminModule),
                data: { capabilities: ["Inspection"] },
                canActivate: [CapabilityGuard]
            },
            {
                path: "**",
                loadChildren: () => import("../dynamic/dynamic.module").then((m) => m.DynamicPageModule),
                pathMatch: "full",
                data: { capabilities: ["Hall Monitor"] },
                canActivate: [CapabilityGuard]
            },
        ],
    },
];
