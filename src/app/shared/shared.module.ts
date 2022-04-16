//Shared module: Only for things that are used
//application wide
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DemoMaterialModule } from "../demo-material-module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DiuComponentLibraryModule } from "diu-component-library";
import { FlexLayoutModule } from "@angular/flex-layout";

@NgModule({
    imports: [
        CommonModule,
        DemoMaterialModule,
        FormsModule, ReactiveFormsModule,
        DiuComponentLibraryModule,
        FlexLayoutModule
    ],
    exports: [
        DemoMaterialModule,
        FormsModule, ReactiveFormsModule,
        DiuComponentLibraryModule,
        FlexLayoutModule
    ],
})
export class SharedModule { }
