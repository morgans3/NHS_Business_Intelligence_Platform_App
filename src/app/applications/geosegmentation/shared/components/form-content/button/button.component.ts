import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { FieldConfig } from "../../../../_models/field.interface";

@Component({
  selector: "app-button",
  template: `
    <div
      class="demo-full-width margin-top"
      [formGroup]="group"
      style="margin-top: 10px;"
    >
      <button
        type="submit"
        mat-raised-button
        color="primary"
        style="width: 100%"
      >
        {{ field.label }}
      </button>
      <br /><br />
      <button type="reset" mat-raised-button color="warn" style="width: 100%">
        Clear
      </button>
    </div>
  `,
  styles: []
})
export class ButtonComponent implements OnInit {
  field: FieldConfig;
  group: FormGroup;
  constructor() {}
  ngOnInit() {}
}
