import { Component, OnInit } from "@angular/core";
import { DTOComponents } from "../../../../_models/PageEntities";
import { DTOListItem } from "../../../../_models/DTOListItem";
import { DataService } from "../../../../_services/data.service";

@Component({
  selector: "app-matselectionlist",
  template: `
    <div *ngIf="!list">Loading...</div>
    <mat-selection-list *ngIf="list">
      <mat-list-option *ngFor="let comp of list">{{
        comp.option
      }}</mat-list-option>
    </mat-selection-list>
  `,
})
export class MatselectionlistComponent implements OnInit {
  component: DTOComponents;
  list: DTOListItem[];

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService
      .getByID("List/getListByID", this.component.componentID)
      .subscribe((data: DTOListItem[]) => {
        this.list = data;
      });
  }
}
