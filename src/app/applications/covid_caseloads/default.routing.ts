import { Routes } from "@angular/router";
import { RecentreferralsComponent } from "./pages/recentreferrals/recentreferrals.component";

export const DefaultRoutes: Routes = [
    {
        path: "virtualwards_decisions",
        loadChildren: () => import("./pages/vwdecisions/vwdecisions.module").then(m => m.VWDecisionsModule)
    },
    {
        path: "recent_referrals",
        component: RecentreferralsComponent
    },
    {
        path: "",
        redirectTo: "virtualwards_decisions"
    }
];
