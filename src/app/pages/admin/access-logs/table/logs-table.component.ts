import { Component, OnInit, ViewChild } from "@angular/core";
import { APIService } from "diu-component-library";
import { MatTable } from "@angular/material/table";
import { MatDialog } from "@angular/material/dialog";
import * as moment from "moment";
import { ActivatedRoute } from "@angular/router";

@Component({
    selector: "access-logs-table",
    templateUrl: "./logs-table.component.html",
    styles: [
        `
            a {
                color: rgba(0, 0, 0, 0.87);
                font-weight: 500;
            }
        `,
    ],
})
export class AccessLogsTableComponent implements OnInit {
    @ViewChild(MatTable) table: MatTable<any>;

    logs = { all: [], isLastPage: false };
    filters = { query_by: "date", user: "", type: "", date: moment(), pageKey: null };

    constructor(private dialog: MatDialog, private apiService: APIService, private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        // Get initial data
        this.activatedRoute.queryParams.subscribe((params) => {
            // Assign query params
            this.filters = Object.assign(this.filters, params);

            // Get logs on first load
            this.getLogs();
        });
    }

    getLogs(startItem = null) {
        // Get data observable
        let dataObservable;
        if (this.filters.query_by === "date") {
            // Set page key?
            if (startItem) {
                this.filters.pageKey = JSON.stringify({ date: startItem.date, uuid: startItem.uuid });
            }

            // Get by date
            dataObservable = this.apiService.getAllAccessLogs({
                date: this.filters.date.format("YYYY-MM-DD"),
                pageKey: this.filters.pageKey,
            });
        } else if (this.filters.query_by === "user") {
            // Set page key?
            if (startItem) {
                this.filters.pageKey = JSON.stringify({
                    date: startItem.date,
                    uuid: startItem.uuid,
                    "username#org": startItem["username#org"],
                });
            }

            // Get by user
            dataObservable = this.apiService.getAllAccessLogsByUser({
                user: this.filters.user,
                pageKey: this.filters.pageKey,
            });
        } else {
            // Set page key?
            if (startItem) {
                this.filters.pageKey = JSON.stringify({ date: startItem.date, uuid: startItem.uuid, type: startItem.type });
            }

            // Get by type
            dataObservable = this.apiService.getAllAccessLogs({
                type: this.filters.type,
                pageKey: this.filters.pageKey,
            });
        }

        dataObservable.subscribe((data: any) => {
            // Set log data
            this.logs.all = this.logs.all.concat(data.length > 0 ? data : []);
            this.logs.isLastPage = data.length > 0 ? false : true;
        });
    }

    changeType(type, type_value = null) {
        this.filters.query_by = type;
        this.filters[this.filters.query_by] = type_value || this.filters[this.filters.query_by];
        if (this.filters[this.filters.query_by] === "") {
            return;
        }
        this.filter();
    }

    filterTimeout;
    filter() {
        clearTimeout(this.filterTimeout);
        this.filterTimeout = setTimeout(() => {
            // Reset page key and get data
            this.logs = { all: [], isLastPage: false };
            this.filters.pageKey = null;
            this.getLogs();
        }, 500);
    }

    view(log) {
        import("../access-log/access-log.modal").then((c) => {
            this.dialog.open(c.AccessLogModalComponent, {
                data: { log },
                width: "500px",
            });
        });
    }
}
