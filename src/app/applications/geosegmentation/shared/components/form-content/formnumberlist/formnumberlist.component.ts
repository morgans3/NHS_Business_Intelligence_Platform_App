import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { FieldConfig } from "../../../../_models/field.interface";

@Component({
  selector: "app-formnumberlist",
  template: `
    <div *ngIf="field.options.length === 0 && field.globalList === null">
      No options added
    </div>
    <ol *ngIf="field.options && !field.globalList">
      <li *ngFor="let item of field.options">{{ item.option }}</li>
    </ol>
    <ol *ngIf="field.globalList">
      <li *ngFor="let item of field.globalList.questionList">
        {{ item.list.option }}
      </li>
    </ol>
  `,
  styles: []
})
export class FormNumberListComponent implements OnInit {
  field: FieldConfig;
  group: FormGroup;
  constructor() {}
  ngOnInit() {}
}
