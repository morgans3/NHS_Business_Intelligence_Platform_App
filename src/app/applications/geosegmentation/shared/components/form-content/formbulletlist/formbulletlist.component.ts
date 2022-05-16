import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { FieldConfig } from "../../../../_models/field.interface";

@Component({
  selector: "app-formbulletlist",
  template: `
    <div *ngIf="field.options.length === 0 && field.globalList === null">
      No options added
    </div>
    <ul *ngIf="field.options && !field.globalList">
      <li *ngFor="let item of field.options">{{ item.option }}</li>
    </ul>
    <ul *ngIf="field.globalList">
      <li *ngFor="let item of field.globalList.questionList">
        {{ item.list.option }}
      </li>
    </ul>
  `,
  styles: []
})
export class FormBulletListComponent implements OnInit {
  field: FieldConfig;
  group: FormGroup;
  constructor() {}
  ngOnInit() {}
}
