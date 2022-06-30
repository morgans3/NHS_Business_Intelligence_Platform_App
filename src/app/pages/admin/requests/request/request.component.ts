import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { APIService } from "diu-component-library";

@Component({
    selector: "app-requests-request",
    templateUrl: "./request.component.html",
})
export class RequestComponent implements OnInit {
    request;

    constructor(
        private apiService: APIService,
        private activatedRoute: ActivatedRoute,
    ) {}

    ngOnInit() {
        this.activatedRoute.params.subscribe((params) => {
            if (params.id) {
                // TODO: Make view more user friendly
                this.apiService.getRequest(params.id).subscribe((data: any) => {
                    this.request = data;
                });
            }
        });
    }
}
