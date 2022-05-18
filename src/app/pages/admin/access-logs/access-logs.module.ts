import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { DemoMaterialModule } from "../../../demo-material-module";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { Routes } from "./access-logs.routing";
import { DiuComponentLibraryModule } from "diu-component-library";

import { AccessLogComponent } from "./access-log.component";
import { AccessLogsTableComponent } from "./table/logs-table.component";
import { AccessLogsChartComponent } from "./chart/logs-chart.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        DemoMaterialModule,
        FlexLayoutModule,
        RouterModule.forChild(Routes),
        DiuComponentLibraryModule,
    ],
    declarations: [AccessLogComponent, AccessLogsTableComponent, AccessLogsChartComponent],
})
export class AccessLogsAdminModule {}
