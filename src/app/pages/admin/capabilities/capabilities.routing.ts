import { Routes as RouteInterface } from "@angular/router";
import { CapabilitiesTableComponent } from "./table/capabilities-table.component";
import { CapabilityComponent } from "./capability/capability.component";

export const Routes: RouteInterface = [
    {
        path: "",
        component: CapabilitiesTableComponent,
    },
    {
        path: ":id",
        component: CapabilityComponent,
    }
];
