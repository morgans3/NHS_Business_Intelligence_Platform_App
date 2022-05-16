import { Component } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { FieldConfig } from "../../../../_models/field.interface";

@Component({
  selector: "app-formheader",
  template: `
    <h1
      *ngIf="field.inputType === '1'"
      [ngStyle]="
        field.savedDataType === 'boolean' && { 'text-decoration': 'underline' }
      "
    >
      {{ field.label }}
    </h1>
    <h2
      *ngIf="field.inputType === '2'"
      [ngStyle]="
        field.savedDataType === 'boolean' && { 'text-decoration': 'underline' }
      "
    >
      {{ field.label }}
    </h2>
    <h3
      *ngIf="field.inputType === '3'"
      [ngStyle]="
        field.savedDataType === 'boolean' && { 'text-decoration': 'underline' }
      "
    >
      {{ field.label }}
    </h3>
    <h4
      *ngIf="field.inputType === '4'"
      [ngStyle]="
        field.savedDataType === 'boolean' && { 'text-decoration': 'underline' }
      "
    >
      {{ field.label }}
    </h4>
    <h5
      *ngIf="field.inputType === '5'"
      [ngStyle]="
        field.savedDataType === 'boolean' && { 'text-decoration': 'underline' }
      "
    >
      {{ field.label }}
    </h5>
    <h6
      *ngIf="field.inputType === '6'"
      [ngStyle]="
        field.savedDataType === 'boolean' && { 'text-decoration': 'underline' }
      "
    >
      {{ field.label }}
    </h6>
  `,
  styles: []
})
export class FormHeaderComponent {
  field: FieldConfig;
  group: FormGroup;
  constructor() {}
}
