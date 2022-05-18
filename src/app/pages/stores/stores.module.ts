import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { DemoMaterialModule } from "../../demo-material-module";
import { FlexLayoutModule } from "@angular/flex-layout";
import { StoresRoutes } from "./stores.routing";
import { DiuComponentLibraryModule } from "diu-component-library";
import { StoresComponent } from "./stores/stores.component";

@NgModule({
    imports: [CommonModule, DemoMaterialModule, FlexLayoutModule, RouterModule.forChild(StoresRoutes), DiuComponentLibraryModule],
    declarations: [StoresComponent],
})
export class StoresModule {}
