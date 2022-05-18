import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FlexLayoutModule } from "@angular/flex-layout";

import { DemoMaterialModule } from "../../../demo-material-module";
import { MainPipe } from "../../../_pipes/main-pipe.module";

import { StatCardComponent } from "./components/stat-card/stat-card.component";
import { ExpandTextDialogComponent } from "./modals/expand/dialogexpand";
import { ExpandListDialogComponent } from "./modals/expandlist/dialogexpandlist";
import { ConfirmTextDialogComponent } from "./modals/textconfirm/dialogtextconfirm";

@NgModule({
    imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule, DemoMaterialModule, FlexLayoutModule, MainPipe],
    declarations: [StatCardComponent, ExpandTextDialogComponent, ExpandListDialogComponent, ConfirmTextDialogComponent],
    exports: [StatCardComponent, ExpandTextDialogComponent, ExpandListDialogComponent, ConfirmTextDialogComponent],
    providers: [],
})
export class SharedModule {}
