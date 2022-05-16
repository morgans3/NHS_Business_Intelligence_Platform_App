import { Component } from "@angular/core";
import { DTOComponents } from "../../../../_models/PageEntities";

@Component({
  selector: "app-divider",
  template: `
    <hr />
  `,
})
export class DividerComponent {
  component?: DTOComponents;

  constructor() {}
}
