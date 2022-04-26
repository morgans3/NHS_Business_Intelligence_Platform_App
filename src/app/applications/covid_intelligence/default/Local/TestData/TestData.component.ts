import { Component, OnInit, Input, OnChanges } from "@angular/core";
import { TestData } from "../../../_models/Regional";

@Component({
  selector: "app-TestData",
  templateUrl: "./TestData.component.html",
  styleUrls: ["./TestData.component.scss"]
})
export class TestDataComponent implements OnInit, OnChanges {
  @Input() source: TestData[] = [];
  @Input() columns: string[] = [];
  testSource: TestData[] = [];
  testColumns: string[] = [];

  constructor() {}

  ngOnInit() {
    this.testSource = this.source;
    this.testColumns = this.columns;
  }

  ngOnChanges() {
    this.testSource = this.source;
    this.testColumns = this.columns;
  }
}
