import { Component, OnInit } from "@angular/core";
import { DTOComponents } from "../../../../_models/PageEntities";
import { DTOListItem } from "../../../../_models/DTOListItem";
import { DataService } from "../../../../_services/data.service";

@Component({
  selector: "app-orderedlist",
  template: `
    <div *ngIf="!list">Loading...</div>
    <ol *ngIf="list">
      <li *ngFor="let comp of list">{{ comp.option }}</li>
    </ol>
  `,
  styles: []
})
export class OrderedlistComponent implements OnInit {
  component: DTOComponents;
  list: DTOListItem[];

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService
      .getByID("List/getListByID", this.component.id)
      .subscribe((data: DTOListItem[]) => {
        this.list = data;
      });
  }
}
