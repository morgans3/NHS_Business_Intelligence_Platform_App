import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FlexLayoutModule } from "@angular/flex-layout";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";

import { AccordionLinkModule } from "../../shared/accordion/accordionLinkModule";
import { DemoMaterialModule } from "src/app/demo-material-module";
import { SupportRoutes } from "./support.routing";

import { GuideComponent } from "./guides/guides.component";

import { GPSelectComponent } from "../forms/access-request/gp-select/gp-select.component";
import { AccessRequestFormComponent } from "../forms/access-request/access-request.component";
import { AccessRequestActionFormComponent } from "../forms/access-request/action/action.component";

@NgModule({
  imports: [CommonModule, AccordionLinkModule, RouterModule.forChild(SupportRoutes), ReactiveFormsModule, FormsModule, FlexLayoutModule, DemoMaterialModule],
  declarations: [GuideComponent, GPSelectComponent, AccessRequestFormComponent, AccessRequestActionFormComponent],
})
export class SupportModule {}
