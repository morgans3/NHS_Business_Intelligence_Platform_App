import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { DTOGlobalList } from "../_models/DTOListItem";
import { EntityForms, EntityFormTypes } from "../_models/ModelForms";
import { BaseService } from "diu-component-library";
declare var window: any;

@Injectable({
    providedIn: "root",
})
export class FormsService extends BaseService {
    baseUrl = "";
    controller = "Forms";

    constructor(protected http: HttpClient, @Inject("environment") environment) {
        super(http, environment);
        const origin = window.location.href;
        this.baseUrl = this.combineURL(origin, "api");
    }

    public get() {
        return this.http.get<EntityForms[]>(this.baseUrl + this.controller + "/");
    }

    public getAllTypes() {
        return this.http.get<EntityFormTypes[]>(this.baseUrl + this.controller + "/getAllTypes/");
    }

    public getBasic() {
        return this.http.get<EntityForms[]>(this.baseUrl + this.controller + "/getAll/");
    }

    public getForm(id: number) {
        return this.http.get<EntityForms>(this.baseUrl + this.controller + "/" + id);
    }

    public add(payload: EntityForms) {
        return this.http.post(this.baseUrl + this.controller + "/", payload);
    }

    public remove(payload: EntityForms) {
        return this.http.delete(this.baseUrl + this.controller + "/" + payload.id);
    }

    public update(payload: EntityForms) {
        return this.http.put(this.baseUrl + this.controller + "/" + payload.id, payload);
    }

    public addGlobalList(payload: DTOGlobalList) {
        return this.http.post(this.baseUrl + this.controller + "/AddGlobalList/", payload);
    }

    public updateGlobalList(payload: DTOGlobalList) {
        return this.http.put(this.baseUrl + this.controller + "/UpdateGlobalList/" + payload.id, payload);
    }
}
