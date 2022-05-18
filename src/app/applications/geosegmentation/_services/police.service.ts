import { HttpClient, HttpBackend } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: "root",
})
export class PoliceService {
    private http: HttpClient;

    constructor(private handler: HttpBackend) {
        this.http = new HttpClient(handler);
    }

    public getOneMileFromCenter(lat: string, lng: string) {
        return this.http.get("https://data.police.uk/api/crimes-street/all-crime?lat=" + lat + "&lng=" + lng);
    }

    public getWithinBoundary(values: { lat: string; lng: string }[]) {
        let requeststring = "";
        values.forEach((pair) => {
            requeststring += pair.lat + "," + pair.lng + ":";
        });

        if (requeststring.length > 0) {
            requeststring = requeststring.substr(0, requeststring.length - 1);
        }

        return this.http.get("https://data.police.uk/api/crimes-street/all-crime?poly=" + requeststring);
    }

    public getCategories() {
        return this.http.get("https://data.police.uk/api/crime-categories");
        //return this.http.get("https://data.police.uk/api/crime-categories?date=2020-01");
    }
}
