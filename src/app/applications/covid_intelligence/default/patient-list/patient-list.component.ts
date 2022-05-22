import { Angular2Csv } from "angular2-csv/Angular2-csv";
import { Component, OnInit, ViewChild } from "@angular/core";
import { Store } from "@ngxs/store";
import { Router } from "@angular/router";
import { NotificationService } from "../../../../_services/notification.service";
import { AuthState } from "../../../../_states/auth.state";
import { PatientLinked, Cohort, Caseload, CVICohort, APIService } from "diu-component-library";
import { ListTypes } from "./listtypes";
import { FormGroup, FormControl } from "@angular/forms";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { decodeToken } from "../../../../_pipes/functions";

@Component({
    selector: "app-patient-list",
    templateUrl: "./patient-list.component.html",
    styleUrls: ["./patient-list.component.scss"],
})
export class PatientListComponent implements OnInit {
    noAccess = false;
    noResults = false;
    refreshDT = new Date();
    displayedColumns: string[] = ["fullname", "nhsnumber", "age", "sex", "flags", "actions"];
    dataSource: MatTableDataSource<any>;
    dataFetched = false;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    tokenDecoded: any;
    bookmarks = [];
    sensitiveData = false;
    list_types = ListTypes;
    selectedlisttypes = [];
    citizenlist: PatientLinked[];
    filterBookmark = false;
    limit = "1000";
    allcohorts: Cohort[] = [];
    mycaseloads: Caseload[] = [];
    selectedcaseload: Caseload;
    allpatientgroups: any[] = [];
    group: FormGroup = new FormGroup({
        cohort: new FormControl(null),
        patientgroup: new FormControl(null),
    });
    cohorturl: string;

    constructor(
        private apiService: APIService,
        private router: Router,
        public store: Store,
        private notificationService: NotificationService
    ) {
        const token = this.store.selectSnapshot(AuthState.getToken);
        if (token) {
            this.tokenDecoded = decodeToken(token);
            this.apiService.getCVICohortsByUsername(this.tokenDecoded.username).subscribe((res: Cohort[]) => {
                res.forEach((item) => {
                    if (item.cohorturl.length < 3) {
                        item.cohorturl = "{}";
                    }
                    if (typeof item.cohorturl === "object") {
                        if (this.isEmpty(item.cohortName)) {
                            item.cohorturl = "{}";
                        } else {
                            item.cohorturl = JSON.stringify(item.cohorturl);
                        }
                    }
                });
                this.allcohorts = res.sort();
            });
        }
    }

    isEmpty(obj) {
        return Object.keys(obj).length === 0;
    }

    ngOnInit() {
        this.cohorturl = localStorage.getItem("@@selected-cohort");
        localStorage.removeItem("@@selected-cohort");
        this.getData();
    }

    changeLimit(newValue) {
        this.limit = newValue.toString();
        this.getData();
    }

    getData() {
        this.noAccess = false;
        this.noResults = false;
        this.dataFetched = false;
        if (this.cohorturl) {
            this.getDataWithCohort(this.cohorturl);
        } else {
            if (!this.limit) {
                this.limit = "1000";
            }
            this.apiService.getPatients(this.limit).subscribe(
                (list: PatientLinked[]) => {
                    this.citizenlist = list;
                    this.setData(this.citizenlist);
                    this.refreshDT = this.getLastDate(this.citizenlist);
                },
                (err) => {
                    this.dataFetched = true;
                    this.noResults = true;
                    if (err === "OK") {
                        this.notificationService.info("There are no citizens that match your security role.");
                    } else {
                        this.notificationService.warning(err);
                    }
                }
            );
        }
    }

    getDataWithCohort(cohorturl: string) {
        this.noAccess = false;
        this.noResults = false;
        this.dataFetched = false;
        this.apiService.getPatientsByCohort(this.limit, cohorturl).subscribe(
            (list: PatientLinked[]) => {
                this.citizenlist = list;
                this.setData(this.citizenlist);
                this.refreshDT = this.getLastDate(this.citizenlist);
            },
            (err) => {
                this.dataFetched = true;
                this.noResults = true;
                if (err === "OK") {
                    this.notificationService.info("There are no citizens that match your security role.");
                } else {
                    this.notificationService.warning(err);
                }
            }
        );
    }

    changeCohort(event: CVICohort) {
        if (event) {
            this.getDataWithCohort(event.cohorturl);
        }
    }

