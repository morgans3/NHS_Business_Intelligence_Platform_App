import { Component, OnInit } from "@angular/core";
import { DTOComponents } from "../../../../_models/PageEntities";

@Component({
  selector: "app-link",
  template: `
    <a [href]="link" target="_blank">{{ text }}</a>
  `,
  styles: []
})
export class LinkComponent implements OnInit {
  component: DTOComponents;
  link: string;
  text: string;

  constructor() {}

  ngOnInit() {
    if (this.component.name) {
      this.link = this.component.name.split("@")[1];
      this.text = this.component.name.split("@")[0];
    }
  }
}
