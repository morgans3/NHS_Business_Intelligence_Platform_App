import { Component, OnInit } from "@angular/core";
import { DTOComponents } from "../../../../_models/PageEntities";
import { DTOListItem } from "../../../../_models/DTOListItem";
import { DataService } from "../../../../_services/data.service";

@Component({
  selector: "app-matlist",
  template: `
    <div *ngIf="!list">Loading...</div>
    <mat-list role="list" *ngIf="list">
      <mat-list-item role="listitem" *ngFor="let comp of list">{{
        comp.option
      }}</mat-list-item>
    </mat-list>
  `,
})
export class MatlistComponent implements OnInit {
  
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
