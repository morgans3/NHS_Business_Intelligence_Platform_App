import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DemoMaterialModule } from "../../../demo-material-module";
import { FlexLayoutModule } from "@angular/flex-layout";

import { PasswordComponentsModule } from "./password-components.module";
import { PasswordResetLayoutComponent } from "./password-reset.component";

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: "",
                component: PasswordResetLayoutComponent,
            },
        ]),
        FormsModule,
        FlexLayoutModule,
        DemoMaterialModule,
        ReactiveFormsModule,
        PasswordComponentsModule,
    ],
    declarations: [PasswordResetLayoutComponent],
})
export class PasswordResetModule {}
