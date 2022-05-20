import { Component, Input, OnInit } from "@angular/core";
import { ExcelWorkBook } from "../workbook/workbook.component";
import { formatDate } from "@angular/common";
import * as XLSX from "xlsx";

@Component({
    selector: "app-exportexcel",
    template: "<button type='button' mat-raised-button color='primary' (click)='generateXLS()'>Export to Excel</button>",
})
export class ExportExcelComponent implements OnInit {
    @Input() workbook: ExcelWorkBook;

    constructor() {}

    ngOnInit() {}

    generateXLS() {
        if (this.workbook) {
            const newDate = new Date();
            const wb: XLSX.WorkBook = { SheetNames: [], Sheets: {} };
            this.workbook.worksheets.forEach((sheet) => {
                XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(sheet.data), sheet.name);
            });
            XLSX.writeFile(wb, "Results_" + formatDate(newDate, "dd-MM-yyyy_HH_mm", "en-GB") + ".xlsx");
        }
    }
}
