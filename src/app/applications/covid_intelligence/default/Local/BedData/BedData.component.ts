import { Component, OnInit, Input, OnChanges } from "@angular/core";
import { BedData } from "diu-component-library";

@Component({
  selector: "app-BedData",
  templateUrl: "./BedData.component.html",
  styleUrls: ["./BedData.component.scss"]
})
export class BedDataComponent implements OnInit, OnChanges {
  @Input() source: BedData[] = [];
  @Input() columns: string[] = [];
  bedSource: BedData[] = [];
  bedColumns: string[] = [];

  constructor() {}

  ngOnInit() {
    this.bedSource = this.source;
    this.bedColumns = this.columns;
  }

  ngOnChanges() {
    this.bedSource = this.source;
    this.bedColumns = this.columns;
  }
}
