import { Routes } from "@angular/router";
import { CapabilityGuard } from "src/app/_guards/capability.guard";
import { NSSSComponent } from "./pages/nsss/nsss.component";

export const DefaultRoutes: Routes = [
    {
        path: "",
        component: NSSSComponent,
        canActivate: [CapabilityGuard],
        data: { capabilities: ["cvi_shielding"] },
    },
];
