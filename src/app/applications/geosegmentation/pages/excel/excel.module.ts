import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DemoMaterialModule } from "../../../../demo-material-module";
import { MainPipe } from "../../../../_pipes/main-pipe.module";

import { WorkbookComponent } from "./workbook/workbook.component";
import { ExportExcelComponent } from "./export/exportexcel.component";
import { WorksheetComponent } from "./worksheet/worksheet.component";

@NgModule({
    imports: [CommonModule, ReactiveFormsModule, FormsModule, DemoMaterialModule, FlexLayoutModule, MainPipe],
    declarations: [WorksheetComponent, WorkbookComponent, ExportExcelComponent],
    exports: [WorkbookComponent, ExportExcelComponent],
})
export class ExcelModule {}
