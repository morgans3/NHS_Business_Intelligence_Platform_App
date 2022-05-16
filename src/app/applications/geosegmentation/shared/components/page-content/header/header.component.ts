import { Component } from "@angular/core";
import { DTOComponents } from "../../../../_models/PageEntities";

@Component({
  selector: "app-header",
  template: `
    <h1 *ngIf="component.componentID === 1">{{ component.name }}</h1>
    <h2 *ngIf="component.componentID === 2">{{ component.name }}</h2>
    <h3 *ngIf="component.componentID === 3">{{ component.name }}</h3>
    <h4 *ngIf="component.componentID === 4">{{ component.name }}</h4>
    <h5 *ngIf="component.componentID === 5">{{ component.name }}</h5>
    <h6 *ngIf="component.componentID === 6">{{ component.name }}</h6>
  `,
  styles: []
})
export class HeaderComponent {
  component: DTOComponents;

  constructor() {}
}
