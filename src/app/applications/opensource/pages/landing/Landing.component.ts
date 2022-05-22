import { Component, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { APIService } from "diu-component-library";

export interface OpenSourceViews {
    ipaddress: string;
    datetime: string;
    parent: string;
    page: string;
}

@Component({
    selector: "app-Landing",
    templateUrl: "./Landing.component.html",
})
export class LandingComponent implements OnInit {
    searchResults = false;
    dataFetched: boolean;
    displayedColumns: string[] = ["page", "parent", "ipaddress", "datetime"];
    dataSource: MatTableDataSource<OpenSourceViews>;
    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: false }) sort: MatSort;

    constructor(private interfaceService: APIService) {}

    ngOnInit() {}

    changePage(pagename: string) {
        this.searchResults = true;
        this.dataSource = new MatTableDataSource();
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.interfaceService.getOpenSourceByPage(pagename, "100").subscribe((data: OpenSourceViews[]) => {
            this.dataSource = new MatTableDataSource();
            this.dataSource.data = data;
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
            this.dataFetched = true;
        });
    }

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim();
        filterValue = filterValue.toLowerCase();
        this.dataSource.filter = filterValue;
    }
}
