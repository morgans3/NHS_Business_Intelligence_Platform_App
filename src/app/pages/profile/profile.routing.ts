import { Routes } from "@angular/router";
import { ProfileComponent } from "./profile.component";

export const ProfileRoutes: Routes = [
    {
        path: "",
        component: ProfileComponent,
        data: { awsTrackable: true },
    },
    {
        path: ":tab",
        component: ProfileComponent,
        data: { awsTrackable: true },
    },
];
