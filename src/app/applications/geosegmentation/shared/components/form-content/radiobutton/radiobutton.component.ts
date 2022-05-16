import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormGroup, Validators } from "@angular/forms";
import { FieldConfig, Validator } from "../../../../_models/field.interface";

@Component({
  selector: "app-radiobutton",
  styles: [".mat-radio-label { padding-right: 10px !important; }"],
  template: `
    <div class="demo-full-width margin-top" [formGroup]="group">
      <label class="radio-label-padding">{{ field.label }} </label> &nbsp;
      <mat-radio-group [formControlName]="field.name">
        <mat-radio-button *ngFor="let item of options" [value]="item">{{
          item
        }}</mat-radio-button>
      </mat-radio-group>
      <mat-hint
        *ngIf="
          field.validators.length > 0 && !this.group.get(this.field.name).value
        "
        style="color:tomato; padding-left:10px; font-size: 0.9em"
      >
        *A selection is required
      </mat-hint>
    </div>
  `,
  encapsulation: ViewEncapsulation.None
})
export class RadiobuttonComponent implements OnInit {
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
