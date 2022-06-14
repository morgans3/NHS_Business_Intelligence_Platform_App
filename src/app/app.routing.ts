import { Routes } from "@angular/router";
import { AuthGuard } from "./_guards/auth.guard";
import { FullComponent } from "./layouts/full/full.component";
import { FormLayoutComponent } from "./layouts/form/form.component";
import { SupportLayoutComponent } from "./layouts/support/support.component";
import { FullmapComponent } from "./layouts/fullmap/fullmap.component";

export const AppRoutes: Routes = [
    {
        path: "",
        component: FormLayoutComponent,
        children: [
            {
                path: "",
                loadChildren: () => import("./pages/forms/login/login.module").then((m) => m.LoginModule),
            },
            {
                path: "login",
                loadChildren: () => import("./pages/forms/login/login.module").then((m) => m.LoginModule),
            },
            {
                path: "password-reset",
                loadChildren: () => import("./pages/forms/password-reset/password-reset.module").then((m) => m.PasswordResetModule),
            },
        ],
    },
    {
        path: "support",
        component: SupportLayoutComponent,
        children: [
            {
                path: "",
                loadChildren: () => import("./pages/support/support.module").then((m) => m.SupportModule),
            },
        ],
    },
    {
        path: "apps",
        canActivate: [AuthGuard],
        children: [
            {
                path: "",
                pathMatch: "full",
                component: FullComponent,
                loadChildren: () => import("./pages/stores/stores.module").then((m) => m.StoresModule),
                canActivate: [AuthGuard],
            },
            {
                path: "mapping",
                component: FullmapComponent,
                data: { layout_config: { id: "Place_Based_Intelligence" } },
                loadChildren: () => import("./applications/place_based/mapping.module").then((m) => m.MappingModule),
            },
            {
                path: "covid19",
                component: FullComponent,
                data: { layout_config: { id: "Covid19_Information" } },
                loadChildren: () => import("./applications/covid_intelligence/default/default.module").then((m) => m.DefaultModule),
            },
            {
                path: "covid19-shielding",
                component: FullComponent,
                data: { layout_config: { id: "Covid19_Information" } },
                loadChildren: () => import("./applications/covid_shielding/default.module").then((m) => m.DefaultModule),
            },
            {
                path: "covid19-caseloads",
                component: FullComponent,
                data: { layout_config: { id: "Covid19_Information" } },
                loadChildren: () => import("./applications/covid_caseloads/default.module").then((m) => m.DefaultModule),
            },
            {
                path: "population-health",
                component: FullComponent,
                data: { layout_config: { id: "Population_Health" } },
                loadChildren: () => import("./applications/population_health/default.module").then((m) => m.DefaultModule),
            },
            {
                path: "suicide-prevention",
                component: FullComponent,
                data: { layout_config: { id: "Suicide_Prevention" } },
                loadChildren: () => import("./applications/suicide_prevention/default/default.module").then((m) => m.DefaultModule),
            },
            {
                path: "opensource",
                component: FullComponent,
                data: { layout_config: { id: "Opensource" } },
                loadChildren: () => import("./applications/opensource/default.module").then((m) => m.DefaultModule),
            },
            {
                path: "geosegmentation",
                component: FullComponent,
                data: { layout_config: { id: "Geosegmentation" } },
                loadChildren: () => import("./applications/geosegmentation/default.module").then((m) => m.DefaultModule),
            },
            {
                path: "**",
                component: FullComponent,
                loadChildren: () => import("./pages/dynamic/dynamic.module").then((m) => m.DynamicPageModule),
                pathMatch: "full",
            },
        ],
    },
    {
        path: "dashboardstore",
        canActivate: [AuthGuard],
        children: [
            {
                path: "",
                pathMatch: "full",
                component: FullComponent,
                loadChildren: () => import("./pages/stores/stores.module").then((m) => m.StoresModule),
                canActivate: [AuthGuard],
            },
            {
                path: "virtual_wardy",
                component: FullComponent,
                loadChildren: () => import("./pages/dashboardisplay/dashboardisplay.module").then((m) => m.DashboardisplayModule),
            },
            {
                path: "**",
                component: FullComponent,
                loadChildren: () => import("./pages/dynamic/dynamic.module").then((m) => m.DynamicPageModule),
                pathMatch: "full",
            },
        ],
    },
    {
        path: "",
        component: FullComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: "dashboard",
                loadChildren: () => import("./pages/dashboard/dashboard.module").then((m) => m.DashboardModule),
            },
            {
                path: "teams",
                loadChildren: () => import("./pages/teams/teams.module").then((m) => m.TeamsModule),
                data: { awsTrackable: true },
            },
            {
                path: "profile",
                loadChildren: () => import("./pages/profile/profile.module").then((m) => m.ProfileModule),
            },
            {
                path: "admin",
                loadChildren: () => import("./pages/admin/admin.module").then((m) => m.AdminModule),
                // data: { capabilities: ["admin"] },
                // canActivate: [CapabilityGuard]
            },
            {
                path: "**",
                loadChildren: () => import("./pages/dynamic/dynamic.module").then((m) => m.DynamicPageModule),
                pathMatch: "full",
            },
        ],
    },
    {
        path: "**",
        loadChildren: () => import("./pages/dynamic/dynamic.module").then((m) => m.DynamicPageModule),
        pathMatch: "full",
        canActivate: [AuthGuard],
    },
];
