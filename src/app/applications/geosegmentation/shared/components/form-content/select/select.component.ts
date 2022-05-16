import { Component, OnInit } from "@angular/core";
import { FormGroup, Validators } from "@angular/forms";
import {
  FieldConfig,
  Validator
} from "../../../../_models/field.interface";

@Component({
  selector: "app-select",
  template: `
    <mat-form-field class="demo-full-width margin-top" [formGroup]="group">
      <mat-select [placeholder]="field.label" [formControlName]="field.name">
        <mat-option *ngFor="let item of options" [value]="item">{{
          item
        }}</mat-option>
      </mat-select>
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
export class SelectComponent implements OnInit {
  field: FieldConfig;
  group: FormGroup;
  options: string[] = [];
  constructor() {}
  ngOnInit() {
    if (this.field.globalList) {
      this.field.globalList.questionList.forEach(element => {
        this.options.push(element.list.option);
      });
    } else if (this.field.options) {
      this.field.options.forEach(element => {
        this.options.push(element.option);
      });
    }

    if (this.field.validators && this.field.validators.length > 0) {
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
