import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { BaseService } from "diu-component-library";
import { CVICohort } from "diu-component-library";

/**
 * Cohort Service Class
 */
@Injectable({
  providedIn: "root",
})
export class CviCohortService extends BaseService {
  
    constructor(protected http: HttpClient, @Inject("environment") environment) {
        super(http, environment);
        const origin = window.location.href;
        this.baseUrl = this.combineURL(origin, "api");
    }

    public get(
        filters: { username?: string }
    ) {
        return this.http.get(this.baseUrl + "cvicohorts", {
            params: filters
        });
    }

    public create(payload: CVICohort) {
        return this.http.post(this.baseUrl + "cvicohorts/register/", payload);
    }

    // public update(payload: Cohort) {
    //     return this.http.post(this.baseUrl + "cohorts/update", payload);
    // } 
    
    public delete(payload: CVICohort) {
        return this.http.post(this.baseUrl + "cvicohorts/delete/", payload);
        // return this.http.delete(this.baseUrl + "cohorts/delete", {
        //     body: payload
        // });
    }
}