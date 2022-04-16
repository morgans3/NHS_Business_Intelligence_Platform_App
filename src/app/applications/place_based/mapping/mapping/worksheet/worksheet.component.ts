import { Component, ViewChild, Input, OnInit, OnChanges, AfterViewInit } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";

@Component({
  selector: "app-worksheet",
  templateUrl: "worksheet.component.html",
  styleUrls: ["worksheet.component.css"],
})
export class WorksheetComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() sheet: any;
  @Input() filtertext?: string;
  @Input() filterrange?: { start?: Date; end?: Date };
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor() {}

  ngAfterViewInit() {
    this.setTable();
  }

  ngOnInit() {
    this.setTable();
  }

  ngOnChanges() {
    this.setTable();
    if (this.filtertext) {
      this.applyFilter(this.filtertext);
    }
    if (this.filterrange) {
      // TODO: filter any Date fields
    }
  }

  setTable() {
    if (this.sheet) {
      this.dataSource = new MatTableDataSource(this.sheet);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
