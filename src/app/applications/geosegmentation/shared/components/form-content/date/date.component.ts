import { Component, OnInit } from "@angular/core";
import { FormGroup, Validators } from "@angular/forms";
import {
  FieldConfig,
  Validator
} from "../../../../_models/field.interface";
@Component({
  selector: "app-date",
  template: `
    <mat-form-field class="demo-full-width margin-top" [formGroup]="group">
      <input
        matInput
        [matDatepicker]="picker"
        [formControlName]="field.name"
        [placeholder]="field.label"
        readonly="true"
      />
      <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
      <mat-datepicker
        type="datetime"
        touchUi
        clockStep="5"
        #picker
      ></mat-datepicker>
      <mat-hint></mat-hint>
      <ng-container
        *ngFor="let validation of field.validators"
        ngProjectAs="mat-error"
      >
        <mat-error *ngIf="group.get(field.name).hasError(validation.name)">{{
          validation.message
        }}</mat-error>
      </ng-container>
    </mat-form-field>
  `,
  styles: []
})
export class DateComponent implements OnInit {
  field: FieldConfig;
  group: FormGroup;
  constructor() {}
  ngOnInit() {
    if (this.field.validators !== undefined && this.field.validators !== null) {
      this.field.validators.forEach(element => {
        this.setValidation(element);
      });
    }
  }

  setValidation(validator: Validator) {
    switch (validator.validatortype) {
      case "pattern":
        this.group.get(this.field.name).validator = Validators.pattern(
          validator.validatorpattern
        );
        break;
      default:
        this.group.get(this.field.name).validator = Validators.required;
        break;
    }
  }
}
