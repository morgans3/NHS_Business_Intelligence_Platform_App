import { Component, OnInit, ViewChild } from "@angular/core";
import { APIService, VirtualWardPatient } from "diu-component-library";
import { NotificationService } from "../../../../../_services/notification.service";
import { StatCardData } from "../../Regional/stat-card.component";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { ConditionTypes } from "./conditiontypes";
import { Store } from "@ngxs/store";
import { AuthState } from "../../../../../_states/auth.state";
import { FormGroup, FormControl } from "@angular/forms";
import { ConfirmDialogComponent } from "../../Regional/dialogconfirm";
import { ContactDialogComponent } from "./dialogcontact";
import { NotesDialogComponent } from "./dialognotes";
import { ReasonDialogComponent } from "./dialogreason";
import { UserDialogComponent } from "./dialogprofile";
import { decodeToken } from "../../../../../_pipes/functions";

export const recommendations = ["RS Lower Risk", "RS Greater Risk", "National SOP", "Local SOP"];

export const CCGs = [
  { code: "02M", name: "Fylde & Wyre CCG" },
  { code: "00R", name: "Blackpool CCG" },
  { code: "02G", name: "W.Lancs CCG" },
  { code: "00Q", name: "Blackburn with Darwen CCG" },
  { code: "00X", name: "Chorley and South Ribble CCG" },
  { code: "01A", name: "East Lancs CCG" },
  { code: "01E", name: "Greater Preston CCG" },
  { code: "01K", name: "Lancashire North CCG" },
];

@Component({
  selector: "app-vwdecisions",
  templateUrl: "./vwdecisions.component.html",
  styleUrls: ["./vwdecisions.component.scss"],
})
export class VwdecisionsComponent implements OnInit {
  allSelected = false;
  totalStats: StatCardData = {
    title: "Displayed List",
    value: "0",
    icon: "fas fa-notes-medical",
    color: "bg-info",
  };
  reviewStats: StatCardData = {
    title: "Meets National SOP | Local SOP",
    value: "0 | 0",
    icon: "fas fa-user-md",
    color: "bg-danger",
  };
  monitorStats: StatCardData = {
    title: "Positive Cases from PHE",
    value: "0",
    icon: "fas fa-shield-virus",
    color: "bg-success",
  };
  dischargeStats: StatCardData = {
    title: "Oldest Specimen Date",
    value: "0",
    icon: "fas fa-virus",
    color: "bg-primary",
  };
  dataFetched = false;
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  options = [{ value: "null", name: "No data available" }];
  ccgoptions = [];
  gpoptions = [];
  displayedColumns: string[] = ["selector", "extra", "fullname", "nhs_number", "age_in_years", "phone_number", "specimen_date", "loaded_date", "risk_score", "rs_frailty_index", "recommendation", "flags", "actions"];
  allpatients: VirtualWardPatient[] = [];
  patients: VirtualWardPatient[] = [];
  GPs = [];
  limit = "5000";
  list_types = ConditionTypes;
  selectedlisttypes = [];
  sensitiveData = false;
  tokenDecoded: any;
  recommendationlist = recommendations;
  bulkActionList: VirtualWardPatient[] = [];
  group: FormGroup = new FormGroup({
    ccg_ddl: new FormControl(null),
    gp_ddl: new FormControl(null),
    recommendation_ddl: new FormControl(null),
  });
  isChecked = true;
  gpLoading = true;
  agehide = false;

