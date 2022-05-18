import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { DemoMaterialModule } from "../../../../demo-material-module";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { SharedModule } from "../../shared/shared.module";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { NeedListComponent } from "./need-list.component";
import { JoyrideModule } from "ngx-joyride";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        DragDropModule,
        ReactiveFormsModule,
        DemoMaterialModule,
        FlexLayoutModule,
        JoyrideModule.forRoot(),
        RouterModule.forChild([
            {
                path: "",
                component: NeedListComponent,
            },
        ]),
    ],
    declarations: [NeedListComponent],
})
export class NeedListModule {}
