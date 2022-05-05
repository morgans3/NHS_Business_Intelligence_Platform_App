import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FlexLayoutModule } from "@angular/flex-layout";

import { DemoMaterialModule } from "../../../demo-material-module"
import { MainPipe } from "../../../_pipes/main-pipe.module";

import { UserValidationComponent } from "./components/user-validation/UserValidation.component";
import { VerifiyDialogComponent } from "./modals/verify/dialogverifiy";
import { ValidateDialogComponent } from "./modals/validate/dialogvalidate";
import { StatCardComponent } from "./components/stat-card/stat-card.component";

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        RouterModule,
        DemoMaterialModule,
        FlexLayoutModule,
        MainPipe
    ],
    declarations: [
        StatCardComponent,
        UserValidationComponent,
        VerifiyDialogComponent,
        ValidateDialogComponent
    ],
    entryComponents: [
        VerifiyDialogComponent,
        ValidateDialogComponent
    ],
    exports: [
        StatCardComponent,
        UserValidationComponent,
        VerifiyDialogComponent,
        ValidateDialogComponent
    ],
})
export class SharedModule {}