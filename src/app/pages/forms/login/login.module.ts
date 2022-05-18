import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DemoMaterialModule } from "../../../demo-material-module";
import { FlexLayoutModule } from "@angular/flex-layout";

import { LoginComponent } from "./login.component";

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: "",
                component: LoginComponent,
            },
        ]),
        FlexLayoutModule,
        DemoMaterialModule,
        ReactiveFormsModule,
        FormsModule,
    ],
    declarations: [LoginComponent],
})
export class LoginModule {}
