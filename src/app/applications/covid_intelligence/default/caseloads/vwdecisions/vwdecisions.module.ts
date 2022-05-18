import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { DemoMaterialModule } from "../../../../../demo-material-module";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { ContactDialogComponent } from "./dialogcontact";
import { NotesDialogComponent } from "./dialognotes";
import { UserDialogComponent } from "./dialogprofile";
import { ReasonDialogComponent } from "./dialogreason";
import { VwdecisionsComponent } from "./vwdecisions.component";
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
                component: VwdecisionsComponent,
            },
        ]),
    ],
    declarations: [ContactDialogComponent, NotesDialogComponent, UserDialogComponent, ReasonDialogComponent, VwdecisionsComponent],
})
export class VWDecisionsModule {}
