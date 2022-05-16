import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { FieldConfig } from "../../../../_models/field.interface";

@Component({
  selector: "app-formlink",
  template: `
    <a [href]="field.label" target="_blank">{{ DisplayName }}</a>
  `,
  styles: []
})
export class FormLinkComponent implements OnInit {
  DisplayName: string;
  field: FieldConfig;
  group: FormGroup;
  constructor() {}

  ngOnInit() {
    this.DisplayName = this.decamelize(this.field.name, " ");
  }

  decamelize(str, separator) {
    separator = typeof separator === "undefined" ? "_" : separator;

    return this.capital_letter(
      str
        .replace(/([a-z\d])([A-Z])/g, "$1" + separator + "$2")
        .replace(/([A-Z]+)([A-Z][a-z\d]+)/g, "$1" + separator + "$2")
        .toLowerCase()
    );
  }

  capital_letter(str) {
    str = str.split(" ");

    for (let i = 0, x = str.length; i < x; i++) {
      str[i] = str[i][0].toUpperCase() + str[i].substr(1);
    }

    return str.join(" ");
  }
}
