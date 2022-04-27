import { Component, OnInit, Input, OnChanges } from "@angular/core";
import { ConditionTypes } from "../../../caseloads/vwdecisions/conditiontypes";
import { PatientLinked } from "diu-component-library";

@Component({
  selector: "app-conditions",
  templateUrl: "./conditions.component.html",
  styleUrls: ["./conditions.component.scss"],
})
export class ConditionsComponent implements OnChanges {
  @Input() setperson: PatientLinked;
  person: PatientLinked;
  list_types = ConditionTypes;
  filtered_list_types = [];

  constructor() {}

  ngOnChanges() {
    if (this.setperson) {
      if (this.person !== this.setperson) {
        this.person = this.setperson;
        this.setFilteredList();
      }
    }
  }

  setFilteredList() {
    this.filtered_list_types = [];
    this.list_types.forEach((elem) => {
      if (this.person[elem.value] === elem.default) this.filtered_list_types.push(elem);
    });
  }
}
