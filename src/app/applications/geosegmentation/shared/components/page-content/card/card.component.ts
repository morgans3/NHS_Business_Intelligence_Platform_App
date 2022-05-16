import { Component } from "@angular/core";
import { DTOComponents } from "../../../../_models/PageEntities";

@Component({
  selector: "app-card",
  template: `
    <mat-card>
      <mat-card-content>
        <div *ngIf="component.internalComponents">
          <ng-container
            *ngFor="let comp of component.internalComponents"
            dynamicComponent
            [component]="comp"
          ></ng-container>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: []
})
export class CardComponent {
  component: DTOComponents;

  constructor() {}
}
