import { Component, OnInit, ViewChild } from "@angular/core";
import { NotificationService } from "../../../../_services/notification.service";
import { StatCardData } from "../../../../shared/stat-card.component";
import { MatTableDataSource } from "@angular/material/table";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { Store } from "@ngxs/store";
import { AuthState } from "../../../../_states/auth.state";
import { Angular2Csv } from "angular2-csv/Angular2-csv";
import { FormGroup, FormControl } from "@angular/forms";
import { ConditionTypes } from "../vwdecisions/conditiontypes";
import { recommendations } from "../vwdecisions/vwdecisions.component";
import { APIService, VirtualWardPatient } from "diu-component-library";
import { CCGs } from "../vwdecisions/vwdecisions.component";
import { decodeToken } from "../../../../_pipes/functions";

export const Actions = ["Refer - Self-Management", "Refer - Hospital", "Refer - Virtual Ward"];

@Component({
    selector: "app-recentreferrals",
    templateUrl: "./recentreferrals.component.html",
    styleUrls: ["./recentreferrals.component.scss"],
})
export class RecentreferralsComponent implements OnInit {
    allSelected = false;
    totalStats: StatCardData = {
        title: "Displayed List",
        value: "0",
        icon: "fas fa-notes-medical",
        color: "bg-info",
    };
    reviewStats: StatCardData = {
        title: "Referred to Docobo",
        value: "0",
        icon: "fas fa-clinic-medical",
        color: "bg-primary",
    };
    monitorStats: StatCardData = {
        title: "Referred for Self-Management",
        value: "0",
        icon: "fas fa-user",
        color: "bg-megna",
    };
    dischargeStats: StatCardData = {
        title: "Referred to Hospital",
        value: "0",
        icon: "fas fa-hospital-user",
        color: "bg-danger",
    };
    dataFetched = false;
    dataSource: MatTableDataSource<any>;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    options = [{ value: "null", name: "No data available" }];
    ccgoptions = [];
    gpoptions = [];
    displayedColumns: string[] = [
        "fullname",
        "nhs_number",
        "age_in_years",
        "specimen_date",
        "recommendation",
        "actions",
        "updated_date",
        "flags",
        "functions",
    ];
    allpatients: VirtualWardPatient[] = [];
    patients: VirtualWardPatient[] = [];
    GPs = [];
    limit = "1000";
    list_types = ConditionTypes;
    selectedlisttypes = [];
    sensitiveData = false;
    tokenDecoded: any;
    recommendationlist = recommendations;
    actionlist = Actions;
    group: FormGroup = new FormGroup({
        ccg_ddl: new FormControl(null),
        gp_ddl: new FormControl(null),
        recommendation_ddl: new FormControl(null),
        action_ddl: new FormControl(null),
    });
    isChecked = true;
    gpLoading = true;

    constructor(
        public store: Store,
        public dialog: MatDialog,
        private apiService: APIService,
        private notificationService: NotificationService
    ) {
        const token = this.store.selectSnapshot(AuthState.getToken);
        if (token) {
            this.tokenDecoded = decodeToken(token);
        }
    }

    ngOnInit() {
        this.dataSource = new MatTableDataSource();
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.getGPs();
        this.getPatients();
    }

    getGPs() {
        this.GPs = [];
        this.apiService.getGPPractices().subscribe((data: any[]) => {
            if (data && data.length > 0) {
                data[0].features.forEach((row) => {
                    this.GPs.push({
                        code: row.properties.Code,
                        name: row.properties.Name,
                    });
                });
                this.gpLoading = false;
                this.populateGPOptions();
            }
        });
    }

    populateGPOptions() {
        this.gpoptions = this.GPs;
        this.gpoptions.sort((a, b) => {
            if (a.name < b.name) {
                return -1;
            }
            if (a.name > b.name) {
                return 1;
            }
            return 0;
        });
    }

