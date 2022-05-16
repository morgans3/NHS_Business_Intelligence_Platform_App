import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { BaseService } from "diu-component-library";
declare var window: any;

@Injectable({
  providedIn: "root"
})
export class DataService extends BaseService {

  baseUrl = "";

  constructor(protected http: HttpClient, @Inject("environment") environment) {
    super(http, environment);
    const origin = window.location.href;
    this.baseUrl = this.combineURL(origin, "api");
  }

  public get(controller: string) {
    return this.http.get(this.baseUrl + controller + "/");
  }

  public getDocument(controller: string) {
    return this.http.get(this.baseUrl + controller + "/", {
      responseType: "arraybuffer"
    });
  }

  public getByID(controller: string, id: any) {
    return this.http.get(this.baseUrl + controller + "/" + id);
  }

  public getDocumentByID(controller: string, id: number) {
    return this.http.get(this.baseUrl + controller + "/" + id, {
      responseType: "arraybuffer"
    });
  }

  public add(controller: string, payload) {
    return this.http.post(this.baseUrl + controller + "/", payload);
  }

  public remove(controller: string, payload) {
    return this.http.delete(this.baseUrl + controller + "/" + payload.id);
  }

  public update(controller: string, payload) {
    return this.http.put(this.baseUrl + controller + "/" + payload.id, payload);
  }
}
