import { Component, OnInit, Input } from "@angular/core";
import { HttpClient } from "@angular/common/http";

export interface Crime {
    category: string;
    location_type: string;
    location: {
        latitude: string;
        street: {
            id: string;
            name: string;
        };
        longitude: string;
    };
    context: string;
    outcome_status: string;
    persistent_id: string;
    id: string;
    location_subtype: string;
    month: string;
}

@Component({
    selector: "app-crime-information",
    templateUrl: "./crime-information.component.html",
})
export class CrimeInformationComponent implements OnInit {
    @Input() lat: string;
    @Input() lng: string;
    crimes: Crime[] = [];
    categoryCount: any;
    categoryCountKeys: any;

    constructor(private http: HttpClient) {}

    ngOnInit() {
        if (this.lat && this.lng) {
            this.http
                .get(`https://data.police.uk/api/crimes-street/all-crime?lat=${this.lat}&lng=${this.lng}`)
                .subscribe((res: Crime[]) => {
                    if (res) {
                        this.crimes = res;
                        this.getStats();
                    }
                });
        }
    }

    getStats() {
        this.categoryCount = {};
        this.crimes.reduce((previous, current) => {
            this.categoryCount[current.category] = (this.categoryCount[current.category] || 0) + 1;
            return previous;
        });
        this.categoryCountKeys = Object.keys(this.categoryCount);
    }
}
