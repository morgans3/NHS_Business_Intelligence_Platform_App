import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: "root",
})
export class PostcodeService {
    baseUrl = "https://postcodes.io/postcodes/";

    constructor(private http: HttpClient) {}

    public getByPostcode(postcode: string) {
        return this.http.get(this.baseUrl + postcode);
    }
}
