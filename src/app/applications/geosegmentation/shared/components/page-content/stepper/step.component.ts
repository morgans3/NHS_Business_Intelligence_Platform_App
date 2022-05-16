import { Component, OnInit } from "@angular/core";
import { DTOComponents } from "../../../../_models/PageEntities";
import { DataService } from "../../../../_services/data.service";

@Component({
  selector: "app-stepper",
  template: `
    <ng-container
      dynamicComponent
      *ngFor="let comp of component.internalComponents"
      [component]="comp"
    ></ng-container>
  `,
  styles: []
})
export class StepComponent implements OnInit {
  component: DTOComponents;

  constructor(private dataService: DataService) {
    this.dataService
      .getByID("Page/Component/", this.component.id)
      .subscribe((data: DTOComponents) => {
        console.log(data);
        this.component = data;
      });
  }

  ngOnInit() {}
}
