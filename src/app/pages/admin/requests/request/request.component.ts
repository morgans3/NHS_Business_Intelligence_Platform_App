import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router, NavigationEnd } from "@angular/router";
import { APIService } from "diu-component-library/";
declare function cwr(operation: string, payload: any): void;

@Component({
  selector: "app-requests-request",
  templateUrl: "./request.component.html",
})
export class RequestComponent implements OnInit {
  request;
  requestConfig = {
    title: "Form submission",
    abbreviation: "",
    apiEndpoint: "",
    claims: "",
    questions: [
      {
        label: "ID",
        type: "input",
        inputType: "text",
        name: "id",
        helperText: "",
        validators: [],
        options: [],
        rules: [],
        repeaterFieldData: [],
      },
      {
        label: "Sent at",
        type: "input",
        inputType: "text",
        name: "created_at",
        helperText: "",
        validators: [],
        options: [],
        rules: [],
        repeaterFieldData: [],
      },
    ],
  };
  // , { "label": "Start Date", "type": "date", "inputType": "date", "name": "startdate", "helperText": "select the start date", "validators": [{ "name": "required", "validatorpattern": "", "message": "" }], "options": [], "rules": [], "repeaterFieldData": [] }, { "label": "End Date", "type": "date", "inputType": "date", "name": "enddate", "helperText": "select the end", "validators": [{ "name": "required", "validatorpattern": "", "message": "" }], "options": [], "rules": [], "repeaterFieldData": [] }, { "label": "Alert Colour", "type": "select", "inputType": "", "name": "status", "helperText": "", "validators": [{ "name": "required", "validatorpattern": "", "message": "" }], "options": [{ "optionKey": "danger", "optionValue": "Red", "ordernumber": 1 }, { "optionKey": "success", "optionValue": "Aqua", "ordernumber": 2 }, { "optionKey": "warning", "optionValue": "Yellow", "ordernumber": 3 }, { "optionKey": "primary", "optionValue": "Purple", "ordernumber": 4 }, { "optionKey": "info", "optionValue": "Blue", "ordernumber": 5 }], "rules": [], "repeaterFieldData": [] }, { "label": "Icon", "type": "select", "inputType": "", "name": "icon", "helperText": "", "validators": [{ "name": "required", "validatorpattern": "", "message": "" }], "options": [{ "optionKey": "ti-check-box", "optionValue": "Check", "ordernumber": 1 }, { "optionKey": "ti-plus", "optionValue": "Add", "ordernumber": 2 }, { "optionKey": "ti-minue", "optionValue": "Minus", "ordernumber": 3 }, { "optionKey": "ti-help-alt", "optionValue": "Question", "ordernumber": 4 }, { "optionKey": "ti-na", "optionValue": "Stop", "ordernumber": 5 }, { "optionKey": "ti-user", "optionValue": "Person", "ordernumber": 6 }, { "optionKey": "ti-info-alt", "optionValue": "Info", "ordernumber": 7 }, { "optionKey": "ti-alert", "optionValue": "Exclamation", "ordernumber": 8 }, { "optionKey": "ti-star", "optionValue": "Star", "ordernumber": 9 }], "rules": [], "repeaterFieldData": [] }, { "label": "Is Archived", "type": "select", "inputType": "", "name": "archive", "helperText": "", "validators": [{ "name": "required", "validatorpattern": "", "message": "" }], "options": [{ "optionKey": "false", "optionValue": "No", "ordernumber": 1 }, { "optionKey": "true", "optionValue": "Yes", "ordernumber": 2 }], "rules": [], "repeaterFieldData": [] }], "defaultValues": [{ "label": "_id", "value": "current_timestamp" }, { "label": "author", "value": "AlexS" }] }

  constructor(private apiService: APIService, private activatedRoute: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        cwr("recordPageView", this.router.url);
      }
    });
    this.activatedRoute.params.subscribe((params) => {
      if (params.id) {
        // TODO: Allow ability to get all request types
        this.apiService.getAccessRequest(params.id).subscribe((data: any) => {
          this.request = data;
          console.log(data);
        });
      }
    });
  }
}
