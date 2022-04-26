import { Component, OnInit, OnChanges, Input } from "@angular/core";
import { PatientLinked } from "../../../_models/patient";
import { ListTypes } from "../../patient-list/listtypes";

@Component({
  selector: "app-citizenlists",
  templateUrl: "./citizenlists.component.html",
  styleUrls: ["./citizenlists.component.scss"],
})
export class CitizenlistsComponent implements OnChanges {
  @Input() setperson: PatientLinked;
  person: PatientLinked;
  list_types = ListTypes;
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
