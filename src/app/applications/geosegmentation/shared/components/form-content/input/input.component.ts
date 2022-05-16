import { Component, OnInit } from "@angular/core";
import { FormGroup, Validators } from "@angular/forms";
import { FieldConfig, Validator } from "../../../../_models/field.interface";

@Component({
  selector: "app-input",
  template: `
    <mat-form-field class="demo-full-width" [formGroup]="group">
      <input
        matInput
        [formControlName]="field.name"
        [placeholder]="field.label"
        [type]="field.inputType"
      />
      <ng-container
        *ngFor="let validation of field.validators"
        ngProjectAs="mat-error"
      >
        <mat-error *ngIf="group.get(field.name).hasError(validation.name)">{{
          validation.message
        }}</mat-error>
      </ng-container>
    </mat-form-field>
    <div *ngFor="let validation of field.validators">
      {{ validation.validator }}
    </div>
  `,
  styles: []
})
export class InputComponent implements OnInit {
  field: FieldConfig;
  group: FormGroup;
  
  constructor() {}

  ngOnInit() {
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
