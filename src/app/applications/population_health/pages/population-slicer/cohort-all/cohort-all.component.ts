import { Component, OnInit, ViewChild, Input, Output, EventEmitter, OnChanges } from "@angular/core";
import { MatSelectionList, MatSelectionListChange } from "@angular/material/list";
import { MatDialog } from "@angular/material/dialog";
import { Cohort, APIService, iTeam } from "diu-component-library";
import { Store } from "@ngxs/store";
import { AuthState } from "../../../../../_states/auth.state";
import { NotificationService } from "../../../../../_services/notification.service";
import { ConfirmText, ConfirmTextDialogComponent } from "../../../shared/modals/textconfirm/dialogtextconfirm";
import { Router } from "@angular/router";
import { generateID, decodeToken } from "../../../../../_pipes/functions";

@Component({
    selector: "app-cohort-all",
    templateUrl: "./cohort-all.component.html",
    styleUrls: ["./cohort-all.component.scss"],
})
export class CohortAllComponent implements OnInit, OnChanges {
    @ViewChild(MatSelectionList) cohorts: MatSelectionList;
    @Input() cohort: any;
    @Output() changeEvent = new EventEmitter<any>();
    allcohorts: Cohort[] = [];
    tokenDecoded: any;
    shownCohort: any;
    selectedCohort: Cohort = new Cohort();
    AgeDimension: any;
    CCGDimension: any;
    popListAllow = ["Morgans3", "morgans3", "BondS1"];
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
            this.apiService.getCohortsByUsername(this.tokenDecoded.username).subscribe((res: Cohort[]) => {
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

    ngOnInit() {
        this.cohorts.selectionChange.subscribe((s: MatSelectionListChange) => {
            this.cohorts.deselectAll();
            s.option.selected = true;
            const savedCohort = this.allcohorts.find((x) => x["_id"] === s.option.value);
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
        this.router.navigate(["/population-list"]);
    }

    resetCohort() {
        this.cohorts.deselectAll();
        this.selectedCohort = new Cohort();
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
        const newCohort: Cohort = {
            cohortName: response.name,
            cohorturl: JSON.stringify(this.cohort),
            isDeleted: false,
            _id: generateID(),
            user: this.tokenDecoded.username,
        };
        if (response.teamcode) {
            newCohort.teamcode = response.teamcode;
        }
        this.selectedCohort = newCohort;
        this.apiService.createCohort(this.selectedCohort).subscribe(() => {
            this.apiService.getCohortsByUsername(this.tokenDecoded.username).subscribe((res: Cohort[]) => {
                this.allcohorts = res;
                this.notificationService.success("New cohort has been created");
            });
        });
    }

    saveUpdate() {
        this.notificationService
            .question("Are you sure you wish to proceed with this action?", [
                {
                    title: "Yes",
                    value: true,
                    color: "primary",
                },
                {
                    title: "No",
                    value: false,
                    color: "warn",
                },
            ])
            .then((confirmed) => {
                if (confirmed === true) {
                    this.confirmUpdate();
                }
            });
    }

    confirmUpdate() {
        this.selectedCohort.cohorturl = JSON.stringify(this.cohort);
        this.apiService.updateCohort(this.selectedCohort).subscribe(() => {
            this.apiService.getCohortsByUsername(this.tokenDecoded.username).subscribe((res: Cohort[]) => {
                this.allcohorts = res;
                this.notificationService.success("Cohort Database has been updated");
            });
        });
    }

    removeCohort() {
        this.notificationService
            .question("Are you sure you want to delete this cohort?", [
                {
                    title: "Yes",
                    value: true,
                    color: "primary",
                },
                {
                    title: "No",
                    value: false,
                    color: "warn",
                },
            ])
            .then((confirmed) => {
                if (confirmed === true) {
                    this.apiService.deleteCohort(this.selectedCohort).subscribe(() => {
                        this.apiService.getCohortsByUsername(this.tokenDecoded.username).subscribe((res: Cohort[]) => {
                            this.allcohorts = res;
                            this.notificationService.success("Cohort has been removed from Database");
                        });
                    });
                }
            });
    }
}