    getCCGs() {
        this.ccgoptions = CCGs;
        this.ccgoptions.sort((a, b) => {
            if (a.name < b.name) {
                return -1;
            }
            if (a.name > b.name) {
                return 1;
            }
            return 0;
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
        } else {
            this.notificationService.warning("Authentication error: no new passport attached.");
        }
    }

    getPatients() {
        this.dataFetched = false;
        this.apiService.getVWDecisionActioned(this.limit).subscribe(
            (data: VirtualWardPatient[]) => {
                this.allpatients = data;
                this.dataFetched = true;
                this.scanStats();
                this.setData();
                this.populateDropdowns(this.allpatients);
            },
            () => {
                this.dataFetched = true;
                this.notificationService.warning(
                    "Unable to retrieve patient list. You may not have a role to view patient information. Please contact support."
                );
            }
        );
    }

    scanStats() {
        this.totalStats.text = this.allpatients.length.toString();
        this.monitorStats.text = this.allpatients
            .slice()
            .reduce((acc, cur) => (cur.status === "Refer - Self-Management" ? ++acc : acc), 0)
            .toString();
        this.reviewStats.text = this.allpatients
            .slice()
            .reduce((acc, cur) => (cur.status === "Refer - Virtual Ward" ? ++acc : acc), 0)
            .toString();
        this.dischargeStats.text = this.allpatients
            .slice()
            .reduce((acc, cur) => (cur.status === "Refer - Hospital" ? ++acc : acc), 0)
            .toString();
    }

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim();
        filterValue = filterValue.toLowerCase();
        this.dataSource.filter = filterValue;
    }

    filterList(event) {
        if (this.selectedlisttypes.indexOf(event) > -1) {
            this.selectedlisttypes.splice(this.selectedlisttypes.indexOf(event), 1);
        } else {
            this.selectedlisttypes.push(event);
        }
        this.setData();
    }

    setData() {
        this.patients = this.allpatients;
        if (this.selectedlisttypes.length > 0) {
            this.patients = this.patients.filter((x) => {
                let flag = false;
                if (this.isChecked) {
                    this.selectedlisttypes.forEach((filter) => {
                        const type = this.list_types.find((b) => b.value === filter);
                        if (x[filter] === type.default) {
                            flag = true;
                        }
                    });
                    return flag;
                } else {
                    flag = true;
                    this.selectedlisttypes.forEach((filter) => {
                        const type = this.list_types.find((b) => b.value === filter);
                        if (x[filter] !== type.default) {
                            flag = false;
                        }
                    });
                    return flag;
                }
            });
        }
        if (this.group.controls.gp_ddl.value && this.group.controls.gp_ddl.value.length > 0) {
            this.patients = this.patients.filter((x) => x.gpp_code === this.group.controls.gp_ddl.value);
        }
        if (this.group.controls.ccg_ddl.value && this.group.controls.ccg_ddl.value.length > 0) {
            this.patients = this.patients.filter((x) => x.ccg_code === this.group.controls.ccg_ddl.value);
        }
        if (this.group.controls.recommendation_ddl.value && this.group.controls.recommendation_ddl.value.length > 0) {
            this.patients = this.patients.filter((x) => x.recommendation === this.group.controls.recommendation_ddl.value);
        }
        if (this.group.controls.action_ddl.value && this.group.controls.action_ddl.value.length > 0) {
            this.patients = this.patients.filter((x) => x.status === this.group.controls.action_ddl.value);
        }
        this.dataSource = new MatTableDataSource(this.patients);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.dataFetched = true;
        this.totalStats.text = this.patients.length.toString();
    }

    filterCCG() {
        this.setData();
        this.populateDropdowns(this.patients, false, true);
    }

    filterGP() {
        this.setData();
        this.populateDropdowns(this.patients, true, false);
    }