  constructor(
    public dialog: MatDialog, 
    private apiService: APIService, 
    private notificationService: NotificationService, 
    public store: Store, 
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
    this.ccgoptions = CCGs.sort((a, b) => {
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
    this.apiService.getVWDecisionPatientsByStatus("Pending", this.limit).subscribe(
      (data: VirtualWardPatient[]) => {
        this.allpatients = data;
        this.dataFetched = true;
        this.scanStats();
        this.setData();
        this.populateDropdowns(this.patients, true, true);
      },
      (error) => {
        this.dataFetched = true;
        this.notificationService.warning("Unable to retrieve patient list. You may not have a role to view patient information. Please contact support.");
      }
    );
  }

  scanStats() {
    const totalNationalSop: number = this.allpatients.reduce((acc, cur) => (cur.recommendation === "National SOP" ? ++acc : acc), 0);
    const totalLocalSop: number = this.allpatients.reduce((acc, cur) => (cur.recommendation === "Local SOP" ? ++acc : acc), 0);

    this.totalStats.text = this.allpatients.length.toString();
    this.monitorStats.text = this.allpatients.reduce((acc, cur) => (cur.status === "Pending" ? ++acc : acc), 0).toString();
    this.reviewStats.text = `${totalNationalSop.toString()} | ${totalLocalSop.toString()}`;
    this.dischargeStats.text = "";
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
    if (this.agehide) {
      this.patients = this.patients.filter((x) => x.age_in_years >= 18);
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
    let lastsample = new Date();
    dataset.forEach((person) => {
      if (!ccglist.includes(person.ccg_code)) {
        ccglist.push(person.ccg_code);
      }
      if (!gplist.includes(person.gpp_code)) {
        gplist.push(person.gpp_code);
      }
      if (person.specimen_date && lastsample > new Date(person.specimen_date)) {
        lastsample = new Date(person.specimen_date);
      }
    });
    this.dischargeStats.text = lastsample.toISOString().split("T")[0];
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

  getLabelClass(recommendation: string) {
    switch (recommendation) {
      case "RS Greater Risk":
      case "RS Higher Risk":
        return "label label-warning";
      case "RS Lower Risk":
        return "label label-megna";
      case "National SOP":
        return "label label-purple";
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
    this.selectAll(false);
    this.setData();
  }

  logReason(item: VirtualWardPatient) {
    const dialogRef = this.dialog.open(ReasonDialogComponent, {
      width: "90%",
      data: null,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        item.nonreferral_reason = result;
        this.submitReferral("Refer - Self-Management", item);
      }
    });
  }

  submitReferral(value, item: VirtualWardPatient) {
    if (value === "Refer - Virtual Ward") {
      if (item.phone_number || item.newcontact) {
        this.apiService.updateVWStatus(item.id, value).subscribe((data: any) => {
          if (data && data.success) {
            this.notificationService.success("Referral Update has been made for: " + item.nhs_number);
            this.allpatients.splice(this.allpatients.indexOf(item), 1);
            this.scanStats();
            this.setData();
          }
        });
      } else {
        this.notificationService.warning("Unable to submit to Docobo without a Phone Number. Please add a contact number for: " + item.nhs_number);
      }
    } else {
      let reason = null;
      if (item.nonreferral_reason) {
        reason = item.nonreferral_reason;
      }
      this.apiService.updateVWStatus(item.id, value, reason).subscribe((data: any) => {
        if (data && data.success) {
          this.notificationService.success("Referral Update has been made for: " + item.nhs_number);
          this.allpatients.splice(this.allpatients.indexOf(item), 1);
          this.scanStats();
          this.setData();
        }
      });
    }
  }

  selectItem(item) {
    if (this.bulkActionList.includes(item)) {
      item.selected = null;
      this.bulkActionList = this.bulkActionList.filter((x) => x !== item);
    } else {
      item.selected = true;
      this.bulkActionList.push(item);
    }
  }

  selectAll(event) {
    this.allSelected = event;
    this.patients.forEach((person) => {
      person.selected = event;
    });
    if (event) {
      this.bulkActionList = this.patients;
    } else {
      this.bulkActionList = [];
    }
    this.setData();
  }

  bulkAction(actiontype: string) {
    if (this.bulkActionList.length > 10) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: "350px",
        data: null,
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.carryOutBulkAction(actiontype);
        }
      });
    } else {
      this.carryOutBulkAction(actiontype);
    }
  }

  carryOutBulkAction(actiontype: string) {
    if (actiontype === "Refer - Self-Management") {
      const dialogRef = this.dialog.open(ReasonDialogComponent, {
        width: "90%",
        data: null,
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.bulkActionList.forEach((item) => {
            item.nonreferral_reason = result;
            this.submitReferral(actiontype, item);
          });
          this.bulkActionList = [];
        }
      });
    } else {
      this.bulkActionList.forEach((item) => {
        this.submitReferral(actiontype, item);
      });
      this.bulkActionList = [];
    }
  }

  moreInfo(row) {
    this.apiService.getPatientDemographics(row.nhs_number).subscribe((res: any) => {
      if (res) {
        const dialogRef = this.dialog.open(UserDialogComponent, {
          width: "350px",
          data: res,
        });
      } else {
        this.notificationService.error("Unable to locate this person, please contact support.");
      }
    });
  }

  editContact(row) {
    const dialogContact = this.dialog
      .open(ContactDialogComponent, {
        width: "90%",
        data: row,
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.apiService.updateVWContact(row.id, res).subscribe((response: any) => {
            if (response && response.success && response.success === true) {
              this.notificationService.success("Contact information has been updated");
              row.newcontact = res;
            } else {
              const reason = response.reason || "Please contact support.";
              this.notificationService.warning("Unable to update. " + reason);
            }
          });
        } else if (res === null) {
          this.apiService.clearVWContact(row.id).subscribe((response: any) => {
            if (response && response.success && response.success === true) {
              this.notificationService.success("Contact information has been updated");
              row.newcontact = null;
            } else {
              const reason = response.reason || "Please contact support.";
              this.notificationService.warning("Unable to update. " + reason);
            }
          });
        }
      });
  }

  editNotes(row) {
    const dialogContact = this.dialog
      .open(NotesDialogComponent, {
        width: "90%",
        data: row,
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.apiService.updateVWNotes(row.id, res).subscribe((response: any) => {
            if (response && response.success && response.success === true) {
              this.notificationService.success("Notes have been updated");
              row.notes = res;
            } else {
              const reason = response.reason || "Please contact support.";
              this.notificationService.warning("Unable to update. " + reason);
            }
          });
        } else if (res === null) {
          this.apiService.clearVWNotes(row.id).subscribe((response: any) => {
            if (response && response.success && response.success === true) {
              this.notificationService.success("Notes have been updated");
              row.notes = null;
            } else {
              const reason = response.reason || "Please contact support.";
              this.notificationService.warning("Unable to update. " + reason);
            }
          });
        }
      });
  }

  toggleAgeHide() {
    this.setData();
    this.populateDropdowns(this.patients, true, true);
  }
}
