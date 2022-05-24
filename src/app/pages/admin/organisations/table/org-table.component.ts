import { Component, OnInit, ViewChild } from "@angular/core";
import { APIService } from "diu-component-library";
import { MatDialog } from "@angular/material/dialog";
import { MatTable } from "@angular/material/table";
import { NotificationService } from "../../../../_services/notification.service";

@Component({
    selector: "app-org-table",
    templateUrl: "./org-table.component.html",
})
export class OrganisationsTableComponent implements OnInit {
    orgs = { all: [], filtered: [] };
    @ViewChild(MatTable) table: MatTable<any>;

    constructor(
        private dialog: MatDialog,
        private apiService: APIService,
        private notificationService: NotificationService
    ) {}

    ngOnInit() {
        this.apiService.getOrganisations().subscribe((orgs: any) => {
            this.orgs = { all: orgs, filtered: orgs };
        });
    }

    search(name) {
        if (name === "") {
            this.orgs.filtered = this.orgs.all;
        } else {
            this.orgs.filtered = this.orgs.all.filter((org) => {
                return org.name.toLowerCase().includes(name.toLowerCase());
            });
        }
    }

    addEdit(org = null) {
        import("../organisation/organisation.modal").then((c) => {
            const dialog = this.dialog.open(c.OrgModalComponent, {
                data: { org },
            });
            dialog.afterClosed().subscribe((data) => {
                if (data) {
                    if (org !== null) {
                        // Change item at index
                        this.orgs.all[this.orgs.all.findIndex((listedOrg) => listedOrg.code === org.code)] = data;

                        // Change item in filtered list
                        const filteredListIndex = this.orgs.filtered.findIndex((listedOrg) => listedOrg.code === org.code);
                        if (filteredListIndex >= 0) {
                            this.orgs.filtered[filteredListIndex] = data;
                        }
                    } else {
                        // Add to list
                        this.orgs = { all: [data].concat(this.orgs.all), filtered: [data].concat(this.orgs.filtered) };
                    }

                    // Trigger material table
                    this.table.renderRows();
                }
            });
        });
    }

    delete(organisation) {
        this.notificationService.question("Are you sure you want to delete this organisation?").then((confirmed) => {
            if (confirmed === true) {
                this.apiService.removeOrganisation(organisation).subscribe((res) => {
                    // Notify success
                    this.notificationService.success("Organisation has been removed successfully!");

                    // Change item at index
                    this.orgs.all.splice(this.orgs.all.findIndex((item) => item.name === organisation.name), 1);

                    // Change item in filtered list
                    const filteredListIndex = this.orgs.filtered.findIndex((item) => item.name === organisation.name);
                    if (filteredListIndex >= 0) {
                        this.orgs.filtered.splice(filteredListIndex, 1);
                    }

                    // Trigger material table
                    this.table.renderRows();
                });
            }
        });
    }
}
