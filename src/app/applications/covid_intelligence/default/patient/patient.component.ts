import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

import { Store } from "@ngxs/store";
import { decodeToken } from "../../../../_pipes/functions";
import { AuthState } from "../../../../_states/auth.state";
import { PatientLinked, APIService } from "diu-component-library";
import { NotificationService } from "../../../../_services/notification.service";

@Component({
    selector: "app-patient",
    templateUrl: "./patient.component.html",
})
export class PatientComponent implements OnInit {
    dataFetched = false;
    tokenDecoded: any;
    nhsnumber: string;
    inputLng = "-3.015379";
    inputLat = "53.821978";
    person: PatientLinked;

    constructor(
        public store: Store,
        private router: Router,
        private route: ActivatedRoute,
        private apiService: APIService,
        private notificationService: NotificationService
    ) {
        const token = this.store.selectSnapshot(AuthState.getToken);
        if (token) {
            this.tokenDecoded = decodeToken(token);
        }
    }

    ngOnInit() {
        this.route.paramMap.subscribe((params) => {
            this.nhsnumber = params.get("nhsnumber");
            this.getData();
        });
    }

    getData() {
        this.apiService.getPatientDetail(this.nhsnumber).subscribe(
            (res: PatientLinked) => {
                this.dataFetched = true;
                this.person = res;
            },
            () => {
                this.notificationService.warning("Unable to find patient details.");
                this.person = null;
                this.dataFetched = true;
            }
        );
    }

    returnToList() {
        this.router.navigate(["/population-list"]);
    }

    displayNHSNumber(nhsnumber: string) {
        if (nhsnumber.length > 0) {
            const first = nhsnumber.substring(0, 4);
            const second = nhsnumber.substr(4, 3);
            const third = nhsnumber.substr(7, 3);
            return first + " " + second + " " + third;
        }
        return "";
    }

    showDate(thedate) {
        if (thedate) {
            return new Date(thedate).toUTCString();
        } else {
            return null;
        }
    }
}
