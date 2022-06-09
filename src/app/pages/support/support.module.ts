import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FlexLayoutModule } from "@angular/flex-layout";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { SharedModule } from "../../shared/shared.module";

import { AccordionLinkModule } from "../../shared/accordion/accordionLinkModule";
import { DemoMaterialModule } from "../../demo-material-module";
import { SupportRoutes } from "./support.routing";

import { GuideComponent } from "./guides/guides.component";

import { CapabilitiesSelectModule } from "../../shared/components/capabilities-select/capabilities-select.module";
import { AccessRequestFormComponent } from "../forms/access-request/access-request.component";
import { AccessRequestActionFormComponent } from "../forms/access-request/action/action.component";

@NgModule({
    imports: [
        CommonModule,
        AccordionLinkModule,
        CapabilitiesSelectModule,
        RouterModule.forChild(SupportRoutes),
        ReactiveFormsModule,
        FormsModule,
        FlexLayoutModule,
        DemoMaterialModule,
        SharedModule
    ],
    declarations: [GuideComponent, AccessRequestFormComponent, AccessRequestActionFormComponent],
})
export class SupportModule {}
