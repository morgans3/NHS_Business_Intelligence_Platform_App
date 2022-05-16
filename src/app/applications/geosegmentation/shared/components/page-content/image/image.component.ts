import { Component } from "@angular/core";
import { Lightbox } from "ngx-lightbox";
import { DTOComponents } from "../../../../_models/PageEntities";
import { environment } from "../../../../../../../environments/environment";
@Component({
  selector: "app-image",
  template: `
    <img
      mat-card-image
      [src]="'../../../../../../../assets/images/dynamic/' + component.name"
      alt="Dynamic Image"
      (click)="open(component.name)"
      width="100%"
      style="margin:5px;"
    />
  `,
  styles: []
})
export class ImageComponent {
  
  component: DTOComponents;

  constructor(private _lightbox: Lightbox) { }

  open(imageRef: string): void {
    this._lightbox.open([
      {
        downloadUrl: `https://${environment.websiteURL}/assets/images/dynamic/${imageRef}`,
        src: "../../../../../../../assets/images/dynamic/" + imageRef,
        caption: "",
        thumb: "../../../../../../../assets/images/dynamic/" + imageRef
      }
    ], 0);
  }

  close(): void {
    this._lightbox.close();
  }
}
