import { Component, OnInit, Input, OnChanges } from "@angular/core";
import { MortalityData } from "../../../_models/Regional";

@Component({
  selector: "app-MortalityData",
  templateUrl: "./MortalityData.component.html",
  styleUrls: ["./MortalityData.component.scss"]
})
export class MortalityDataComponent implements OnInit, OnChanges {
  @Input() source: MortalityData[] = [];
  @Input() columns: string[] = [];
  mortalitySource: MortalityData[] = [];
  mortalityColumns: string[] = [];

  constructor() {}

  ngOnInit() {
    this.mortalitySource = this.source;
    this.mortalityColumns = this.columns;
  }

  ngOnChanges() {
    this.mortalitySource = this.source;
    this.mortalityColumns = this.columns;
  }
}
