import { Component, ViewChild, Input, Output, EventEmitter, OnChanges, AfterViewInit } from "@angular/core";
import { MatSelectionList, MatSelectionListChange } from "@angular/material/list";
import { MatDialog } from "@angular/material/dialog";
import { Store } from "@ngxs/store";
import { AuthState } from "../../../../../_states/auth.state";
import { NotificationService } from "../../../../../_services/notification.service";
import { Router } from "@angular/router";
import { iTeam, CVICohort, APIService } from "diu-component-library";
import { ConfirmText, ConfirmTextDialogComponent } from "../../../../../shared/modals/textconfirm/dialogtextconfirm";
import { decodeToken } from "../../../../../_pipes/functions";

@Component({
    selector: "app-covid-cohort-all",
    templateUrl: "./cohort-all.component.html",
    styleUrls: ["./cohort-all.component.scss"],
})
export class CohortAllComponent implements AfterViewInit, OnChanges {
    @ViewChild(MatSelectionList) cohorts: MatSelectionList;
    @Input() cohort: any;
    @Output() changeEvent = new EventEmitter<any>();
    allcohorts: CVICohort[] = [];
    tokenDecoded: any;
    shownCohort: any;
    selectedCohort: CVICohort = new CVICohort();
    AgeDimension: any;
    CCGDimension: any;
    teamcodes: any;
    teamlist: iTeam[];

    constructor(
        private store: Store,
        private apiService: APIService,
        private notificationService: NotificationService,
        public dialog: MatDialog,
        private router: Router
    ) {
        let token = this.store.selectSnapshot(AuthState.getToken);
        if (!token) {
            const localtoken = localStorage.getItem("@@token");
            if (localtoken && localtoken["stateauth"]) {
                token = localStorage.getItem("@@token")["stateauth"].token;
            }
        }
        if (token) {
            this.tokenDecoded = decodeToken(token);
            this.teamcodes = this.tokenDecoded["memberships"];
            this.apiService.getCVICohortsByUsername(this.tokenDecoded.username).subscribe((res: CVICohort[]) => {
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
        } else {
            this.notificationService.warning("Unable to retrieve Cohorts");
        }
    }

    isEmpty(obj) {
        return Object.keys(obj).length === 0;
    }

    ngAfterViewInit() {
        this.cohorts.selectionChange.subscribe((s: MatSelectionListChange) => {
            this.cohorts.deselectAll();
            s.option.selected = true;
            const savedCohort = this.allcohorts.find((x) => x.cohortName === s.option.value);
            if (savedCohort) {
                this.selectedCohort = savedCohort;
                this.changeEvent.emit(this.selectedCohort);
            }
        });
        this.apiService.getTeams().subscribe((res: iTeam[]) => {
            this.teamlist = res;
        });
    }

    ngOnChanges() {
        this.selectedCohort.cohorturl = JSON.stringify(this.cohort);
    }

    goToPopList() {
        const win = document.getElementsByClassName("mat-drawer-content")[0];
        const scrollToTop = window.setInterval(() => {
            const pos = win.scrollTop;
            if (pos > 0) {
                win.scrollTo(0, pos - 200);
            } else {
                window.clearInterval(scrollToTop);
            }
        }, 16);
        if (JSON.stringify(this.cohort) !== "{}") {
            localStorage.setItem("@@selected-cohort", JSON.stringify(this.cohort));
        }
        this.router.navigate(["/population-list"]);
    }

    resetCohort() {
        this.cohorts.deselectAll();
        this.selectedCohort = new CVICohort();
        this.changeEvent.emit(null);
    }

    saveNew() {
        const modalSettings: ConfirmText = {
            title: "Save New Cohort",
            text: "Please confirm the name for this new Cohort...",
            response: {},
            teams: this.teamcodes,
            teamlist: this.teamlist,
        };
        const dialogRef = this.dialog.open(ConfirmTextDialogComponent, {
            width: "350px",
            data: modalSettings,
        });
        dialogRef.afterClosed().subscribe((response) => {
            if (response && response.name) {
                this.confirmNew(response);
            }
        });
    }

    saveAsNew() {
        const modalSettings: ConfirmText = {
            title: "Save selected Cohort as New",
            text: "Please confirm the name for the new Cohort...",
            response: {},
            teams: this.teamcodes,
            teamlist: this.teamlist,
        };
        const dialogRef = this.dialog.open(ConfirmTextDialogComponent, {
            width: "350px",
            data: modalSettings,
        });
        dialogRef.afterClosed().subscribe((response) => {
            if (response && response.name) {
                this.confirmNew(response);
            }
        });
    }

    confirmNew(response: any) {
        const newCohort: CVICohort = {
            cohortName: response.name,
            cohorturl: JSON.stringify(this.cohort),
            createdDT: new Date(),
            username: this.tokenDecoded.username,
        };
        if (response.teamcode) {
            newCohort.teamcode = response.teamcode;
        }
        this.selectedCohort = newCohort;
        this.apiService.createCVICohort(this.selectedCohort).subscribe((data: any) => {
            if (data.success) {
                this.apiService.getCVICohortsByUsername(this.tokenDecoded.username).subscribe((res: CVICohort[]) => {
                    this.allcohorts = res;
                    this.notificationService.success("New cohort has been created");
                });
            } else {
                this.notificationService.warning("Unable to create cohort");
            }
        });
    }

    saveUpdate() {
        this.notificationService.question("Are you sure you wish to proceed with this action?").then((confirmed) => {
            if (confirmed === true) {
                this.confirmUpdate();
            }
        });
    }

    confirmUpdate() {
        this.selectedCohort.cohorturl = JSON.stringify(this.cohort);
        this.apiService.createCVICohort(this.selectedCohort).subscribe((data: any) => {
            if (data.success) {
                this.apiService.getCVICohortsByUsername(this.tokenDecoded.username).subscribe((res: CVICohort[]) => {
                    this.allcohorts = res;
                    this.notificationService.success("Cohort Database has been updated");
                });
            } else {
                this.notificationService.warning("Unable to update cohort");
            }
        });
    }

    removeCohort() {
        this.notificationService.question("Are you sure you wish to proceed with this action?").then((confirmed) => {
            if (confirmed === true) {
                this.apiService.deleteCVICohort(this.selectedCohort).subscribe((data: any) => {
                    if (data.success) {
                        this.apiService.getCVICohortsByUsername(this.tokenDecoded.username).subscribe((res: CVICohort[]) => {
                            this.allcohorts = res;
                            this.notificationService.success("Cohort has been removed from Database");
                        });
                    } else {
                        this.notificationService.warning("Unable to create cohort");
                    }
                });
            }
        });
    }

    no_duplicates(inputArray) {
        return inputArray.filter((item, pos, self) => {
            return self.indexOf(item) === pos;
        });
    }
}
