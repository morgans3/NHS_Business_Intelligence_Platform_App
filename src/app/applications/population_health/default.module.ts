import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FlexLayoutModule } from "@angular/flex-layout";

import { DemoMaterialModule } from "../../demo-material-module";
import { MainPipe } from "../../_pipes/main-pipe.module";

import { DefaultRoutes } from "./default.routing";
import { SettingsComponent } from "./pages/settings/settings.component";

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
    declarations: [SettingsComponent],
})
export class DefaultModule {}
