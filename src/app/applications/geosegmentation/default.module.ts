import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { DefaultRoutes } from "./default.routing";
import { FlexLayoutModule } from "@angular/flex-layout";
import { RouterModule } from "@angular/router";

import { MainPipe } from "../../_pipes/main-pipe.module";
import { ExcelModule } from "./pages/excel/excel.module";
import { DemoMaterialModule } from "../../demo-material-module";
import { ComponentsModule } from "./shared/components/components.module";

import { HomeComponent } from "./pages/home/home.component";
import { AdminComponent } from "./pages/admin/admin.component";

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(DefaultRoutes),
        ReactiveFormsModule,
        FormsModule,
        DemoMaterialModule,
        FlexLayoutModule,
        MainPipe,
        ExcelModule,
        ComponentsModule,
    ],
    declarations: [HomeComponent, AdminComponent],
})
export class DefaultModule {}
