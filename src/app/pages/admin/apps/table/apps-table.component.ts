import { Component, OnInit, ViewChild } from "@angular/core";
import { DynamicApiService } from "diu-component-library";
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from "@angular/material/table";
import { NotificationService } from "../../../../_services/notification.service";

@Component({
    selector: "app-apps-table",
    templateUrl: "./apps-table.component.html",
})
export class AppsTableComponent implements OnInit {

    apps = { all: [], filtered: [] };
    @ViewChild(MatTable) table: MatTable<any>;

    constructor(
        private dialog: MatDialog,
        private dynApiService: DynamicApiService,
        private notificationService: NotificationService
    ) { }

    ngOnInit() {
        this.dynApiService.getApps().subscribe((apps: any) => {
            this.apps = { all: apps, filtered: apps }
        });
    }

    search(name) {
        if (name == '') {
            this.apps.filtered = this.apps.all;
        } else {
            this.apps.filtered = this.apps.all.filter((app) => {
                return (app.name.toLowerCase() + app.description.toLowerCase()).includes(name.toLowerCase());
            })
        }
    }

    addEdit(app = null) {
        import("../app/app.modal").then((c) => {
            let dialog = this.dialog.open(c.AppModalComponent, {
                data: { app: app },
            });
            dialog.afterClosed().subscribe((data) => {
                if(data) {
                    if(app !== null) {
                        //Change item at index
                        this.apps.all[this.apps.all.findIndex((listedApp) => listedApp.name == app.name)] = data;

                        //Change item in filtered list
                        let filteredListIndex = this.apps.filtered.findIndex((listedApp) => listedApp.name == app.name);
                        if(filteredListIndex >= 0) {
                            this.apps.filtered[filteredListIndex] = data;
                        }
                    } else {
                        //Add to list
                        this.apps = { all: [data].concat(this.apps.all), filtered: [data].concat(this.apps.filtered) }
                    }
                    
                    //Trigger material table
                    this.table.renderRows();
                }
            });
        })
    }

    delete(app) {
        this.notificationService.question("Are you sure you want to delete this app?").then((confirmed) => {
            if(confirmed == true) {
                this.dynApiService.archiveApp(app).subscribe((res) => {
                    //Notify success
                    this.notificationService.success("App has been removed successfully!");

                    //Change item at index
                    this.apps.all.splice(this.apps.all.findIndex((listedApp) => listedApp.name == app.name), 1);

                    //Change item in filtered list
                    let filteredListIndex = this.apps.filtered.findIndex((listedApp) => listedApp.name == app.name);
                    if (filteredListIndex >= 0) {
                        this.apps.filtered.splice(filteredListIndex, 1);
                    }

                    //Trigger material table
                    this.table.renderRows();
                });    
            }
        });
    }
}