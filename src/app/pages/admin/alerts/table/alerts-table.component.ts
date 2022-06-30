import { Component, OnInit, ViewChild } from "@angular/core";
import { APIService } from "diu-component-library";
import { MatDialog } from "@angular/material/dialog";
import { MatTable } from "@angular/material/table";
import { NotificationService } from "../../../../_services/notification.service";

@Component({
    selector: "app-alerts-table",
    templateUrl: "./alerts-table.component.html",
})
export class AlertsTableComponent implements OnInit {
    alerts = { all: [], filtered: [] };
    @ViewChild(MatTable) table: MatTable<any>;

    constructor(private dialog: MatDialog, private notificationService: NotificationService, private apiService: APIService) {}

    ngOnInit() {
        this.apiService.getSystemAlerts().subscribe((orgs: any) => {
            this.alerts = { all: orgs, filtered: orgs };
        });
    }

    search(name) {
        if (name === "") {
            this.alerts.filtered = this.alerts.all;
        } else {
            this.alerts.filtered = this.alerts.all.filter((alert) => {
                return alert.name.toLowerCase().includes(name.toLowerCase());
            });
        }
    }

    addEdit(alert = null) {
        import("../alerts/alert.modal").then((c) => {
            const dialog = this.dialog.open(c.AlertModalComponent, {
                data: { alert },
            });
            dialog.afterClosed().subscribe((data) => {
                if (data) {
                    if (alert !== null) {
                        // Change item at index
                        this.alerts.all[this.alerts.all.findIndex((listedDash) => listedDash.name === alert.name)] = data;

                        // Change item in filtered list
                        const filteredListIndex = this.alerts.filtered.findIndex((listedDash) => listedDash.name === alert.name);
                        if (filteredListIndex >= 0) {
                            this.alerts.filtered[filteredListIndex] = data;
                        }
                    } else {
                        // Add to list
                        this.alerts = { all: [data].concat(this.alerts.all), filtered: [data].concat(this.alerts.filtered) };
                    }

                    // Trigger material table
                    this.table.renderRows();
                }
            });
        });
    }

    delete(alert) {
        this.notificationService.question("Are you sure you want to delete this alert?").then((confirmed) => {
            if (confirmed === true) {
                this.apiService.removeSystemAlert(alert).subscribe(() => {
                    // Notify success
                    this.notificationService.success("Alert has been removed successfully!");
                    // Change item at index
                    this.alerts.all.splice(
                        this.alerts.all.findIndex((listedDash) => listedDash.name === alert.name),
                        1
                    );
                    // Change item in filtered list
                    const filteredListIndex = this.alerts.filtered.findIndex((listedDash) => listedDash.name === alert.name);
                    if (filteredListIndex >= 0) {
                        this.alerts.filtered.splice(filteredListIndex, 1);
                    }
                    // Trigger material table
                    this.table.renderRows();
                });
            }
        });
    }
}
