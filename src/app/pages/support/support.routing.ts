import { Routes } from "@angular/router";
import { GuideComponent } from "./guides/guides.component";
import { AccessRequestFormComponent } from "../forms/access-request/access-request.component";
import { AccessRequestActionFormComponent } from "../forms/access-request/action/action.component";

export const SupportRoutes: Routes = [
    { path: "guides", component: GuideComponent },
    {
        path: "guides/:id",
        component: GuideComponent,
        data: { awsTrackable: true },
    },
    { path: "access-request", component: AccessRequestFormComponent },
    {
        path: "access-request/:action",
        component: AccessRequestActionFormComponent,
        data: { awsTrackable: true },
    },
    { path: "", redirectTo: "/support/guides", pathMatch: "full" },
];
