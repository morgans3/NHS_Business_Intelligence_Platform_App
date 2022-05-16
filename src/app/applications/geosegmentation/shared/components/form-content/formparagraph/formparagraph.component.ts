import { Component } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { FieldConfig } from "../../../../_models/field.interface";

@Component({
  selector: "app-formparagraph",
  template: `
    <p>{{ field.label }}</p>
  `,
  styles: []
})
export class FormParagraphComponent {
  field: FieldConfig;
  group: FormGroup;
  constructor() {}
}