    getLastDate(dataset: PatientLinked[]) {
        const sorted = dataset.sort((a, b) => {
            const bdate = b.etl_run_date || b.d_etl_run_date;
            const adate = a.etl_run_date || a.d_etl_run_date;
            return new Date(bdate).getTime() - new Date(adate).getTime();
        });
        const answer = sorted[0].etl_run_date || sorted[0].d_etl_run_date;
        return answer;
    }

    setData(dataset) {
        this.dataSource = new MatTableDataSource(dataset);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.dataFetched = true;
    }

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim();
        filterValue = filterValue.toLowerCase();
        this.dataSource.filter = filterValue;
    }

    personSelected(row) {
        const nhsnumber = row.nhs_number;
        this.router.navigate(["/person", nhsnumber]);
    }

    personBookmarked(row) {
        if (this.bookmarks.indexOf(row.nhs_number) > -1) {
            this.bookmarks.splice(this.bookmarks.indexOf(row.nhs_number), 1);
        } else {
            this.bookmarks.push(row.nhs_number);
        }
        if (this.filterBookmark) {
            this.filterBookmarked();
        }
    }

    filterBookmarked() {
        if (this.filterBookmark) {
            if (this.bookmarks.length > 0) {
                this.setData(this.citizenlist.filter((x) => this.bookmarks.indexOf(x.nhs_number) > -1));
            } else {
                this.notificationService.warning("No Bookmarks selected, unable to filter");
                this.filterBookmark = false;
            }
        } else {
            this.setData(this.citizenlist);
        }
    }

    updatePID(event) {
        if (event) {
            this.tokenDecoded = event;
            if (this.tokenDecoded.mfa) {
                this.sensitiveData = true;
            } else {
                this.sensitiveData = false;
            }
        } else {
            this.notificationService.warning("Authentication error: no new passport attached.");
        }
    }

    filterList(event) {
        if (this.selectedlisttypes.indexOf(event) > -1) {
            this.selectedlisttypes.splice(this.selectedlisttypes.indexOf(event), 1);
        } else {
            this.selectedlisttypes.push(event);
        }
        if (this.selectedlisttypes.length === 0) {
            this.setData(this.citizenlist);
        } else {
            this.setData(
                this.citizenlist.filter((x) => {
                    let flag = false;
                    this.selectedlisttypes.forEach((filter) => {
                        const type = this.list_types.find((b) => b.value === filter);
                        if (x[filter] === type.default) {
                            flag = true;
                        }
                    });
                    return flag;
                })
            );
        }
    }

    saveNewCaseload() {
        console.log("saveNewCaseload");
        this.notificationService.info("Feature not enabled. Still in development.");
    }

    saveUpdatedCaseload() {
        console.log("saveUpdatedCaseload");
        this.notificationService.info("Feature not enabled. Still in development.");
    }

    saveAsNewCaseload() {
        console.log("saveAsNewCaseload");
        this.notificationService.info("Feature not enabled. Still in development.");
    }

    removeCaseload() {
        console.log("removeCaseload");
        this.notificationService.info("Feature not enabled. Still in development.");
    }

    resetCaseload() {
        console.log("removeCaseload");
        this.notificationService.info("Feature not enabled. Still in development.");
    }

    exportContactDetails(hasMFA: boolean) {
        const csvName = "CohortAddress";
        const options = {
            title: "Nexus Intelligence Cohort Addresses",
            fieldSeparator: ",",
            quoteStrings: `"`,
            decimalseparator: ".",
            showLabels: true,
            showTitle: false,
            useBom: true,
            headers: [
                "Title",
                "Forename",
                "Surname",
                "Address Line 1",
                "Address Line 2",
                "Address Line 3",
                "Address Line 4",
                "Address Line 5",
                "Postcode",
                "NHS Number",
            ],
        };

        const exportData = [];

        if (!hasMFA) {
            this.notificationService.warning("Authentication Error. Please Provide Multi-Factor Authentication Before Exporting Data.");
        } else {
            this.citizenlist.forEach((d) => {
                exportData.push({
                    title: d.title ? d.title : "",
                    forename: d.forename,
                    surname: d.surname,
                    address_line_1: d.address_line_1 ? d.address_line_1 : "",
                    address_line_2: d.address_line_2 ? d.address_line_2 : "",
                    address_line_3: d.address_line_3 ? d.address_line_3 : "",
                    address_line_4: d.address_line_4 ? d.address_line_4 : "",
                    address_line_5: d.address_line_5 ? d.address_line_5 : "",
                    postcode: d.postcode,
                    nhs_number: d.nhs_number ? d.nhs_number : "",
                });
            });
            new Angular2Csv(exportData, csvName, options);
            this.notificationService.info("Citizen Addresses Exported.");
        }
    }
}
