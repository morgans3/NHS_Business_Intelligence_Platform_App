import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { ContactDialogComponent } from "./dialogcontact";
import { NotesDialogComponent } from "./dialognotes";
import { UserDialogComponent } from "./dialogprofile";
import { ReasonDialogComponent } from "./dialogreason";
import { VwdecisionsComponent } from "./vwdecisions.component";
import { SharedModule } from "src/app/shared/shared.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
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
