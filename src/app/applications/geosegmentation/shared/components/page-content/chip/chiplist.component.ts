import { Component, OnInit } from "@angular/core";
import { DTOComponents } from "../../../../_models/PageEntities";
import { DTOListItem } from "../../../../_models/DTOListItem";
import { DataService } from "../../../../_services/data.service";

@Component({
  selector: "app-chiplist",
  template: `
    <div *ngIf="!chiplist">Loading...</div>
    <mat-chip-list *ngIf="chiplist">
      <mat-chip color="primary" selected *ngFor="let comp of chiplist">{{
        comp.option
      }}</mat-chip>
    </mat-chip-list>
  `,
  styles: []
})
export class ChipListComponent implements OnInit {
  component: DTOComponents;
  chiplist: DTOListItem[];

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService
      .getByID("List/getListByID", this.component.componentID)
      .subscribe((data: DTOListItem[]) => {
        this.chiplist = data;
      });
  }
}
