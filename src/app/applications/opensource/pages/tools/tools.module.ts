import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { HealthInequalitiesToolComponent } from "./health-inequalities-tool/health-inequalities-tool.component";
import { DemoMaterialModule } from "../../../../demo-material-module";
import { FlexLayoutModule } from "@angular/flex-layout";

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([{
      path: "",
      component: HealthInequalitiesToolComponent
    }]),
    DemoMaterialModule,
    FlexLayoutModule
  ],
  declarations: [HealthInequalitiesToolComponent]
})
export class ToolsModule {}
