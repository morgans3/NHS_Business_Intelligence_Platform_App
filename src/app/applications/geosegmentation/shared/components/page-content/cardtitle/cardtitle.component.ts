import { Component } from "@angular/core";
import { DTOComponents } from "../../../../_models/PageEntities";

@Component({
  selector: "app-cardtitle",
  template: `
    <mat-card-title>{{ component.name }}</mat-card-title>
  `,
  styles: []
})
export class CardTitleComponent {
  component: DTOComponents;

  constructor() {}
}
