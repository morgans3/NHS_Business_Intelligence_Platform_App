import { Component, Input, OnInit } from "@angular/core";

export interface ExcelWorkBook {
    name: string;
    worksheets: ExcelWorkSheet[];
}

export interface ExcelWorkSheet {
    name: string;
    data: any[];
}

@Component({
    selector: "app-workbook",
    templateUrl: "workbook.component.html",
})
export class WorkbookComponent implements OnInit {
    @Input() workbook: ExcelWorkBook;

    constructor() {}

    ngOnInit() {}
}
