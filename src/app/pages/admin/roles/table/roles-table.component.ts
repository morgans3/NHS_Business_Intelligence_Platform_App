import { Component, OnInit, ViewChild } from "@angular/core";
import { MFAAuthService } from "diu-component-library";
import { MatTable } from "@angular/material/table";
import { NotificationService } from "../../../../_services/notification.service";

@Component({
    selector: "app-roles-table",
    templateUrl: "./roles-table.component.html",
})
export class RolesTableComponent implements OnInit {

    roles = { all: [], filtered: [] };
    @ViewChild(MatTable) table: MatTable<any>;

    constructor(
        private authService: MFAAuthService,
        private notificationService: NotificationService
    ) { }

    ngOnInit() {
        this.authService.getRoles().subscribe((roles: any) => {
            this.roles = { all: roles, filtered: roles }
        });
    }

    search(name) {
        if (name == '') {
            this.roles.filtered = this.roles.all;
        } else {
            this.roles.filtered = this.roles.all.filter((item) => {
                return (item.name.toLowerCase() + item.description.toLowerCase()).includes(name.toLowerCase());
            })
        }
    }

    delete(item) {
        this.notificationService.question("Are you sure you want to delete this role?").then((confirmed) => {
            if (confirmed == true) {
                this.authService.deleteRole(item.id).subscribe((res) => {
                    //Notify success
                    this.notificationService.success("Role has been removed successfully!");

                    //Change item at index
                    this.roles.all.splice(this.roles.all.findIndex((listedItem) => listedItem.id == item.id), 1);

                    //Change item in filtered list
                    let filteredListIndex = this.roles.filtered.findIndex((listedItem) => listedItem.id == item.id);
                    if (filteredListIndex >= 0) {
                        this.roles.filtered.splice(filteredListIndex, 1);
                    }

                    //Trigger material table
                    this.table.renderRows();
                });
            }
        });
    }
}
