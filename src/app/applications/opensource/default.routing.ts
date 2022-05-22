import { Routes } from "@angular/router";
import { LandingComponent } from "./pages/landing/Landing.component";

export const DefaultRoutes: Routes = [
    {
        path: "main",
        component: LandingComponent,
    },
    {
        path: "health_inequalities_tool",
        loadChildren: () => import("./pages/tools/tools.module").then((m) => m.ToolsModule),
    },
];
