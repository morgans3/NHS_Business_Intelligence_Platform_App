import { Component, OnInit, Input, OnChanges } from "@angular/core";
import { EquipmentData } from "diu-component-library";

@Component({
  selector: "app-EquipmentData",
  templateUrl: "./EquipmentData.component.html",
  styleUrls: ["./EquipmentData.component.scss"]
})
export class EquipmentDataComponent implements OnInit, OnChanges {
  @Input() source: EquipmentData[] = [];
  @Input() columns: string[] = [];
  equipmentSource: EquipmentData[] = [];
  equipmentColumns: string[] = [];

  constructor() {}

  ngOnInit() {
    this.equipmentSource = this.source;
    this.equipmentColumns = this.columns;
  }

  ngOnChanges() {
    this.equipmentSource = this.source;
    this.equipmentColumns = this.columns;
  }
}
