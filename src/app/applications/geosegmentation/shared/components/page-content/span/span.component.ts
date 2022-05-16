import { Component } from "@angular/core";
import { DTOComponents } from "../../../../_models/PageEntities";

@Component({
  selector: "app-span",
  template: `
    <span>{{ component.name }}</span>
  `,
  styles: []
})
export class SpanComponent {
  component: DTOComponents;

  constructor() {}
}
