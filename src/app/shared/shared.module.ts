import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DemoMaterialModule } from "../demo-material-module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DiuComponentLibraryModule } from "diu-component-library";
import { FlexLayoutModule } from "@angular/flex-layout";
import { MapComponent } from "./map.component";
import { RouterModule } from "@angular/router";
import { MainPipe } from "../_pipes/main-pipe.module";

import { StatCardComponent } from "./stat-card.component";
import { ExpandListDialogComponent } from "./modals/expandlist/dialogexpandlist";
import { ConfirmTextDialogComponent } from "./modals/textconfirm/dialogtextconfirm";
import { UserValidationComponent } from "./user-validation/UserValidation.component";
import { VerifiyDialogComponent } from "./modals/verify/dialogverifiy";
import { ValidateDialogComponent } from "./modals/validate/dialogvalidate";
import { LeafletModule } from "@asymmetrik/ngx-leaflet";
import { ModalService } from "../_services/modal.service";

@NgModule({
    declarations: [
        MapComponent,
        StatCardComponent,
        ExpandListDialogComponent,
        ConfirmTextDialogComponent,
        UserValidationComponent,
        VerifiyDialogComponent,
        ValidateDialogComponent,
    ],
    imports: [
        CommonModule,
        DemoMaterialModule,
        FormsModule,
        ReactiveFormsModule,
        DiuComponentLibraryModule,
        FlexLayoutModule,
        DemoMaterialModule,
        RouterModule,
        MainPipe,
        LeafletModule,
    ],
    exports: [
        DemoMaterialModule,
        FormsModule,
        ReactiveFormsModule,
        DiuComponentLibraryModule,
        FlexLayoutModule,
        MapComponent,
        StatCardComponent,
        ExpandListDialogComponent,
        ConfirmTextDialogComponent,
        UserValidationComponent,
    ],
    providers: [ModalService],
    entryComponents: [VerifiyDialogComponent, ValidateDialogComponent],
})
export class SharedModule {}
