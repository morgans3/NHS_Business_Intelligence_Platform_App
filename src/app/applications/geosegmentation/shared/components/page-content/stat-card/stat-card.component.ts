import { Component, Input } from "@angular/core";
import { DTOComponents } from "../../../../_models/PageEntities";

export class StatCardData {
  title: string;
  value: string;
  color: string;
  icon: string;
}

@Component({
  selector: "app-statcard",
  template: `
    <mat-card *ngIf="data" [ngClass]="data.color">
      <mat-card-content>
        <div class="d-flex no-block align-items-center">
          <div class="mr-auto text-white icon-3x">
            <mat-icon [inline]="true">{{ data.icon }}</mat-icon>
          </div>
          <div class="stats" style="text-align: right">
            <h5 class="text-white m-0">{{ data.title }}</h5>
            <h3 class="text-white m-0">&nbsp;{{ data.value }}</h3>
          </div>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: []
})
export class StatCardComponent {
  component: DTOComponents;
  @Input() data: StatCardData;

  constructor() {}
}
