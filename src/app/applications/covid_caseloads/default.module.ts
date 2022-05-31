import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { CommonModule } from "@angular/common";
import { DefaultRoutes } from "./default.routing";
import { FlexLayoutModule } from "@angular/flex-layout";
import { DemoMaterialModule } from "../../demo-material-module";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { MainPipe } from "../../_pipes/main-pipe.module";
import { JoyrideModule } from "ngx-joyride";
import { MaterialModule } from "diu-component-library";
import { SharedModule } from "../../shared/shared.module";

import { RecentreferralsComponent } from "./pages/recentreferrals/recentreferrals.component";

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(DefaultRoutes),
        ReactiveFormsModule,
        FormsModule,
        DemoMaterialModule,
        MaterialModule,
        FlexLayoutModule,
        MainPipe,
        JoyrideModule.forRoot(),
        SharedModule,
    ],
    declarations: [
        RecentreferralsComponent,
    ],
})
export class DefaultModule { }
