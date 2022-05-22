import { Component, ViewChild, Input, OnInit } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";

@Component({
    selector: "app-worksheet",
    templateUrl: "worksheet.component.html",
    styleUrls: ["worksheet.component.css"],
})
export class WorksheetComponent implements OnInit {
    @Input() sheet: any;
    dataSource: MatTableDataSource<any>;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor() {}

    ngOnInit() {
        this.dataSource = new MatTableDataSource(this.sheet);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }
}
