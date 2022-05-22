import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { APIService } from "diu-component-library/";

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
    constructor(private apiService: APIService, private activatedRoute: ActivatedRoute, private router: Router) {}

    ngOnInit() {
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
