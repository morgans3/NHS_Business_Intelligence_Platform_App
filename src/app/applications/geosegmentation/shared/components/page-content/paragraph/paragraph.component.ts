import { Component } from "@angular/core";
import { DTOComponents } from "../../../../_models/PageEntities";

@Component({
  selector: "app-paragraph",
  template: `
    <p>{{ component.name }}</p>
  `,
  styles: []
})
export class ParagraphComponent {
  component: DTOComponents;

  constructor() {}
}
