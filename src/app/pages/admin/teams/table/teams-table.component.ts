import { Component, OnInit, ViewChild } from "@angular/core";
import { APIService } from "diu-component-library";
import { MatTable } from "@angular/material/table";
import { NotificationService } from "../../../../_services/notification.service";

@Component({
  selector: "app-teams-table",
  templateUrl: "./teams-table.component.html",
})
export class TeamsTableComponent implements OnInit {
  teams = { all: [], filtered: [] };
  @ViewChild(MatTable) table: MatTable<any>;

  constructor(private notificationService: NotificationService, private apiService: APIService) {}

  ngOnInit() {
    this.apiService.getTeams().subscribe((teams: any) => {
      this.teams = { all: teams, filtered: teams };
    });
  }

  search(name) {
    if (name == "") {
      this.teams.filtered = this.teams.all;
    } else {
      this.teams.filtered = this.teams.all.filter((team) => {
        return team.name.toLowerCase().includes(name.toLowerCase());
      });
    }
  }

  delete(item) {
    this.notificationService.question("Are you sure you want to delete this team?").then((confirmed) => {
      if (confirmed == true) {
        this.apiService.deleteTeam(item).subscribe((res) => {
          //Notify success
          this.notificationService.success("Team has been removed successfully!");

          //Change item at index
          this.teams.all.splice(
            this.teams.all.findIndex((listedItem) => listedItem._id == item._id),
            1
          );

          //Change item in filtered list
          let filteredListIndex = this.teams.filtered.findIndex((listedItem) => listedItem._id == item._id);
          if (filteredListIndex >= 0) {
            this.teams.filtered.splice(filteredListIndex, 1);
          }

          //Trigger material table
          this.table.renderRows();
        });
      }
    });
  }
}
