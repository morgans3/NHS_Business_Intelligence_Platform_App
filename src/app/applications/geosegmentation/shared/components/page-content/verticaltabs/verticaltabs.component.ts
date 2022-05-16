import { Component, OnInit } from "@angular/core";
import { DTOComponents } from "../../../../_models/PageEntities";

@Component({
  selector: "app-verticaltabs",
  template: `
    <div *ngIf="!component.internalComponents">No Tabs to Load...</div>
    <div id="content" *ngIf="component.internalComponents">
      <div id="main-content">
        <mat-tab-group id="leftTabGroup">
          <mat-tab [label]="comp.name" *ngFor="let comp of orderedList">
            <ng-container dynamicComponent [component]="comp"></ng-container>
          </mat-tab> </mat-tab-group
        >Test
      </div>
    </div>
  `,
  styleUrls: ["./verticaltabs.component.scss"]
})
export class VerticaltabsComponent implements OnInit {
  component: DTOComponents;
  orderedList: DTOComponents[];

  constructor() {}

  ngOnInit() {
    this.orderedList = this.component.internalComponents.sort(
      x => x.orderNumber
    );
  }
}
