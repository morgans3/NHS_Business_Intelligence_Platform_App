import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { DefaultRoutes } from "./default.routing";
import { FlexLayoutModule } from "@angular/flex-layout";
import { RouterModule } from "@angular/router";

import { MainPipe } from "../../_pipes/main-pipe.module";
import { DemoMaterialModule } from "../../demo-material-module";

import { DefaultComponent } from "./default.component";
import { HomeComponent } from "./pages/home/home.component";
import { SettingsComponent } from "./pages/settings/settings.component";
import { DatasetComponent } from "./pages/datasets/dataset.component";
import { MapFeatureComponent } from "./pages/map-feature/map-feature.component";
import { MapService } from "./shared/map.service";
import { DatasetService } from "./shared/dataset.service";

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(DefaultRoutes),
        ReactiveFormsModule,
        FormsModule,
        DemoMaterialModule,
        FlexLayoutModule,
        MainPipe,
    ],
    declarations: [
        DefaultComponent,
        HomeComponent,
        DatasetComponent,
        MapFeatureComponent,
        SettingsComponent
    ],
    providers: [
        MapService,
        DatasetService
    ]
})
export class DefaultModule {}
