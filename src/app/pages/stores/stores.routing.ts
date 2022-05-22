import { Routes } from "@angular/router";
import { StoresComponent } from "./stores/stores.component";

export const StoresRoutes: Routes = [
    {
        path: "apps",
        component: StoresComponent,
    },
    {
        path: "dashboardstore",
        component: StoresComponent,
    },
];
