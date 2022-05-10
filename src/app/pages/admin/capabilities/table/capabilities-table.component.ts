import { Component, OnInit, ViewChild } from "@angular/core";
import { APIService } from "diu-component-library";
import { MatTable } from "@angular/material/table";
import { NotificationService } from "../../../../_services/notification.service";

@Component({
  selector: "app-capabilities-table",
  templateUrl: "./capabilities-table.component.html",
})
export class CapabilitiesTableComponent implements OnInit {
  @ViewChild(MatTable) table: MatTable<any>;

  capabilities = { all: [], filtered: [] };
  filters = { name: "", tags: [] };

  constructor(private apiService: APIService, private notificationService: NotificationService) {}

  ngOnInit() {
    this.apiService.getCapabilities().subscribe((capabilities: any) => {
      this.capabilities = { all: capabilities, filtered: capabilities };
    });
  }

  search() {
    if (this.filters.tags.length == 0) {
      //Search by name only
      this.capabilities.filtered = this.capabilities.all.filter((item) => {
        return (item.name.toLowerCase() + item.description.toLowerCase()).includes(this.filters.name.toLowerCase());
      });
    } else {
      //Search by name and tag
      this.apiService.getAllCapabilitiesByTag(this.filters.tags.join(',')).subscribe((capabilities: any) => {
        this.capabilities.filtered = (capabilities instanceof Array ? capabilities : []).filter((item) => {
          return (item.name.toLowerCase() + item.description.toLowerCase()).includes(this.filters.name.toLowerCase());
        });
      });
    }
  }

  delete(item) {
    this.notificationService.question("Are you sure you want to delete this capability?").then((confirmed) => {
      if (confirmed == true) {
        this.apiService.deleteCapability(item.id).subscribe((res) => {
          //Notify success
          this.notificationService.success("Capability has been removed successfully!");

          //Change item at index
          this.capabilities.all.splice(
            this.capabilities.all.findIndex((listedItem) => listedItem.id == item.id),
            1
          );

          //Change item in filtered list
          let filteredListIndex = this.capabilities.filtered.findIndex((listedItem) => listedItem.id == item.id);
          if (filteredListIndex >= 0) {
            this.capabilities.filtered.splice(filteredListIndex, 1);
          }

          //Trigger material table
          this.table.renderRows();
        });
      }
    });
  }
}