    populateDropdowns(dataset: VirtualWardPatient[], ccgfilter?: boolean, gpfilter?: boolean) {
        this.getCCGs();
        const ccglist = [];
        const gplist = [];
        dataset.forEach((person) => {
            if (!ccglist.includes(person.ccg_code)) {
                ccglist.push(person.ccg_code);
            }
            if (!gplist.includes(person.gpp_code)) {
                gplist.push(person.gpp_code);
            }
        });
        if (ccgfilter) {
            this.ccgoptions = this.ccgoptions.filter((x) => ccglist.indexOf(x.code) > -1);
        }
        if (gpfilter) {
            this.gpoptions = this.GPs.filter((x) => gplist.indexOf(x.code) > -1);
            this.gpoptions.sort((a, b) => {
                if (a.name < b.name) {
                    return -1;
                }
                if (a.name > b.name) {
                    return 1;
                }
                return 0;
            });
        }
    }

    exportReferralsToCsv(hasMFA: boolean) {
        const csvName = "Recent Virtual Ward Referrals";
        const options = {
            title: "Nexus Intelligence Recent Virtual Ward Referrals",
            fieldSeparator: ",",
            quoteStrings: `"`,
            decimalseparator: ".",
            showLabels: true,
            showTitle: false,
            useBom: true,
            headers: [
                "NHS Number",
                "Forename",
                "Surname",
                "Age",
                "Phone number",
                "Email address",
                "Date referred to virtual ward",
                "Specimen date",
            ],
        };

        const exportData = [];

        if (!hasMFA) {
            this.notificationService.warning("Authentication Error. Please Provide Multi-Factor Authentication Before Exporting Data");
        } else {
            this.patients.forEach((patient) => {
                exportData.push({
                    nhs_number: patient.nhs_number,
                    forename: patient.forename,
                    surname: patient.surname,
                    age_in_years: patient.age_in_years,
                    phone_number: patient.phone_number,
                    email: patient.email,
                    updated_date: new Date(patient.updated_date).toLocaleDateString(),
                    specimen_date: new Date(patient.specimen_date).toLocaleDateString(),
                });
            });
            new Angular2Csv(exportData, csvName, options);
            this.notificationService.info("Recent Virtual Ward Referrals Exported.");
        }
    }

    getLabelClass(recommendation: string) {
        switch (recommendation) {
            case "RS Greater Risk":
            case "RS Higher Risk":
                return "label label-warning";
            case "Refer - Self-Management":
            case "RS Lower Risk":
                return "label label-megna";
            case "National SOP":
            case "Refer – Virtual Ward":
                return "label label-purple";
            case "Refer - Hospital":
                return "label label-danger";
            case "Local SOP":
                return "label label-light-purple";
            default:
                return "label label-purple";
        }
    }

    clearFilters() {
        this.group.reset();
        this.patients = this.allpatients;
        this.selectedlisttypes = [];
        this.setData();
    }

    undoAction(item: VirtualWardPatient) {
        this.apiService.updateVWStatus(item.id, "Pending").subscribe((data: any) => {
            if (data && data.success) {
                this.notificationService.success(
                    "Status has been set back to Pending, this positive case is now available to review in VW Management Console."
                );
                this.allpatients.splice(this.allpatients.indexOf(item), 1);
                this.scanStats();
                this.setData();
            }
        });
    }

    displaystatus(item: VirtualWardPatient) {
        let str = item.status;
        if (item.nonreferral_reason) {
            switch (item.nonreferral_reason) {
                case "Not Symptomatic":
                    str += " (NS)";
                    break;
                case "Patient Refused":
                    str += " (PR)";
                    break;
                case "Inappropriate - Palliative Care":
                    str += " (I-PC)";
                    break;
                case "Inappropriate - Care Home":
                    str += " (I-CH)";
                    break;
                case "Inappropriate - Other":
                    str += " (I-Or)";
                    break;
                case "Not Reviewed":
                    str += " (NR)";
                    break;
                default:
                    break;
            }
        }
        return str;
    }
}
