import { Component, OnInit, ViewChild } from "@angular/core";
import { APIService } from "diu-component-library";
import { MatDialog } from "@angular/material/dialog";
import { MatTable } from "@angular/material/table";
import { NotificationService } from "../../../../_services/notification.service";

@Component({
    selector: "app-dashboards-table",
    templateUrl: "./dashboards-table.component.html",
})
export class DashboardsTableComponent implements OnInit {
    dashboards = { all: [], filtered: [] };
    @ViewChild(MatTable) table: MatTable<any>;

    constructor(private dialog: MatDialog, private notificationService: NotificationService, private apiService: APIService) {}

    ngOnInit() {
        // TODO: where is this endpoint now?
        // this.apiService.getDashboards().subscribe((orgs: any) => {
        //   this.dashboards = { all: orgs, filtered: orgs };
        // });
    }

    search(name) {
        if (name === "") {
            this.dashboards.filtered = this.dashboards.all;
        } else {
            this.dashboards.filtered = this.dashboards.all.filter((dashboard) => {
                return dashboard.name.toLowerCase().includes(name.toLowerCase());
            });
        }
    }

    addEdit(dashboard = null) {
        import("../dashboard/dashboard.modal").then((c) => {
            const dialog = this.dialog.open(c.DashboardModalComponent, {
                data: { dashboard },
            });
            dialog.afterClosed().subscribe((data) => {
                if (data) {
                    if (dashboard !== null) {
                        // Change item at index
                        this.dashboards.all[this.dashboards.all.findIndex((listedDash) => listedDash.code === dashboard.code)] = data;

                        // Change item in filtered list
                        const filteredListIndex = this.dashboards.filtered.findIndex((listedDash) => listedDash.code === dashboard.code);
                        if (filteredListIndex >= 0) {
                            this.dashboards.filtered[filteredListIndex] = data;
                        }
                    } else {
                        // Add to list
                        this.dashboards = { all: [data].concat(this.dashboards.all), filtered: [data].concat(this.dashboards.filtered) };
                    }

                    // Trigger material table
                    this.table.renderRows();
                }
            });
        });
    }

    delete(dashboard) {
        console.log(dashboard);
        this.notificationService.question("Are you sure you want to delete this dashboard?").then((confirmed) => {
            if (confirmed === true) {
                // TODO: where is this endpoint now?
                // this.apiService.archiveDashboard(dashboard).subscribe((res) => {
                //     //Notify success
                //     this.notificationService.success("Dashboard has been removed successfully!");
                //     //Change item at index
                //     this.dashboards.all.splice(this.dashboards.all.findIndex((listedDash) => listedDash.name === dashboard.name), 1);
                //     //Change item in filtered list
                //     let filteredListIndex = this.dashboards.filtered.findIndex((listedDash) => listedDash.name === dashboard.name);
                //     if (filteredListIndex >= 0) {
                //         this.dashboards.filtered.splice(filteredListIndex, 1);
                //     }
                //     //Trigger material table
                //     this.table.renderRows();
                // });
            }
        });
    }
}
