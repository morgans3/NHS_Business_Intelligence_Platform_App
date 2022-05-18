import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DemoMaterialModule } from "../../../demo-material-module";
import { FlexLayoutModule } from "@angular/flex-layout";

import { PasswordResetService } from "./password-reset.service";
import { PasswordResetRequestComponent } from "./request/request.component";
import { PasswordResetVerifyComponent } from "./verify/verify.component";
import { PasswordResetComponent } from "./reset/reset.component";

@NgModule({
    imports: [CommonModule, RouterModule, FlexLayoutModule, DemoMaterialModule, ReactiveFormsModule, FormsModule],
    declarations: [PasswordResetRequestComponent, PasswordResetVerifyComponent, PasswordResetComponent],
    providers: [PasswordResetService],
    exports: [PasswordResetRequestComponent, PasswordResetVerifyComponent, PasswordResetComponent],
})
export class PasswordComponentsModule {}
