import { Component, OnInit, Input } from "@angular/core";

export interface MosaicTable {
    title: string;
    data: any[];
}

@Component({
    selector: "app-MosaicTable",
    templateUrl: "./MosaicTable.component.html",
})
export class MosaicTableComponent implements OnInit {
    displayedColumns: string[];
    @Input() dataSource: any[];

    constructor() {}

    ngOnInit() {
        this.displayedColumns = Object.keys(this.dataSource[0]);
    }
}
