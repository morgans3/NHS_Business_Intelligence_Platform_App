import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { APIService } from "diu-component-library";
import { IncidentMethods } from "src/app/_models/SPI_Lookups";

export interface AdminLists {
  listname: string;
  list: IncidentMethods[];
  displayname: string;
}

@Component({
  selector: "app-Admin",
  templateUrl: "./Admin.component.html",
  styleUrls: ["./Admin.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class AdminComponent implements OnInit {
  allmethods: IncidentMethods[];
  fulllist: AdminLists[] = [
    {
      listname: "bcu_options",
      list: [],
      displayname: "BCU Options",
    },
    {
      listname: "method",
      list: [],
      displayname: "Methods",
    },
    {
      listname: "inquest_conclusion",
      list: [],
      displayname: "Inquest Conclusions",
    },
    {
      listname: "bereavement_options",
      list: [],
      displayname: "Bereavement Options",
    },
    {
      listname: "suicide_type",
      list: [],
      displayname: "Suicide Type",
    },
    {
      listname: "coroner_areas",
      list: [],
      displayname: "Coroner Options",
    },
    {
      listname: "csp_districts",
      list: [],
      displayname: "CSP/Districts",
    },
    {
      listname: "ccg_values",
      list: [],
      displayname: "CCGs",
    },
    {
      listname: "ics_values",
      list: [],
      displayname: "ICS",
    },
    {
      listname: "reporters",
      list: [],
      displayname: "Reporters",
    },
    {
      listname: "local_authorities",
      list: [],
      displayname: "Local Authorities",
    },
    {
      listname: "location_types",
      list: [],
      displayname: "Location Types",
    },
    {
      listname: "employment_values",
      list: [],
      displayname: "Employment Values",
    },
    {
      listname: "asc_lcc_update",
      list: [],
      displayname: "Adult Social Care LCC",
    },
    {
      listname: "cgl_update",
      list: [],
      displayname: "CGL Update",
    },
    {
      listname: "csp_resident",
      list: [],
      displayname: "CSP Resident",
    },
    {
      listname: "da",
      list: [],
      displayname: "DA",
    },
    {
      listname: "delphi_update",
      list: [],
      displayname: "Delphi Update",
    },
    {
      listname: "gender",
      list: [],
      displayname: "Gender",
    },
    {
      listname: "vic_perp_both",
      list: [],
      displayname: "Vic, Perp, Both",
    },
    {
      listname: "ethnicity",
      list: [],
      displayname: "Ethnicity",
    },
    {
      listname: "mh_services_lscft_update",
      list: [],
      displayname: "MH Services / LSCFT update",
    },
  ];
  constructor(private referenceService: APIService) {
    this.fulllist.sort((a, b) => {
      return a.displayname < b.displayname ? -1 : a.displayname > b.displayname ? 1 : 0;
    });
  }

  ngOnInit() {
    this.updatelists();
  }

  dividemethods() {
    this.fulllist.forEach((li) => {
      li.list = this.allmethods.filter((x) => x.list === li.listname);
    });
  }

  updatelists(event?) {
    if (event === undefined) {
      this.referenceService.getSpiIncidents().subscribe((data: IncidentMethods[]) => {
        this.allmethods = data;
        if (this.allmethods.length > 0) {
          this.dividemethods();
        }
      });
    }
  }
}
