import { Component, OnInit, ViewChild, ChangeDetectorRef } from "@angular/core";
import { Store } from "@ngxs/store";
import { Router } from "@angular/router";
import { MatTableDataSource } from "@angular/material/table";
import { Incident } from "src/app/_models/SPI_Lookups";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { NotificationService } from "src/app/_services/notification.service";
import { decodeToken } from "src/app/_pipes/functions";
import { AuthState } from "src/app/_states/auth.state";
import { StorageService } from "src/app/_services/storage.service";

@Component({
    selector: "app-Incidents",
    templateUrl: "./Incidents.component.html",
})
export class IncidentsComponent implements OnInit {
    displayedColumns: string[] = ["incident_ref", "type", "method", "ics", "coroner_area", "date", "actions"];
    dataSource: MatTableDataSource<Incident>;
    dataFetched = false;
    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: false }) sort: MatSort;
    tokenDecoded: any;
    bookmarks = [];
    incidents: Incident[] = [];
    sensitiveData = false;

    constructor(
        private router: Router,
        public store: Store,
        private notificationService: NotificationService,
        private storageService: StorageService,
        private changeDetectorRef: ChangeDetectorRef
    ) {
        const token = this.store.selectSnapshot(AuthState.getToken);
        if (token) {
            this.tokenDecoded = decodeToken(token);
        }
    }

    ngOnInit() {
        this.getData();
    }

    getData() {
        this.dataFetched = false;
        this.storageService.getIncidents().subscribe((data: Incident[]) => {
            this.incidents = data;
            this.updateTable();
            this.changeDetectorRef.detectChanges();
            if (this.paginator) {
                this.dataSource.paginator = this.paginator;
            }
            if (this.sort) {
                this.dataSource.sort = this.sort;
            }
        });
    }

    updateTable() {
        this.dataSource = new MatTableDataSource(this.incidents);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.dataFetched = true;
    }

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim();
        filterValue = filterValue.toLowerCase();
        this.dataSource.filter = filterValue;
    }

    incidentSelected(row) {
        localStorage.setItem("@@selected-incident", JSON.stringify(row));
        this.router.navigate(["/incidentform"]);
    }

    removeRecord(row) {
        this.storageService.removeIncident(row).subscribe((data: any) => {
            if (data.success && data.success === false) {
                this.notificationService.error("Unable to remove Incident, reason: " + data.msg);
            } else {
                this.notificationService.success("Incident removed");
                this.incidents.splice(this.incidents.indexOf(row), 1);
                this.updateTable();
            }
        });
    }

    updatePID(event) {
        if (event) {
            this.tokenDecoded = event;
            if (this.tokenDecoded.mfa) {
                this.sensitiveData = true;
            } else {
                this.sensitiveData = false;
            }
            this.getData();
        } else {
            this.notificationService.warning("Authentication error: no new passport attached.");
        }
    }
}
