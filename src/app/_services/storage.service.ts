import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class StorageService {
  base = "storage";
  baseUrl: string;

  constructor(private http: HttpClient) {
    const parsedUrl = window.location.origin;
    const origin = parsedUrl;
    this.baseUrl = this.combineURL(origin.replace("spi", ""), this.base);
  }

  private combineURL(origin: string, subd: string) {
    const domain = origin.split("//")[1].split("/")[0].replace("www", "");
    if (domain.includes("localhost")) {
      return "https://" + subd + ".dev." + environment.websiteURL + "/";
    } else if (domain.includes("dev") || domain.includes("demo")) {
      return "https://" + subd + domain + "/";
    }
    return "https://" + subd + domain + "/";
  }

  public getIncidents() {
    return this.http.get(this.baseUrl + "spindex/getAll/");
  }

  public getIncidentByIndex(index) {
    return this.http.get(this.baseUrl + "spindex/getByIndex?index=" + index);
  }

  public getCrossfilter(filter) {
    return this.http.get(this.baseUrl + "spindex/getCrossfilter?filter=" + filter);
  }

  public addIncident(payload) {
    return this.http.post(this.baseUrl + "spindex/register/", payload);
  }

  public updateIncident(payload) {
    return this.http.post(this.baseUrl + "spindex/update/", payload);
  }

  public removeIncident(payload) {
    return this.http.post(this.baseUrl + "spindex/remove/", payload);
  }
}
