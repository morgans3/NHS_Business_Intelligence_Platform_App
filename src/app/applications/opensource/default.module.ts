import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { CommonModule } from "@angular/common";
import { DefaultRoutes } from "./default.routing";
import { FlexLayoutModule } from "@angular/flex-layout";
import { DemoMaterialModule } from "../../demo-material-module";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { MainPipe } from "../../_pipes/main-pipe.module";
import { LandingComponent } from "./pages/landing/Landing.component";

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(DefaultRoutes),
    ReactiveFormsModule,
    FormsModule,
    DemoMaterialModule,
    FlexLayoutModule,
    MainPipe
  ],
  declarations: [LandingComponent]
})
export class DefaultModule {}
