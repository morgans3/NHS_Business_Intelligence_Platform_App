import { Component, ViewChild, ElementRef, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { FormControl, Validators } from "@angular/forms";
import { Store } from "@ngxs/store";

import { Cohort, APIService, NiceResponse } from "diu-component-library";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";

import { AuthState } from "../../../../_states/auth.state";
import { decodeToken } from "../../../../_pipes/functions";
import { CviCohortService } from "../../_services/cvicohort-service";
declare var window: any;

@Component({
  selector: "app-intervention-assistant",
  templateUrl: "./intervention-assistant.component.html",
  styleUrls: ["./intervention-assistant.component.scss"],
})
export class InterventionAssistantComponent implements OnInit {
  @ViewChild("expansion_panel") expansion_panel_Parent: ElementRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  loading = false;
  tokenDecoded: any;
  cohort_array: Cohort[];
  no_nice_response = [
    {
      Title: "No Interventions or Guidance Found For This Specific Cohort, Please Try A Broader Cohort Search.",
      Abstract: "",
      EvidenceTypes: "",
      SourceUrl: "",
    },
  ];
  no_response = [
    {
      official_title: "No Trials Found For This Specific Cohort, Please Try A Broader Cohort Search.",
      source_id: "",
      enrollment: "",
      status: "",
      registered: "",
      publications: "",
      url: "",
    },
  ];
  intervention_types = [
    {
      description: "Nice Evidence Search (Including Wider Determinents of Health, e.g. smoking, employment)",
      name: "primary",
    },
    { description: "Clinical Trials", name: "secondary" },
  ];
  phases = [
    { description: "Phase I", name: "1" },
    { description: "Phase II", name: "2" },
    { description: "Phase III", name: "3" },
    { description: "Phase IV", name: "4" },
    { description: "Not Applicable", name: "not_applicable" },
  ];
  response: any;
  selected_cohort: string;
  specific_intervention: string;
  selected_type: any;
  selected_years = 40;
  nice_div = true;
  intervention_control = new FormControl("", [Validators.required]);
  cohort_control = new FormControl("", [Validators.required]);
  cohort_search_control = new FormControl("", [Validators.required]);
  selected_phase = ["4", "not_applicable"];
  phase_control = new FormControl(this.selected_phase);
  secondary_columns: string[] = ["official_title", "enrollment", "min_age_number", "gender", "completion_date", "study_phase"];
  primary_columns: string[] = ["official_title"];

  nice_secondary_columns: string[] = ["Title", "Abstract", "EvidenceTypes", "SourceName"];
  nice_primary_columns: string[] = ["Title"];
  //this.selected_type && this.selected_type.name === 'primary'
  constructor(
    public http: HttpClient, 
    private store: Store, 
    private apiService: APIService,
    private cviCohortsService: CviCohortService
  ) { }

  ngOnInit() {
    const token = this.store.selectSnapshot(AuthState.getToken);
    if (token) {
      this.tokenDecoded = decodeToken(token);
      this.cviCohortsService.getByUsername(this.tokenDecoded.username).subscribe((res: Cohort[]) => {
        this.cohort_array = res;
      });
    }
    this.response = new MatTableDataSource();
    this.response.sort = this.sort;
    this.response.paginator = this.paginator;
  }

  // Save response data and plot
  get_data(response) {
    if (!response) {
      this.response.data = this.no_response;
    } else {
      this.response.data = response;
    }
    this.response.sort = this.sort;
    this.response.paginator = this.paginator;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.response.filter = filterValue;
  }

  reset_intervention_list() {
    this.intervention_control.reset();
    this.cohort_control.reset();
    this.cohort_search_control.reset();
    this.selected_years = 40;
    this.selected_phase = ["4", "not_applicable"];
  }

  // Disable the "Select Phase" drop-down for primary interventions
  phase_disabler() {
    if (this.selected_type && this.selected_type.name === "secondary") {
      return false;
    }
    return true;
  }

  // Limit returned abstract size for readability
  shorten_text(text: string) {
    if (!text.length) {
      return text;
    } else if (text.length > 250) {
      return text.substring(0, 248) + " ...";
    } else {
      return text;
    }
  }

  // Send API call to plumbeR
  send_api() {
    switch (this.selected_type.name) {
      case "secondary":
        const cohort = this.cohort_array.find((x) => x.cohortName === this.selected_cohort);
        let phase_request = "";
        this.selected_phase.forEach((d) => {
          phase_request = phase_request + d + ",";
        });
        if (phase_request.length > 0) {
          phase_request = phase_request.substr(0, phase_request.length - 1);
        }
        let date_request = 100;
        if (this.selected_years) {
          date_request = this.selected_years;
        }
        const search = {
          search: cohort.cohorturl,
          phases: phase_request,
          min_date: date_request,
        };
        this.nice_div = false;
        this.loading = true;
        this.apiService.searchClinicalTrials(search.search, search.phases, search.min_date.toString()).subscribe((res) => {
          this.loading = false;
          this.get_data(res);
        });
        break;
      default:
        this.nice_div = true;
        let nice_query = "";
        // check for conditions (LTCs2Dimension)
        if (!this.specific_intervention || this.specific_intervention === "") {
          const nice_cohort = this.cohort_array.find((x) => x.cohortName === this.selected_cohort);
          const parsed_cohort = JSON.parse(nice_cohort.cohorturl);

          if (parsed_cohort["LTCs2Dimension"]) {
            parsed_cohort["LTCs2Dimension"].forEach((element) => {
              nice_query += " " + element.toString().toLowerCase();
            });

            this.loading = true;
            this.apiService.searchNICEEvidence(nice_query, 250).subscribe((res: any) => {
              const nice_results: NiceResponse = JSON.parse(res.msg);
              const search_results = nice_results.SearchResult.Documents;

              this.loading = false;
              this.get_data(search_results);
            });
          } else {
            this.response.data = this.no_nice_response;
          }
        } else {
          nice_query += this.specific_intervention;
          this.loading = true;
          this.apiService.searchNICEEvidence(nice_query, 250).subscribe((res: any) => {
            const nice_results: NiceResponse = JSON.parse(res.msg);
            const search_results = nice_results.SearchResult.Documents;

            this.loading = false;
            this.get_data(search_results);
          });
        }
    }
  }
}
