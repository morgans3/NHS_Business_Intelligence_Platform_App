import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

import { SharedModule } from "../../shared/shared.module"
import { DynamicComponent } from "./dynamic.component";

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild([
            { path: "", component: DynamicComponent }
        ])
    ],
    declarations: [
        DynamicComponent
    ]
})
export class DynamicPageModule { }
