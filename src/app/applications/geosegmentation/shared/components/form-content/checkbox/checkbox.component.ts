import { Component, OnInit } from "@angular/core";
import { FormGroup, Validators } from "@angular/forms";
import {
  FieldConfig,
  Validator
} from "../../../../_models/field.interface";

@Component({
  selector: "app-checkbox",
  template: `
    <div
      class="demo-full-width margin-top"
      [formGroup]="group"
      style="margin-bottom:4px"
    >
      <mat-checkbox [formControlName]="field.name">{{
        field.label
      }}</mat-checkbox>
      <mat-hint
        *ngIf="
          field.validators.length > 0 && !this.group.get(this.field.name).value
        "
        style="color:tomato; padding-left:10px; font-size: 0.9em"
      >
        *Must acknowledge in order to proceed
      </mat-hint>
    </div>
  `,
  styles: []
})
export class CheckboxComponent implements OnInit {
  field: FieldConfig;
  group: FormGroup;
  constructor() {}
  ngOnInit() {
    if (this.field.validators !== null) {
      this.field.validators.forEach(element => {
        this.setValidation(element);
      });
    }
  }

  setValidation(validator: Validator) {
    switch (validator.validatortype) {
      default:
        this.group.get(this.field.name).validator = Validators.required;
        break;
    }
  }
}
