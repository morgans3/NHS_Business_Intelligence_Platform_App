import { Component, OnInit, ViewChild } from "@angular/core";
import { APIService } from "diu-component-library";
import { MatTable } from "@angular/material/table";
import { NotificationService } from "../../../../_services/notification.service";

@Component({
    selector: "app-roles-table",
    templateUrl: "./roles-table.component.html",
})
export class RolesTableComponent implements OnInit {
    roles = { all: [], filtered: [] };
    @ViewChild(MatTable) table: MatTable<any>;

    constructor(private apiService: APIService, private notificationService: NotificationService) {}

    ngOnInit() {
        this.apiService.getRoles().subscribe((roles: any) => {
            this.roles = { all: roles, filtered: roles };
        });
    }

    search(name) {
        if (name === "") {
            this.roles.filtered = this.roles.all;
        } else {
            this.roles.filtered = this.roles.all.filter((item) => {
                const itemName = item.name.toLowerCase() as string;
                const description = item.description.toLowerCase() as string;
                const fullItem = itemName + description;
                return fullItem.includes(name.toLowerCase());
            });
        }
    }

    delete(item) {
        this.notificationService.question("Are you sure you want to delete this role?").then((confirmed) => {
            if (confirmed === true) {
                this.apiService.deleteRole(item.id).subscribe(() => {
                    // TODO: check response: has this been successful?
                    // Notify success
                    this.notificationService.success("Role has been removed successfully!");

                    // Change item at index
                    this.roles.all.splice(
                        this.roles.all.findIndex((listedItem) => listedItem.id === item.id),
                        1
                    );

                    // Change item in filtered list
                    const filteredListIndex = this.roles.filtered.findIndex((listedItem) => listedItem.id === item.id);
                    if (filteredListIndex >= 0) {
                        this.roles.filtered.splice(filteredListIndex, 1);
                    }

                    // Trigger material table
                    this.table.renderRows();
                });
            }
        });
    }
}
