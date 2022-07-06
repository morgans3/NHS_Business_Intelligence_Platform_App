import { Routes } from "@angular/router";
import { DefaultComponent } from "./default.component";
import { HomeComponent } from "./pages/home/home.component";
import { DatasetComponent } from "./pages/datasets/dataset.component";
import { SettingsComponent } from "./pages/settings/settings.component";
import { MapFeatureComponent } from "./pages/map-feature/map-feature.component";

export const DefaultRoutes: Routes = [
    {
        path: "",
        component: DefaultComponent,
        children: [
            {
                path: "",
                component: HomeComponent
            },
            {
                path: "map-feature",
                component: MapFeatureComponent,
            },
            {
                path: "datasets",
                component: DatasetComponent,
            },
            {
                path: "settings",
                component: SettingsComponent,
            }
        ]
    }
];
