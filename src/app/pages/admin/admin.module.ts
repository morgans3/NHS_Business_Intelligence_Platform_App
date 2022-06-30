import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { DemoMaterialModule } from "../../demo-material-module";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { AdminRoutes } from "./admin.routing";
import { DiuComponentLibraryModule } from "diu-component-library";

import { AdminComponent } from "./admin.component";
import { RequestsTableComponent } from "./requests/table/table.component";
import { RequestComponent } from "./requests/request/request.component";
import { AppsTableComponent } from "./apps/table/apps-table.component";
import { OrganisationsTableComponent } from "./organisations/table/org-table.component";
import { DashboardsTableComponent } from "./dashboards/table/dashboards-table.component";
import { AlertsTableComponent } from "./alerts/table/alerts-table.component";
import { NewsfeedsTableComponent } from "./newsfeeds/table/newsfeeds-table.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        DemoMaterialModule,
        FlexLayoutModule,
        RouterModule.forChild(AdminRoutes),
        DiuComponentLibraryModule,
    ],
    declarations: [
        AdminComponent,
        RequestsTableComponent,
        RequestComponent,
        AppsTableComponent,
        OrganisationsTableComponent,
        DashboardsTableComponent,
        AlertsTableComponent,
        NewsfeedsTableComponent,
    ],
})
export class AdminModule {}
