import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { MFAAuthService } from "diu-component-library/";
import { getValueByKey } from "../functions";
import { requestTypes } from "./types";

@Component({
    selector: "app-requests-forms",
    templateUrl: "./table.component.html",
})
export class RequestsTableComponent implements OnInit {

    filters = { type: "AccountRequest", pageKey: "" };
    table = { displayedColumns: [], columns: [], actions: [], data: [] };

    constructor(
        private router: Router,
        private authService: MFAAuthService
    ) { }

    ngOnInit() {
        this.getRequests(); //Initialise requests
    }

    getRequests() {
        this.authService.getRequests(this.filters).subscribe((data: any) => {
            //Set table config
            this.table = {
                data: data.Items,
                columns: requestTypes[this.filters.type].columns,
                actions: requestTypes[this.filters.type].actions,
                displayedColumns: requestTypes[this.filters.type].columns.map((column) => {
                    return column.def;
                }).concat(['actions']),
            }
        });
    }

    getRequestsByType(type) {
        this.filters.type = type;
        this.getRequests();
    }

    action(action, item) {
        if(action.type == 'link') {
            console.log(getValueByKey(action.link, item));
            this.router.navigateByUrl(getValueByKey(action.link, item));
        }
    }

    getValueByKey = getValueByKey;
}
