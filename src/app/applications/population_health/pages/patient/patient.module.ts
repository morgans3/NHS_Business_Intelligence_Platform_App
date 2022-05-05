import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { DemoMaterialModule } from "../../../../demo-material-module";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { SharedModule } from "../../shared/shared.module";
import { CrimeInformationComponent } from "./crime-information/crime-information.component";
import { TheographComponent } from "./theograph/theograph.component";
import { PatientComponent } from "./patient.component";

@NgModule({
    imports: [
        CommonModule, 
        FormsModule, 
        SharedModule,
        ReactiveFormsModule, 
        DemoMaterialModule, 
        FlexLayoutModule, 
        RouterModule.forChild([{
            path: "", component: PatientComponent
        }]), 
    ],
    declarations: [
        PatientComponent, 
        TheographComponent,
        CrimeInformationComponent
    ],
})
export class PatientModule {}
