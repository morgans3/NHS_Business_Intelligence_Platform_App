import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { DemoMaterialModule } from "../../../../../demo-material-module";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { RecentreferralsComponent } from "./recentreferrals.component";
import { SharedModule } from "../../../shared/shared.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        DemoMaterialModule,
        FlexLayoutModule,
        SharedModule,
        RouterModule.forChild([
            {
                path: "",
                component: RecentreferralsComponent,
            },
        ]),
    ],
    declarations: [RecentreferralsComponent],
})
export class RecentReferralsModule {}
