import { Component, OnInit, ViewChild } from "@angular/core";
import { UserGroupService, DynamicApiService } from "diu-component-library";
import { NotificationService } from "../../../../_services/notification.service";
import { MatTable } from "@angular/material/table";

@Component({
  selector: "app-users-table",
  templateUrl: "./users-table.component.html",
})
export class UsersTableComponent implements OnInit {
  
  @ViewChild(MatTable) table: MatTable<any>;

  users = { all: [], nextPageKey: null };
  filters = { organisation: "", name: "", pageKey: null }
  
  organisations = [
    { name: "Admin", authmethod: "Demo" },
    { name: "Collaborative Partners", authmethod: "Demo" },
  ];

  constructor(
    private notificationService: NotificationService,
    private userGroupService: UserGroupService,
    private dynamicApiService: DynamicApiService,
  ) {}

  ngOnInit() {
    //Get organisations
    this.dynamicApiService.getOrganisations().subscribe((orgs: any) => {
      this.organisations = orgs;
    });

    //Get initial users
    this.getUsers();
  }

  getUsers(startItem = null) {
    //Set page key?
    if (startItem) { this.filters.pageKey = JSON.stringify(startItem); }

    //Get users
    this.userGroupService.getUsers(this.filters).subscribe((data: any) => {
      //Set log data
      this.users.all = this.users.all.concat(data.Items.length > 0 ? data.Items : []);

      //Has next page?
      if (data.LastEvaluatedKey) {
        this.users.nextPageKey = data.LastEvaluatedKey;
      } else {
        this.users.nextPageKey = null;
      }
    });
  }

  filterTimeout;
  filter() {
    clearTimeout(this.filterTimeout);
    this.filterTimeout = setTimeout(() => {
      //Reset page key and get data
      this.users = { all: [], nextPageKey: null };
      this.filters.pageKey = null;
      this.getUsers();
    }, 500);
  }

  delete(item) {
    this.notificationService.question("Are you sure you want to delete this user?").then((confirmed) => {
      if (confirmed == true) {
        this.userGroupService.deleteUser(item.username, item.organisation).subscribe((data) => {
          //Notify success
          this.notificationService.success("User has been removed successfully!");

          //Change item at index
          this.users.all.splice(this.users.all.findIndex((listedItem) => (
            listedItem.username == item.username && listedItem.organisation == item.organisation
          )), 1);

          //Trigger material table
          this.table.renderRows();
        });
      }
    });
  }
}
