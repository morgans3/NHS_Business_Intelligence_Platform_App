import { Component, OnInit } from "@angular/core";
import { DTOComponents } from "../../../../_models/PageEntities";

@Component({
  selector: "app-stepper",
  template: `
    <mat-horizontal-stepper #stepper *ngIf="this.component">
      <mat-step *ngFor="let step of steps">
        <ng-template matStepLabel>{{ step.name }}}</ng-template>
        <ng-container dynamicComponent [component]="step"></ng-container>
      </mat-step>
    </mat-horizontal-stepper>
  `,
  styles: []
})
export class StepperComponent implements OnInit {
  component: DTOComponents;
  steps: DTOComponents[];

  constructor() {}

  ngOnInit() {
    this.steps = this.component.internalComponents;
  }
}
