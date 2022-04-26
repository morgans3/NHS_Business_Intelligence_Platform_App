import { Component, OnInit, ViewChild } from "@angular/core";
import { MatTable, MatTableDataSource, MatPaginator, MatSort } from "@angular/material";
import { Store } from "@ngxs/store";
import { JwtHelper } from "angular2-jwt";
import { NotificationService } from "../../_services/notification.service";
import { AuthState } from "../../_states/auth.state";
import { StatCardData } from "../Regional/stat-card.component";
import { Angular2Csv } from "angular2-csv/Angular2-csv";
import { ShieldingServices } from "./shielding.services";
import { SQLApiService } from "../../_services/sqlapi.service";
import { PatientService } from "../../_services/patient.service";

@Component({
  selector: "app-nsss",
  templateUrl: "./nsss.component.html",
  styleUrls: ["./nsss.component.scss"],
})
export class NSSSComponent implements OnInit {
  noAccess = false;
  noResults = false;
  refreshDT = new Date();
  dataSource: MatTableDataSource<any>;
  dataFetched = false;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  table: MatTable<any>;
  tokenDecoded: any;
  sensitiveData = false;
  shieldingServices = ShieldingServices;
  selectedShieldingServices = [];
  shieldingList = [];
  exportData: [];
  filterBookmark = false;
  exampleData = [
    {
      properties: {
        message: "Getting Shielding Data...",
      },
    },
  ];
  displayedColumns: string[] = ["nhs_number", "first_name", "last_name", "address_line1", "address_line2", "address_town_city", "address_postcode", "contact_number_calls", "contact_number_texts", "contact_email", "flags"];

  totalStats: StatCardData = {
    title: "Number on NSSS",
    value: "0",
    icon: "fas fa-clipboard-list",
    color: "bg-info",
  };
  activeStats: StatCardData = {
    title: "Number of Active Users",
    value: "0",
    icon: "fas fa-check-circle",
    color: "bg-danger",
  };
  selectedStats: StatCardData = {
    title: "Number Selected",
    value: "0",
    icon: "fas fa-user-plus",
    color: "bg-success",
  };
  dataRefreshedStats: StatCardData = {
    title: "Refreshed Date",
    value: "0",
    icon: "fas fa-calendar-alt",
    color: "bg-primary",
  };

  constructor(private patientService: PatientService, public store: Store, private notificationService: NotificationService) {
    const token = this.store.selectSnapshot(AuthState.getToken);
    if (token) {
      const jwtHelper = new JwtHelper();
      this.tokenDecoded = jwtHelper.decodeToken(token);
      this.patientService.getCitizens("5000").subscribe((data: []) => {
        this.shieldingList = data;
        this.setData(this.shieldingList);
      });
    }
  }

  isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }

  ngOnInit() {}

  formatDate(date) {
    let d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) {
      month = "0" + month;
    }
    if (day.length < 2) {
      day = "0" + day;
    }

    return [year, month, day].join("-");
  }

  setStats() {
    const shieldingList = this.shieldingList;
    if (shieldingList && shieldingList.length > 0) {
      this.totalStats.text = shieldingList.length.toString();
      this.activeStats.text = shieldingList.reduce((acc, cur) => (cur["active_status_flag"] ? ++acc : acc), 0).toString();
      this.selectedStats.text = this.dataSource.data.length.toString();
      this.dataRefreshedStats.text = shieldingList ? this.formatDate(shieldingList[0]["loaded_date"]) : "";
    } else {
      throw Error("Shielding List is not available");
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

  filterServices(event) {
    if (this.selectedShieldingServices.indexOf(event) > -1) {
      this.selectedShieldingServices.splice(this.selectedShieldingServices.indexOf(event), 1);
    } else {
      this.selectedShieldingServices.push(event);
    }
    if (this.selectedShieldingServices.length === 0) {
      this.setData(this.shieldingList);
    } else {
      this.setData(
        this.shieldingList.filter((x) => {
          let flag = true;
          this.selectedShieldingServices.forEach((filter) => {
            const type = this.shieldingServices.find((b) => b.value === filter);
            if (x[filter] !== type.default) {
              flag = false;
            }
          });
          return flag;
        })
      );
    }
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  setData(dataset) {
    this.dataSource = new MatTableDataSource(dataset);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.setStats();
  }

  exportShieldingList(hasMFA: boolean) {
    const csvName = "nsss_list";
    const options = {
      title: "NSSS User List",
      fieldSeparator: ",",
      quoteStrings: '"',
      decimalseparator: ".",
      showLabels: true,
      showTitle: false,
      useBom: true,
      headers: ["NHS Number", "ID", "Forename", "Middle Name(s)", "Surname", "Date of Birth", "Address Line 1", "Address Line 2", "Town/City", "Postcode", "Address UPRN", "Contact Number (Calls)", "Contact Number (Texts)", "Contact Email", "Submission Date/Time", "UID Submission", "Are You Applying On Behalf Of Someone Else?", "Have You Received An NHS Letter?", "Do You Want Supermarket Deliveries?", "Do You Need Someone To Contact You About Local Support?", "Do You Have One Of The Listed Medical Conditions?", "Do You Have Someone To Go Shopping For You?", "LAD Code", "Active Status", "SPL Category", "SPL Address Line 1", "SPL Address Line 2", "SPL Address Line 3", "SPL Address Line 4", "SPL Address Line 5", "SPL Address Postcode", "SPL Address UPRN"],
    };

    var exportData;
    if (!hasMFA) {
      this.notificationService.warning("Authentication Error. Please Provide Multi-Factor Authentication Before Exporting Data.");
    } else {
      exportData = this.dataSource.data.map((d) => {
        return {
          nhs_number: d["nhs_number"] ? d["nhs_number"] : "",
          id: d["ID"] ? d["ID"] : "",
          first_name: d["first_name"] ? d["first_name"] : "",
          middle_name: d["middle_name"] ? d["middle_name"] : "",
          last_name: d["last_name"] ? d["last_name"] : "",
          date_of_birth: this.formatDate(d["date_of_birth"]) ? this.formatDate(d["date_of_birth"]) : "",
          address_line1: d["address_line1"] ? d["address_line1"] : "",
          address_line2: d["address_line2"] ? d["address_line2"] : "",
          address_town_city: d["address_town_city"] ? d["address_town_city"] : "",
          address_postcode: d["address_postcode"] ? d["address_postcode"] : "",
          address_uprn: d["address_uprn"] ? d["address_uprn"] : "",
          contact_number_calls: d["contact_number_calls"] ? d["contact_number_calls"] : "",
          contact_number_texts: d["contact_number_texts"] ? d["contact_number_texts"] : "",
          contact_email: d["contact_email"] ? d["contact_email"] : "",
          submission_datetime: d["submission_datetime"] ? d["submission_datetime"] : "",
          uid_submission: d["uid_submission"] ? d["uid_submission"] : "",
          are_you_applying_on_behalf_of_someone_else: d["are_you_applying_on_behalf_of_someone_else"] ? d["are_you_applying_on_behalf_of_someone_else"] : "",
          have_you_received_an_nhs_letter: d["have_you_received_an_nhs_letter"] ? d["have_you_received_an_nhs_letter"] : "",
          do_you_want_supermarket_deliveries: d["do_you_want_supermarket_deliveries"] ? d["do_you_want_supermarket_deliveries"] : "",
          do_you_need_someone_to_contact_you_about_local_support: d["do_you_need_someone_to_contact_you_about_local_support"] ? d["do_you_need_someone_to_contact_you_about_local_support"] : "",
          do_you_have_one_of_the_listed_medical_conditions: d["do_you_have_one_of_the_listed_medical_conditions"] ? d["do_you_have_one_of_the_listed_medical_conditions"] : "",
          do_you_have_someone_to_go_shopping_for_you: d["do_you_have_someone_to_go_shopping_for_you"] ? d["do_you_have_someone_to_go_shopping_for_you"] : "",
          ladcode: d["ladcode"] ? d["ladcode"] : "",
          active_status: d["active_status"] ? d["active_status"] : "",
          spl_category: d["spl_category"] ? d["spl_category"] : "",
          spl_address_line1: d["spl_address_line1"] ? d["spl_address_line1"] : "",
          spl_address_line2: d["spl_address_line2"] ? d["spl_address_line2"] : "",
          spl_address_line3: d["spl_address_line3"] ? d["spl_address_line3"] : "",
          spl_address_line4: d["spl_address_line4"] ? d["spl_address_line4"] : "",
          spl_address_line5: d["spl_address_line5"] ? d["spl_address_line5"] : "",
          spl_address_postcode: d["spl_address_postcode"] ? d["spl_address_postcode"] : "",
          spl_address_uprn: d["spl_address_uprn"] ? d["spl_address_uprn"] : "",
        };
      });

      new Angular2Csv(exportData, csvName, options);
      this.notificationService.info("Citizen Addresses Exported.");
    }
  }
}
