import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { BaseService } from "diu-component-library";
import { Cohort } from "diu-component-library";

/**
 * Cohort Service Class
 */
@Injectable({
  providedIn: "root",
})
export class CohortService extends BaseService {
  
    constructor(protected http: HttpClient, @Inject("environment") environment) {
        super(http, environment);
        const origin = window.location.href;
        this.baseUrl = this.combineURL(origin, "api");
    }

    public get() {
        return this.http.get(this.baseUrl + "cohorts");
    }

    public getByUsername(email: string) {
        return this.http.get(this.baseUrl + "cohorts/getByuser?user=" + email);
    }

    public create(payload: Cohort) {
        return this.http.post(this.baseUrl + "cohorts/create/", payload);
    }

    public update(payload: Cohort) {
        return this.http.post(this.baseUrl + "cohorts/update", payload);
    } 
    
    public delete(payload: Cohort) {
        return this.http.delete(this.baseUrl + "cohorts/delete", {
            body: payload
        });
    }
}